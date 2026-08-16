# QUICK CLEANUP CHECKLIST - IRISiv Code Audit

## 🔴 DELETE IMMEDIATELY (3 files)

```bash
# 1. Unused React component (never imported)
rm src/components/shared/AIVerificationResultCard.tsx

# 2. Duplicate demo reset endpoint (security risk - open to anyone)
rm src/app/api/demo/reset/route.ts

# 3. Duplicate audit endpoint 
rm src/app/api/audit/route.ts
```

## 📦 UNINSTALL UNUSED DEPENDENCIES (4 packages)

```bash
npm uninstall framer-motion clsx tailwind-merge sql.js
```

**Reason:** Zero usage in codebase, takes up ~90KB in node_modules

---

## 🧹 MOVE TEST SCRIPTS OUT OF GIT (14 files)

Add to `.gitignore`:
```
# Development/test scripts - not for production
scripts/comprehensiveTest.js
scripts/comprehensiveTestV2.js
scripts/debugLifecycle.js
scripts/debugProposal.js
scripts/quickLifecycleTest.js
scripts/smokeFlow.js
scripts/smokeFlowExisting.js
scripts/smokeTest.js
scripts/test_direct_workflow.js
scripts/test_sqlite_persistence.js
scripts/test_sqlite_reload.js
scripts/test_ui_routes.js
scripts/test_workflow_e2e.js
scripts/testSQLitePersist.js
```

---

## 🔧 REFACTOR: Remove Hardcoded Demo Defaults

**Files to modify:** 8 API routes

| Route | Current | Change To |
|-------|---------|-----------|
| [src/app/api/projects/route.ts](src/app/api/projects/route.ts#L24) | `org-ngo-1` fallback | Require in request body, throw 400 if missing |
| [src/app/api/requirements/route.ts](src/app/api/requirements/route.ts#L7) | `org-ngo-1` fallback | Required parameter |
| [src/app/api/projects/[id]/approve/route.ts](src/app/api/projects/[id]/approve/route.ts#L8) | `org-corp-1` fallback | Required parameter |
| [src/app/api/projects/[id]/lock/route.ts](src/app/api/projects/[id]/lock/route.ts#L8) | `org-corp-1` fallback | Required parameter |
| [src/app/api/projects/[id]/proposals/route.ts](src/app/api/projects/[id]/proposals/route.ts#L27) | `org-biz-1` fallback | Required parameter |
| [src/app/api/projects/[id]/delivery/route.ts](src/app/api/projects/[id]/delivery/route.ts#L8) | `org-biz-1` fallback | Required parameter |
| [src/app/api/proposals/[id]/select/route.ts](src/app/api/proposals/[id]/select/route.ts#L11) | `org-corp-1` fallback | Required parameter |
| [src/app/api/tenders/[id]/select/route.ts](src/app/api/tenders/[id]/select/route.ts#L10) | `org-corp-1` fallback | Required parameter |

---

## 🗑️ CLEAN UP: Remove SQLite Fallback

**File:** [src/lib/db/supabaseClient.ts](src/lib/db/supabaseClient.ts#L5-L19)

**Action:** Delete lines 5-19 (entire SQLite conditional logic)

```typescript
// DELETE THIS SECTION:
const useSqlite = (process.env.USE_SQLITE || 'false').toLowerCase() === 'true';
if (useSqlite) {
  // ... entire if block ...
}
```

**Result:** Simplify to Supabase-only, remove incomplete feature.

---

## 🔒 SECURITY: Add Authentication

Add auth checks to:
- [src/app/api/admin/reset/route.ts](src/app/api/admin/reset/route.ts) - Verify admin role
- [src/app/api/admin/audit-logs/route.ts](src/app/api/admin/audit-logs/route.ts) - Verify admin role

Current code has NO authentication - anyone can call these!

---

## 📊 REFACTORING IMPACT SUMMARY

| Action | Files Affected | Breaking Change | Effort |
|--------|-----------------|-----------------|--------|
| Delete unused component | 1 | No | 1 min |
| Delete demo reset endpoint | 1 | No (unless used by tests) | 1 min |
| Delete audit endpoint | 1 | No | 1 min |
| Uninstall packages | 4 | No | 2 min |
| Update .gitignore | 1 | No | 1 min |
| Remove hardcoded org defaults | 8 API routes | **YES** - requires client update | 30 min |
| Remove SQLite fallback | 1 file | No | 5 min |
| Add auth checks | 2 endpoints | **YES** - requires auth implementation | 30 min |

**Total Estimated Time:** 1-2 hours

---

## 📋 FILES REFERENCE

**Detailed analysis available in:** [CODE-CLEANUP-AUDIT.md](CODE-CLEANUP-AUDIT.md)

**Key findings:**
- 6 unused files (1 component + 14 test scripts)
- 3 unused npm dependencies (~90KB)
- 2 duplicate API endpoints
- 8 hardcoded demo organization defaults
- 1 incomplete SQLite fallback feature
- 3 npm vulnerabilities requiring fixes

---

## ✅ DONE CHECKLIST

- [ ] Run cleanup commands above
- [ ] Update API routes to require orgId
- [ ] Add authentication to admin endpoints
- [ ] Remove SQLite logic
- [ ] Run tests to verify nothing broke
- [ ] Commit changes

