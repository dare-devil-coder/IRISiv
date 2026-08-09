# IRISiv — Frontend Component & Page Structure

## 1. Suggested Structure

```text
app/
├── (auth)/
│   ├── login/
│   └── signup/
│
├── ngo/
│   ├── dashboard/
│   ├── requirements/
│   │   ├── page
│   │   └── new/
│   ├── projects/
│   ├── verification/
│   └── impact/
│
├── corporate/
│   ├── dashboard/
│   ├── projects/
│   ├── proposals/
│   ├── payments/
│   ├── analytics/
│   ├── reports/
│   └── assistant/
│
├── business/
│   ├── dashboard/
│   ├── opportunities/
│   ├── proposals/
│   ├── projects/
│   ├── delivery/
│   └── payments/
│
└── projects/
    └── [projectId]/
```

## 2. Shared Components

```text
components/
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   ├── Topbar
│   └── PageHeader
│
├── ui/
│   ├── Button
│   ├── Card
│   ├── Badge
│   ├── Dialog
│   ├── Table
│   ├── Tabs
│   ├── Input
│   ├── Select
│   └── ...
│
├── project/
│   ├── ProjectHeader
│   ├── ProjectTimeline
│   ├── ProjectStatusBadge
│   ├── ProjectProgress
│   └── ProjectSummary
│
├── proposal/
│   ├── ProposalCard
│   ├── ProposalTable
│   ├── ProposalScore
│   └── AIRecommendation
│
├── delivery/
│   ├── DeliveryForm
│   ├── EvidenceUploader
│   └── EvidencePreview
│
├── verification/
│   ├── VerificationForm
│   ├── VerificationResult
│   ├── VerificationIssue
│   └── ConfidenceIndicator
│
├── payment/
│   ├── PaymentSummary
│   ├── PaymentMilestone
│   └── PaymentTimeline
│
├── impact/
│   ├── ImpactMetric
│   ├── ImpactSummary
│   └── ImpactReport
│
└── notifications/
    └── NotificationPanel
```

## 3. Important Reusable Components

### ProjectTimeline
Must work for every role.

### ProposalComparison
Must accept proposal data from backend.

### VerificationResult
Must support success and issue states.

### EvidenceUploader
Must support multiple file types according to backend/storage rules.

### PaymentTimeline
Must show simulated payment states.

### ImpactReport
Must present final measurable project impact.

## 4. Component Rules

- Prefer composition over giant components.
- Keep components focused.
- Avoid page-specific duplicates when a shared component is possible.
- Don't put backend business rules in components.
- Use TypeScript props/interfaces.
- Keep styling consistent with the design system.

