# 🗑️ CLEANUP CHECKLIST - Files & Code to Delete

**Purpose**: Remove unused code, dead files, and unnecessary dependencies  
**Estimated Time**: 30 minutes  
**Priority**: AFTER fixing critical issues

---

## 📂 FILES TO DELETE

### 1. Unused React Components

```bash
# Unused component - never imported
rm src/components/shared/AIVerificationResultCard.tsx
```

**Why**: This component is exported but never used anywhere in the codebase.

### 2. Deprecated API Endpoints

```bash
# Duplicate reset endpoint (use /api/admin/reset instead)
rm src/app/api/demo/reset/route.ts

# Duplicate audit endpoint (use /api/admin/audit-logs instead)
rm src/app/api/audit/route.ts
```

**Why**: 
- `POST /api/demo/reset` - no auth checks, security risk
- `GET /api/audit` - duplicates functionality in `/api/admin/audit-logs`

### 3. Unfinished Database Backend

```bash
# SQLite backend is incomplete and not production-ready
rm src/lib/db/sqliteClient.js
# If you want to keep it for reference, move to docs/
mv src/lib/db/sqliteClient.js docs/sqlite-backup-reference.js
```

**Why**: 
- Not fully integrated into the app
- Only falls back to empty store
- Code is incomplete with `.then()` patterns
- Better to use Supabase + in-memory fallback

### 4. Unused Test Scripts (OPTIONAL - Keep if you want)

These test files are references from previous validation runs. You can delete if you've already validated:

```bash
# Keep: quickLifecycleTest.js, comprehensiveTestV2.js (actively used)
# Can delete:
rm scripts/comprehensiveTest.js
rm scripts/debugLifecycle.js
rm scripts/debugProposal.js
rm scripts/smokeFlow.js
rm scripts/smokeFlowExisting.js
rm scripts/smokeTest.js
rm scripts/test_direct_workflow.js
rm scripts/test_sqlite_persistence.js
rm scripts/test_sqlite_reload.js
```

**Why**: Multiple test scripts doing similar things. Keep the two that are actively referenced.

---

## 📦 DEPENDENCIES TO REMOVE

### Unused npm Packages

These packages are installed but not imported anywhere in the codebase:

```bash
# Remove unused packages (~136KB savings)
npm uninstall framer-motion clsx tailwind-merge sql.js

# Why:
# - framer-motion: Animation library (~80KB), not used in components
# - clsx: Class name utility (~2KB), not imported
# - tailwind-merge: Tailwind merge utility (~4KB), not imported
# - sql.js: SQLite WASM (~50KB), incomplete implementation
```

**Verification**: After uninstalling, rebuild to ensure nothing breaks:
```bash
npm run build  # Should complete without errors
```

---

## 🔧 DEAD CODE TO REMOVE

### Within `src/lib/services/projectService.ts`

These functions are exported but only called by other deprecated functions:

```typescript
// REMOVE: payAdvance() - only calls recordAdvancePayment()
export async function payAdvance(projectId: string, contractId: string) {
  return recordAdvancePayment(projectId, contractId);
}
// Use recordAdvancePayment() directly instead

// REMOVE: getProposalsByProjectId() - backward compat only, not called
export function getProposalsByProjectId(projectId: string) {
  // ...
}

// REVIEW: submitProposal() - marked as backward compat, unclear if needed
// Check if still used before removing
```

### Within API route files

These are marked for consolidation:

```typescript
// src/app/api/audit/route.ts - DELETE ENTIRE FILE
// Function is in /api/admin/audit-logs - duplicate

// src/app/api/demo/reset/route.ts - DELETE ENTIRE FILE
// Function is in /api/admin/reset - duplicate + security risk
```

### Hardcoded Demo Data

These should be replaced with auth-based values:

```typescript
// Throughout src/lib/services/projectService.ts (~86 occurrences)
// REMOVE: Hardcoded org IDs
'org-corp-1'  // Use authenticated user's org instead
'org-ngo-1'   // Use authenticated user's org instead
'org-biz-1'   // Use authenticated user's org instead
'prof-corp-1' // Use authenticated user ID instead
'prof-ngo-1'  // Use authenticated user ID instead

// Throughout src/app/ngo/requirements/new/page.tsx
// REMOVE: Hardcoded org ID in form submission
ngo_organization_id: 'org-ngo-1'  // Use useAuth() hook instead

// Throughout src/app/corporate/tenders/new/page.tsx
// REMOVE: Hardcoded org ID
corporate_organization_id: 'org-corp-1'  // Use auth context
```

---

## 🧪 TEST SCRIPTS - CLEANUP

### Keep These (Active)
- `scripts/quickLifecycleTest.js` - Main validation test (run regularly)
- `scripts/comprehensiveTestV2.js` - Full feature coverage (reference)

### Delete These (Deprecated)
```bash
# Old/incomplete test files
rm scripts/comprehensiveTest.js
rm scripts/debugLifecycle.js  
rm scripts/debugProposal.js
rm scripts/smokeFlow.js
rm scripts/smokeFlowExisting.js
rm scripts/smokeTest.js
rm scripts/test_direct_workflow.js
rm scripts/test_sqlite_persistence.js
rm scripts/test_sqlite_reload.js
rm scripts/test_ui_routes.js
rm scripts/testSQLitePersist.js
rm scripts/test_workflow_e2e.js
```

### Optional: Create cleanup script
```bash
# scripts/cleanup.sh - Run cleanup safely
#!/bin/bash

echo "Cleaning up unused test files..."
rm -v scripts/comprehensiveTest.js
rm -v scripts/debugLifecycle.js
rm -v scripts/debugProposal.js
rm -v scripts/smokeFlow.js
rm -v scripts/smokeFlowExisting.js
rm -v scripts/smokeTest.js
rm -v scripts/test_direct_workflow.js
rm -v scripts/test_sqlite_persistence.js
rm -v scripts/test_sqlite_reload.js
rm -v scripts/test_ui_routes.js
rm -v scripts/testSQLitePersist.js
rm -v scripts/test_workflow_e2e.js

echo "Cleaning up unused components..."
rm -v src/components/shared/AIVerificationResultCard.tsx

echo "Cleaning up deprecated endpoints..."
rm -v src/app/api/demo/reset/route.ts
rm -v src/app/api/audit/route.ts

echo "Uninstalling unused packages..."
npm uninstall framer-motion clsx tailwind-merge sql.js

echo "Cleanup complete!"
```

---

## 🔍 VALIDATION AFTER CLEANUP

After deleting files and uninstalling packages:

### 1. Build Test
```bash
npm run build

# Expected: ✓ Compiled successfully
# Should NOT have any missing imports
```

### 2. Lint Check
```bash
npm run lint

# Expected: No errors about missing modules
```

### 3. Manual Verification
```bash
# Check that key endpoints still work
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/admin/audit-logs  # (not /api/audit)
curl http://localhost:3000/api/admin/reset       # (not /api/demo/reset)
```

### 4. Git Status
```bash
git status

# Should show only the deletions:
# deleted:    src/components/shared/AIVerificationResultCard.tsx
# deleted:    src/app/api/demo/reset/route.ts
# deleted:    src/app/api/audit/route.ts
# ... (test scripts)

# package.json should show:
# - framer-motion removed
# - clsx removed  
# - tailwind-merge removed
# - sql.js removed
```

---

## 📊 CLEANUP SUMMARY

| Item | Type | Size | Status |
|------|------|------|--------|
| AIVerificationResultCard.tsx | Component | ~2KB | DELETE |
| /api/demo/reset | Endpoint | ~1KB | DELETE |
| /api/audit | Endpoint | ~1KB | DELETE |
| sqliteClient.js | Database | ~3KB | DELETE or ARCHIVE |
| 11 test scripts | Tests | ~20KB | DELETE |
| framer-motion | Package | ~80KB | UNINSTALL |
| clsx | Package | ~2KB | UNINSTALL |
| tailwind-merge | Package | ~4KB | UNINSTALL |
| sql.js | Package | ~50KB | UNINSTALL |
| **TOTAL SAVINGS** | - | **~164KB** | ✅ |

---

## ⚠️ IMPORTANT NOTES

1. **Before deleting**: Make sure no other code imports these files
   ```bash
   grep -r "AIVerificationResultCard" src/  # Should return nothing
   grep -r "sql.js" src/                    # Should return nothing
   ```

2. **Test after each deletion**: Build should still succeed
   ```bash
   npm run build  # Run after each major deletion
   ```

3. **Git history**: Deletion is recorded, can be recovered if needed
   ```bash
   git log --follow src/components/shared/AIVerificationResultCard.tsx
   ```

4. **Keep documentation**: Move important reference files to `docs/`
   ```bash
   mkdir -p docs/archived
   mv src/lib/db/sqliteClient.js docs/archived/sqliteClient-reference.js
   ```

5. **Update CI/CD**: If using GitHub Actions or similar, update any references to deleted files

---

## 🎯 EXECUTION PLAN

### Phase 1: Safe Deletions (5 minutes)
```bash
rm src/components/shared/AIVerificationResultCard.tsx
rm src/app/api/demo/reset/route.ts
rm src/app/api/audit/route.ts
npm run build  # Verify
```

### Phase 2: Test Scripts Cleanup (5 minutes)
```bash
# Delete old test files (keep quickLifecycleTest.js and comprehensiveTestV2.js)
rm scripts/comprehensiveTest.js
rm scripts/debugLifecycle.js
# ... etc
npm run build  # Verify
```

### Phase 3: Package Cleanup (5 minutes)
```bash
npm uninstall framer-motion clsx tailwind-merge sql.js
npm run build  # Verify - should complete successfully
```

### Phase 4: Database Backend (5 minutes)
```bash
# Either delete or archive SQLite implementation
rm src/lib/db/sqliteClient.js
# OR
mv src/lib/db/sqliteClient.js docs/archived/sqliteClient-reference.js
npm run build  # Verify
```

### Phase 5: Commit Changes
```bash
git add -A
git commit -m "chore: cleanup unused code, dead endpoints, and dependencies

- Remove unused AIVerificationResultCard component
- Remove duplicate reset and audit endpoints
- Delete deprecated test scripts (keep quickLifecycle* only)
- Uninstall unused packages: framer-motion, clsx, tailwind-merge, sql.js
- Remove incomplete SQLite backend implementation

Reduces codebase by ~164KB and removes technical debt."
```

---

## 🔄 AFTER CLEANUP

These files should still exist:
- ✅ `scripts/quickLifecycleTest.js` - Main E2E test
- ✅ `scripts/comprehensiveTestV2.js` - Feature coverage test
- ✅ `src/app/api/admin/**` - Admin endpoints (complete)
- ✅ All core service files
- ✅ All frontend pages and components (except AIVerificationResultCard)

These should be gone:
- ❌ 11 duplicate/deprecated test scripts  
- ❌ Unused npm packages (~136KB)
- ❌ Unused components
- ❌ Duplicate API endpoints
- ❌ Incomplete SQLite backend

**Result**: Cleaner codebase, faster npm installs, easier maintenance
