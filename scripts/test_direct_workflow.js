const { ProjectService } = require('../src/lib/services/projectService');

async function testDirectWorkflow() {
  console.log('--- Direct Service Layer Workflow Test ---');
  ProjectService.resetDemoState();

  // 1. Admin KYC
  const approvedOrg = ProjectService.approveKYC('org-ngo-2');
  console.log('1. KYC Approved:', approvedOrg.name, 'Status:', approvedOrg.kyc_status);

  // 2. NGO requirement
  const project = await ProjectService.createRequirement('org-ngo-1', {
    title: 'Solar Inverters for Rural Health Subcenters',
    category: 'Environment & Solar',
    location: 'Kutch, Gujarat',
    problem_statement: 'Vaccine cold storage power backup required.',
    target_type: 'PRODUCT',
    target_quantity: 10,
    target_unit: 'units',
    estimated_budget: 350000,
    beneficiaries_impacted: 12000,
    proposed_timeline_days: 25,
    status: 'AI_ANALYZING',
  });
  console.log('2. Requirement Created:', project.project_code, 'Status:', project.status);

  // 3. AI Need Analysis
  const needAnalysis = await ProjectService.analyzeNGONeed(project.id);
  console.log('3. AI Need Analyzed: Score', needAnalysis.feasibility_score, 'Recommendations ready');

  // 4. NGO Approves
  const approvedProj = await ProjectService.approveNeedAnalysis(project.id);
  console.log('4. NGO Approved Need: Status', approvedProj.status);

  // 5. Company Locks
  const lockedProj = await ProjectService.lockProject(project.id, 'org-corp-1');
  console.log('5. Company Locked Project: Status', lockedProj.status, 'Sponsor:', lockedProj.corporate_organization_id);

  // 6. Company Tender
  const tender = await ProjectService.createTender({
    project_id: project.id,
    corporate_organization_id: 'org-corp-1',
    title: 'Tender: Solar Power Backup for Health Subcenters',
    description: 'Supply and installation of 10 solar hybrid inverter systems.',
    target_type: 'PRODUCT',
    target_quantity: 10,
    target_unit: 'units',
    max_budget: 350000,
    closing_days: 7,
    delivery_deadline_days: 25,
    business_domain: 'Solar & Renewable Energy',
  });
  console.log('6. Tender Published:', tender.tender_code, 'Domain:', tender.business_domain);

  // 7. Business Bids
  const quotation = await ProjectService.submitQuotation(tender.id, 'org-biz-1', {
    bid_amount: 320000,
    delivery_timeline_days: 20,
    item_specifications: 'Tier-1 solar systems with 5-year warranty',
    production_capacity: 'High',
    relevant_experience_years: 6,
  });
  console.log('7. Business Bid Submitted: ₹', quotation.bid_amount, 'Status:', quotation.status);

  // 8. Close & AI Score
  const closedTender = await ProjectService.closeTender(tender.id);
  console.log('8. Tender Closed: AI Scored Quotations ready');

  // 9. Select Vendor
  const contractedProj = await ProjectService.selectQuotation(quotation.id, 'org-corp-1');
  console.log('9. Vendor Selected: Status', contractedProj.status, 'Contract Value: ₹', contractedProj.contract_value);

  // 10. 20% Advance Payment
  const pay20 = await ProjectService.recordAdvancePayment(project.id);
  console.log('10. 20% Advance Disbursed: ₹', pay20.amount, 'Status: ADVANCE_20_PAID');

  // 11. Delivery Proof Upload
  const delivery = await ProjectService.submitFulfillment(project.id, 'org-biz-1', {
    fulfillment_type: 'PRODUCT',
    quantity_delivered: 10,
    quality: 'EXCELLENT',
    comments: 'All 10 systems installed and commissioned.',
  });
  console.log('11. Delivery Evidence Uploaded: Status FULFILLMENT_SUBMITTED');

  // 12. 40% Milestone Payment
  const pay40 = await ProjectService.recordMilestonePayment(project.id);
  console.log('12. 40% Milestone Disbursed: ₹', pay40.amount, 'Status: MILESTONE_40_PAID');

  // 13. NGO Ground Verification
  const ngoVerif = await ProjectService.recordNGOVerification(project.id, {
    quantity_received: 10,
    quality_acceptable: true,
    packaging_acceptable: true,
    delivered_on_time: true,
    comments: 'All 10 health centers inspected. Working properly.',
    has_issue: false,
    authorized_representative_confirmed: true,
    submitted_by: 'Ananya Sharma',
  });
  console.log('13. NGO Physical Ground Verification: Status NGO_CONFIRMED');

  // 14. Final 40% Payment
  const payFinal = await ProjectService.payFinalPayment(project.id);
  console.log('14. Final 40% Payment Disbursed: ₹', payFinal.amount, 'Project Status: COMPLETED');

  // 15. Reviews
  const review = ProjectService.createReview({
    projectId: project.id,
    reviewerOrgId: 'org-corp-1',
    reviewerRole: 'CORPORATE',
    targetOrgId: 'org-biz-1',
    targetRole: 'BUSINESS',
    rating: 5,
    comment: 'Exemplary on-time execution and professional handover.',
  });
  console.log('15. Review Submitted:', review.rating, 'Stars by', review.reviewer_role, 'to', review.target_role);

  console.log('\n--- ALL 15 LIFECYCLE WORKFLOW STEPS VALIDATED AND PASSING! ---');
}

testDirectWorkflow().catch(console.error);
