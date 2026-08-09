# IRISiv — Backend Folder Structure

Recommended modular structure:

```text
server/
├── config/
│   ├── env.ts
│   ├── auth.ts
│   └── database.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── requirements.routes.ts
│   ├── projects.routes.ts
│   ├── opportunities.routes.ts
│   ├── proposals.routes.ts
│   ├── contracts.routes.ts
│   ├── payments.routes.ts
│   ├── deliveries.routes.ts
│   ├── evidence.routes.ts
│   ├── verification.routes.ts
│   ├── impact.routes.ts
│   ├── notifications.routes.ts
│   └── audit.routes.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── requirements.controller.ts
│   ├── projects.controller.ts
│   ├── proposals.controller.ts
│   ├── payments.controller.ts
│   ├── deliveries.controller.ts
│   ├── verification.controller.ts
│   └── impact.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── project.service.ts
│   ├── proposal.service.ts
│   ├── contract.service.ts
│   ├── payment.service.ts
│   ├── delivery.service.ts
│   ├── verification.service.ts
│   ├── notification.service.ts
│   ├── audit.service.ts
│   └── impact.service.ts
│
├── integrations/
│   ├── ai/
│   │   └── ai.service.ts
│   ├── storage/
│   │   └── storage.service.ts
│   └── notifications/
│       └── notification.adapter.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── error.middleware.ts
│   └── request-id.middleware.ts
│
├── validators/
│   ├── auth.schemas.ts
│   ├── project.schemas.ts
│   ├── proposal.schemas.ts
│   ├── delivery.schemas.ts
│   └── verification.schemas.ts
│
├── types/
│   ├── auth.ts
│   ├── project.ts
│   ├── proposal.ts
│   ├── payment.ts
│   ├── delivery.ts
│   └── verification.ts
│
├── utils/
│   ├── errors.ts
│   ├── pagination.ts
│   └── dates.ts
│
└── app.ts
```

Adapt this to the existing repository rather than blindly replacing its structure.
