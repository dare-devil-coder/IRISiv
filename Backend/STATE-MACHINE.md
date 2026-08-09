# IRISiv — Project State Machine

## Primary State Graph

```text
DRAFT
  ↓
SUBMITTED
  ↓
CSR_APPROVED
  ↓
PUBLISHED
  ↓
PROPOSALS_OPEN
  ↓
BUSINESS_SELECTED
  ↓
CONTRACTED
  ↓
ADVANCE_PAID
  ↓
IN_PROGRESS
  ↓
DELIVERY_SUBMITTED
  ↓
NGO_VERIFIED
  ↓
AI_VERIFIED
  ↓
FINAL_PAYMENT_PENDING
  ↓
COMPLETED
```

## Exception Path

```text
DELIVERY_SUBMITTED
      ↓
NGO_VERIFIED
      ↓
AI_VERIFICATION
      ↓
ISSUE_DETECTED
      ↓
MANUAL_REVIEW
      ↓
RESOLVED
      ↓
AI_VERIFIED
```

## Rules

Do not expose a generic endpoint such as:

`PATCH /projects/:id { status: "COMPLETED" }`

for normal users.

Status changes must happen through explicit domain actions.

Examples:

```text
POST /projects/:id/approve
POST /projects/:id/publish
POST /proposals/:id/select
POST /projects/:id/contract
POST /projects/:id/payment/advance
POST /projects/:id/start
POST /projects/:id/delivery
POST /projects/:id/verification
POST /projects/:id/verification/review
POST /projects/:id/payment/final
```

This makes the workflow auditable and prevents clients from bypassing business rules.
