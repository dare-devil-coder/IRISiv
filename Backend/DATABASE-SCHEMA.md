# IRISiv — Database Schema Contract

## Ownership

Person 3 is the database owner.

Person 2 must coordinate all schema changes with Person 3.

This document is the logical data contract required by the backend. Person 3 should translate it into the final PostgreSQL/Supabase schema, constraints, indexes and RLS.

## Core Entities

### profiles

- id
- auth_user_id
- name
- email
- role
- created_at
- updated_at

Roles:
- NGO
- CORPORATE
- BUSINESS
- ADMIN

### organizations

- id
- name
- organization_type
- created_at
- updated_at

organization_type:
- NGO
- CORPORATE
- BUSINESS

### organization_members

- id
- organization_id
- profile_id
- member_role
- created_at

### csr_projects

- id
- project_code
- title
- category
- location
- description
- beneficiaries
- estimated_budget
- contract_value
- deadline
- status
- ngo_organization_id
- corporate_organization_id
- selected_business_organization_id
- created_at
- updated_at
- completed_at

### proposals

- id
- project_id
- business_organization_id
- bid_amount
- delivery_timeline_days
- capacity
- experience
- description
- status
- submitted_at
- updated_at

### proposal_evaluations

- id
- proposal_id
- cost_score
- timeline_score
- capacity_score
- experience_score
- feasibility_score
- overall_score
- recommendation
- reasoning
- model_metadata
- created_at

### contracts

- id
- project_id
- corporate_organization_id
- business_organization_id
- amount
- terms
- status
- created_at

### payments

- id
- project_id
- contract_id
- payment_type
- amount
- status
- approved_by
- approved_at
- created_at

payment_type:
- ADVANCE
- FINAL

### deliveries

- id
- project_id
- business_organization_id
- quantity_delivered
- delivery_date
- quality
- comments
- submitted_at
- updated_at

### evidence

- id
- delivery_id
- evidence_type
- storage_path/reference
- file_name
- mime_type
- uploaded_by
- created_at

### ngo_verifications

- id
- project_id
- delivery_id
- quantity_received
- delivery_date
- quality_acceptable
- packaging_acceptable
- delivered_on_time
- invoice_reference
- comments
- authorized_representative_confirmed
- submitted_by
- submitted_at

### ai_verifications

- id
- project_id
- ngo_verification_id
- status
- confidence
- requested_quantity
- received_quantity
- completion_percentage
- issues
- recommendation
- model_metadata
- created_at

### verification_reviews

- id
- project_id
- ai_verification_id
- reviewer_id
- decision
- comments
- created_at

### impact_reports

- id
- project_id
- contract_value
- beneficiaries
- requested_quantity
- delivered_quantity
- completion_percentage
- verification_status
- impact_summary
- generated_by
- created_at

### notifications

- id
- recipient_profile_id
- project_id
- type
- title
- message
- read_at
- created_at

### audit_logs

- id
- project_id
- actor_profile_id
- actor_role
- action
- metadata
- created_at

## Relationships

```text
organization
 ├── members
 └── projects

project
 ├── proposals
 │    └── proposal_evaluation
 ├── contract
 ├── payments
 ├── delivery
 │    └── evidence
 ├── ngo_verification
 │    └── ai_verification
 ├── verification_review
 ├── impact_report
 ├── notifications
 └── audit_logs
```

## Important Constraints

- A project must have one controlling NGO.
- A project may have one corporate owner/funder at the relevant stage.
- A project may have at most one selected business.
- A proposal belongs to exactly one project and one business.
- A selected proposal must belong to the project.
- Payment records must reference a project/contract.
- Delivery belongs to the selected business.
- Verification belongs to the project/delivery.
- Audit records should be append-only.
