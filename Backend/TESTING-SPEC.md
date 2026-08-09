# IRISiv — Backend Testing Specification

## 1. Unit Tests

Test:
- state transition rules
- validation
- authorization helpers
- payment calculations
- proposal scoring data mapping
- verification result mapping

## 2. API Tests

Test each important endpoint.

## 3. End-to-End Workflow Test

The most important test:

```text
Create NGO
→ Create requirement
→ Submit requirement
→ Corporate approves
→ Publish opportunity
→ Business submits proposal
→ AI evaluation stored
→ Corporate selects business
→ Contract created
→ Advance recorded
→ Business starts
→ Delivery submitted
→ Evidence registered
→ NGO verification
→ AI verification
→ Corporate review
→ Final payment
→ Project completed
→ Impact report
```

## 4. Negative Tests

Must reject:
- wrong role
- wrong organization
- wrong project
- invalid state
- duplicate proposal
- duplicate selection
- duplicate payment
- missing verification
- unresolved verification issue
- business attempting corporate action
- NGO attempting corporate action

## 5. Integration Failure Tests

Simulate:
- AI timeout
- AI invalid response
- storage failure
- database failure
- notification failure

Critical workflow data must not become inconsistent when a non-critical integration fails.

## 6. Acceptance Test

The backend must be runnable without the frontend.

Use:
- Postman
- Thunder Client
- automated API tests
- or equivalent

The full lifecycle should be demonstrable through API calls.
