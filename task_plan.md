# Task Plan: Backend PDF Export For Lookup Lists

## Goal
Move lookup-list PDF export from frontend-generated jsPDF tables to backend-generated PDF downloads via each entity's `/ExportPdf?Language=<lang>` endpoint while preserving the current page filters generically through the shared base list/service abstractions.

## Current Phase
Phase 5

## Phases
### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints and requirements
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define technical approach
- [x] Identify shared abstractions to change
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation
- [x] Add generic backend PDF export support in the service layer
- [x] Refactor base list PDF export to download backend blobs
- [x] Adjust lookup-specific overrides only where required
- **Status:** complete

### Phase 4: Testing & Verification
- [x] Verify lookup exports still pass current filters
- [x] Run targeted build or static verification
- [x] Fix any issues found
- **Status:** complete

### Phase 5: Delivery
- [x] Review modified files
- [x] Summarize behavior and risks
- [ ] Deliver result to user
- **Status:** in_progress

## Key Questions
1. Which lookup screens rely directly on `BaseListComponent.exportPdf` versus custom overrides?
2. What is the safest generic contract for downloading backend PDFs without affecting non-lookup screens?
3. How should language and filter payload be passed so the current filtered page exports exactly what the backend expects?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Start in the shared `BaseListComponent` and `BaseCrudService` layers | Most lookup lists already inherit export behavior there, so one refactor gives broad coverage |
| Scope the change around backend blob download using each service's URL segment | Keeps endpoint construction generic and avoids hardcoding per-entity export routes |
| Introduce `BaseLookupListComponent` instead of flipping all `BaseListComponent` screens to backend export | Limits behavior changes to lookup pages and keeps the legacy jsPDF fallback for non-lookup screens |
| Keep `my-shifts` on a custom override but route it through the new backend helper | Preserves its specialized list behavior while still moving its PDF export off the frontend |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `rg` search included `src/app` which does not exist in this repo layout | 1 | Switched to searching under `src`, `src/abstracts`, `src/services`, and feature folders only |
| Touched TypeScript files were rewritten with CRLF, causing noisy full-file diffs | 1 | Normalized the edited files back to LF with a bulk line-ending pass before final review |

## Notes
- Re-read this plan before major decisions.
- Avoid touching unrelated user changes in the dirty worktree.
