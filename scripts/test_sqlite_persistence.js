const path = require('path');
const fs = require('fs');

process.env.USE_SQLITE = 'true';

const sqliteClient = require('../src/lib/db/sqliteClient.js');

async function testPersistence() {
  console.log('--- STEP 1: Initialize SQLite & Insert Project ---');
  const testId = `test-persist-${Date.now()}`;
  const insertRes = await sqliteClient.from('csr_projects').insert([{
    id: testId,
    project_code: `CODE-${Date.now()}`,
    title: 'SQLite Test Project Persistence',
    category: 'EDUCATION',
    location: 'Gujarat',
    description: 'Testing SQLite file persistence',
    beneficiaries: 250,
    estimated_budget: 150000,
    status: 'SUBMITTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]);

  console.log('Insert result:', insertRes);

  // Force persist
  const persisted = await sqliteClient.persist();
  console.log('Persisted to disk:', persisted);

  const dbPath = path.join(process.cwd(), 'data', 'irisiv.db');
  console.log('DB File Exists?', fs.existsSync(dbPath));
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log(`DB File Size: ${stats.size} bytes`);
  }

  console.log('--- STEP 2: Query Inserted Data ---');
  const readRes = await sqliteClient.from('csr_projects').eq('id', testId).single();
  console.log('Read data from DB:', readRes.data);

  if (readRes.data && readRes.data.id === testId) {
    console.log('✅ TEST PASSED: SQLite persistence verified!');
  } else {
    console.error('❌ TEST FAILED: Could not read inserted row');
    process.exit(1);
  }
}

testPersistence().catch((err) => {
  console.error('Error during test:', err);
  process.exit(1);
});
