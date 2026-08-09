# IRISiv — User Flow Specification

## 1. Master Flow

```text
NGO
 ↓
Create Requirement
 ↓
Corporate
 ↓
Approve / Fund
 ↓
IRISiv
 ↓
Publish Opportunity
 ↓
Business
 ↓
Submit Proposal
 ↓
AI
 ↓
Evaluate Proposals
 ↓
Corporate
 ↓
Select Business
 ↓
Contract
 ↓
Advance Payment
 ↓
Business
 ↓
Execute
 ↓
Submit Delivery + Evidence
 ↓
NGO
 ↓
Verify Delivery
 ↓
AI
 ↓
Analyze Verification
 ↓
Corporate
 ↓
Approve Final Payment
 ↓
IRISiv
 ↓
Generate Impact Report
```

## 2. NGO Flow

1. Login
2. NGO dashboard
3. Create requirement
4. Save draft or submit
5. Requirement enters submitted state
6. Corporate approves
7. Requirement becomes CSR project/opportunity
8. NGO monitors project
9. Business executes
10. Delivery submitted
11. NGO opens verification
12. Reviews delivery details/evidence
13. Confirms or reports issue
14. AI verification runs
15. NGO sees verification result
16. Project eventually completes
17. NGO sees impact

## 3. Corporate Flow

1. Login
2. Corporate dashboard
3. See pending CSR requirements/projects
4. Open project
5. Review NGO requirement
6. Approve/fund
7. Opportunity becomes available
8. Businesses submit proposals
9. Corporate opens proposal comparison
10. Review AI evaluation
11. Select business
12. Contract/payment state begins
13. Monitor execution
14. Receive delivery verification
15. Review NGO confirmation + AI validation
16. Approve final payment state
17. Project becomes completed
18. View impact report

## 4. Business Flow

1. Login
2. Business dashboard
3. View opportunities
4. Open opportunity
5. Review requirements
6. Submit proposal
7. Track proposal
8. If selected, open active project
9. Start execution
10. Submit delivery
11. Upload evidence
12. Wait for NGO verification
13. Track verification
14. Track final payment state
15. Project completes

## 5. AI Proposal Flow

```text
Project Requirements
+
Business Proposal
 ↓
AI Evaluation
 ↓
Scores
 ↓
Recommendation
 ↓
Corporate reviews
 ↓
Corporate makes final selection
```

AI must not automatically select the business.

## 6. AI Verification Flow

```text
Delivery Submission
+
NGO Verification
+
Evidence
 ↓
AI Verification
 ↓
Compare expected vs actual
 ↓
Detect issues
 ↓
Confidence / result
 ↓
No issue → eligible for corporate review
Issue → manual review
```

## 7. Payment UI Flow

```text
Contract
 ↓
Advance Payment State
 ↓
Execution
 ↓
Delivery
 ↓
NGO Verification
 ↓
AI Validation
 ↓
Corporate Approval
 ↓
Final Payment State
 ↓
Completed
```

For the hackathon, this is a simulation/state workflow, not actual money movement.

## 8. Failure Flow

```text
Delivery Submitted
 ↓
AI Verification
 ↓
Mismatch detected
 ↓
Manual Review Required
 ↓
Corporate/authorized reviewer resolves
 ↓
Verification updated
 ↓
Final payment decision
```

## 9. Navigation Rules

After major actions, route the user to the next meaningful state.

Examples:
- Requirement submitted → Requirement detail/status
- Project approved → Project detail
- Proposal submitted → Proposal status
- Business selected → Active project/contract
- Delivery submitted → Delivery status
- Verification completed → Verification result
- Final payment approved → Completed project/impact report
