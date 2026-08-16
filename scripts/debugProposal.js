const fetch = globalThis.fetch;

async function debugTest() {
  const base = 'http://localhost:3004';

  // Step 1: Submit a proposal
  console.log('\n=== STEP 1: Submit Proposal ===');
  const submitRes = await fetch(`${base}/api/projects/proj-dlc/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_organization_id: 'org-biz-1',
      bid_amount: 25000,
      delivery_timeline_days: 15,
      capacity: 'TestCap',
      experience: 'TestExp',
      description: 'Debug proposal',
    }),
  });
  const submitData = await submitRes.json();
  console.log('Submit status:', submitRes.status);
  console.log('Proposal ID:', submitData.data?.id);
  const proposalId = submitData.data?.id;

  // Step 2: List all proposals for the project
  console.log('\n=== STEP 2: Get All Proposals for Project ===');
  const listRes = await fetch(`${base}/api/projects/proj-dlc/proposals`);
  const listData = await listRes.json();
  console.log('List status:', listRes.status);
  console.log('Found proposals:', listData.data?.length || 0);
  if (listData.data?.length > 0) {
    console.log('First proposal ID:', listData.data[0].id);
  }

  // Step 3: Try to select the proposal
  if (proposalId) {
    console.log('\n=== STEP 3: Select Proposal ===');
    const selectRes = await fetch(`${base}/api/proposals/${proposalId}/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
    });
    const selectData = await selectRes.json();
    console.log('Select status:', selectRes.status);
    console.log('Select result:', selectData);
  }
}

debugTest().catch(console.error);
