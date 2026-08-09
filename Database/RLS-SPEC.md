# IRISiv — Row Level Security Specification

RLS is a defense-in-depth layer. Backend authorization remains mandatory.

## General

Enable RLS on application tables that contain protected data.

Use authenticated identity from Supabase Auth.

Do not trust role, profile ID or organization ID supplied by a client request.

## Profiles

A user can read/update their own profile subject to application rules.

Admins can have broader access.

## Organizations

Members can read their own organization information.

Organization creation/update should be controlled by backend/admin workflows.

## Organization members

Members can read membership relevant to their organization.

Administrative membership changes should be restricted.

## Projects

### NGO

Can access projects where:
- ngo_organization_id belongs to an organization the user is a member of.

### Corporate

Can access projects where:
- corporate_organization_id belongs to an organization the user is a member of.

### Business

Can access:
- published/proposal-open opportunities intended for business discovery, subject to product policy;
- projects where selected_business_organization_id belongs to the user's organization;
- its own proposal records.

Do not grant a business unrestricted access to all projects.

## Proposals

Business:
- create/read its own proposals;
- cannot modify another business's proposals.

Corporate:
- can read proposals for projects controlled by its organization;
- can perform selection through the backend workflow.

NGO:
- does not automatically get proposal management access.

## AI evaluations

Readable by authorized project participants according to product workflow.

Creation/update should be controlled by backend/AI service.

## Contracts and payments

Only authorized project participants can read relevant records.

Payment mutation must go through backend workflow.

Do not allow direct client-side status manipulation.

## Deliveries

Selected business can create/read its own project delivery records.

NGO and corporate can read relevant delivery records.

## Evidence

Uploader must be authorized for the associated project/delivery.

Unrelated organizations must not read private evidence.

## NGO verification

Only authorized NGO members for the project may submit/update the NGO verification through the application workflow.

Business must not write NGO verification.

## AI verification

AI verification writes should be restricted to the approved service/backend path.

Users should generally read, not arbitrarily modify, AI results.

## Verification reviews

Corporate reviewers for the project can create/read relevant reviews.

Business must not create corporate reviews.

## Impact reports

Authorized project participants can read relevant impact reports.

Generation/update should be controlled by backend workflow.

## Notifications

A user can read/update read-state for their own notifications.

## Audit logs

Authenticated project participants may have read access only where product policy requires it.

Ordinary users must not update/delete audit records.

Prefer append-only insertion through trusted backend/service paths.

## Storage

Storage policies must mirror project authorization. Never assume a private bucket is secure without object-level policies.
