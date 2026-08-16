const fetch = globalThis.fetch;

async function test() {
  const base = 'http://localhost:3005';

  console.log('\n=== TEST: Fresh lifecycle with debugging ===\n');

  // Step 1: Create proposal
  console.log('1. Submit proposal...');
  const submitRes = await fetch(`${base}/api/projects/proj-dlc/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_organization_id: 'org-biz-1',
      bid_amount: 60000,
      delivery_timeline_days: 25,
      capacity: 'Cap',
      experience: 'Exp',
      description: 'Test',
    }),
  });
  const submitData = await submitRes.json();
  console.log(`   Status: ${submitRes.status}`);
  const pid = submitData.data?.id;
  console.log(`   Proposal ID: ${pid}`);
  if (!pid) {
    console.log('   ERROR: No proposal ID in response');
    console.log('   Response:', JSON.stringify(submitData, null, 2));
    return;
  }

  // Step 2: Try to select
  console.log(`\n2. Select proposal ${pid}...`);
  const selectRes = await fetch(`${base}/api/proposals/${pid}/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
  });
  const selectData = await selectRes.json();
  console.log(`   Status: ${selectRes.status}`);
  if (selectRes.status !== 200) {
    console.log('   ERROR:', selectData.error?.message || selectData);
  } else {
    console.log(`   Project status: ${selectData.data.status}`);
  }
}

test().catch(console.error);
