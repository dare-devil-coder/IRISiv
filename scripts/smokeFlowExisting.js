const fetch = globalThis.fetch || require('node-fetch');

async function json(res){ try { return await res.json(); } catch(e){ return { error: e.message }; } }

const projectId = '44444444-4444-4444-4444-444444444442';

async function run(){
  try{
    console.log('Using projectId', projectId);
    // Submit proposal
    let res = await fetch(`http://localhost:3000/api/projects/${projectId}/proposals`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({business_organization_id:'org-biz-1', bid_amount:18000, delivery_timeline_days:10, capacity:'Cap', experience:'Exp', description:'We deliver'})});
    let j = await json(res); console.log('submitProposal', j);
    const proposalId = j.data?.id || j.data?.proposal_id || (j.success && j.data && j.data.id);

    if(!proposalId){ console.error('No proposal id, abort'); return; }

    // Select proposal
    res = await fetch(`http://localhost:3000/api/proposals/${proposalId}/select`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({corporate_organization_id:'org-corp-1'})});
    j = await json(res); console.log('selectProposal', j);

    // Pay advance
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/payment/advance`, {method:'POST'});
    j = await json(res); console.log('advance', j);

    // Start
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/start`, {method:'POST'});
    j = await json(res); console.log('start', j);

    // Delivery
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/delivery`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({business_organization_id:'org-biz-1', quantity_delivered:2000, delivery_date:'2026-08-10', quality:'GOOD', comments:'Delivered', evidenceFiles:[{name:'rec.pdf', type:'DELIVERY_RECEIPT'}]})});
    j = await json(res); console.log('delivery', j);
    const deliveryId = j.data?.id;

    // NGO verification
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/verification`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({delivery_id:deliveryId, quantity_received:2000, quality_acceptable:true, packaging_acceptable:true, delivered_on_time:true, invoice_reference:'INV-999', comments:'OK'})});
    j = await json(res); console.log('ngoVerification', j);

    // Final payment
    res = await fetch(`http://localhost:3000/api/projects/${projectId}/payment/final`, {method:'POST'});
    j = await json(res); console.log('finalPayment', j);

  }catch(e){ console.error('Flow error', e); }
}

run();
