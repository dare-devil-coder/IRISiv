# IRISiv — Person 2 Backend Handoff

## Your Mission

You are responsible for building the backend/application engine of IRISiv.

The frontend developer will build the user interface.
The database developer owns PostgreSQL/Supabase schema, migrations, RLS and storage structure.
The AI/integration developer owns AI implementation and advanced integrations.

Your responsibility is to make the complete IRISiv workflow actually work through secure APIs and backend business logic.

## Primary Outcome

A CSR project must be able to move through the complete lifecycle without requiring the frontend:

Requirement
→ Corporate approval
→ Opportunity publication
→ Proposal
→ AI evaluation
→ Business selection
→ Contract
→ Advance payment state
→ Execution
→ Delivery
→ NGO verification
→ AI verification
→ Corporate review
→ Final payment state
→ Completed
→ Impact report

The backend should be testable through API tools before frontend integration.

## Ownership

### You own

- API architecture
- Controllers/routes
- Request validation
- Backend services
- Business rules
- Project state machine
- Authentication integration
- Authorization enforcement
- Proposal workflow
- Contract workflow
- Payment state workflow
- Delivery workflow
- Verification orchestration
- AI service integration boundary
- Notifications/events
- Audit events
- Impact-report aggregation
- Error handling
- Logging
- Backend tests
- API documentation

### You do NOT own

- Frontend UI
- React/Next UI components
- PostgreSQL schema ownership
- Supabase migrations ownership
- RLS policy ownership
- AI model/prompt ownership
- Real payment processing

## Non-Negotiable Rules

1. Do not redesign the finalized workflow.
2. Do not put business logic in route handlers.
3. Do not trust frontend validation.
4. Do not allow frontend users to bypass authorization.
5. Do not let AI automatically make the final payment decision.
6. Do not implement real money movement for the hackathon.
7. Do not modify the database schema without coordinating with Person 3.
8. Do not invent API response structures without communicating with Person 1.
9. Keep AI behind a stable service interface so Person 4 can change implementation later.
10. Every important state transition must be validated server-side.

## First Milestone

Implement and test this path first:

Create requirement
→ Approve project
→ Publish opportunity
→ Submit proposal
→ Evaluate proposal
→ Select business

Then continue with:

Contract
→ Advance state
→ Start
→ Delivery
→ NGO verification
→ AI verification
→ Corporate review
→ Final payment state
→ Complete
→ Impact report

## Definition of Done

The backend is complete only when the complete lifecycle works through APIs, unauthorized actions are rejected, invalid state transitions are rejected, errors are consistent, audit events exist, and Person 1 can integrate using documented contracts.
