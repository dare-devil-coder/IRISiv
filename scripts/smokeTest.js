const http = require('http');
const fetch = globalThis.fetch || require('node-fetch');

async function postRequirement(){
  const res = await fetch('http://localhost:3000/api/requirements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Smoke Test Requirement',
      category: 'EDUCATION',
      location: 'Testville',
      description: 'Test description',
      beneficiaries: 150,
      estimated_budget: 25000,
      deadline: '2026-12-31',
      ngo_organization_id: 'org-ngo-1',
      submitImmediately: true,
    }),
  });
  const json = await res.json();
  console.log('createRequirement ->', JSON.stringify(json, null, 2));
  const projectId = json.data?.id || json.data?.project?.id || json.data?.project_id || (json.data && json.data.project_code ? json.data.project_code : null);
  return projectId;
}

async function run(){
  try{
    const id = await postRequirement();
    console.log('ProjectId:', id);
  }catch(e){
    console.error('Error', e);
  }
}

run();
