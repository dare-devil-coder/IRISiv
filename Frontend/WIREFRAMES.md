# IRISiv — Frontend Wireframes

These are structural wireframes. Do not treat the ASCII layout as the final visual design.

## 1. Login

```text
+------------------------------------------------+
|                     IRISiv                     |
|                                                |
|              Welcome back                     |
|                                                |
| Email                                          |
| [____________________________]                 |
|                                                |
| Password                                       |
| [____________________________]                 |
|                                                |
|              [      LOGIN      ]               |
|                                                |
| Forgot password?      Create account           |
+------------------------------------------------+
```

## 2. Role Selection / Signup

```text
+------------------------------------------------+
| Create your IRISiv account                    |
|                                                |
| I am a:                                        |
|                                                |
| [ NGO ]       [ CORPORATE ]       [ BUSINESS ] |
|                                                |
| Name                                           |
| Email                                          |
| Password                                       |
|                                                |
| [ CREATE ACCOUNT ]                             |
+------------------------------------------------+
```

## 3. NGO Dashboard

```text
+----------+-------------------------------------+
| Sidebar  | NGO Dashboard                       |
|          |                                     |
| Dashboard| [Active] [Pending] [Verify] [Done]|
| Require- |                                     |
| ments    | Pending Actions                     |
| Projects | +-------------------------------+   |
| Delivery | | Delivery verification needed |   |
| Verify   | +-------------------------------+   |
| Evidence |                                     |
| Impact   | Recent Projects                     |
|          | +-------------------------------+   |
|          | | Project | Status | Deadline  |   |
|          | +-------------------------------+   |
+----------+-------------------------------------+
```

## 4. Create Requirement

```text
+------------------------------------------------+
| Create CSR Requirement                         |
|                                                |
| Project Title                                  |
| [________________________________]             |
|                                                |
| Category        Location                       |
| [___________]   [______________]               |
|                                                |
| Beneficiaries   Estimated Budget               |
| [___________]   [______________]               |
|                                                |
| Deadline                                        |
| [______________]                               |
|                                                |
| Requirement                                     |
| [________________________________________]     |
| [________________________________________]     |
|                                                |
| [Save Draft]          [Submit Requirement]     |
+------------------------------------------------+
```

## 5. Corporate Dashboard

```text
+----------+-------------------------------------+
| Sidebar  | Corporate Dashboard                |
|          |                                     |
|          | [CSR Budget] [Allocated] [Active] |
|          | [Beneficiaries]                     |
|          |                                     |
|          | Pending Approvals                   |
|          | +-------------------------------+   |
|          | | Project | NGO | Budget | View |   |
|          | +-------------------------------+   |
|          |                                     |
|          | Projects Requiring Attention        |
+----------+-------------------------------------+
```

## 6. Business Dashboard

```text
+----------+-------------------------------------+
| Sidebar  | Business Dashboard                |
|          |                                     |
|          | [Opportunities] [Proposals] [Live] |
|          |                                     |
|          | Available Opportunities             |
|          | +-------------------------------+   |
|          | | Project | Budget | Deadline  |   |
|          | +-------------------------------+   |
+----------+-------------------------------------+
```

## 7. Proposal Comparison

```text
+-------------------------------------------------------------+
| Project: School Kit Distribution                            |
|                                                             |
| AI Evaluation                                               |
|                                                             |
|              Business A   Business B*   Business C        |
| Cost             82          95            98              |
| Timeline         80          92            70              |
| Capacity         85          94            75              |
| Experience       78          91            72              |
|                                                             |
| Overall          82          93            77              |
|                                                             |
| * AI Recommended                                             |
|                                                             |
| [View Proposal]             [Select Business]              |
+-------------------------------------------------------------+
```

## 8. Project Lifecycle

```text
Requirement       ✓
     |
CSR Approved      ✓
     |
Published         ✓
     |
Proposals         ✓
     |
Business Selected ●
     |
Contract          ○
     |
Advance Paid      ○
     |
Execution         ○
     |
Delivery          ○
     |
NGO Verification  ○
     |
AI Verification   ○
     |
Final Payment     ○
     |
Completed         ○
```

## 9. AI Verification — Success

```text
+------------------------------------------------+
|          AI VERIFICATION ENGINE                |
+------------------------------------------------+
| Requested Quantity             500       ✓     |
| Received Quantity              500       ✓     |
| Quantity Match                 100%      ✓     |
| Timeline                       On Time   ✓     |
| Quality                        Good      ✓     |
| Documentation                  Complete  ✓     |
|                                                |
| VERIFICATION RESULT                            |
|                                                |
|              LIKELY FULFILLED                  |
|                                                |
| Confidence                    96%              |
| Completion                    100%             |
| Issues                        None              |
+------------------------------------------------+
```

## 10. AI Verification — Failure

```text
+------------------------------------------------+
|          AI VERIFICATION ENGINE                |
+------------------------------------------------+
| Requested Quantity             1000            |
| Received Quantity               950            |
|                                                |
|              QUANTITY MISMATCH                 |
|                                                |
| Shortfall                       50             |
| Shortfall %                      5%            |
|                                                |
| Recommendation:                                |
|           MANUAL REVIEW REQUIRED               |
+------------------------------------------------+
```

## 11. Impact Report

```text
+------------------------------------------------+
|              CSR IMPACT REPORT                 |
+------------------------------------------------+
| Project #CSR-1024                              |
| Status: COMPLETED                              |
|                                                |
| ₹50,000             500                        |
| Project Value       Beneficiaries              |
|                                                |
| 500 / 500           100%                       |
| Delivered           Completion                 |
|                                                |
| NGO Verified        ✓                          |
| Evidence            ✓                          |
| AI Verified         ✓                          |
| Final Payment       ✓                          |
|                                                |
| Impact Summary                                |
| [AI generated summary]                         |
+------------------------------------------------+
```

