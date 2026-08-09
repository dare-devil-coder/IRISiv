# IRISiv — Backend Technical Stack

## Recommended Stack

- Language: TypeScript
- Runtime: Node.js
- API: Next.js Route Handlers/server layer OR dedicated Node API, depending on existing repository
- Database: PostgreSQL via Supabase
- Authentication: Supabase Auth or team's approved equivalent
- Storage: Supabase Storage
- Validation: Zod
- API testing: Postman/Thunder Client + automated tests
- Logging: structured server-side logging
- AI integration: service adapter owned by Person 4

## Architectural Principle

Prefer a modular monolith for the hackathon.

Do not create microservices unless there is a clear need.

Suggested layers:

```text
routes/controllers
↓
validation
↓
services
↓
repositories/database
↓
external service adapters
```

## API

REST is preferred for clear frontend integration.

## Database Access

Use the team's agreed Supabase/PostgreSQL access layer.

Keep SQL/database access out of controllers.

## Deployment

The final deployment target can be decided by the team, but the application must work locally first and use environment variables for deployment configuration.

## Production-readiness Direction

The architecture should make it possible to replace:
- simulated payments with a regulated payment integration
- prototype AI with production AI
- demo organizations with verified organizations
- local development storage with production storage

without redesigning the core project lifecycle.
