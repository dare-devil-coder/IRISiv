# IRISiv — Person 3 Handoff

## Role

You are the Database Engineer for IRISiv.

Your responsibility is to implement the PostgreSQL/Supabase data layer that supports the existing frontend and backend workflow.

## You own

- PostgreSQL schema
- Supabase migrations
- tables and relationships
- constraints
- indexes
- enums
- RLS policies
- storage policies
- seed/demo data
- audit-log persistence
- database documentation
- database integrity tests

## You do not own

- frontend UI
- backend controllers/services
- AI model implementation
- product workflow redesign

## Architecture

Frontend → Backend/API → PostgreSQL/Supabase

The frontend must not bypass the backend for business operations.

## Core rule

The database must represent ONE shared CSR project across NGO, Corporate and Business roles.

Do not create separate project records for each dashboard.

## Required implementation order

1. Auth/profile/organization foundation
2. CSR project core
3. proposals and AI evaluations
4. contracts and simulated payments
5. deliveries and evidence
6. NGO/AI verification and corporate review
7. impact reports, notifications and audit logs
8. RLS and storage hardening
9. realistic demo seed data
10. integrity/security tests

## Definition of done

A fresh database can represent the complete lifecycle from requirement creation through impact reporting, with foreign-key integrity, controlled statuses, RLS, secure storage and realistic demo data.
