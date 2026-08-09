# IRISiv — Backend Business Logic

## 1. Requirement

NGO creates requirement.

Allowed:
`DRAFT → SUBMITTED`

Only NGO owner can edit a draft.

## 2. Approval

Corporate can approve a submitted project.

`SUBMITTED → CSR_APPROVED`

Only authorized corporate can approve.

## 3. Publishing

Approved project can become publicly available.

`CSR_APPROVED → PUBLISHED → PROPOSALS_OPEN`

## 4. Proposal

Business can submit only while proposals are open.

Rules:
- Must be authenticated.
- Must belong to a business organization.
- Must not submit duplicate proposal if duplicates are prohibited.
- Must provide required fields.
- Cannot submit after proposal window closes.

## 5. AI Proposal Evaluation

Evaluation happens after proposal submission or in an explicitly controlled asynchronous workflow.

AI output is stored.

AI recommendation does not automatically select a business.

## 6. Selection

Corporate makes final business selection.

`PROPOSALS_OPEN → BUSINESS_SELECTED`

Only one business can be selected.

## 7. Contract

Selected business + corporate create simulated contract.

`BUSINESS_SELECTED → CONTRACTED`

## 8. Advance Payment

Contract must exist.

`CONTRACTED → ADVANCE_PAID`

This is a simulated payment state for the hackathon.

## 9. Execution

Only selected business can start.

`ADVANCE_PAID → IN_PROGRESS`

## 10. Delivery

Only selected business can submit delivery.

`IN_PROGRESS → DELIVERY_SUBMITTED`

Delivery must contain required quantity/date information.

## 11. NGO Verification

Associated NGO verifies the delivery.

Verification captures quantity, date, quality, packaging, timeliness, comments, reference and authorized confirmation.

## 12. AI Verification

Backend assembles relevant project data and sends it to Person 4's AI service.

Possible outcomes:
- likely fulfilled
- issue detected
- manual review required

AI is advisory.

## 13. Corporate Review

Corporate reviews NGO confirmation, evidence and AI result.

Corporate can approve or request review according to state.

## 14. Final Payment

Only after required review/verification conditions are satisfied.

`FINAL_PAYMENT_PENDING → COMPLETED`

Payment is simulated for hackathon.

## 15. Completion

When completed:
- project status becomes completed
- final payment state recorded
- impact metrics become available
- notification emitted
- audit event recorded

## 16. Impact Report

Impact report should be based on stored project data, not invented values.

## 17. Invalid Operations

Reject:
- unauthorized actions
- invalid state transitions
- duplicate selection
- duplicate final payment
- business modifying NGO verification
- NGO selecting business
- corporate submitting business proposal
- arbitrary status updates from clients
- deleting immutable audit records
