# IRISiv — Database Schema

Database: PostgreSQL / Supabase

## 1. profiles

Application profile linked to the authenticated user.

- id: uuid, PK
- auth_user_id: uuid, unique, required
- name: text, required
- email: text, required
- role: user_role enum, required
- created_at: timestamptz, required, default now()
- updated_at: timestamptz, required, default now()

Do not store passwords here.

## 2. organizations

Represents an NGO, Corporate or Business organization.

- id: uuid, PK
- name: text, required
- organization_type: organization_type enum, required
- created_at: timestamptz, required, default now()
- updated_at: timestamptz, required, default now()

## 3. organization_members

Many-to-many relationship between profiles and organizations.

- id: uuid, PK
- organization_id: uuid, FK → organizations.id, required
- profile_id: uuid, FK → profiles.id, required
- member_role: text, required
- created_at: timestamptz, required, default now()

Unique: organization_id + profile_id.

## 4. csr_projects

Central project entity shared across all roles.

- id: uuid, PK
- project_code: text, unique, required
- title: text, required
- category: text, required
- location: text
- description: text, required
- beneficiaries: integer, required, CHECK >= 0
- estimated_budget: numeric(14,2), required, CHECK >= 0
- contract_value: numeric(14,2), CHECK >= 0
- deadline: date
- status: project_status enum, required
- ngo_organization_id: uuid, FK → organizations.id, required
- corporate_organization_id: uuid, FK → organizations.id
- selected_business_organization_id: uuid, FK → organizations.id
- created_at: timestamptz, required, default now()
- updated_at: timestamptz, required, default now()
- completed_at: timestamptz

## 5. proposals

Business proposals for a project.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- business_organization_id: uuid, FK → organizations.id, required
- bid_amount: numeric(14,2), required, CHECK >= 0
- delivery_timeline_days: integer, required, CHECK > 0
- capacity: text
- experience: text
- description: text, required
- status: proposal_status enum, required
- submitted_at: timestamptz, required, default now()
- updated_at: timestamptz, required, default now()

## 6. proposal_evaluations

AI evaluation is stored separately from the original proposal.

- id: uuid, PK
- proposal_id: uuid, FK → proposals.id, required
- cost_score: numeric(5,2)
- timeline_score: numeric(5,2)
- capacity_score: numeric(5,2)
- experience_score: numeric(5,2)
- feasibility_score: numeric(5,2)
- overall_score: numeric(5,2)
- recommendation: text
- reasoning: text
- model_metadata: jsonb
- created_at: timestamptz, required, default now()

Scores should be constrained to the agreed range in the implementation.

## 7. contracts

Simulated contract record for the hackathon workflow.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, unique, required
- corporate_organization_id: uuid, FK → organizations.id, required
- business_organization_id: uuid, FK → organizations.id, required
- amount: numeric(14,2), required, CHECK >= 0
- terms: text
- status: contract_status enum, required
- created_at: timestamptz, required

## 8. payments

Simulated payment state records.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- contract_id: uuid, FK → contracts.id, required
- payment_type: payment_type enum, required
- amount: numeric(14,2), required, CHECK >= 0
- status: payment_status enum, required
- approved_by: uuid, FK → profiles.id
- approved_at: timestamptz
- created_at: timestamptz, required, default now()

Use uniqueness rules to prevent duplicate advance/final records for the same project unless a later versioning requirement explicitly changes this.

## 9. deliveries

Business delivery submission.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- business_organization_id: uuid, FK → organizations.id, required
- quantity_delivered: integer, required, CHECK >= 0
- delivery_date: date, required
- quality: text
- comments: text
- submitted_at: timestamptz, required, default now()
- updated_at: timestamptz, required, default now()

## 10. evidence

Files and supporting evidence linked to a delivery.

- id: uuid, PK
- delivery_id: uuid, FK → deliveries.id, required
- evidence_type: evidence_type enum, required
- storage_path: text, required
- file_name: text, required
- mime_type: text
- uploaded_by: uuid, FK → profiles.id, required
- created_at: timestamptz, required, default now()

## 11. ngo_verifications

Human verification submitted by the NGO.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- delivery_id: uuid, FK → deliveries.id, required
- quantity_received: integer, required, CHECK >= 0
- delivery_date: date
- quality_acceptable: boolean, required
- packaging_acceptable: boolean, required
- delivered_on_time: boolean, required
- invoice_reference: text
- comments: text
- authorized_representative_confirmed: boolean, required
- submitted_by: uuid, FK → profiles.id, required
- submitted_at: timestamptz, required, default now()

## 12. ai_verifications

AI analysis of the verification evidence/submission.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- ngo_verification_id: uuid, FK → ngo_verifications.id, required
- status: ai_verification_status enum, required
- confidence: numeric(5,4)
- requested_quantity: integer
- received_quantity: integer
- completion_percentage: numeric(6,2)
- issues: jsonb
- recommendation: text
- model_metadata: jsonb
- created_at: timestamptz, required, default now()

AI results are advisory data, not automatic payment authority.

## 13. verification_reviews

Corporate/human review of verification.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, required
- ai_verification_id: uuid, FK → ai_verifications.id
- reviewer_id: uuid, FK → profiles.id, required
- decision: review_decision enum, required
- comments: text
- created_at: timestamptz, required, default now()

## 14. impact_reports

Impact summary for a project.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id, unique, required
- contract_value: numeric(14,2)
- beneficiaries: integer
- requested_quantity: integer
- delivered_quantity: integer
- completion_percentage: numeric(6,2)
- verification_status: text
- impact_summary: text
- generated_by: uuid, FK → profiles.id
- created_at: timestamptz, required, default now()

## 15. notifications

User notifications.

- id: uuid, PK
- recipient_profile_id: uuid, FK → profiles.id, required
- project_id: uuid, FK → csr_projects.id
- type: notification_type enum, required
- title: text, required
- message: text, required
- read_at: timestamptz
- created_at: timestamptz, required, default now()

## 16. audit_logs

Append-only audit history.

- id: uuid, PK
- project_id: uuid, FK → csr_projects.id
- actor_profile_id: uuid, FK → profiles.id
- actor_role: user_role
- action: audit_action enum, required
- metadata: jsonb
- created_at: timestamptz, required, default now()

Ordinary users must not update or delete audit logs.
