# IRISiv — Sample Data Shape

These examples are illustrative demo values. Do not hard-code these records into application logic.

## Profile

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Demo NGO User",
  "email": "ngo@example.test",
  "role": "NGO"
}
```

## Organizations

```json
[
  {
    "id": "21111111-1111-4111-8111-111111111111",
    "name": "Demo Foundation",
    "organization_type": "NGO"
  },
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Demo Corporation",
    "organization_type": "CORPORATE"
  },
  {
    "id": "23333333-3333-4333-8333-333333333333",
    "name": "Demo Business",
    "organization_type": "BUSINESS"
  }
]
```

## Project

```json
{
  "project_code": "CSR-1024",
  "title": "School Kit Distribution",
  "category": "Education",
  "location": "Demo Location",
  "beneficiaries": 500,
  "estimated_budget": 50000,
  "contract_value": 50000,
  "status": "COMPLETED"
}
```

## Proposal

```json
{
  "bid_amount": 48000,
  "delivery_timeline_days": 14,
  "capacity": "Can fulfill 500 kits",
  "experience": "Relevant project experience",
  "status": "SELECTED"
}
```

## AI Proposal Evaluation

```json
{
  "cost_score": 92,
  "timeline_score": 90,
  "capacity_score": 95,
  "experience_score": 91,
  "feasibility_score": 94,
  "overall_score": 92.4,
  "recommendation": "Strong Candidate"
}
```

## Delivery

```json
{
  "quantity_delivered": 500,
  "delivery_date": "2026-08-08",
  "quality": "Good",
  "comments": "Delivery received by NGO."
}
```

## NGO Verification

```json
{
  "quantity_received": 500,
  "quality_acceptable": true,
  "packaging_acceptable": true,
  "delivered_on_time": true,
  "authorized_representative_confirmed": true
}
```

## AI Verification

```json
{
  "status": "LIKELY_FULFILLED",
  "confidence": 0.96,
  "requested_quantity": 500,
  "received_quantity": 500,
  "completion_percentage": 100,
  "issues": [],
  "recommendation": "Review for final payment"
}
```

## Important

Use test/demo identities and emails only. Do not use real people's personal data in seed scripts.
