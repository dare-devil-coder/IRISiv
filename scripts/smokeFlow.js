const fetch = globalThis.fetch || require('node-fetch');

async function json(res){
  try { return await res.json(); } catch(e){ return { error: e.message }; }
}

async function run(){
  try{
    // 1. Create requirement
    let res = await fetch('http://localhost:3000/api/requirements', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title:'Flow Test Req', category:'EDUCATION', location:'Testland', description:'Desc', beneficiaries:100, estimated_budget:20000, ngo_organization_id:'org-ngo-1', submitImmediately:true})});
    let j = await json(res); console.log('createRequirement', j.success ? j.data.id : j);
    const projectId = j.data?.id;

    // 2. Approve by corporate
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/approve`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({corporate_organization_id:'org-corp-1'})});
    j = await json(res); console.log('approve', j.success ? j.data.status : j);

    // 3. Submit proposal
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/proposals`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({business_organization_id:'org-biz-1', bid_amount:18000, delivery_timeline_days:10, capacity:'Cap', experience:'Exp', description:'We deliver'})});
    j = await json(res); console.log('submitProposal', j.success ? j.data.id : j);
    const proposalId = j.data?.id;

    // 4. Select proposal
    res = await fetch(`http://localhost:3000/api/proposals/${proposalId}/select`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({corporate_organization_id:'org-corp-1'})});
    j = await json(res); console.log('selectProposal', j.success ? j.data.status : j);

    // 5. Pay advance
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/payment/advance`, {method:'POST'});
    j = await json(res); console.log('advance', j.success ? j.data.id : j);

    // 6. Start project
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/start`, {method:'POST'});
    j = await json(res); console.log('start', j.success ? j.data.status : j);

    // 7. Submit delivery
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/delivery`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({business_organization_id:'org-biz-1', quantity_delivered:100, delivery_date:'2026-08-10', quality:'GOOD', comments:'Delivered', evidenceFiles:[{name:'rec.pdf', type:'DELIVERY_RECEIPT'}]})});
    j = await json(res); console.log('delivery', j.success ? j.data.id : j);
    const deliveryId = j.data?.id;

    // 8. NGO verification
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/verification`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({delivery_id:deliveryId, quantity_received:100, quality_acceptable:true, packaging_acceptable:true, delivered_on_time:true, invoice_reference:'INV-999', comments:'OK'})});
    j = await json(res); console.log('ngoVerification', j.success ? j.data.aiVerification.status : j);

    // 9. Final payment
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/payment/final`, {method:'POST'});
    j = await json(res); console.log('finalPayment', j.success ? j.data.id : j);

  }catch(e){ console.error('Flow error', e); }
}

run();
