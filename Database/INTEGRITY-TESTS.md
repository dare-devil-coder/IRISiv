# IRISiv — Database Integrity Test Plan

## Foreign keys

- proposal → existing project
- proposal → existing business organization
- evaluation → existing proposal
- contract → existing project
- payment → existing project and contract
- delivery → existing project/business
- evidence → existing delivery
- NGO verification → existing project/delivery
- AI verification → existing NGO verification
- review → existing project
- impact report → existing project

## Uniqueness

- profile.auth_user_id
- project.project_code
- organization_members.organization_id + profile_id
- one active contract per project
- one impact report per project
- one selected proposal per project
- one advance payment record per project in the hackathon model
- one final payment record per project in the hackathon model

## Numeric checks

Reject negative:
- budgets
- contract amounts
- bid amounts
- payment amounts
- quantities

Reject invalid:
- completion_percentage outside 0–100
- confidence outside 0–1
- evaluation scores outside the agreed score range

## Authorization tests

Verify that:
- Business A cannot read Business B private evidence.
- Business cannot write NGO verification.
- NGO cannot select a business.
- Business cannot approve corporate payment.
- Ordinary users cannot edit/delete audit logs.
- Users cannot access unrelated private projects.

## Workflow integrity

The backend must not be able to create contradictory records such as:
- COMPLETED project with no selected business where selection is required
- payment for nonexistent contract
- evidence for nonexistent delivery
- AI verification for nonexistent NGO verification
