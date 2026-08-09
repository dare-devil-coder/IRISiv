-- IRISiv Production Database Schema (Full Specification)

-- Clean up existing tables safely in reverse dependency order
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS impact_reports CASCADE;
DROP TABLE IF EXISTS verification_reviews CASCADE;
DROP TABLE IF EXISTS ai_verifications CASCADE;
DROP TABLE IF EXISTS ngo_verifications CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS proposal_evaluations CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS csr_projects CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. Profiles Table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('NGO', 'CORPORATE', 'BUSINESS', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Organizations Table
CREATE TABLE organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('NGO', 'CORPORATE', 'BUSINESS')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Organization Members Table
CREATE TABLE organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, profile_id)
);

-- 4. CSR Projects Table
CREATE TABLE csr_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    location TEXT,
    description TEXT,
    beneficiaries INTEGER NOT NULL,
    estimated_budget INTEGER NOT NULL,
    contract_value INTEGER,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'SUBMITTED', 'CSR_APPROVED', 'PUBLISHED', 
        'PROPOSALS_OPEN', 'BUSINESS_SELECTED', 'CONTRACTED', 
        'ADVANCE_PAID', 'IN_PROGRESS', 'DELIVERY_SUBMITTED', 
        'NGO_VERIFIED', 'AI_VERIFIED', 'FINAL_PAYMENT_PENDING', 
        'COMPLETED', 'MANUAL_REVIEW'
    )),
    ngo_organization_id UUID REFERENCES organizations(id) ON DELETE RESTRICT,
    corporate_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    selected_business_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Proposals Table
CREATE TABLE proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    business_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    bid_amount INTEGER NOT NULL,
    delivery_timeline_days INTEGER NOT NULL,
    capacity INTEGER,
    experience TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'AI_EVALUATED', 'SELECTED', 'REJECTED', 'CLOSED'
    )),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI Proposal Evaluations Table
CREATE TABLE proposal_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    cost_score INTEGER CHECK (cost_score >= 0 AND cost_score <= 100),
    timeline_score INTEGER CHECK (timeline_score >= 0 AND timeline_score <= 100),
    capacity_score INTEGER CHECK (capacity_score >= 0 AND capacity_score <= 100),
    experience_score INTEGER CHECK (experience_score >= 0 AND experience_score <= 100),
    feasibility_score INTEGER CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    recommendation TEXT,
    reasoning TEXT,
    model_metadata JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Contracts Table
CREATE TABLE contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    corporate_organization_id UUID REFERENCES organizations(id) ON DELETE RESTRICT,
    business_organization_id UUID REFERENCES organizations(id) ON DELETE RESTRICT,
    amount INTEGER NOT NULL,
    terms TEXT,
    status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'SIGNED', 'TERMINATED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('ADVANCE', 'FINAL')),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'RECORDED', 'FAILED')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Deliveries Table
CREATE TABLE deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    business_organization_id UUID REFERENCES organizations(id) ON DELETE RESTRICT,
    quantity_delivered INTEGER NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    quality TEXT,
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Evidence Table
CREATE TABLE evidence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL CHECK (evidence_type IN (
        'INVOICE', 'DELIVERY_RECEIPT', 'PHOTO', 'QUANTITY_CONFIRMATION', 'AUTHORIZED_CONFIRMATION', 'OTHER'
    )),
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. NGO Verifications Table
CREATE TABLE ngo_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    quantity_received INTEGER NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE,
    quality_acceptable BOOLEAN DEFAULT true,
    packaging_acceptable BOOLEAN DEFAULT true,
    delivered_on_time BOOLEAN DEFAULT true,
    invoice_reference TEXT,
    comments TEXT,
    authorized_representative_confirmed BOOLEAN DEFAULT false,
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AI Verifications Table
CREATE TABLE ai_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    ngo_verification_id UUID REFERENCES ngo_verifications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
    requested_quantity INTEGER NOT NULL,
    received_quantity INTEGER NOT NULL,
    completion_percentage NUMERIC CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    issues JSONB,
    recommendation TEXT,
    model_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Verification Reviews Table
CREATE TABLE verification_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    ai_verification_id UUID REFERENCES ai_verifications(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    decision TEXT NOT NULL CHECK (decision IN ('APPROVE', 'REQUEST_REVIEW', 'REJECT')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Impact Reports Table
CREATE TABLE impact_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    contract_value INTEGER,
    beneficiaries INTEGER,
    requested_quantity INTEGER,
    delivered_quantity INTEGER,
    completion_percentage NUMERIC CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    verification_status TEXT,
    impact_summary TEXT,
    generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Notifications Table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES csr_projects(id) ON DELETE CASCADE,
    actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_role TEXT,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE csr_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view open opportunities" ON csr_projects;
CREATE POLICY "Public can view open opportunities" 
ON csr_projects FOR SELECT 
USING (status IN ('PROPOSALS_OPEN', 'PUBLISHED'));

DROP POLICY IF EXISTS "Audit logs can be created" ON audit_logs;
CREATE POLICY "Audit logs can be created" 
ON audit_logs FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs cannot be deleted" ON audit_logs;
CREATE POLICY "Audit logs cannot be deleted" 
ON audit_logs FOR DELETE 
USING (false);

DROP POLICY IF EXISTS "Audit logs cannot be updated" ON audit_logs;
CREATE POLICY "Audit logs cannot be updated" 
ON audit_logs FOR UPDATE 
USING (false);
