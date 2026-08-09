# IRISiv — UI/UX Specification

## 1. Design Direction

IRISiv should feel like a serious B2B / fintech / impact-management platform.

Design qualities:
- Trustworthy
- Professional
- Clear
- Data-driven
- Modern
- Calm
- Accessible
- Operational

Avoid:
- Excessive gradients
- Excessive glassmorphism
- Decorative 3D effects
- Random animations
- Overloaded dashboards
- Visual noise

## 2. Suggested Visual System

### Color Roles

Use semantic roles rather than scattering colors throughout the code.

- Primary: deep professional blue/indigo
- Background: neutral near-white
- Surface: white
- Text primary: near-black/slate
- Text secondary: muted slate
- Border: light neutral
- Success: green
- Warning: amber
- Error: red
- Information: blue

The exact palette should be centralized in Tailwind/theme tokens so it can be changed without rewriting components.

## 3. Typography

Recommended:
- Primary font: Inter or another clean modern sans-serif
- Headings: semibold/bold
- Body: regular
- Labels: medium
- Numbers/KPIs: semibold/bold

Use a consistent type scale.

## 4. Layout

Desktop-first because the hackathon demo will primarily be presented on a laptop/projector.

Recommended:
- Max content width: approximately 1280–1440px
- Sidebar: fixed desktop navigation
- Main content: responsive
- Cards: consistent padding/radius
- Tables: horizontally scrollable on smaller screens
- Forms: clear grouping and labels

## 5. Responsive Breakpoints

Use Tailwind breakpoints consistently:
- Mobile: default
- `sm`
- `md`
- `lg`
- `xl`
- `2xl`

No page should become unusable on tablet/mobile.

## 6. Component States

Every interactive component must support:
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error
- Success where applicable

## 7. Status Semantics

Use semantic status styling consistently.

Examples:
- Draft
- Submitted
- CSR Approved
- Published
- Proposals Open
- Business Selected
- Contracted
- Advance Paid
- In Progress
- Delivery Submitted
- NGO Verified
- AI Verified
- Manual Review
- Final Payment Pending
- Completed

## 8. Project Lifecycle Visual

Create one reusable timeline component:

Requirement
↓
CSR Approved
↓
Published
↓
Proposals
↓
Business Selected
↓
Contract
↓
Advance Paid
↓
Execution
↓
Delivery
↓
NGO Verified
↓
AI Verified
↓
Final Payment
↓
Completed
↓
Impact Report

The active state must be visually dominant.

## 9. Accessibility

- Keyboard-accessible controls
- Visible focus states
- Semantic HTML
- Labels for form fields
- Sufficient contrast
- Don't communicate status by color alone
- Meaningful button text
- Alt text for meaningful images

## 10. Animation

Use Framer Motion only where it improves comprehension:
- Page transitions
- Timeline progression
- Modal entry
- KPI appearance
- AI verification result reveal

Do not animate every element.

## 11. Dashboard UX Rule

Every dashboard should answer three questions immediately:

1. What is happening?
2. What needs my attention?
3. What should I do next?

