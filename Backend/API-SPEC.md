# IRISiv — API Specification

## API Conventions

Base path:

`/api`

Content type:

`application/json`

Authenticated endpoints require the configured auth mechanism.

Standard success envelope:

```json
{
  "success": true,
  "data": {}
}
```

Standard error envelope:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## Authentication

### POST `/api/auth/signup`

Creates an account.

Roles:
- NGO
- CORPORATE
- BUSINESS

Request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password",
  "role": "NGO",
  "organizationName": "Example Foundation"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": {},
    "session": {}
  }
}
```

### POST `/api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "user": {},
    "session": {}
  }
}
```

### POST `/api/auth/logout`

Response `204` or standard success response.

### GET `/api/auth/me`

Returns authenticated user and role.

---

# Requirements

### POST `/api/requirements`

Role: NGO

Request:

```json
{
  "title": "School Kit Distribution",
  "category": "EDUCATION",
  "location": "Rajkot",
  "beneficiaries": 500,
  "description": "Provide school kits",
  "estimatedBudget": 50000,
  "deadline": "2026-08-30"
}
```

Response `201`:
Created requirement.

### GET `/api/requirements`

Role: NGO/Admin

Returns authorized requirements.

### GET `/api/requirements/:id`

Returns one requirement if authorized.

### PATCH `/api/requirements/:id`

Role: NGO owner

Allowed while draft.

### POST `/api/requirements/:id/submit`

Role: NGO owner

Precondition:
Requirement is `DRAFT`.

Result:
Requirement becomes `SUBMITTED`.

---

# Projects

### GET `/api/projects`

Returns projects authorized for the current user.

Support filters:
- status
- role-relevant ownership
- category
- pagination

### GET `/api/projects/:id`

Returns project aggregate including relevant:
- requirement
- NGO
- corporate
- business
- status
- milestones
- payment summary
- delivery summary
- verification summary

### POST `/api/projects/:id/approve`

Role: CORPORATE

Precondition:
Project is submitted/awaiting approval.

Result:
`CSR_APPROVED`.

### POST `/api/projects/:id/publish`

Role: CORPORATE or authorized platform workflow

Precondition:
Project is approved.

Result:
`PUBLISHED` / `PROPOSALS_OPEN`.

### POST `/api/projects/:id/start`

Role: selected BUSINESS

Precondition:
Business selected, contract exists, advance state satisfied.

Result:
`IN_PROGRESS`.

---

# Opportunities

### GET `/api/opportunities`

Role: BUSINESS

Returns published opportunities visible to the business.

### GET `/api/opportunities/:id`

Role: BUSINESS

Returns public/opportunity-level project information.

---

# Proposals

### POST `/api/projects/:id/proposals`

Role: BUSINESS

Request:

```json
{
  "bidAmount": 50000,
  "deliveryTimelineDays": 7,
  "capacity": 800,
  "experience": "Relevant project experience",
  "description": "Proposal details"
}
```

Precondition:
Project is open for proposals.

Response `201`:
Created proposal.

### GET `/api/projects/:id/proposals`

Role: CORPORATE/Admin

Returns proposals for the project.

### GET `/api/proposals/:id`

Returns an authorized proposal.

### POST `/api/proposals/:id/evaluate`

Internal/platform/AI integration action.

Calls Person 4's AI service and stores the evaluation.

### GET `/api/proposals/:id/evaluation`

Returns stored AI evaluation.

### POST `/api/proposals/:id/select`

Role: CORPORATE

Preconditions:
- Corporate controls project.
- Proposal belongs to project.
- Project is open for selection.

Result:
Selected business is assigned to project and project becomes `BUSINESS_SELECTED`.

Other proposals become closed/rejected according to agreed workflow.

---

# Contracts

### POST `/api/projects/:id/contract`

Role: CORPORATE

Creates a simulated contract record.

Request:

```json
{
  "amount": 50000,
  "terms": "Demo contract terms"
}
```

Result:
Project becomes `CONTRACTED`.

### GET `/api/projects/:id/contract`

Returns contract details.

---

# Payments

Hackathon payment is state simulation, not actual money movement.

### GET `/api/projects/:id/payments`

Returns payment records.

### POST `/api/projects/:id/payment/advance`

Role: CORPORATE

Precondition:
Contract exists.

Creates advance payment state.

Result:
Project becomes `ADVANCE_PAID`.

### POST `/api/projects/:id/payment/final`

Role: CORPORATE

Preconditions:
- Required verification completed
- Corporate review approved
- No unresolved mandatory issue

Creates final payment state.

Result:
Project becomes `COMPLETED`.

---

# Delivery

### POST `/api/projects/:id/delivery`

Role: BUSINESS

Request:

```json
{
  "quantityDelivered": 500,
  "deliveryDate": "2026-08-08",
  "quality": "GOOD",
  "comments": "Delivered successfully"
}
```

Result:
Project becomes `DELIVERY_SUBMITTED`.

### GET `/api/projects/:id/delivery`

Returns delivery.

### PATCH `/api/deliveries/:id`

Role: authorized business while editable.

---

# Evidence

### POST `/api/deliveries/:id/evidence`

Accepts evidence metadata/file reference according to storage contract.

Evidence types:
- INVOICE
- DELIVERY_RECEIPT
- PHOTO
- QUANTITY_CONFIRMATION
- AUTHORIZED_CONFIRMATION
- OTHER

### GET `/api/deliveries/:id/evidence`

Returns authorized evidence metadata.

### DELETE `/api/evidence/:id`

Only allow deletion while the evidence is still editable and by an authorized actor.

---

# NGO Verification

### POST `/api/projects/:id/verification`

Role: NGO

Request:

```json
{
  "quantityReceived": 500,
  "deliveryDate": "2026-08-08",
  "qualityAcceptable": true,
  "packagingAcceptable": true,
  "deliveredOnTime": true,
  "invoiceReference": "INV-1024",
  "comments": "Verified",
  "authorizedRepresentativeConfirmed": true
}
```

Result:
NGO verification stored.

Then trigger AI verification.

### GET `/api/projects/:id/verification`

Returns NGO verification and AI verification if available.

---

# AI Verification

### POST `/api/projects/:id/verification/analyze`

Internal service endpoint or internal-only route.

Input is assembled server-side from:
- requirement
- delivery
- NGO verification
- evidence references/metadata

Output is stored.

Example:

```json
{
  "status": "LIKELY_FULFILLED",
  "confidence": 0.96,
  "requestedQuantity": 500,
  "receivedQuantity": 500,
  "completionPercentage": 100,
  "issues": [],
  "recommendation": "REVIEW_FOR_FINAL_PAYMENT"
}
```

If mismatch:

```json
{
  "status": "ISSUE_DETECTED",
  "confidence": 0.96,
  "requestedQuantity": 1000,
  "receivedQuantity": 950,
  "completionPercentage": 95,
  "issues": [
    {
      "code": "QUANTITY_MISMATCH",
      "shortfall": 50,
      "shortfallPercentage": 5
    }
  ],
  "recommendation": "MANUAL_REVIEW_REQUIRED"
}
```

AI result is advisory.

---

# Corporate Verification Review

### POST `/api/projects/:id/verification/review`

Role: CORPORATE

Request:

```json
{
  "decision": "APPROVE",
  "comments": "Reviewed NGO confirmation and AI result."
}
```

Allowed decisions:
- APPROVE
- REQUEST_REVIEW
- REJECT

The exact allowed transitions must be enforced by project state.

---

# Impact

### GET `/api/projects/:id/impact`

Returns calculated impact metrics.

### POST `/api/projects/:id/impact-report`

Generates/stores impact report data through Person 4's integration.

---

# Notifications

### GET `/api/notifications`

Returns current user's notifications.

### PATCH `/api/notifications/:id/read`

Marks notification as read.

---

# Audit

### GET `/api/projects/:id/audit`

Authorized users can see appropriate project audit history.

Regular users must not be able to modify audit events.

---

# Health

### GET `/api/health`

Returns service health.

Example:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## API Status Code Rules

- `200` successful read/action
- `201` resource created
- `204` successful no-content action
- `400` malformed request
- `401` unauthenticated
- `403` authenticated but forbidden
- `404` resource not found
- `409` state conflict/duplicate operation
- `422` validation error
- `500` unexpected server error
