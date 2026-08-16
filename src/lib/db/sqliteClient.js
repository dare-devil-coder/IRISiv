const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'irisiv.db');

let SQL = null;
let db = null;
let initPromise = null;
let autoSaveInterval = null;
let lastSaveTime = 0;

function persistToDisk() {
  if (!db) return;
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
    lastSaveTime = Date.now();
    console.log(`[SQLite] Persisted database to ${DB_PATH} (${data.length} bytes)`);
    return true;
  } catch (e) {
    console.error(`[SQLite] Failed to persist: ${e.message}`);
    return false;
  }
}

function ensureInit() {
  if (initPromise) return initPromise;
  const wasmPath = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
  initPromise = initSqlJs({ locateFile: () => wasmPath }).then((SQLmod) => {
    SQL = SQLmod;
    if (fs.existsSync(DB_PATH)) {
      const filebuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(new Uint8Array(filebuffer));
      console.log(`[SQLite] Loaded existing database from ${DB_PATH}`);
    } else {
      db = new SQL.Database();
      console.log(`[SQLite] Created new in-memory database`);
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS csr_projects (
        id TEXT PRIMARY KEY,
        project_code TEXT,
        title TEXT,
        category TEXT,
        location TEXT,
        description TEXT,
        beneficiaries INTEGER,
        estimated_budget INTEGER,
        contract_value INTEGER,
        deadline TEXT,
        status TEXT,
        ngo_organization_id TEXT,
        corporate_organization_id TEXT,
        selected_business_organization_id TEXT,
        tender_id TEXT,
        created_at TEXT,
        updated_at TEXT,
        completed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        business_organization_id TEXT,
        bid_amount INTEGER,
        delivery_timeline_days INTEGER,
        capacity TEXT,
        experience TEXT,
        description TEXT,
        status TEXT,
        submitted_at TEXT,
        updated_at TEXT
      );
    `);

    // Setup process exit handlers
    process.on('exit', persistToDisk);
    process.on('SIGINT', () => { persistToDisk(); process.exit(0); });
    process.on('SIGTERM', () => { persistToDisk(); process.exit(0); });

    // Setup auto-save every 5 seconds
    if (!autoSaveInterval) {
      autoSaveInterval = setInterval(persistToDisk, 5000);
      autoSaveInterval.unref(); // Don't block process exit
    }

    // expose for runtime
    global.__IRISIV_DB_INSTANCE = db;
    global.__IRISIV_PERSIST = persistToDisk;
    return db;
  });
  return initPromise;
}

function runAsync(fn) {
  try {
    const res = fn();
    return Promise.resolve({ data: res, error: null });
  } catch (e) {
    return Promise.resolve({ data: null, error: e });
  }
}

class FromBuilder {
  constructor(table) {
    this.table = table;
    this._where = [];
    this._orExpr = null;
    this._order = null;
    this._single = false;
  }

  select(_cols) { return this; }
  eq(col, val) { this._where.push([col, val]); return this; }
  or(expr) { this._orExpr = expr; return this; }
  order(col, opts) { this._order = { col, asc: opts?.ascending ?? true }; return this; }
  single() { this._single = true; return this; }

  then(resolve, reject) { return this.execute().then(resolve, reject); }

  async execute() {
    await ensureInit();
    return runAsync(() => {
      let sql = `SELECT * FROM ${this.table}`;
      const params = [];
      if (this._orExpr) {
        const parts = this._orExpr.split(',').map((p) => p.trim());
        const clauses = parts.map((p) => {
          const [col, op, valRaw] = p.split('.');
          const val = valRaw && valRaw.startsWith('$') ? valRaw.slice(1) : valRaw;
          params.push(val);
          return `${col} = ?`;
        });
        sql += ` WHERE (${clauses.join(' OR ')})`;
      } else if (this._where.length) {
        const clauses = this._where.map(([c, v]) => { params.push(v); return `${c} = ?`; });
        sql += ` WHERE ${clauses.join(' AND ')}`;
      }
      if (this._order) sql += ` ORDER BY ${this._order.col} ${this._order.asc ? 'ASC' : 'DESC'}`;

      const theDb = global.__IRISIV_DB_INSTANCE;
      const stmt = theDb.prepare(sql);
      if (params.length) stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      if (this._single) return rows[0] ?? null;
      return rows;
    });
  }

  async insert(rows) {
    await ensureInit();
    const result = await runAsync(() => {
      const inserted = [];
      const keys = Object.keys(rows[0] || {});
      const cols = keys.join(',');
      const placeholders = keys.map(() => '?').join(',');
      const sql = `INSERT OR REPLACE INTO ${this.table} (${cols}) VALUES (${placeholders})`;
      const theDb = global.__IRISIV_DB_INSTANCE;
      const stmt = theDb.prepare(sql);
      theDb.run('BEGIN TRANSACTION');
      for (const it of rows) {
        const vals = keys.map((k) => (it[k] ?? null));
        stmt.bind(vals); stmt.step(); stmt.reset(); inserted.push(it);
      }
      theDb.run('COMMIT'); stmt.free();
      return inserted;
    });
    // Persist to disk after insert
    if (result.data && global.__IRISIV_PERSIST) {
      setTimeout(() => global.__IRISIV_PERSIST(), 100);
    }
    return result;
  }

  async update(obj) {
    await ensureInit();
    const result = await runAsync(() => {
      const setKeys = Object.keys(obj);
      const setSql = setKeys.map((k) => `${k} = ?`).join(', ');
      const params = setKeys.map((k) => obj[k]);
      let sql = `UPDATE ${this.table} SET ${setSql}`;
      if (this._orExpr) {
        const parts = this._orExpr.split(',').map((p) => p.trim());
        const clauses = parts.map((p) => { const [col] = p.split('.'); return `${col} = ?`; });
        sql += ` WHERE (${clauses.join(' OR ')})`;
      } else if (this._where.length) {
        const whereSql = this._where.map(([c]) => `${c} = ?`).join(' AND ');
        sql += ` WHERE ${whereSql}`;
        params.push(...this._where.map(([, v]) => v));
      }
      const theDb = global.__IRISIV_DB_INSTANCE;
      const stmt = theDb.prepare(sql);
      if (params.length) stmt.bind(params);
      stmt.step(); const changes = theDb.getRowsModified(); stmt.free();
      return { changes };
    });
    // Persist to disk after update
    if (result.data && global.__IRISIV_PERSIST) {
      setTimeout(() => global.__IRISIV_PERSIST(), 100);
    }
    return result;
  }
}

const sqlite = {
  from(table) { return new FromBuilder(table); },
  async persist() {
    await ensureInit();
    return persistToDisk();
  }
};

module.exports = sqlite;
