# IRISiv — Third-Party Integrations

## 1. Supabase

Purpose:
- Authentication
- PostgreSQL
- Storage

Owner:
Person 3 for database/storage architecture.

Backend responsibility:
- Use approved database/storage interfaces.
- Enforce application authorization.
- Do not expose service secrets.

## 2. AI Service

Owner:
Person 4.

Backend responsibility:
- Provide stable adapter.
- Send only required data.
- Validate AI response.
- Store result.
- Handle timeout/failure.
- Do not allow AI to bypass corporate approval.

Suggested adapter:

```text
AIService.evaluateProposal(project, proposal)
AIService.verifyDelivery(project, delivery, verification, evidence)
AIService.generateImpactReport(project)
```

## 3. Payments

Hackathon:
No real payment gateway.

Use simulated payment records/states.

Real-world payment integration is a later concern requiring legal/financial review.

## 4. Notifications

For hackathon, notifications may be database-backed.

Later they can be connected to:
- Email
- Push
- WhatsApp/SMS
- Other approved channels

## 5. Storage

Use Supabase Storage or the team's approved storage provider for evidence.

Store file metadata/reference in the database.

## 6. Integration Rules

External services must be isolated behind adapters.

Do not call external services directly from every controller.
