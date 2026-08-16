const fetch = globalThis.fetch || require('node-fetch');

async function run() {
  const port = process.env.PORT || '3000';
  const base = `http://localhost:${port}`;
  const proposalRes = await fetch(`${base}/api/projects/proj-dlc/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_organization_id: 'org-biz-1',
      bid_amount: 18000,
      delivery_timeline_days: 10,
      capacity: 'Cap',
      experience: 'Exp',
      description: 'We deliver',
    }),
  });
  const proposalData = await proposalRes.json();
  console.log('submit', proposalRes.status, proposalData);
  const pid = proposalData.data.id;

  const selectRes = await fetch(`${base}/api/proposals/${pid}/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corporate_organization_id: 'org-corp-1' }),
  });
  console.log('select', selectRes.status, await selectRes.json());

  const advanceRes = await fetch(`${base}/api/projects/proj-dlc/payment/advance`, { method: 'POST' });
  console.log('advance', advanceRes.status, await advanceRes.json());

  const startRes = await fetch(`${base}/api/projects/proj-dlc/start`, { method: 'POST' });
  console.log('start', startRes.status, await startRes.json());

  const deliveryRes = await fetch(`${base}/api/projects/proj-dlc/delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_organization_id: 'org-biz-1',
      quantity_delivered: 2000,
      delivery_date: '2026-08-10',
      quality: 'GOOD',
      comments: 'Delivered',
      evidenceFiles: [{ name: 'rec.pdf', type: 'DELIVERY_RECEIPT' }],
    }),
  });
  const deliveryData = await deliveryRes.json();
  console.log('delivery', deliveryRes.status, deliveryData);

  const verificationRes = await fetch(`${base}/api/projects/proj-dlc/verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      delivery_id: deliveryData.data?.id,
      quantity_received: 2000,
      quality_acceptable: true,
      packaging_acceptable: true,
      delivered_on_time: true,
      invoice_reference: 'INV-999',
      comments: 'OK',
    }),
  });
  console.log('verification', verificationRes.status, await verificationRes.json());

  const finalRes = await fetch(`${base}/api/projects/proj-dlc/payment/final`, { method: 'POST' });
  console.log('final', finalRes.status, await finalRes.json());
}

run().catch((err) => {
  console.error('error', err);
  process.exit(1);
});