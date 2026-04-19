# Task Plan: Attendance Report Mission Type Column

## Goal
Add a visible work mission type column to the attendance reports, using the existing `missionType` field and supporting both on-screen tables and report exports.

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
- [x] Identify shared model/UI touchpoints
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation
- [x] Add reusable mission type label handling
- [x] Update my attendance report table/export output
- [x] Update all attendance report table/export output
- [x] Add translation keys for the new column and 3 mission types
- **Status:** complete

### Phase 4: Testing & Verification
- [x] Run targeted verification/build checks
- [ ] Confirm table/export mappings compile cleanly
- [x] Document test results in progress.md
- **Status:** complete

### Phase 5: Delivery
- [x] Review modified files
- [x] Summarize changes and verification
- [x] Deliver to user
- **Status:** complete

## Key Questions
1. Is `missionType` already present on the attendance report model returned by the API?
2. Where should the new label logic live so both my/all reports and exports stay consistent?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Add mission type label logic on `AttendanceReport` | Keeps the enum-to-label mapping reusable across both report views and exports |
| Add the column in both HTML tables and Excel/PDF row mapping | The feature request targets the attendance report output, not only the on-screen table |
| Use translation keys for the 3 mission types | Keeps UI behavior consistent with the rest of the module and supports Arabic/English |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `rg src/assets` failed because translations live under `public/assets` | 1 | Re-ran the search against `public/assets` |
| Sandboxed build/type-check commands did not return a reliable completion state | 1 | Switched to source-level verification and documented the limitation |

## Notes
- Re-read this plan before major decisions
- Keep findings/progress files updated alongside implementation
