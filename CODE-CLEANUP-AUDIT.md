# IRISiv Code Cleanup Audit Report
**Date:** August 16, 2026  
**Scope:** Full codebase analysis for unused files, dead code, dependencies, and demo code

---

## Executive Summary

**Total Issues Found: 24**
- 6 completely unused files
- 3 unused npm dependencies 
- 14 demo/test scripts
- 2 duplicate API endpoints
- 3 npm vulnerabilities to fix

**Priority:** Remove high-volume test scripts and unused dependencies immediately.

---

## 1. COMPLETELY UNUSED FILES (DELETE THESE)

### Components - 1 file
| File | Type | Reason | Impact |
|------|------|--------|--------|
| [src/components/shared/AIVerificationResultCard.tsx](src/components/shared/AIVerificationResultCard.tsx) | React Component | Defined but never imported anywhere | Dead code - **DELETE** |

---

## 2. UNUSED npm DEPENDENCIES (UNINSTALL THESE)

These packages are installed in package.json but have zero imports in the codebase:

| Package | Version | Size | Reason to Remove | Status |
|---------|---------|------|------------------|--------|
| `framer-motion` | ^12.4.7 | ~80KB | No animations used in any component | Safe to remove |
| `clsx` | ^2.1.1 | ~2KB | Not used for className merging | Safe to remove |
| `tailwind-merge` | ^3.0.1 | ~4KB | Tailwind merge not utilized | Safe to remove |

**Commands to remove:**
```bash
npm uninstall framer-motion clsx tailwind-merge
```

---

## 3. HARDCODED DEMO/TEST CODE (CLEAN UP THESE)

### A. Mock Data File
**File:** [src/lib/db/mockData.ts](src/lib/db/mockData.ts)  
**Issue:** Contains 20+ INITIAL_* exports with hardcoded demo data  
**Exports:**
- `INITIAL_PROFILES` - 6 mock users (prof-ngo-1, prof-corp-1, prof-biz-1, prof-admin-1, etc.)
- `INITIAL_ORGANIZATIONS` - org-ngo-1, org-corp-1, org-biz-1 (repeated 86 times in code)
- `INITIAL_PROJECTS` - proj-dlc (hardcoded test project)
- `INITIAL_PROPOSALS`, `INITIAL_CONTRACTS`, `INITIAL_PAYMENTS`, `INITIAL_DELIVERIES`, etc.

**Action:** Keep structure but replace with empty arrays; move demo data to separate `/data/demo.ts` file for testing only.

### B. Hardcoded Organization IDs Throughout Codebase
**Locations:** 8 API routes with fallback demo IDs

| Route | Fallback ID | Issue |
|-------|------------|-------|
| [src/app/api/projects/route.ts](src/app/api/projects/route.ts#L24) | `org-ngo-1` | Defaults to demo org when no param |
| [src/app/api/requirements/route.ts](src/app/api/requirements/route.ts#L7) | `org-ngo-1` | Hardcoded default |
| [src/app/api/projects/[id]/approve/route.ts](src/app/api/projects/[id]/approve/route.ts#L8) | `org-corp-1` | Falls back to demo |
| [src/app/api/projects/[id]/lock/route.ts](src/app/api/projects/[id]/lock/route.ts#L8) | `org-corp-1` | Demo org |
| [src/app/api/projects/[id]/proposals/route.ts](src/app/api/projects/[id]/proposals/route.ts#L27) | `org-biz-1` | Business fallback |
| [src/app/api/projects/[id]/delivery/route.ts](src/app/api/projects/[id]/delivery/route.ts#L8) | `org-biz-1` | Demo default |
| [src/app/api/proposals/[id]/select/route.ts](src/app/api/proposals/[id]/select/route.ts#L11) | `org-corp-1` | Corporate fallback |
| [src/app/api/tenders/[id]/select/route.ts](src/app/api/tenders/[id]/select/route.ts#L10) | `org-corp-1` | Fallback |

**Action:** Remove fallback defaults; require valid orgId in request body. Throw 400 error if missing.

### C. SQLite Fallback (Not Integrated)
**File:** [src/lib/db/supabaseClient.ts](src/lib/db/supabaseClient.ts)  
**Issue:** `USE_SQLITE` environment variable enables WASM-based SQLite fallback  
**Problem:**
- Only partially integrated 
- 5 test files created to validate persistence
- Environment variable approach incomplete
- Not suitable for production

**Action:** Remove SQLite feature entirely or complete integration properly. For now:
```bash
# Remove these SQLite test scripts:
rm scripts/test_sqlite_persistence.js
rm scripts/test_sqlite_reload.js
rm scripts/testSQLitePersist.js
```

Also remove from [src/lib/db/supabaseClient.ts](src/lib/db/supabaseClient.ts#L5-L19):
```typescript
// DELETE: Lines 5-19 (SQLite conditional logic)
```

Remove `sql.js` dependency as secondary cleanup.

### D. Demo Authentication
**File:** [src/lib/services/projectService.ts](src/lib/services/projectService.ts#L99)  
**Method:** `resetDemoState()`  
**Issue:** Provides endpoint to reset platform to demo seed state  
**Status:** CRITICAL ISSUE - Allows anyone to reset production data

### E. Demo Reset Endpoints
**Files:** 
- [src/app/api/demo/reset/route.ts](src/app/api/demo/reset/route.ts)
- [src/app/api/admin/reset/route.ts](src/app/api/admin/reset/route.ts)

**Issue:** Both endpoints exist and call same function  
**Action:** Keep only `/api/admin/reset` (behind authentication); DELETE `/api/demo/reset`

---

## 4. DUPLICATE API ENDPOINTS (CONSOLIDATE THESE)

### Audit Log Endpoints - 2x Redundancy

| Endpoint | File | Function | Issue |
|----------|------|----------|-------|
| `GET /api/admin/audit-logs` | [src/app/api/admin/audit-logs/route.ts](src/app/api/admin/audit-logs/route.ts) | `ProjectService.getAuditLogs()` | Requires admin role (implied) |
| `GET /api/audit` | [src/app/api/audit/route.ts](src/app/api/audit/route.ts) | `ProjectService.getAuditLogs()` | No role check |

**Action:** Keep `/api/admin/audit-logs` with authentication; DELETE `/api/audit` or redirect it.

### Reset Endpoints - 2x Redundancy

| Endpoint | File | Security |
|----------|------|----------|
| `POST /api/admin/reset` | [src/app/api/admin/reset/route.ts](src/app/api/admin/reset/route.ts) | Behind /admin path (implicit security) |
| `POST /api/demo/reset` | [src/app/api/demo/reset/route.ts](src/app/api/demo/reset/route.ts) | **OPEN TO ANYONE** - DELETE |

**Action:** DELETE `/api/demo/reset` immediately.

---

## 5. TEST/DEMO SCRIPTS TO ARCHIVE (14 files)

These scripts are for development/testing only and should not be committed:

```
scripts/comprehensiveTest.js              - Full endpoint test suite
scripts/comprehensiveTestV2.js            - Duplicate test suite
scripts/debugLifecycle.js                 - Debug workflow
scripts/debugProposal.js                  - Debug proposals
scripts/quickLifecycleTest.js             - Quick e2e flow
scripts/smokeFlow.js                      - Basic workflow test
scripts/smokeFlowExisting.js              - Test existing data
scripts/smokeTest.js                      - Simple smoke test
scripts/test_direct_workflow.js           - Direct service test
scripts/test_sqlite_persistence.js        - SQLite file persistence
scripts/test_sqlite_reload.js             - SQLite reload test
scripts/test_ui_routes.js                 - UI route validation
scripts/test_workflow_e2e.js              - Full e2e workflow
scripts/testSQLitePersist.js              - Persistence validation
```

**Action:** Move to separate `/.dev-scripts/` directory or remove from git tracking with `.gitignore`

---

## 6. DEPENDENCY ISSUES TO FIX

### npm Vulnerabilities (3 HIGH)

From `package-lock.json`:
1. **PostCSS XSS** - Unescaped `</style>` tag vulnerability
2. **sharp CVE** - Inherited transitive vulnerability
3. **Next.js Version** - Upgrade required to `16.3.1` for security patches

**Action:**
```bash
npm update
npm audit fix
npm install next@16.3.1
```

---

## 7. SUMMARY: WHAT TO DELETE

### Delete Immediately (Breaking Change: None)
```bash
# 1. Unused component
rm src/components/shared/AIVerificationResultCard.tsx

# 2. Duplicate demo reset endpoint
rm src/app/api/demo/reset/route.ts

# 3. Duplicate audit endpoint
rm src/app/api/audit/route.ts

# 4. Demo test scripts (move to .gitignore)
# Add to .gitignore:
scripts/**

# 5. Remove unused dependencies
npm uninstall framer-motion clsx tailwind-merge sql.js
```

### Refactor (Moderate Effort)
```bash
# 1. Remove hardcoded demo defaults from 8 API routes
#    - Make orgId required in request body
#    - Throw 400 if missing

# 2. Clean up mockData.ts
#    - Keep structure, replace with empty arrays
#    - Move demo data to separate file

# 3. Remove SQLite fallback logic from supabaseClient.ts
#    - Delete lines 5-19 (conditional logic)
#    - Simplify to Supabase-only

# 4. Add authentication checks
#    - /api/admin/reset requires auth
#    - /api/admin/audit-logs requires auth
```

---

## 8. CLEANUP CHECKLIST

- [ ] Delete `src/components/shared/AIVerificationResultCard.tsx`
- [ ] Delete `src/app/api/demo/reset/route.ts`
- [ ] Delete `src/app/api/audit/route.ts`
- [ ] Add `scripts/**` to `.gitignore`
- [ ] Run `npm uninstall framer-motion clsx tailwind-merge sql.js`
- [ ] Remove SQLite logic from `src/lib/db/supabaseClient.ts`
- [ ] Remove hardcoded org ID defaults from 8 API routes
- [ ] Add auth checks to admin endpoints
- [ ] Run `npm audit fix` for security patches
- [ ] Run `npm update next` to upgrade to 16.3.1

---

## Files Modified by This Audit
- [package.json](package.json) - Will have 4 fewer dependencies
- [.gitignore](.gitignore) - Will ignore scripts/
- 8 API route files - Will remove hardcoded defaults
- [src/lib/db/supabaseClient.ts](src/lib/db/supabaseClient.ts) - Will remove SQLite logic

**Estimated Cleanup Time:** 2-4 hours  
**Estimated Size Reduction:** ~150KB (node_modules)

