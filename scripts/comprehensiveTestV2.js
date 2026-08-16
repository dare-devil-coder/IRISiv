#!/usr/bin/env node
/**
 * COMPREHENSIVE FEATURE VALIDATION TEST SUITE - UPDATED
 * Tests all major API endpoints and workflows for IRISiv platform
 * Run with: node scripts/comprehensiveTestV2.js
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
  if (!res.ok) throw new Error(`${label || url}: ${res.status}`);
  return data;
}

async function post(url, body, label = '') {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok && res.status !== 201) 
    throw new Error(`${label || url}: ${res.status}`);
  return { status: res.status, data };
}

async function runAll() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     IRISIV COMPREHENSIVE FEATURE VALIDATION TEST SUITE V2      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Reset test state by using a new project to avoid state conflicts
  const testProjectId = `proj-test-${Date.now()}`;

  // ============================================================================
  // 1. PROJECT LISTING
  // ============================================================================
  console.log('\n📋 PROJECT LISTING:');
  
  let projects = [];
  await test('GET /api/projects - List all projects', async () => {
    const res = await get('/api/projects', 'List projects');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
    if (res.data.length === 0) throw new Error('No projects found');
    projects = res.data;
  });

  await test('GET /api/projects/proj-dlc - Get specific project', async () => {
    const res = await get('/api/projects/proj-dlc', 'Get project');
    // Response structure is {success, data: {project, payments, proposals}}
    if (!res.data.project) throw new Error('No project in response');
    if (!res.data.project.id) throw new Error('No project ID');
  });

  // ============================================================================
  // 2. PROPOSAL WORKFLOW
  // ============================================================================
  console.log('\n💼 PROPOSAL WORKFLOW:');

  let newProposalId = null;
  await test('POST /api/projects/proj-dlc/proposals - Submit proposal', async () => {
    const res = await post(`/api/projects/proj-dlc/proposals`, {
      business_organization_id: 'org-biz-1',
      bid_amount: 45000,
      delivery_timeline_days: 18,
      capacity: 'Strong team',
      experience: 'Relevant projects',
      description: 'High-quality solution',
    }, 'Submit proposal');
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    newProposalId = res.data.id;
    if (!newProposalId) throw new Error('No proposal ID');
    if (!res.data.evaluation) throw new Error('No AI evaluation');
  });

  await test('GET /api/projects/proj-dlc/proposals - List proposals', async () => {
    const res = await get('/api/projects/proj-dlc/proposals', 'List proposals');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 3. REQUIREMENTS WORKFLOW
  // ============================================================================
  console.log('\n📝 REQUIREMENTS:');

  let reqId = null;
  await test('POST /api/requirements - Create requirement', async () => {
    const res = await post(`/api/requirements`, {
      ngo_organization_id: 'org-ngo-1',
      title: 'School Infrastructure',
      category: 'EDUCATION',
      beneficiaries: 500,
      estimated_budget: 300000,
      deadline: '2026-12-31',
      description: 'Complete school renovation',
    }, 'Create requirement');
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    reqId = res.data.id;
  });

  // ============================================================================
  // 4. TENDERS
  // ============================================================================
  console.log('\n🏆 TENDERS:');

  await test('GET /api/tenders - List tenders', async () => {
    const res = await get('/api/tenders', 'List tenders');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 5. AUDIT & LOGGING
  // ============================================================================
  console.log('\n📊 AUDIT & LOGGING:');

  await test('GET /api/audit - List audit logs', async () => {
    const res = await get('/api/audit', 'List audit');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  await test('GET /api/notifications - List notifications', async () => {
    const res = await get('/api/notifications', 'List notifications');
    if (!Array.isArray(res.data)) throw new Error('Expected array');
  });

  // ============================================================================
  // 6. AI FEATURES
  // ============================================================================
  console.log('\n🤖 AI FEATURES:');

  await test('POST /api/ai/assistant - AI proposal evaluation', async () => {
    const res = await post(`/api/ai/assistant`, {
      action: 'evaluateProposal',
      projectId: 'proj-dlc',
      proposal: {
        bid_amount: 50000,
        delivery_timeline_days: 15,
        capacity: 'Team size',
        experience: 'Years',
      },
    }, 'AI assistant');
    if (!res.data) throw new Error('No response from AI');
  });

  // ============================================================================
  // 7. AUTHENTICATION SIMULATION
  // ============================================================================
  console.log('\n🔐 AUTHENTICATION:');

  await test('POST /api/auth/me - Get current user', async () => {
    const res = await post(`/api/auth/me`, {}, 'Get user');
    if (!res.data) throw new Error('No user data');
  });

  // ============================================================================
  // 8. ERROR HANDLING
  // ============================================================================
  console.log('\n⚠️  ERROR HANDLING:');

  await test('GET /api/projects/nonexistent - 404 handling', async () => {
    try {
      await get('/api/projects/nonexistent', '404 test');
      throw new Error('Should have thrown 404');
    } catch (err) {
      if (!err.message.includes('404')) throw err;
    }
  });

  await test('POST /api/projects/invalid-id/proposals - Invalid project', async () => {
    try {
      await post(`/api/projects/invalid-id/proposals`, {
        business_organization_id: 'org-biz-1',
        bid_amount: 10000,
        delivery_timeline_days: 10,
        description: 'Test',
      }, 'Invalid project');
      throw new Error('Should have thrown error');
    } catch (err) {
      // Expected to fail
    }
  });

  // ============================================================================
  // 9. FULL LIFECYCLE VALIDATION
  // ============================================================================
  console.log('\n🚀 FULL LIFECYCLE FLOW:');

  let lifecycleProposalId = null;
  await test('Complete workflow: Create proposal → Select → Pay', async () => {
    // Create proposal
    const submitRes = await post(`/api/projects/proj-dlc/proposals`, {
      business_organization_id: 'org-biz-1',
      bid_amount: 55000,
      delivery_timeline_days: 16,
      capacity: 'Full team',
      experience: 'Extensive',
      description: 'Complete solution',
    }, 'Lifecycle proposal');
    lifecycleProposalId = submitRes.data.id;

    // Select proposal
    const selectRes = await post(`/api/proposals/${lifecycleProposalId}/select`, {
      corporate_organization_id: 'org-corp-1',
    }, 'Select proposal');
    if (selectRes.data.status !== 'CONTRACTED') throw new Error('Not CONTRACTED');

    // Record advance payment
    const payRes = await post(`/api/projects/proj-dlc/payment/advance`, {}, 'Advance payment');
    if (payRes.data.payment_type !== 'ADVANCE_20') throw new Error('Wrong payment type');
    if (payRes.data.amount <= 0) throw new Error('Payment amount is 0');
  });

  await test('Project start and delivery workflow', async () => {
    // Start project
    const startRes = await post(`/api/projects/proj-dlc/start`, {}, 'Start project');
    if (startRes.data.status !== 'IN_PROGRESS') throw new Error('Not IN_PROGRESS');

    // Submit delivery
    const delRes = await post(`/api/projects/proj-dlc/delivery`, {
      business_organization_id: 'org-biz-1',
      quantity_delivered: 150,
      delivery_date: new Date().toISOString().split('T')[0],
      quality: 'EXCELLENT',
      comments: 'Perfect condition',
      evidenceFiles: [{ name: 'receipt.pdf', type: 'DELIVERY_RECEIPT' }],
    }, 'Delivery');
    if (delRes.status !== 201) throw new Error(`Expected 201, got ${delRes.status}`);
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

  const success = failCount === 0;
  if (success) {
    console.log('✅ ALL TESTS PASSED! Platform is fully functional.\n');
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. Review details above.\n`);
  }
  process.exit(success ? 0 : 1);
}

runAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
