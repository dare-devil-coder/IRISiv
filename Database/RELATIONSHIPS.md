# IRISiv — Relationships

## Identity

One authenticated user has one application profile.

Profile ↔ Organization is many-to-many through organization_members.

## Project

One NGO organization can own many CSR projects.

One Corporate organization can control many CSR projects.

A project can have zero or one selected Business organization.

## Proposals

One project has many proposals.

One Business organization can submit many proposals across projects.

One proposal has zero or more AI evaluation records; the implementation should normally expose the latest/current evaluation to the application.

Only one proposal may be selected for a project.

## Contract

A project has zero or one active contract in the current hackathon model.

A contract belongs to one project, one corporate organization and one selected business organization.

## Payments

A project can have payment records.

Each payment references the project and contract.

Payment type distinguishes ADVANCE and FINAL.

## Delivery

A project can have delivery submissions.

Each delivery belongs to the selected business organization for that project.

## Evidence

A delivery can have many evidence records.

Evidence references a storage object; the binary file itself is not stored in PostgreSQL.

## Verification

A delivery can have NGO verification.

An AI verification references the NGO verification it analyzed.

A corporate review references the relevant AI verification.

## Impact

A project has zero or one current impact report in the hackathon model.

## Notifications

A profile can receive many notifications.

A notification may optionally reference a project.

## Audit

A project can have many audit events.

An audit event identifies the actor and action.

## Critical integrity rule

The same project record must be shared across NGO, Corporate and Business views. Do not create duplicate project rows for each role.
