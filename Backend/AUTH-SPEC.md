# IRISiv — Authentication & Authorization Specification

## 1. Authentication Provider

Use the team's agreed authentication provider, preferably Supabase Auth if Supabase is the platform foundation.

Do not implement custom password storage if the chosen auth provider already securely manages passwords.

## 2. Signup

Signup collects:
- Name
- Email
- Password
- Role
- Organization name/details

The auth identity and application profile must be linked.

## 3. Roles

- NGO
- CORPORATE
- BUSINESS
- ADMIN

Role is application authorization data and must not be trusted solely from a client-provided field.

## 4. Authorization

Backend must verify:
- authenticated identity
- profile
- organization membership
- role
- resource ownership/control
- project state

## 5. Protected Routes

All project-changing endpoints must be protected.

Examples:
- Approve project → Corporate
- Submit proposal → Business
- Select business → Corporate
- Start project → Selected business
- Submit delivery → Selected business
- Submit NGO verification → NGO associated with project
- Final payment approval → Authorized corporate reviewer

## 6. Security Rules

Never:
- trust a user_id from request body for ownership
- trust a role from request body
- allow client-supplied organization_id to bypass membership
- expose secrets
- return sensitive records to unauthorized users

Derive identity from authenticated session/token.

## 7. Session

The frontend should receive the session according to the selected auth provider.

The backend should validate authentication for protected operations.

## 8. RLS

Person 3 owns database-level RLS.

Backend authorization must still be explicit and understandable.

Do not treat hiding a frontend button as authorization.
