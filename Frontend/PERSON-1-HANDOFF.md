# IRISiv — Person 1 Frontend Handoff

## Your Mission

You own the complete frontend of IRISiv.

You are responsible for turning the finalized IRISiv product workflow into a polished, responsive, interactive web application.

## What You Own

### Frontend
- Authentication UI
- NGO dashboard
- Corporate dashboard
- Business dashboard
- Project pages
- Requirements
- Opportunities
- Proposals
- AI evaluation UI
- Delivery
- Evidence
- Verification
- Payment states
- Analytics
- Impact reports
- Notifications
- Shared components
- Responsive design
- UX states

## What You Do NOT Own

- PostgreSQL schema
- Supabase migrations
- RLS implementation
- Backend business rules
- AI model implementation
- Real payment processing

## Your Dependencies

### From Person 2 — Backend
You need:
- API endpoints
- Request/response contracts
- Authentication behavior
- Project status values
- Error formats

### From Person 3 — Database
You need:
- Data model decisions
- Storage/file rules
- Available data fields
- RLS/auth behavior relevant to frontend

### From Person 4 — AI/Integration
You need:
- AI result shapes
- Proposal score structure
- Verification result structure
- Impact report structure
- AI assistant response structure

## Your First Deliverables

### Phase 1
- Application shell
- Authentication UI
- Role-based navigation
- Shared UI system
- Sidebar/topbar
- Project timeline

### Phase 2
- NGO dashboard
- Corporate dashboard
- Business dashboard
- Requirement forms
- Opportunity pages
- Proposal pages

### Phase 3
- Proposal comparison
- AI recommendation UI
- Active project UI
- Delivery form
- Evidence uploader
- NGO verification UI

### Phase 4
- AI verification result
- Failure/mismatch state
- Payment timeline
- Impact report
- Analytics
- Notifications

### Phase 5
- API integration
- Loading/error/empty states
- Responsive polish
- Accessibility
- Final demo flow

## Final Acceptance Test

The frontend must support this complete visual journey:

NGO login
→ Create requirement
→ Corporate login
→ Approve project
→ Business login
→ View opportunity
→ Submit proposal
→ Corporate login
→ Compare proposals
→ View AI recommendation
→ Select business
→ Business login
→ Start project
→ Submit delivery/evidence
→ NGO login
→ Verify delivery
→ View AI verification
→ Corporate login
→ Review verification
→ Approve final payment
→ View impact report

## Critical Rule

The frontend must make the project lifecycle obvious.

Every important project screen must show:
- Current status
- Previous completed steps
- Current action
- Next expected step

## Collaboration Rule

Do not directly change backend/database architecture to make a frontend feature work.

If data/API is missing:
1. Tell the backend developer exactly what is required.
2. Agree on the API contract.
3. Use temporary mock data only if necessary.
4. Replace mock data with the real API before final integration.

## Definition of Done

The frontend is done only when:
- All three role dashboards work
- Major user flows are connected
- Project lifecycle is visible
- AI states are represented
- Verification success/failure states work
- Payment states work
- Impact report works
- Loading/error/empty states work
- Responsive behavior works
- TypeScript/build/lint pass
- No major console errors
- The complete judge demo can be performed without manually editing data
