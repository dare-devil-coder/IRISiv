# IRISiv — Error Specification

## Standard Shape

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROJECT_STATE",
    "message": "The project cannot accept proposals in its current state.",
    "details": {}
  }
}
```

## Common Codes

### Authentication

`AUTH_REQUIRED`
`INVALID_CREDENTIALS`
`SESSION_EXPIRED`

### Authorization

`FORBIDDEN`
`ROLE_NOT_ALLOWED`
`ORGANIZATION_ACCESS_DENIED`

### Validation

`VALIDATION_ERROR`
`INVALID_AMOUNT`
`INVALID_DATE`
`MISSING_REQUIRED_FIELD`

### Resources

`NOT_FOUND`
`PROJECT_NOT_FOUND`
`PROPOSAL_NOT_FOUND`
`DELIVERY_NOT_FOUND`

### State

`INVALID_PROJECT_STATE`
`INVALID_PAYMENT_STATE`
`INVALID_VERIFICATION_STATE`

### Conflicts

`DUPLICATE_PROPOSAL`
`BUSINESS_ALREADY_SELECTED`
`PAYMENT_ALREADY_RECORDED`
`DUPLICATE_VERIFICATION`

### AI

`AI_SERVICE_UNAVAILABLE`
`AI_INVALID_RESPONSE`
`AI_ANALYSIS_FAILED`

### Storage

`FILE_UPLOAD_FAILED`
`EVIDENCE_NOT_FOUND`

## Rules

Do not expose:
- stack traces
- database credentials
- service secrets
- internal SQL
- unnecessary personal information

Log detailed internal errors server-side.
Return safe errors to clients.
