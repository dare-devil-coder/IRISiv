const path = require('path');
const fs = require('fs');

process.env.USE_SQLITE = 'true';

const sqliteClient = require('../src/lib/db/sqliteClient.js');

async function testReload() {
  console.log('--- STEP 3: Restart Process & Verify Data Persistence ---');
  const dbPath = path.join(process.cwd(), 'data', 'irisiv.db');
  console.log('Checking if DB file exists before loading:', fs.existsSync(dbPath));

  const list = await sqliteClient.from('csr_projects').execute();
  console.log(`Loaded ${list.data ? list.data.length : 0} projects from disk.`);

  if (list.data && list.data.length > 0) {
    console.log('Sample loaded project:', list.data[0]);
    console.log('✅ RESTART TEST PASSED: Database loaded from disk successfully!');
  } else {
    console.error('❌ RESTART TEST FAILED: No projects loaded from disk');
    process.exit(1);
  }
}

testReload().catch((err) => {
  console.error('Error during reload test:', err);
  process.exit(1);
});
