# Unused Code & Dead Exports - IRISiv Audit

## Functions/Exports NOT Used Anywhere

### 1. `AIVerificationResultCard` React Component
**File:** `src/components/shared/AIVerificationResultCard.tsx`  
**Type:** React.FC Component  
**Status:** DEAD CODE - Defined but never imported  
**Action:** DELETE entire file

```typescript
// This export is never used:
export const AIVerificationResultCard: React.FC<AIVerificationResultCardProps> = ({
  verification,
  onReview,
}) => { ... }
```

**Dependencies:** Imports lucide-react icons but nothing else depends on this component.

---

### 2. `resetDemoState()` Method
**File:** `src/lib/services/projectService.ts` (line ~99)  
**Type:** Static method  
**Status:** ONLY USED BY 2 ENDPOINTS - both should be deleted
**Action:** Remove after deleting `/api/demo/reset`

```typescript
static resetDemoState() {
  store.resetToDemoState();
  return { success: true, message: 'System state reset to clean demo seed.' };
}
```

**Called By:**
- [src/app/api/admin/reset/route.ts](src/app/api/admin/reset/route.ts#L5) ✓ Keep
- [src/app/api/demo/reset/route.ts](src/app/api/demo/reset/route.ts#L5) ✗ DELETE

**Note:** After deleting `/api/demo/reset`, this function becomes security-only endpoint.

---

### 3. Unused Mock Data Exports
**File:** `src/lib/db/mockData.ts`  
**Type:** Const arrays  
**Status:** Only loaded on app startup, not used dynamically

**Unused exports (listed for reference - all referenced but many loaded unnecessarily):**
```typescript
export const INITIAL_PROFILES = [ ... ]           // Only profile-ngo-1, corp-1, biz-1 used
export const INITIAL_ORGANIZATIONS = [ ... ]     // Same 3 orgs repeated
export const INITIAL_ORG_VERIFICATIONS = [ ... ] // Mostly unused
export const INITIAL_NEED_ANALYSES = [ ... ]     // Single entry used
export const INITIAL_PROJECTS = [ ... ]          // Only proj-dlc used
export const INITIAL_PROPOSALS = []              // Always empty
export const INITIAL_EVALUATIONS = {}            // Always empty
export const INITIAL_TENDERS = [ ... ]           // Only 2-3 used
export const INITIAL_QUOTATIONS = [ ... ]        // Minimal usage
export const INITIAL_QUOTATION_EVALUATIONS = [ ... ] // Minimal usage
```

**Action:** These are initialized but most values are never accessed. Consider lazy-loading or removing extras.

---

### 4. Query Parameter `role` in Various GET Endpoints
**Locations:** Multiple files  
**Issue:** Parameter accepted but not always used correctly

Example - `src/app/api/projects/route.ts`:
```typescript
// Accepts role parameter but it's optional and has no enforcement
const role = searchParams.get('role') as UserRole | undefined;
const projects = await ProjectService.getProjects(role || undefined, orgId);
```

**Problem:** No validation that caller has this role. Frontend can spoof any role.

---

### 5. Unused Endpoint: `GET /api/audit`
**File:** `src/app/api/audit/route.ts`  
**Status:** DUPLICATE of `/api/admin/audit-logs`  
**Action:** DELETE

```typescript
// This is redundant - use /api/admin/audit-logs instead
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') || undefined;
  const logs = ProjectService.getAuditLogs(projectId);
  return NextResponse.json({ success: true, data: logs });
}
```

---

### 6. Unused Endpoint: `POST /api/demo/reset`
**File:** `src/app/api/demo/reset/route.ts`  
**Status:** DUPLICATE + SECURITY RISK  
**Action:** DELETE

```typescript
// No authentication - anyone can call this!
export async function POST() {
  const res = ProjectService.resetDemoState();
  return NextResponse.json(res);
}
```

This allows any client to wipe all platform data. CRITICAL SECURITY ISSUE.

---

## Hardcoded Demo Values Used Everywhere (NOT DEAD BUT PROBLEMATIC)

### Profile IDs (Hardcoded in 12 locations)
```typescript
// Used as fallback/default in these files:
'prof-biz-1'  // src/lib/services/projectService.ts (8 occurrences)
'prof-ngo-1'  // src/lib/services/projectService.ts (notifications)
'prof-corp-1' // src/lib/services/projectService.ts (audit logs)
```

### Organization IDs (Hardcoded as defaults in 8 routes)
```typescript
'org-ngo-1'   // Default NGO org - 7 occurrences
'org-corp-1'  // Default corporate - 8 occurrences  
'org-biz-1'   // Default business - 5 occurrences
```

### Project IDs
```typescript
'proj-dlc'    // Flagship demo project - used in mock data initialization
```

---

## Classes with Minimal Usage

### `FeatherlessAIAdapter`
**File:** `src/lib/ai/featherlessAdapter.ts`  
**Status:** Defined but rarely used  
**Action:** Check if AI integration is complete or placeholder

Only called from:
- `src/app/api/ai/assistant/route.ts` (1 usage)

---

## Service Functions with Minimal Implementation

### ProjectService Static Methods - Partially Implemented
Many methods fall back to in-memory demo data instead of actual Supabase queries:

```typescript
static async getProjects(role?: UserRole, orgId?: string): Promise<CSRProject[]> {
  // Tries Supabase, falls back to in-memory mockData
  try {
    const { data, error } = await supabase
      .from('csr_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) { ... }
  } catch {
    // fallback
  }
  
  let list = store.projects;  // ← Uses in-memory mock data as fallback
  // ...
  return list.map((p) => this.attachJoinedOrganizations(p));
}
```

**Issue:** This design means system works in demo mode even when Supabase is unavailable. Good for resilience but bad for production data integrity.

---

## Partially Integrated Features

### SQLite Persistence (INCOMPLETE)
**File:** `src/lib/db/supabaseClient.ts`  
**Status:** Half-integrated, not production-ready  
**Used By:** 3 test scripts

```typescript
const useSqlite = (process.env.USE_SQLITE || 'false').toLowerCase() === 'true';
if (useSqlite) {
  // Lazy require to avoid loading the WASM adapter at build time
  const sqliteClient = require('./sqliteClient.js');
  supabase = sqliteClient;
}
```

**Problem:**
- Only enabled via environment variable
- sqliteClient.js is incomplete (uses sql.js WASM)
- Not suitable for production
- Tests exist but endpoint not documented

**Action:** Either complete it or remove entirely.

---

## Summary: Functions to Remove

| Function | File | Lines | Action |
|----------|------|-------|--------|
| `AIVerificationResultCard` | `src/components/shared/AIVerificationResultCard.tsx` | Entire file | DELETE |
| `resetDemoState()` | `src/lib/services/projectService.ts` | ~99-101 | DELETE (unused after endpoint deletion) |
| Endpoint: `GET /api/audit` | `src/app/api/audit/route.ts` | Entire file | DELETE (duplicate) |
| Endpoint: `POST /api/demo/reset` | `src/app/api/demo/reset/route.ts` | Entire file | DELETE (duplicate + security) |
| Demo org defaults | 8 API route files | Various | REFACTOR (make required) |
| SQLite fallback logic | `src/lib/db/supabaseClient.ts` | 5-19 | DELETE (incomplete) |

---

## Conditional Dead Code (Only Reachable in Demo Mode)

### In-Memory Store Initialization
**File:** `src/lib/services/projectService.ts` (lines 66-88)

```typescript
class SystemStore {
  projects: CSRProject[] = [...INITIAL_PROJECTS];
  proposals: Proposal[] = [...INITIAL_PROPOSALS];
  evaluations: Record<string, ProposalEvaluation> = { ...INITIAL_EVALUATIONS };
  // ... 15 more initialized to mock data
}
```

This entire `SystemStore` class is only used when Supabase fails. In production with Supabase, it's initialized but rarely accessed.

---

## Recommendations Priority

1. **🔴 IMMEDIATE** - Delete unused component + duplicate endpoints (5 min)
2. **🟠 HIGH** - Remove hardcoded demo defaults (30 min) 
3. **🟡 MEDIUM** - Remove SQLite fallback (5 min)
4. **🟢 LOW** - Refactor mock data (2-4 hours)

