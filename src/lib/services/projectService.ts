import {
  CSRProject,
  Proposal,
  ProposalEvaluation,
  Contract,
  Payment,
  Fulfillment,
  NGOVerification,
  AIVerification,
  VerificationReview,
  ImpactReport,
  Notification,
  AuditLog,
  UserRole,
  Organization,
  Profile,
  Tender,
  TenderQuotation,
  QuotationEvaluation,
  OrgVerification,
  NGONeedAnalysis,
} from '@/types';
import {
  INITIAL_PROJECTS,
  INITIAL_PROPOSALS,
  INITIAL_EVALUATIONS,
  INITIAL_CONTRACTS,
  INITIAL_PAYMENTS,
  INITIAL_DELIVERIES,
  INITIAL_NGO_VERIFICATIONS,
  INITIAL_AI_VERIFICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ORGANIZATIONS,
  INITIAL_PROFILES,
  INITIAL_TENDERS,
  INITIAL_QUOTATIONS,
  INITIAL_QUOTATION_EVALUATIONS,
  INITIAL_ORG_VERIFICATIONS,
  INITIAL_NEED_ANALYSES,
  INITIAL_IMPACT_REPORTS,
} from '@/lib/db/mockData';
import { StateMachineService } from './stateMachineService';
import { FeatherlessAIAdapter } from '@/lib/ai/featherlessAdapter';
import { supabase } from '@/lib/db/supabaseClient';

// ─── In-memory store ──────────────────────────────────────────────────────────
class SystemStore {
  projects: CSRProject[] = [...INITIAL_PROJECTS];
  proposals: Proposal[] = [...INITIAL_PROPOSALS];
  evaluations: Record<string, ProposalEvaluation> = { ...INITIAL_EVALUATIONS };
  contracts: Contract[] = [...INITIAL_CONTRACTS];
  payments: Payment[] = [...INITIAL_PAYMENTS];
  deliveries: Fulfillment[] = [...INITIAL_DELIVERIES];
  ngoVerifications: NGOVerification[] = [...INITIAL_NGO_VERIFICATIONS];
  aiVerifications: AIVerification[] = [...INITIAL_AI_VERIFICATIONS];
  reviews: VerificationReview[] = [];
  impactReports: ImpactReport[] = [...INITIAL_IMPACT_REPORTS];
  notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  organizations: Organization[] = [...INITIAL_ORGANIZATIONS];
  profiles: Profile[] = [...INITIAL_PROFILES];
  tenders: Tender[] = [...INITIAL_TENDERS];
  quotations: TenderQuotation[] = [...INITIAL_QUOTATIONS];
  quotationEvaluations: QuotationEvaluation[] = [...INITIAL_QUOTATION_EVALUATIONS];
  orgVerifications: OrgVerification[] = [...INITIAL_ORG_VERIFICATIONS];
  needAnalyses: NGONeedAnalysis[] = [...INITIAL_NEED_ANALYSES];

  resetToDemoState() {
    this.projects = [...INITIAL_PROJECTS];
    this.proposals = [...INITIAL_PROPOSALS];
    this.evaluations = { ...INITIAL_EVALUATIONS };
    this.contracts = [...INITIAL_CONTRACTS];
    this.payments = [...INITIAL_PAYMENTS];
    this.deliveries = [...INITIAL_DELIVERIES];
    this.ngoVerifications = [...INITIAL_NGO_VERIFICATIONS];
    this.aiVerifications = [...INITIAL_AI_VERIFICATIONS];
    this.reviews = [];
    this.impactReports = [...INITIAL_IMPACT_REPORTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.tenders = [...INITIAL_TENDERS];
    this.quotations = [...INITIAL_QUOTATIONS];
    this.quotationEvaluations = [...INITIAL_QUOTATION_EVALUATIONS];
    this.orgVerifications = [...INITIAL_ORG_VERIFICATIONS];
    this.needAnalyses = [...INITIAL_NEED_ANALYSES];
  }
}

const store = new SystemStore();

export class ProjectService {
  static resetDemoState() {
    store.resetToDemoState();
    return { success: true, message: 'System state reset to clean demo seed.' };
  }

  // ─── Project Finders ────────────────────────────────────────────────────────

  private static async findRawProject(id: string): Promise<CSRProject | undefined> {
    const inMemory = store.projects.find((p) => p.id === id || p.project_code === id);
    if (inMemory) return inMemory;

    try {
      const { data, error } = await supabase
        .from('csr_projects')
        .select('*')
        .or(`id.eq.${id},project_code.eq.${id}`)
        .single();

      if (!error && data) {
        const proj = data as CSRProject;
        store.projects.push(proj);
        return proj;
      }
    } catch {
      // fallback to undefined
    }
    return undefined;
  }

  static async getProjects(role?: UserRole, orgId?: string): Promise<CSRProject[]> {
    try {
      const { data, error } = await supabase
        .from('csr_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        const list = (data ?? []) as CSRProject[];
        let filtered = list;
        if (role === 'NGO' && orgId) {
          filtered = list.filter((p) => p.ngo_organization_id === orgId);
        } else if (role === 'CORPORATE' && orgId) {
          filtered = list.filter((p) => p.corporate_organization_id === orgId || !p.corporate_organization_id);
        } else if (role === 'BUSINESS' && orgId) {
          filtered = list.filter(
            (p) =>
              ['TENDER_OPEN', 'CORPORATE_INTERESTED', 'PUBLISHED'].includes(p.status) ||
              p.selected_business_organization_id === orgId
          );
        }
        return filtered.map((p) => this.attachJoinedOrganizations(p));
      }
    } catch {
      // fallback
    }

    let list = store.projects;
    if (role === 'NGO' && orgId) {
      list = list.filter((p) => p.ngo_organization_id === orgId);
    } else if (role === 'CORPORATE' && orgId) {
      list = list.filter((p) => p.corporate_organization_id === orgId || !p.corporate_organization_id);
    } else if (role === 'BUSINESS' && orgId) {
      list = list.filter(
        (p) =>
          ['TENDER_OPEN', 'CORPORATE_INTERESTED', 'PUBLISHED'].includes(p.status) ||
          p.selected_business_organization_id === orgId
      );
    }
    return list.map((p) => this.attachJoinedOrganizations(p));
  }

  static async getProjectById(id: string): Promise<CSRProject | null> {
    try {
      const { data, error } = await supabase
        .from('csr_projects')
        .select('*')
        .or(`id.eq.${id},project_code.eq.${id}`)
        .single();

      if (!error && data) {
        return this.attachJoinedOrganizations(data as CSRProject);
      }
    } catch {
      // fallback
    }

    const proj = store.projects.find((p) => p.id === id || p.project_code === id);
    if (!proj) return null;
    return this.attachJoinedOrganizations(proj);
  }

  private static attachJoinedOrganizations(project: CSRProject): CSRProject {
    const tender = store.tenders.find((t) => t.id === project.tender_id);
    return {
      ...project,
      ngo_organization: store.organizations.find((o) => o.id === project.ngo_organization_id),
      corporate_organization: store.organizations.find((o) => o.id === project.corporate_organization_id),
      business_organization: store.organizations.find((o) => o.id === project.selected_business_organization_id),
      tender,
    };
  }

  // ─── NGO: Create Requirement ─────────────────────────────────────────────────

  static async createRequirement(
    ngoOrgId: string,
    data: {
      title: string;
      category: string;
      fulfillment_type?: string;
      location?: string;
      description: string;
      beneficiaries: number;
      estimated_budget: number;
      deadline?: string;
      urgency?: string;
      submitImmediately?: boolean;
    }
  ): Promise<CSRProject> {
    const safeBeneficiaries = Math.max(1, Number(data.beneficiaries));
    const count = store.projects.length + 1030;
    const projectCode = `CSR-${count}`;

    const newProject: CSRProject = {
      id: `proj-${Date.now()}`,
      project_code: projectCode,
      title: data.title,
      category: data.category,
      fulfillment_type: (data.fulfillment_type as any) || 'PRODUCT',
      location: data.location || 'Gujarat',
      description: data.description,
      beneficiaries: safeBeneficiaries,
      estimated_budget: Number(data.estimated_budget),
      deadline: data.deadline || '2027-03-31',
      status: data.submitImmediately ? 'SUBMITTED' : 'DRAFT',
      urgency: (data.urgency as any) || 'MEDIUM',
      ngo_organization_id: ngoOrgId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from('csr_projects').insert([{
        project_code: newProject.project_code,
        title: newProject.title,
        category: newProject.category,
        location: newProject.location,
        description: newProject.description,
        beneficiaries: newProject.beneficiaries,
        estimated_budget: newProject.estimated_budget,
        deadline: newProject.deadline,
        status: newProject.status,
        ngo_organization_id: ngoOrgId,
      }]);
    } catch {
      // in-memory fallback
    }

    store.projects.unshift(newProject);
    this.logAudit(newProject.id, 'prof-ngo-1', 'NGO', 'REQUIREMENT_CREATED', { title: newProject.title });
    return this.attachJoinedOrganizations(newProject);
  }

  // ─── NGO: AI Need Analysis ────────────────────────────────────────────────────

  static async analyzeNGONeed(projectId: string): Promise<NGONeedAnalysis> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    // Update status to AI_ANALYZING
    rawProj.status = 'AI_ANALYZING';
    rawProj.updated_at = new Date().toISOString();

    const analysis = await FeatherlessAIAdapter.analyzeNGONeed(rawProj);
    const analysisRecord: NGONeedAnalysis = {
      ...analysis,
      id: `need-${Date.now()}`,
      project_id: rawProj.id,
      created_at: new Date().toISOString(),
    };

    store.needAnalyses.unshift(analysisRecord);
    rawProj.status = 'NGO_REVIEW';
    rawProj.ai_need_analysis = analysisRecord;
    rawProj.updated_at = new Date().toISOString();

    this.logAudit(rawProj.id, 'prof-ngo-1', 'NGO', 'AI_NEED_ANALYSIS_COMPLETED', { urgency: analysisRecord.urgency });
    return analysisRecord;
  }

  static getNeedAnalysis(projectId: string): NGONeedAnalysis | undefined {
    return store.needAnalyses.find((n) => n.project_id === projectId);
  }

  // ─── NGO: Approve AI Analysis → SUBMITTED ────────────────────────────────────

  static async approveNeedAnalysis(projectId: string): Promise<CSRProject> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    StateMachineService.assertTransition(rawProj.status, 'SUBMITTED');
    rawProj.status = 'SUBMITTED';
    rawProj.updated_at = new Date().toISOString();

    this.logAudit(rawProj.id, 'prof-ngo-1', 'NGO', 'NGO_APPROVED_NEED_ANALYSIS', {});
    this.notify('prof-corp-1', rawProj.id, 'NEW_REQUIREMENT', 'New NGO Requirement Submitted',
      `NGO submitted project ${rawProj.project_code}: "${rawProj.title}". Review for CSR funding.`);

    return this.attachJoinedOrganizations(rawProj);
  }

  // ─── CORPORATE: Approve → Create Tender ──────────────────────────────────────

  static async approveProjectByCorporate(projectId: string, corpOrgId: string): Promise<CSRProject> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    rawProj.corporate_organization_id = corpOrgId;
    rawProj.status = 'CORPORATE_INTERESTED';
    rawProj.updated_at = new Date().toISOString();

    try {
      await supabase
        .from('csr_projects')
        .update({ status: 'CORPORATE_INTERESTED', corporate_organization_id: corpOrgId })
        .or(`id.eq.${projectId},project_code.eq.${projectId}`);
    } catch {
      // fallback
    }

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'CORPORATE_INTERESTED', { corporate_id: corpOrgId });
    this.notify('prof-ngo-1', rawProj.id, 'PROJECT_INTERESTED',
      'Corporate Interested in Your Project!',
      `Apex Global Technologies has expressed interest in funding "${rawProj.project_code}". A tender will be published shortly.`);

    return this.attachJoinedOrganizations(rawProj);
  }

  // ─── TENDERS ─────────────────────────────────────────────────────────────────

  static async createTender(
    projectId: string,
    corpOrgId: string,
    data: {
      title: string;
      category: string;
      fulfillment_type: string;
      required_quantity: number;
      unit: string;
      minimum_specifications: string;
      budget: number;
      delivery_location: string;
      deadline: string;
      delivery_timeline_days: number;
      payment_terms?: string;
      additional_requirements?: string;
      closing_date: string;
    }
  ): Promise<Tender> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    const count = store.tenders.length + 1030;
    const tender: Tender = {
      id: `tender-${Date.now()}`,
      tender_code: `TND-${count}`,
      project_id: rawProj.id,
      corporate_organization_id: corpOrgId,
      title: data.title,
      category: data.category,
      fulfillment_type: (data.fulfillment_type as any) || 'PRODUCT',
      required_quantity: Number(data.required_quantity),
      unit: data.unit,
      minimum_specifications: data.minimum_specifications,
      budget: Number(data.budget),
      delivery_location: data.delivery_location,
      deadline: data.deadline,
      delivery_timeline_days: Number(data.delivery_timeline_days),
      payment_terms: data.payment_terms || '20% Advance on contract. 40% after fulfillment proof. 40% after NGO confirmation.',
      additional_requirements: data.additional_requirements,
      open_date: new Date().toISOString(),
      closing_date: data.closing_date,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.tenders.unshift(tender);
    rawProj.tender_id = tender.id;
    rawProj.status = 'TENDER_OPEN';
    rawProj.updated_at = new Date().toISOString();

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'TENDER_PUBLISHED', { tender_code: tender.tender_code, budget: tender.budget });
    this.notify('prof-biz-1', rawProj.id, 'TENDER_PUBLISHED', `New Tender: ${tender.title}`,
      `Tender ${tender.tender_code} is open. Budget: ₹${tender.budget.toLocaleString()}. Submit your quotation before ${data.closing_date.split('T')[0]}.`);
    this.notify('prof-biz-2', rawProj.id, 'TENDER_PUBLISHED', `New Tender: ${tender.title}`,
      `Tender ${tender.tender_code} is open. Budget: ₹${tender.budget.toLocaleString()}.`);
    this.notify('prof-biz-3', rawProj.id, 'TENDER_PUBLISHED', `New Tender: ${tender.title}`,
      `Tender ${tender.tender_code} is open. Budget: ₹${tender.budget.toLocaleString()}.`);

    return tender;
  }

  static getTenders(status?: string): Tender[] {
    let list = store.tenders;
    if (status) list = list.filter((t) => t.status === status);
    return list.map((t) => ({
      ...t,
      project: store.projects.find((p) => p.id === t.project_id),
      corporate_organization: store.organizations.find((o) => o.id === t.corporate_organization_id),
      quotations: store.quotations.filter((q) => q.tender_id === t.id).map((q) => ({
        ...q,
        business_organization: store.organizations.find((o) => o.id === q.business_organization_id),
        evaluation: store.quotationEvaluations.find((e) => e.quotation_id === q.id),
      })),
    }));
  }

  static getTenderById(tenderId: string): Tender | undefined {
    const tender = store.tenders.find((t) => t.id === tenderId || t.tender_code === tenderId);
    if (!tender) return undefined;
    return {
      ...tender,
      project: store.projects.find((p) => p.id === tender.project_id),
      corporate_organization: store.organizations.find((o) => o.id === tender.corporate_organization_id),
      quotations: store.quotations.filter((q) => q.tender_id === tender.id).map((q) => ({
        ...q,
        business_organization: store.organizations.find((o) => o.id === q.business_organization_id),
        evaluation: store.quotationEvaluations.find((e) => e.quotation_id === q.id),
      })),
    };
  }

  static getTendersByProject(projectId: string): Tender[] {
    return store.tenders
      .filter((t) => t.project_id === projectId)
      .map((t) => ({
        ...t,
        quotations: store.quotations.filter((q) => q.tender_id === t.id).map((q) => ({
          ...q,
          business_organization: store.organizations.find((o) => o.id === q.business_organization_id),
          evaluation: store.quotationEvaluations.find((e) => e.quotation_id === q.id),
        })),
      }));
  }

  // ─── QUOTATIONS ───────────────────────────────────────────────────────────────

  static async submitQuotation(
    tenderId: string,
    bizOrgId: string,
    data: {
      bid_amount: number;
      delivery_timeline_days: number;
      quantity_offered: number;
      specifications_offered: string;
      capacity: string;
      experience: string;
      description: string;
      warranty_guarantee?: string;
      terms?: string;
    }
  ): Promise<TenderQuotation> {
    const tender = store.tenders.find((t) => t.id === tenderId);
    if (!tender) throw new Error('Tender not found');
    if (tender.status !== 'OPEN') throw new Error('Tender is not open for quotations');

    // Check for duplicate
    const existing = store.quotations.find((q) => q.tender_id === tenderId && q.business_organization_id === bizOrgId);
    if (existing) throw new Error('You have already submitted a quotation for this tender');

    const rawProj = await this.findRawProject(tender.project_id);

    const quotation: TenderQuotation = {
      id: `quot-${Date.now()}`,
      tender_id: tenderId,
      project_id: tender.project_id,
      business_organization_id: bizOrgId,
      bid_amount: Number(data.bid_amount),
      delivery_timeline_days: Number(data.delivery_timeline_days),
      quantity_offered: Number(data.quantity_offered),
      specifications_offered: data.specifications_offered,
      capacity: data.capacity,
      experience: data.experience,
      description: data.description,
      warranty_guarantee: data.warranty_guarantee,
      terms: data.terms,
      status: 'SUBMITTED',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Run AI evaluation immediately
    const evalResult = await FeatherlessAIAdapter.evaluateQuotation(tender, quotation);
    const evalRecord: QuotationEvaluation = {
      ...evalResult,
      id: `qeval-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    store.quotationEvaluations.push(evalRecord);
    quotation.status = 'AI_EVALUATED';
    quotation.evaluation = evalRecord;
    quotation.requirement_match_pct = evalRecord.requirement_match_score;
    store.quotations.unshift(quotation);

    if (rawProj) {
      this.logAudit(rawProj.id, bizOrgId, 'BUSINESS', 'QUOTATION_SUBMITTED', {
        bid_amount: quotation.bid_amount,
        ai_score: evalRecord.overall_score,
      });
      this.notify('prof-corp-1', rawProj.id, 'QUOTATION_RECEIVED', 'New Quotation Received',
        `Business submitted quotation of ₹${quotation.bid_amount.toLocaleString()} (AI Score: ${evalRecord.overall_score}/100) for Tender ${tender.tender_code}.`);
    }

    return { ...quotation, evaluation: evalRecord, business_organization: store.organizations.find((o) => o.id === bizOrgId) };
  }

  static getQuotationsByTender(tenderId: string): TenderQuotation[] {
    return store.quotations
      .filter((q) => q.tender_id === tenderId)
      .map((q) => ({
        ...q,
        business_organization: store.organizations.find((o) => o.id === q.business_organization_id),
        evaluation: store.quotationEvaluations.find((e) => e.quotation_id === q.id),
      }));
  }

  // ─── CORPORATE: Close Tender + Select Business ────────────────────────────────

  static async closeTender(tenderId: string): Promise<Tender> {
    const tender = store.tenders.find((t) => t.id === tenderId);
    if (!tender) throw new Error('Tender not found');

    tender.status = 'CLOSED';
    tender.updated_at = new Date().toISOString();

    const rawProj = await this.findRawProject(tender.project_id);
    if (rawProj) {
      rawProj.status = 'TENDER_CLOSED';
      rawProj.updated_at = new Date().toISOString();
    }

    return tender;
  }

  static async selectQuotation(quotationId: string, corpOrgId: string): Promise<CSRProject> {
    const quotation = store.quotations.find((q) => q.id === quotationId);
    if (!quotation) throw new Error('Quotation not found');

    const tender = store.tenders.find((t) => t.id === quotation.tender_id);
    if (!tender) throw new Error('Tender not found');

    const rawProj = await this.findRawProject(quotation.project_id);
    if (!rawProj) throw new Error('Project not found');

    // Mark selected/rejected
    quotation.status = 'SELECTED';
    store.quotations.forEach((q) => {
      if (q.tender_id === tender.id && q.id !== quotationId) {
        q.status = 'NOT_SELECTED';
      }
    });

    tender.status = 'BUSINESS_SELECTED';
    tender.updated_at = new Date().toISOString();

    rawProj.selected_business_organization_id = quotation.business_organization_id;
    rawProj.contract_value = quotation.bid_amount;
    rawProj.status = 'BUSINESS_SELECTED';
    rawProj.updated_at = new Date().toISOString();

    // Create contract with 20/40/40 terms
    const contractAmount = quotation.bid_amount;
    const contract: Contract = {
      id: `contract-${Date.now()}`,
      project_id: rawProj.id,
      tender_id: tender.id,
      corporate_organization_id: corpOrgId,
      business_organization_id: quotation.business_organization_id,
      amount: contractAmount,
      scope: `Supply and fulfillment for "${rawProj.title}" as per Tender ${tender.tender_code}`,
      terms: `20% Advance (₹${Math.round(contractAmount * 0.2).toLocaleString()}) on contract execution. 40% Fulfillment Milestone (₹${Math.round(contractAmount * 0.4).toLocaleString()}) after delivery proof. 40% Final (₹${Math.round(contractAmount * 0.4).toLocaleString()}) after NGO physical confirmation.`,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    store.contracts.push(contract);

    // Move to CONTRACTED
    rawProj.status = 'CONTRACTED';

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'BUSINESS_SELECTED_VIA_TENDER', {
      quotation_id: quotationId,
      contract_value: contractAmount,
      ai_score: quotation.evaluation?.overall_score,
    });
    this.notify(
      'prof-biz-1', rawProj.id, 'QUOTATION_SELECTED', '🎉 Your Quotation Has Been Selected!',
      `Your quotation for Tender ${tender.tender_code} was selected! Contract value: ₹${contractAmount.toLocaleString()}. Awaiting 20% advance payment.`
    );
    this.notify(
      'prof-ngo-1', rawProj.id, 'BUSINESS_SELECTED', 'Vendor Selected for Your Project',
      `${store.organizations.find((o) => o.id === quotation.business_organization_id)?.name || 'A vendor'} has been selected for ${rawProj.project_code}. Contract: ₹${contractAmount.toLocaleString()}.`
    );

    return this.attachJoinedOrganizations(rawProj);
  }

  // ─── CORPORATE: Record 20% Advance Payment ───────────────────────────────────

  static async recordAdvancePayment(projectId: string): Promise<Payment> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    StateMachineService.assertTransition(rawProj.status, 'ADVANCE_20_PAID');

    let contract = store.contracts.find((c) => c.project_id === rawProj.id);
    if (!contract) {
      contract = {
        id: `contract-${Date.now()}`,
        project_id: rawProj.id,
        corporate_organization_id: 'org-corp-1',
        business_organization_id: rawProj.selected_business_organization_id || 'org-biz-1',
        amount: rawProj.contract_value || rawProj.estimated_budget,
        terms: '20/40/40 payment terms.',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };
      store.contracts.push(contract);
    }

    const advanceAmount = Math.round(contract.amount * 0.20);
    const payment: Payment = {
      id: `pay-${Date.now()}-adv20`,
      project_id: rawProj.id,
      contract_id: contract.id,
      payment_type: 'ADVANCE_20',
      amount: advanceAmount,
      percentage: 20,
      milestone_label: '20% Advance',
      status: 'RECORDED',
      trigger_condition: 'Contract execution confirmed',
      approved_by: 'prof-corp-1',
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    store.payments.push(payment);
    rawProj.status = 'ADVANCE_20_PAID';
    rawProj.updated_at = new Date().toISOString();

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'ADVANCE_20_PAYMENT_RECORDED', { amount: advanceAmount, percentage: '20%' });
    this.notify('prof-biz-1', rawProj.id, 'PAYMENT_RELEASED', '20% Advance Payment Recorded',
      `₹${advanceAmount.toLocaleString()} advance (20%) has been recorded for ${rawProj.project_code}. You may now begin execution.`);

    return payment;
  }

  // ─── BUSINESS: Start Work ────────────────────────────────────────────────────

  static async startProjectWork(projectId: string): Promise<CSRProject> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    StateMachineService.assertTransition(rawProj.status, 'IN_PROGRESS');
    rawProj.status = 'IN_PROGRESS';
    rawProj.updated_at = new Date().toISOString();

    this.logAudit(rawProj.id, 'prof-biz-1', 'BUSINESS', 'PROJECT_WORK_STARTED', {});
    return this.attachJoinedOrganizations(rawProj);
  }

  // ─── BUSINESS: Submit Fulfillment ────────────────────────────────────────────

  static async submitFulfillment(
    projectId: string,
    bizOrgId: string,
    data: {
      fulfillment_type?: string;
      quantity_delivered?: number;
      delivery_date?: string;
      service_description?: string;
      sessions_completed?: number;
      service_date_start?: string;
      service_date_end?: string;
      beneficiaries_served?: number;
      quality?: string;
      comments?: string;
      evidenceFiles?: Array<{ name: string; type: string }>;
    }
  ): Promise<Fulfillment> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    StateMachineService.assertTransition(rawProj.status, 'FULFILLMENT_SUBMITTED');

    const fulfillmentTimestamp = Date.now();
    const fulfillmentId = `del-${fulfillmentTimestamp}`;

    const fulfillment: Fulfillment = {
      id: fulfillmentId,
      project_id: rawProj.id,
      business_organization_id: bizOrgId,
      fulfillment_type: (data.fulfillment_type as any) || 'PRODUCT',
      quantity_delivered: data.quantity_delivered ? Number(data.quantity_delivered) : undefined,
      delivery_date: data.delivery_date,
      service_description: data.service_description,
      sessions_completed: data.sessions_completed,
      service_date_start: data.service_date_start,
      service_date_end: data.service_date_end,
      beneficiaries_served: data.beneficiaries_served,
      quality: data.quality || 'GOOD',
      comments: data.comments,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: (data.evidenceFiles || [{ name: 'Fulfillment_Evidence.pdf', type: 'FULFILLMENT_RECEIPT' }]).map((f, i) => ({
        id: `ev-${fulfillmentTimestamp}-${i}`,
        delivery_id: fulfillmentId,
        evidence_type: (f.type as any) || 'FULFILLMENT_RECEIPT',
        storage_path: `fulfillments/${fulfillmentId}/${f.name}`,
        file_name: f.name,
        mime_type: f.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
        uploaded_by: bizOrgId,
        created_at: new Date().toISOString(),
      })),
    };

    store.deliveries.unshift(fulfillment);
    rawProj.status = 'FULFILLMENT_SUBMITTED';
    rawProj.updated_at = new Date().toISOString();

    // Record 40% milestone payment
    const contract = store.contracts.find((c) => c.project_id === rawProj.id);
    if (contract) {
      const milestoneAmount = Math.round(contract.amount * 0.40);
      const milestonePayment: Payment = {
        id: `pay-${fulfillmentTimestamp}-mil40`,
        project_id: rawProj.id,
        contract_id: contract.id,
        payment_type: 'FULFILLMENT_40',
        amount: milestoneAmount,
        percentage: 40,
        milestone_label: '40% Fulfillment Milestone',
        status: 'RECORDED',
        trigger_condition: 'Fulfillment proof submitted and verified',
        approved_by: 'prof-corp-1',
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      store.payments.push(milestonePayment);
      rawProj.status = 'MILESTONE_40_PAID';
    }

    this.logAudit(rawProj.id, 'prof-biz-1', 'BUSINESS', 'FULFILLMENT_SUBMITTED', {
      quantity: data.quantity_delivered || data.beneficiaries_served,
    });
    this.notify('prof-ngo-1', rawProj.id, 'FULFILLMENT_SUBMITTED', 'Fulfillment Submitted — Your Confirmation Needed',
      `Business submitted fulfillment for ${rawProj.project_code}. Please physically confirm receipt and submit your verification.`);
    this.notify('prof-corp-1', rawProj.id, 'MILESTONE_40_PAID', '40% Milestone Payment Recorded',
      `Fulfillment milestone payment (40% = ₹${Math.round((contract?.amount || 0) * 0.4).toLocaleString()}) recorded for ${rawProj.project_code}.`);

    return fulfillment;
  }

  // ─── NGO: Submit Verification (Confirmation) ─────────────────────────────────

  static async submitNGOVerification(
    projectId: string,
    deliveryId: string,
    data: {
      quantity_received: number;
      quality_acceptable: boolean;
      packaging_acceptable: boolean;
      delivered_on_time: boolean;
      invoice_reference?: string;
      comments?: string;
      has_issue?: boolean;
      issue_description?: string;
    }
  ): Promise<{ ngoVerification: NGOVerification; aiVerification: AIVerification }> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    const delivery = store.deliveries.find((d) => d.id === deliveryId || d.project_id === rawProj.id);
    if (!delivery) {
      throw new Error('No fulfillment record found for this project. Business must submit fulfillment first.');
    }

    const ngoVer: NGOVerification = {
      id: `ngo-ver-${Date.now()}`,
      project_id: rawProj.id,
      delivery_id: delivery.id,
      quantity_received: Number(data.quantity_received),
      quality_acceptable: data.quality_acceptable,
      packaging_acceptable: data.packaging_acceptable,
      delivered_on_time: data.delivered_on_time,
      invoice_reference: data.invoice_reference || '',
      comments: data.comments,
      has_issue: data.has_issue || false,
      issue_description: data.issue_description,
      authorized_representative_confirmed: true,
      submitted_by: 'prof-ngo-1',
      submitted_at: new Date().toISOString(),
    };
    store.ngoVerifications.unshift(ngoVer);

    const aiResult = await FeatherlessAIAdapter.verifyDelivery(rawProj, delivery, ngoVer);
    const aiVerRecord: AIVerification = {
      ...aiResult,
      id: `ai-ver-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    store.aiVerifications.unshift(aiVerRecord);

    if (data.has_issue || aiVerRecord.status !== 'LIKELY_FULFILLED') {
      rawProj.status = 'MANUAL_REVIEW';
      this.notify('prof-corp-1', rawProj.id, 'MISMATCH_DETECTED', '⚠ Issue Flagged — Manual Review Required',
        `AI detected issues for ${rawProj.project_code}: ${aiVerRecord.issues[0]?.message || 'Review required'}.`);
    } else {
      rawProj.status = 'NGO_CONFIRMED';
      this.notify('prof-corp-1', rawProj.id, 'NGO_CONFIRMED', 'NGO Confirmed — Final 40% Ready',
        `Project ${rawProj.project_code} confirmed at ${aiVerRecord.completion_percentage}% by NGO. Release final 40% payment.`);
    }

    rawProj.updated_at = new Date().toISOString();
    this.logAudit(rawProj.id, 'prof-ngo-1', 'NGO', 'NGO_VERIFICATION_SUBMITTED', {
      quantity_received: ngoVer.quantity_received,
      ai_status: aiVerRecord.status,
      has_issue: ngoVer.has_issue,
    });

    return { ngoVerification: ngoVer, aiVerification: aiVerRecord };
  }

  // ─── CORPORATE: Record Final 40% Payment ─────────────────────────────────────

  static async payFinalPayment(projectId: string): Promise<Payment> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    const validFinalStates = ['NGO_CONFIRMED', 'MANUAL_REVIEW', 'AI_VERIFIED', 'NGO_VERIFIED'];
    if (!validFinalStates.includes(rawProj.status)) {
      throw new Error(`Cannot release final payment. Project status '${rawProj.status}' has not completed NGO confirmation yet.`);
    }

    let contract = store.contracts.find((c) => c.project_id === rawProj.id);
    if (!contract) {
      contract = {
        id: `contract-${Date.now()}`,
        project_id: rawProj.id,
        corporate_organization_id: 'org-corp-1',
        business_organization_id: rawProj.selected_business_organization_id || 'org-biz-1',
        amount: rawProj.contract_value || rawProj.estimated_budget,
        terms: '20/40/40 payment terms.',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };
      store.contracts.push(contract);
    }

    const finalAmount = Math.round(contract.amount * 0.40);

    const payment: Payment = {
      id: `pay-${Date.now()}-final40`,
      project_id: rawProj.id,
      contract_id: contract.id,
      payment_type: 'FINAL_40',
      amount: finalAmount,
      percentage: 40,
      milestone_label: '40% Final Payment',
      status: 'RECORDED',
      trigger_condition: 'NGO physical confirmation received',
      approved_by: 'prof-corp-1',
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    store.payments.push(payment);
    rawProj.status = 'COMPLETED';
    rawProj.completed_at = new Date().toISOString();
    rawProj.updated_at = new Date().toISOString();
    contract.status = 'COMPLETED';

    // Generate impact report
    const del = store.deliveries.find((d) => d.project_id === rawProj.id);
    const ngoVer = store.ngoVerifications.find((v) => v.project_id === rawProj.id);
    const allPayments = store.payments.filter((p) => p.project_id === rawProj.id);
    const summary = await FeatherlessAIAdapter.generateImpactSummary(rawProj, del, ngoVer);

    const report: ImpactReport = {
      id: `rep-${Date.now()}`,
      project_id: rawProj.id,
      ngo_name: store.organizations.find((o) => o.id === rawProj.ngo_organization_id)?.name,
      corporate_name: store.organizations.find((o) => o.id === rawProj.corporate_organization_id)?.name,
      business_name: store.organizations.find((o) => o.id === rawProj.selected_business_organization_id)?.name,
      category: rawProj.category,
      location: rawProj.location,
      contract_value: contract.amount,
      payment_advance: allPayments.find((p) => p.payment_type === 'ADVANCE_20')?.amount,
      payment_milestone: allPayments.find((p) => p.payment_type === 'FULFILLMENT_40')?.amount,
      payment_final: finalAmount,
      beneficiaries: rawProj.beneficiaries,
      requested_quantity: rawProj.beneficiaries,
      delivered_quantity: ngoVer?.quantity_received ?? del?.quantity_delivered ?? rawProj.beneficiaries,
      completion_percentage: ngoVer
        ? Math.min(100, Math.round((ngoVer.quantity_received / Math.max(1, rawProj.beneficiaries)) * 100))
        : 100,
      evidence_count: del?.evidence?.length || 0,
      verification_status: 'VERIFIED_AND_AUDITED',
      impact_summary: summary,
      generated_by: 'FeatherlessAI + IRISiv Platform',
      created_at: new Date().toISOString(),
    };
    store.impactReports.unshift(report);

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'PROJECT_COMPLETED_FINAL_40_PAYMENT', { final_amount: finalAmount });
    this.notify('prof-biz-1', rawProj.id, 'PROJECT_COMPLETED', '✅ Final 40% Payment Released',
      `Final payment of ₹${finalAmount.toLocaleString()} released. Project ${rawProj.project_code} successfully completed!`);
    this.notify('prof-ngo-1', rawProj.id, 'PROJECT_COMPLETED', 'Verifiable Impact Report Ready',
      `Impact report generated for ${rawProj.project_code}. ${rawProj.beneficiaries} beneficiaries reached.`);

    return payment;
  }

  // ─── BACKWARD COMPAT: old advance payment path ────────────────────────────────

  static async payAdvance(projectId: string): Promise<Payment> {
    return this.recordAdvancePayment(projectId);
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  static getDelivery(projectId: string): Fulfillment | undefined {
    return store.deliveries.find((d) => d.project_id === projectId);
  }

  static getNGOVerification(projectId: string): NGOVerification | undefined {
    return store.ngoVerifications.find((v) => v.project_id === projectId);
  }

  static getAIVerification(projectId: string): AIVerification | undefined {
    return store.aiVerifications.find((v) => v.project_id === projectId);
  }

  static getPayments(projectId: string): Payment[] {
    return store.payments.filter((p) => p.project_id === projectId);
  }

  static getImpactReport(projectId: string): ImpactReport | undefined {
    return store.impactReports.find((r) => r.project_id === projectId);
  }

  static getNotifications(profileId?: string): Notification[] {
    return store.notifications;
  }

  static getAuditLogs(projectId?: string): AuditLog[] {
    if (projectId) return store.auditLogs.filter((l) => l.project_id === projectId);
    return store.auditLogs;
  }

  static getOrganizations(): Organization[] {
    return store.organizations;
  }

  static getOrgVerification(orgId: string): OrgVerification | undefined {
    return store.orgVerifications.find((v) => v.organization_id === orgId);
  }

  // Backward compat — old proposal methods
  static async submitProposal(
    projectId: string,
    bizOrgId: string,
    data: { bid_amount: number; delivery_timeline_days: number; capacity?: string; experience?: string; description: string }
  ): Promise<Proposal> {
    const rawProj = await this.findRawProject(projectId);
    if (!rawProj) throw new Error('Project not found');

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      project_id: rawProj.id,
      business_organization_id: bizOrgId,
      bid_amount: Number(data.bid_amount),
      delivery_timeline_days: Number(data.delivery_timeline_days),
      capacity: data.capacity,
      experience: data.experience,
      description: data.description,
      status: 'SUBMITTED',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.proposals.unshift(newProposal);
    try {
      await supabase.from('proposals').insert([
        {
          id: newProposal.id,
          project_id: newProposal.project_id,
          business_organization_id: newProposal.business_organization_id,
          bid_amount: newProposal.bid_amount,
          delivery_timeline_days: newProposal.delivery_timeline_days,
          capacity: newProposal.capacity,
          experience: newProposal.experience,
          description: newProposal.description,
          status: newProposal.status,
          submitted_at: newProposal.submitted_at,
          updated_at: newProposal.updated_at,
        },
      ]);
    } catch {
      // fallback to in-memory only
    }

    const evalResult = await FeatherlessAIAdapter.evaluateProposal(rawProj, newProposal);
    const evaluationRecord: ProposalEvaluation = {
      ...evalResult,
      id: `eval-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    store.evaluations[newProposal.id] = evaluationRecord;
    newProposal.status = 'AI_EVALUATED';
    newProposal.evaluation = evaluationRecord;

    this.logAudit(rawProj.id, 'prof-biz-1', 'BUSINESS', 'PROPOSAL_SUBMITTED', { bid_amount: newProposal.bid_amount });
    return newProposal;
  }

  static async getProposalsByProject(projectId: string): Promise<Proposal[]> {
    try {
      const { data, error } = await supabase.from('proposals').select('*').eq('project_id', projectId).order('submitted_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const list = data as Proposal[];
        return list.map((p) => ({
          ...p,
          business_organization: store.organizations.find((o) => o.id === p.business_organization_id),
          evaluation: store.evaluations[p.id],
        }));
      }
    } catch {
      // fallback
    }

    const props = store.proposals.filter((p) => p.project_id === projectId);
    return props.map((p) => ({
      ...p,
      business_organization: store.organizations.find((o) => o.id === p.business_organization_id),
      evaluation: store.evaluations[p.id],
    }));
  }

  static async selectBusinessProposal(proposalId: string, corpOrgId: string): Promise<CSRProject> {
    let proposal = store.proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      try {
        const { data, error } = await supabase.from('proposals').select('*').eq('id', proposalId).single();
        if (!error && data) {
          proposal = data as Proposal;
          store.proposals.unshift(proposal);
        }
      } catch {
        // fallback
      }
    }
    if (!proposal) throw new Error('Proposal not found');

    const rawProj = await this.findRawProject(proposal.project_id);
    if (!rawProj) throw new Error('Project not found');

    proposal.status = 'SELECTED';
    rawProj.selected_business_organization_id = proposal.business_organization_id;
    rawProj.contract_value = proposal.bid_amount;
    rawProj.updated_at = new Date().toISOString();

    store.proposals.forEach((p) => {
      if (p.project_id === rawProj.id && p.id !== proposalId) p.status = 'REJECTED';
    });

    const contract: Contract = {
      id: `contract-${Date.now()}`,
      project_id: rawProj.id,
      corporate_organization_id: corpOrgId,
      business_organization_id: proposal.business_organization_id,
      amount: proposal.bid_amount,
      terms: '20% Advance. 40% Fulfillment Milestone. 40% Final Payment upon NGO confirmation.',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    store.contracts.push(contract);
    rawProj.status = 'CONTRACTED';

    this.logAudit(rawProj.id, 'prof-corp-1', 'CORPORATE', 'BUSINESS_SELECTED', { proposal_id: proposalId });
    this.notify('prof-biz-1', rawProj.id, 'BUSINESS_SELECTED', 'Proposal Selected!',
      `Your proposal for ${rawProj.project_code} has been selected! Contract: ₹${proposal.bid_amount.toLocaleString()}.`);

    return this.attachJoinedOrganizations(rawProj);
  }

  private static logAudit(projectId: string, actorId: string, role: UserRole, action: string, metadata: Record<string, unknown>) {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      project_id: projectId,
      actor_profile_id: actorId,
      actor_role: role,
      action,
      metadata,
      created_at: new Date().toISOString(),
    });
  }

  private static notify(recipientProfileId: string, projectId: string, type: string, title: string, message: string) {
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipient_profile_id: recipientProfileId,
      project_id: projectId,
      type,
      title,
      message,
      created_at: new Date().toISOString(),
    });
  }
}
