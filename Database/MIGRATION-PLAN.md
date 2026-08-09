# IRISiv — Migration Plan

Implement migrations in dependency order.

## 001 — Extensions and common functions

- uuid generation if required
- updated_at helper if used

## 002 — Enums

Create:
- user_role
- organization_type
- project_status
- proposal_status
- contract_status
- payment_type
- payment_status
- evidence_type
- ai_verification_status
- review_decision
- notification_type
- audit_action

## 003 — Identity

Create:
- profiles
- organizations
- organization_members

## 004 — Project core

Create:
- csr_projects

Add indexes and organization foreign keys.

## 005 — Marketplace

Create:
- proposals
- proposal_evaluations

Add uniqueness/indexing required for one selected proposal per project.

## 006 — Contract and payment

Create:
- contracts
- payments

## 007 — Execution

Create:
- deliveries
- evidence

## 008 — Verification

Create:
- ngo_verifications
- ai_verifications
- verification_reviews

## 009 — Reporting and communication

Create:
- impact_reports
- notifications
- audit_logs

## 010 — Indexes

Add query-driven indexes after reviewing actual backend queries.

## 011 — RLS

Enable RLS and create policies.

## 012 — Storage

Create private evidence bucket and storage policies.

## 013 — Seed

Insert deterministic demo organizations/users/projects/proposals/results.

## Migration rules

- Never edit an already-applied migration in a shared environment.
- Add a new migration for schema changes.
- Keep migrations deterministic and reviewable.
- Do not put secrets in migrations.
