const fetch = globalThis.fetch;

async function test() {
  const base = 'http://localhost:3006';
  
  console.log('=== SQLite Persistence Test ===\n');
  
  // Simple proposal submission to trigger database writes
  console.log('1. Submitting proposal to trigger database operations...');
  const res = await fetch(`${base}/api/projects/proj-dlc/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_organization_id: 'org-biz-1',
      bid_amount: 40000,
      delivery_timeline_days: 20,
      capacity: 'Test',
      experience: 'Test',
      description: 'SQLite persistence test',
    }),
  });
  const data = await res.json();
  console.log(`   Status: ${res.status}`);
  console.log(`   Proposal ID: ${data.data?.id}`);
  
  // Wait for auto-save
  console.log('\n2. Waiting 6 seconds for auto-save...');
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('\n3. Database file should now exist at: data/irisiv.db');
}

test().catch(console.error);
