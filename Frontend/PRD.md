# IRISiv — Product Requirements Document (Frontend Scope)

## 1. Product Overview

IRISiv is an AI-assisted CSR execution and trust platform connecting NGOs, corporates, and businesses.

The frontend must represent one complete CSR lifecycle:

**NGO Need → CSR Project → Corporate Approval/Funding → Opportunity → Business Proposals → AI Evaluation → Business Selection → Contract → Advance Payment → Execution → Delivery → NGO Verification → AI Verification → Final Payment → Impact Report**

The project source defines this as the core end-to-end workflow.

## 2. Frontend Users

### NGO
Primary goal:
- Create social/CSR requirements
- Track projects
- Monitor delivery
- Verify delivery
- Upload/inspect evidence
- View impact

### Corporate
Primary goal:
- Review and approve CSR projects
- Fund projects
- Review business proposals
- See AI recommendations
- Select businesses
- Monitor execution
- Review verification
- Approve final payment state
- View impact reports and analytics

### Business
Primary goal:
- Discover CSR opportunities
- Review requirements
- Submit proposals
- Track proposal status
- Execute selected projects
- Submit delivery and evidence
- Track payment state

## 3. Core Frontend Principle

Do NOT treat the application as three disconnected dashboards.

The frontend must make it obvious that all users are interacting with the same CSR project lifecycle.

Every project page should communicate:
- What happened
- Current stage
- What evidence exists
- What action is required
- What happens next

## 4. Core Features

### Authentication
- Login
- Signup
- Role selection
- Role-based routing
- Session states
- Loading/error handling

### NGO
- Dashboard
- Create requirement
- Requirement list/detail
- Project list/detail
- Delivery verification
- Evidence
- Impact

### Corporate
- Dashboard
- CSR project approval
- Project list/detail
- Proposal comparison
- AI recommendation display
- Business selection
- Payment state
- Verification review
- Analytics
- Impact report
- AI assistant UI

### Business
- Dashboard
- Opportunity marketplace
- Opportunity details
- Proposal submission
- Proposal tracking
- Active project
- Delivery submission
- Evidence upload
- Payment status
- Performance

### Shared
- Project lifecycle timeline
- Status badges
- Notifications
- Confirmation dialogs
- Loading/skeleton states
- Empty states
- Error states
- Responsive layouts

## 5. AI UI Requirements

The frontend must show AI as decision support, not as the final authority for financial release.

### Proposal Evaluation
Display:
- Cost score
- Timeline score
- Capacity score
- Experience score
- Feasibility score
- Overall score
- Recommendation
- Reasoning

### Verification
Display:
- Requested quantity
- Received quantity
- Completion percentage
- Timeliness
- Quality
- Documentation
- Evidence
- Confidence
- Issues
- Recommendation

### Failure Scenario
The UI must support a mismatch example:
- Expected: 1,000
- Received: 950
- Shortfall: 5%
- Status: Manual review required

## 6. Payment UI

For the hackathon, payment is simulated.

Display:
- Contract value
- Advance amount
- Remaining amount
- Payment stage
- Approval state

Example:
- Contract: ₹50,000
- Advance: ₹15,000
- Remaining: ₹35,000

The frontend must not imply that IRISiv itself is legally holding or transferring CSR funds.

## 7. Impact Report

Final project view should show:
- Project ID
- Status
- Contract value
- Advance/final payment state
- Beneficiaries
- Requested quantity
- Delivered quantity
- Delivery percentage
- Verification
- Evidence
- Completion
- Impact summary

## 8. Definition of Success

A judge should be able to understand the product by following one project from:
**Requirement → Funding → Proposal → AI Evaluation → Selection → Execution → Delivery → Verification → Payment → Impact.**

