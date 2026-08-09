# IRISiv — Frontend Technical Stack

## 1. Required Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Supabase client for frontend data access where appropriate

## 2. Frontend Architecture

Recommended:

```text
app/
components/
features/
lib/
hooks/
services/
types/
public/
```

Use feature-oriented organization where useful.

## 3. Data Access

Do not hardcode backend data into page components.

Use service functions/hooks such as:

```text
projectService.getProject()
projectService.getProjects()
proposalService.getProposals()
deliveryService.submitDelivery()
verificationService.getResult()
```

The exact implementation must align with the backend developer's API contract.

## 4. State Management

Prefer:
- React state for local UI state
- Server data fetching for server state
- A shared state library only where genuinely necessary

Do not introduce a large state-management system without team agreement.

## 5. Forms

Use consistent:
- Labels
- Validation
- Error messages
- Submission states
- Success states

Recommended:
- React Hook Form
- Zod

## 6. Components

Build reusable components instead of duplicating UI.

Examples:

```text
Button
Input
Select
Textarea
Modal
Dialog
Card
Table
Badge
Tabs
Dropdown
Toast
Skeleton
EmptyState
ErrorState
```

IRISiv-specific:

```text
ProjectCard
ProjectStatusBadge
ProjectTimeline
ProjectHeader
ProposalTable
ProposalScoreCard
DeliveryForm
EvidenceUploader
VerificationResult
PaymentMilestone
ImpactMetric
ImpactReport
NotificationPanel
```

## 7. API Boundary

Frontend should communicate with backend through defined API/service boundaries.

Do not:
- Put business logic into components
- Query arbitrary tables from random components
- Duplicate backend rules in frontend

## 8. Environment Variables

Use environment variables for:
- Supabase URL
- Supabase publishable/anon key as appropriate
- API base URL
- Public configuration

Never expose secret keys in client-side code.

## 9. Git

Recommended branches:

```text
main
frontend
```

Feature branches may be created under the frontend branch.

Use pull requests and review before merging to main.

## 10. Quality

Before declaring frontend complete:
- TypeScript passes
- Lint passes
- Build passes
- No console errors
- All major states work
- Responsive layouts work
- Loading/error/empty states exist
