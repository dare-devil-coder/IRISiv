#!/usr/bin/env node
/**
 * COMPREHENSIVE FEATURE VALIDATION TEST SUITE
 * Tests all major API endpoints and workflows for IRISiv platform
 * Run with: node scripts/comprehensiveTest.js
 */

const BASE_URL = `http://localhost:${process.env.PORT || '3004'}`;
let passCount = 0;
let failCount = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    failCount++;
  }
}

async function get(url, label = '') {
  const res = await fetch(`${BASE_URL}${url}`);
  const data = await res.json();
  if (!res.ok && res.status !== 200) throw new Error(`${label || url}: ${res.status} ${data.error?.message || JSON.stringify(data)}`);
  return data;
}

async function post(url, body, label = '') {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok && res.status !== 200 && res.status !== 201) 
    throw new Error(`${label || url}: ${res.status} ${data.error?.message || JSON.stringify(data)}`);
  return { status: res.status, data };
}

async function runAll() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     IRISIV COMPREHENSIVE FEATURE VALIDATION TEST SUITE        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // ============================================================================
  // 1. PROJECT ENDPOINTS
  // ============================================================================
  console.log('\n📋 PROJECT ENDPOINTS:');
  
  await test('GET /api/projects - List all projects', async () => {
    const res = await get('/api/projects', 'List projects');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
    if (res.data.length === 0) throw new Error('No projects found');
  });

  await test('GET /api/projects/proj-dlc - Get specific project', async () => {
    const res = await get('/api/projects/proj-dlc', 'Get project');
    if (!res.data.id) throw new Error('No project ID');
  });

  // ============================================================================
  // 2. PROPOSAL WORKFLOW
  // ============================================================================
  console.log('\n💼 PROPOSAL WORKFLOW:');

  let proposalId = null;
  await test('POST /api/projects/proj-dlc/proposals - Submit proposal', async () => {
    const res = await post(`/api/projects/proj-dlc/proposals`, {
      business_organization_id: 'org-biz-1',
      bid_amount: 50000,
      delivery_timeline_days: 20,
      capacity: 'High capacity team',
      experience: 'Previous similar projects',
      description: 'Comprehensive solution for digital learning center',
    }, 'Submit proposal');
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    proposalId = res.data.id;
    if (!proposalId) throw new Error('No proposal ID returned');
    if (!res.data.evaluation) throw new Error('No AI evaluation');
    if (res.data.status !== 'AI_EVALUATED') throw new Error('Proposal not evaluated');
  });

  await test('GET /api/projects/proj-dlc/proposals - List project proposals', async () => {
    const res = await get('/api/projects/proj-dlc/proposals', 'List proposals');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  if (proposalId) {
    await test(`POST /api/proposals/${proposalId}/select - Select business proposal`, async () => {
      const res = await post(`/api/proposals/${proposalId}/select`, {
        corporate_organization_id: 'org-corp-1',
      }, 'Select proposal');
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.data.status !== 'CONTRACTED') throw new Error('Project not in CONTRACTED state');
    });
  }

  // ============================================================================
  // 3. PAYMENT WORKFLOW
  // ============================================================================
  console.log('\n💰 PAYMENT WORKFLOW:');

  await test('POST /api/projects/proj-dlc/payment/advance - Record advance payment', async () => {
    const res = await post(`/api/projects/proj-dlc/payment/advance`, {}, 'Record advance');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.payment_type !== 'ADVANCE_20') throw new Error('Wrong payment type');
    if (res.data.amount === 0) throw new Error('Payment amount is 0');
  });

  // ============================================================================
  // 4. PROJECT EXECUTION
  // ============================================================================
  console.log('\n🚀 PROJECT EXECUTION:');

  await test('POST /api/projects/proj-dlc/start - Start project work', async () => {
    const res = await post(`/api/projects/proj-dlc/start`, {}, 'Start project');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.status !== 'IN_PROGRESS') throw new Error('Project not in IN_PROGRESS state');
  });

  let deliveryId = null;
  await test('POST /api/projects/proj-dlc/delivery - Submit delivery', async () => {
    const res = await post(`/api/projects/proj-dlc/delivery`, {
      business_organization_id: 'org-biz-1',
      quantity_delivered: 150,
      delivery_date: new Date().toISOString().split('T')[0],
      quality: 'EXCELLENT',
      comments: 'All units delivered in excellent condition',
      evidenceFiles: [
        { name: 'delivery-receipt.pdf', type: 'DELIVERY_RECEIPT' },
        { name: 'photos.zip', type: 'PHOTOS' },
      ],
    }, 'Submit delivery');
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    deliveryId = res.data.id;
    if (!deliveryId) throw new Error('No delivery ID');
  });

  // ============================================================================
  // 5. VERIFICATION WORKFLOW
  // ============================================================================
  console.log('\n✅ VERIFICATION WORKFLOW:');

  if (deliveryId) {
    await test('POST /api/projects/proj-dlc/verification - Submit NGO verification', async () => {
      const res = await post(`/api/projects/proj-dlc/verification`, {
        delivery_id: deliveryId,
        quantity_received: 150,
        quality_acceptable: true,
        packaging_acceptable: true,
        delivered_on_time: true,
        invoice_reference: 'INV-12345',
        comments: 'All items verified and accepted',
      }, 'NGO verification');
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      if (!res.data.ngoVerification) throw new Error('No NGO verification');
      if (!res.data.aiVerification) throw new Error('No AI verification');
      if (res.data.aiVerification.confidence < 0.8) throw new Error('Low AI confidence');
    });
  }

  await test('POST /api/projects/proj-dlc/payment/final - Record final payment', async () => {
    const res = await post(`/api/projects/proj-dlc/payment/final`, {}, 'Record final payment');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.payment_type !== 'FINAL_40') throw new Error('Wrong payment type');
  });

  // ============================================================================
  // 6. REQUIREMENTS (NGO)
  // ============================================================================
  console.log('\n📝 REQUIREMENTS:');

  let reqId = null;
  await test('POST /api/requirements - Create requirement', async () => {
    const res = await post(`/api/requirements`, {
      ngo_organization_id: 'org-ngo-1',
      title: 'Computer Lab Equipment',
      category: 'EDUCATION',
      budget: 200000,
      deadline: '2026-12-31',
      description: 'Need computers and peripherals',
    }, 'Create requirement');
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    reqId = res.data.id;
  });

  await test('GET /api/requirements - List requirements', async () => {
    const res = await get('/api/requirements', 'List requirements');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 7. TENDERS
  // ============================================================================
  console.log('\n🏆 TENDERS:');

  await test('GET /api/tenders - List tenders', async () => {
    const res = await get('/api/tenders', 'List tenders');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 8. ORGANIZATIONS
  // ============================================================================
  console.log('\n🏢 ORGANIZATIONS:');

  await test('GET /api/organizations - List organizations', async () => {
    const res = await get('/api/organizations', 'List orgs');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
    if (res.data.length === 0) throw new Error('No organizations');
  });

  // ============================================================================
  // 9. AUDIT & NOTIFICATIONS
  // ============================================================================
  console.log('\n📊 AUDIT & NOTIFICATIONS:');

  await test('GET /api/audit - List audit logs', async () => {
    const res = await get('/api/audit', 'List audit');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  await test('GET /api/notifications - List notifications', async () => {
    const res = await get('/api/notifications', 'List notifications');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 10. ERROR CASES & EDGE CASES
  // ============================================================================
  console.log('\n⚠️  ERROR CASES:');

  await test('GET /api/projects/nonexistent - 404 handling', async () => {
    try {
      await get('/api/projects/nonexistent', '404 test');
      throw new Error('Should have thrown 404');
    } catch (err) {
      if (!err.message.includes('404')) throw new Error('Should return 404 for nonexistent project');
    }
  });

  await test('POST /api/projects/nonexistent/proposals - Invalid project error', async () => {
    try {
      await post(`/api/projects/nonexistent/proposals`, {
        business_organization_id: 'org-biz-1',
        bid_amount: 10000,
        delivery_timeline_days: 10,
        description: 'Test',
      }, 'Invalid project');
      throw new Error('Should have thrown error');
    } catch (err) {
      if (!err.message.includes('404') && !err.message.includes('not found')) 
        throw new Error('Should return error for invalid project');
    }
  });

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                        TEST SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  ✓ PASSED: ${passCount.toString().padEnd(50)} ║`);
  console.log(`║  ✗ FAILED: ${failCount.toString().padEnd(50)} ║`);
  console.log(`║  TOTAL:   ${(passCount + failCount).toString().padEnd(50)} ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  if (failCount === 0) {
    console.log('🎉 ALL TESTS PASSED! The platform is fully functional.\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. See details above.\n`);
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
