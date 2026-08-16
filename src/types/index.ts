export type UserRole = 'NGO' | 'CORPORATE' | 'BUSINESS' | 'ADMIN';
export type OrganizationType = 'NGO' | 'CORPORATE' | 'BUSINESS';

// ─── PROJECT STATUS ───────────────────────────────────────────────────────────
export type ProjectStatus =
  | 'DRAFT'
  | 'AI_ANALYZING'
  | 'NGO_REVIEW'
  | 'SUBMITTED'
  | 'CORPORATE_REVIEW'
  | 'CORPORATE_INTERESTED'
  | 'TENDER_OPEN'
  | 'TENDER_CLOSED'
  | 'AI_EVALUATED'
  | 'BUSINESS_SELECTED'
  | 'CONTRACTED'
  | 'ADVANCE_20_PAID'
  | 'IN_PROGRESS'
  | 'FULFILLMENT_SUBMITTED'
  | 'MILESTONE_40_PAID'
  | 'NGO_CONFIRMATION_PENDING'
  | 'NGO_CONFIRMED'
  | 'FINAL_40_PAID'
  | 'COMPLETED'
  | 'MANUAL_REVIEW'
  | 'DISPUTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

// ─── TENDER STATUS ────────────────────────────────────────────────────────────
export type TenderStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'CLOSED'
  | 'UNDER_EVALUATION'
  | 'BUSINESS_SELECTED'
  | 'CANCELLED'
  | 'EXPIRED';

// ─── QUOTATION STATUS ─────────────────────────────────────────────────────────
export type QuotationStatus =
  | 'SUBMITTED'
  | 'AI_EVALUATED'
  | 'SELECTED'
  | 'REJECTED'
  | 'NOT_SELECTED';

// ─── ORG VERIFICATION STATUS ──────────────────────────────────────────────────
export type OrgVerificationStatus =
  | 'DOCUMENTS_NOT_SUBMITTED'
  | 'DOCUMENTS_SUBMITTED'
  | 'AI_SCREENING'
  | 'LEGAL_REVIEW'
  | 'CLARIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'REJECTED';

export type ProposalStatus = 'SUBMITTED' | 'AI_EVALUATED' | 'SELECTED' | 'REJECTED' | 'CLOSED';
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// ─── PAYMENT TYPES: 20% + 40% + 40% ─────────────────────────────────────────
export type PaymentType = 'ADVANCE_20' | 'FULFILLMENT_40' | 'FINAL_40';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'RECORDED' | 'FAILED';

export type FulfillmentType = 'PRODUCT' | 'SERVICE';

export type EvidenceType =
  | 'INVOICE'
  | 'FULFILLMENT_RECEIPT'
  | 'PHOTO'
  | 'SERVICE_COMPLETION_REPORT'
  | 'QUANTITY_CONFIRMATION'
  | 'AUTHORIZED_CONFIRMATION'
  | 'OTHER';

export type AIVerificationStatus =
  | 'LIKELY_FULFILLED'
  | 'ISSUE_DETECTED'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'FAILED';

export type ReviewDecision = 'APPROVE' | 'REQUEST_REVIEW' | 'REJECT';

export type AccountStatus = 'KYC_PENDING' | 'KYC_APPROVED' | 'KYC_REJECTED' | 'ACTIVE';

export type DeliveryStageStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'NGO_CONFIRMED'
  | 'ISSUE_RAISED';

export type PaymentStageStatus =
  | '20_PERCENT_PENDING'
  | '20_PERCENT_PAID'
  | '40_PERCENT_PENDING'
  | '40_PERCENT_PAID'
  | 'FINAL_40_PERCENT_PENDING'
  | 'FULLY_PAID';

// ─── REVIEWS & RATINGS ─────────────────────────────────────────────────────────
export interface OrgReview {
  id: string;
  project_id: string;
  project_title?: string;
  reviewer_org_id: string;
  reviewer_org_name?: string;
  reviewer_role: UserRole;
  target_org_id: string;
  target_org_name?: string;
  target_role: UserRole;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

// ─── PROFILES & ORGANIZATIONS ─────────────────────────────────────────────────

export interface Profile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role: UserRole;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  organization_type: OrganizationType;
  location?: string;
  phone?: string;
  domain?: string;
  registration_number?: string;
  tax_id?: string;
  kyc_status?: AccountStatus;
  rejection_reason?: string;
  verification_status?: OrgVerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  profile_id: string;
  member_role: string;
  created_at: string;
}

// ─── ORG VERIFICATION (Document Verification Workflow) ────────────────────────

export interface OrgVerificationDocument {
  id: string;
  verification_id: string;
  document_type: string;
  file_name: string;
  storage_path: string;
  uploaded_at: string;
}

export interface AIDocumentScreening {
  id: string;
  verification_id: string;
  extracted_data: Record<string, string>;
  identified_document_types: string[];
  completeness_score: number;
  consistency_check: string;
  issues: string[];
  warnings: string[];
  recommendation: 'PROCEED_TO_LEGAL_REVIEW' | 'CLARIFICATION_NEEDED' | 'REJECT';
  screening_summary: string;
  ai_powered: boolean;
  created_at: string;
}

export interface OrgVerification {
  id: string;
  organization_id: string;
  status: OrgVerificationStatus;
  documents: OrgVerificationDocument[];
  ai_screening_result?: AIDocumentScreening;
  reviewer_id?: string;
  reviewer_decision?: 'APPROVE' | 'REQUEST_CLARIFICATION' | 'REJECT';
  reviewer_comments?: string;
  reviewed_at?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ─── NGO NEED ANALYSIS (AI Structured Output) ─────────────────────────────────

export interface NGONeedAnalysisItem {
  item: string;
  quantity: number;
  specification: string;
}

export interface NGONeedAnalysis {
  id: string;
  project_id: string;
  original_description: string;
  structured_title: string;
  category: string;
  problem_summary: string;
  beneficiary_group: string;
  estimated_beneficiaries: number;
  location: string;
  required_items: NGONeedAnalysisItem[];
  estimated_budget: number;
  suggested_timeline_days: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expected_impact: string;
  csr_category: string;
  csr_eligibility_indicators: string[];
  missing_information: string[];
  feasibility_score?: number;
  ai_recommendations?: string;
  ai_powered: boolean;
  created_at: string;
}

// ─── CSR PROJECT ──────────────────────────────────────────────────────────────

export interface CSRProject {
  id: string;
  project_code: string;
  title: string;
  category: string;
  fulfillment_type?: FulfillmentType;
  location?: string;
  description: string;
  beneficiaries: number;
  estimated_budget: number;
  contract_value?: number;
  deadline?: string;
  status: ProjectStatus;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ngo_organization_id: string;
  corporate_organization_id?: string;
  selected_business_organization_id?: string;
  tender_id?: string;
  target_quantity?: number;
  target_unit?: string;
  beneficiaries_impacted?: number;
  problem_statement?: string;
  target_type?: FulfillmentType;
  proposed_timeline_days?: number;
  ai_need_analysis?: NGONeedAnalysis;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  // Joined entity fields for UI convenience
  ngo_organization?: Organization;
  corporate_organization?: Organization;
  business_organization?: Organization;
  tender?: Tender;
  payments?: Payment[];
}

// ─── TENDER ───────────────────────────────────────────────────────────────────

export interface Tender {
  id: string;
  tender_code: string;
  project_id: string;
  corporate_organization_id: string;
  title: string;
  category: string;
  fulfillment_type: FulfillmentType;
  required_quantity: number;
  unit: string;
  minimum_specifications: string;
  budget: number;
  max_budget?: number;
  target_quantity?: number;
  target_unit?: string;
  description?: string;
  business_domain?: string;
  selected_quotation_id?: string;
  delivery_location: string;
  deadline: string;
  delivery_timeline_days: number;
  delivery_deadline_days?: number;
  payment_terms: string;
  additional_requirements?: string;
  open_date: string;
  closing_date: string;
  status: TenderStatus;
  created_at: string;
  updated_at: string;
  // Joined
  project?: CSRProject;
  corporate_organization?: Organization;
  quotations?: TenderQuotation[];
}

// ─── TENDER QUOTATION (replaces old Proposal in tender workflow) ──────────────

export interface TenderQuotation {
  id: string;
  tender_id: string;
  project_id: string;
  business_organization_id: string;
  bid_amount: number;
  delivery_timeline_days: number;
  quantity_offered: number;
  specifications_offered: string;
  capacity: string;
  experience: string;
  description: string;
  relevant_experience_years?: number;
  production_capacity?: string;
  item_specifications?: string;
  warranty_details?: string;
  warranty_guarantee?: string;
  terms?: string;
  status: QuotationStatus;
  requirement_match_pct?: number;
  submitted_at: string;
  updated_at: string;
  // Joined
  business_organization?: Organization;
  evaluation?: QuotationEvaluation;
}

// ─── QUOTATION EVALUATION (AI multi-factor scoring) ──────────────────────────

export interface QuotationEvaluation {
  id: string;
  quotation_id: string;
  tender_id: string;
  price_score: number;
  requirement_match_score: number;
  timeline_score: number;
  capacity_score: number;
  experience_score: number;
  feasibility_score: number;
  verification_score: number;
  overall_score: number;
  recommendation: string;
  ai_recommendation?: string;
  reasoning: string;
  ai_powered: boolean;
  created_at: string;
}

// ─── OLD PROPOSAL (kept for backward compat with existing API routes) ─────────

export interface Proposal {
  id: string;
  project_id: string;
  business_organization_id: string;
  bid_amount: number;
  delivery_timeline_days: number;
  capacity?: string;
  experience?: string;
  description: string;
  status: ProposalStatus;
  submitted_at: string;
  updated_at: string;
  // Joined fields
  business_organization?: Organization;
  evaluation?: ProposalEvaluation;
}

export interface ProposalEvaluation {
  id: string;
  proposal_id: string;
  cost_score: number;
  timeline_score: number;
  capacity_score: number;
  experience_score: number;
  feasibility_score: number;
  overall_score: number;
  recommendation: string;
  reasoning: string;
  model_metadata?: Record<string, unknown>;
  created_at: string;
}

// ─── CONTRACT ─────────────────────────────────────────────────────────────────

export interface Contract {
  id: string;
  project_id: string;
  tender_id?: string;
  corporate_organization_id: string;
  business_organization_id: string;
  amount: number;
  scope?: string;
  fulfillment_requirements?: string;
  terms?: string;
  status: ContractStatus;
  created_at: string;
}

// ─── PAYMENT — 20% + 40% + 40% MODEL ─────────────────────────────────────────

export interface Payment {
  id: string;
  project_id: string;
  contract_id: string;
  payment_type: PaymentType;
  amount: number;
  percentage: number;
  milestone_label: string;
  status: PaymentStatus;
  trigger_condition: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

// ─── FULFILLMENT (replaces "Delivery" — supports both products and services) ──

export interface Fulfillment {
  id: string;
  project_id: string;
  business_organization_id: string;
  fulfillment_type: FulfillmentType;
  // Product fields
  quantity_delivered?: number;
  delivery_date?: string;
  // Service fields
  service_description?: string;
  sessions_completed?: number;
  service_date_start?: string;
  service_date_end?: string;
  beneficiaries_served?: number;
  // Common
  quality?: string;
  comments?: string;
  submitted_at: string;
  updated_at: string;
  evidence?: Evidence[];
}

// Backward compat alias
export type Delivery = Fulfillment;

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────

export interface Evidence {
  id: string;
  delivery_id: string;
  evidence_type: EvidenceType;
  storage_path: string;
  file_name: string;
  mime_type?: string;
  uploaded_by: string;
  created_at: string;
}

// ─── NGO CONFIRMATION ─────────────────────────────────────────────────────────

export interface NGOVerification {
  id: string;
  project_id: string;
  delivery_id: string;
  quantity_received: number;
  delivery_date?: string;
  quality_acceptable: boolean;
  packaging_acceptable: boolean;
  delivered_on_time: boolean;
  invoice_reference?: string;
  comments?: string;
  has_issue?: boolean;
  issue_description?: string;
  authorized_representative_confirmed: boolean;
  submitted_by: string;
  submitted_at: string;
}

// ─── AI VERIFICATION ──────────────────────────────────────────────────────────

export interface AIVerification {
  id: string;
  project_id: string;
  ngo_verification_id: string;
  status: AIVerificationStatus;
  confidence: number;
  requested_quantity: number;
  received_quantity: number;
  completion_percentage: number;
  issues: Array<{
    code: string;
    message: string;
    expected?: number;
    actual?: number;
    shortfall?: number;
    shortfallPercentage?: number;
  }>;
  recommendation: string;
  model_metadata?: Record<string, unknown>;
  created_at: string;
}

export interface VerificationReview {
  id: string;
  project_id: string;
  ai_verification_id?: string;
  reviewer_id: string;
  decision: ReviewDecision;
  comments?: string;
  created_at: string;
}

// ─── IMPACT REPORT ────────────────────────────────────────────────────────────

export interface ImpactReport {
  id: string;
  project_id: string;
  ngo_name?: string;
  corporate_name?: string;
  business_name?: string;
  category?: string;
  location?: string;
  contract_value?: number;
  payment_advance?: number;
  payment_milestone?: number;
  payment_final?: number;
  beneficiaries?: number;
  requested_quantity?: number;
  delivered_quantity?: number;
  completion_percentage?: number;
  evidence_count?: number;
  verification_status?: string;
  impact_summary?: string;
  generated_by?: string;
  created_at: string;
}

// ─── NOTIFICATIONS & AUDIT ────────────────────────────────────────────────────

export interface Notification {
  id: string;
  recipient_profile_id: string;
  project_id?: string;
  type: string;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  project_id?: string;
  actor_profile_id?: string;
  actor_role?: UserRole;
  action: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
