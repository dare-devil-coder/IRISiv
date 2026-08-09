# IRISiv — Person 3 Database Implementation Package

This package is the implementation specification for Person 3, the Database/Supabase Engineer.

## Source of truth

The database must support the finalized IRISiv workflow:

NGO Requirement
→ Corporate Approval
→ CSR Opportunity
→ Business Proposals
→ AI Proposal Evaluation
→ Corporate Selection
→ Contract
→ Advance Payment State
→ Business Execution
→ Delivery + Evidence
→ NGO Verification
→ AI Verification
→ Corporate Review
→ Final Payment State
→ Project Completion
→ Impact Report

The hackathon payment flow is simulated; this schema must not imply that IRISiv is holding or moving real CSR funds.

## Required reading order

1. DATABASE-SCHEMA.md
2. RELATIONSHIPS.md
3. STATE-AND-ENUMS.md
4. RLS-SPEC.md
5. STORAGE-SPEC.md
6. SAMPLE-DATA.md
7. SEED-DATA.sql
8. MIGRATION-PLAN.md
9. PERSON-3-HANDOFF.md

## Implementation rule

Do not invent a second workflow. The database is the system of record for the same project lifecycle consumed by Person 2's backend and Person 1's frontend.

If an implementation decision conflicts with the frontend/backend contracts, stop and resolve the contract rather than silently changing the workflow.
