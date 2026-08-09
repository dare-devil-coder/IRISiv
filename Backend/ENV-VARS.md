# IRISiv — Backend Environment Variables

Create `.env.example`.

Never commit actual secrets.

Example:

```env
NODE_ENV=development
PORT=3000

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DATABASE_URL=

API_BASE_URL=

AI_SERVICE_URL=
AI_SERVICE_API_KEY=

FRONTEND_URL=

LOG_LEVEL=info
```

## Rules

- Never commit `.env`.
- Never expose service-role or secret keys to browser code.
- Do not hardcode API keys.
- Production secrets must be configured through deployment secret management.
