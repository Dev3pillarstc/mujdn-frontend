# Task Plan: Localized PDF Export Filenames

## Goal
Make every PDF export in the Angular app download with an Arabic filename in Arabic UI and an English filename in English UI, matching the department list behavior.

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
- [x] Create project structure if needed
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation
- [x] Execute the plan step by step
- [x] Write code to files before executing
- [x] Test incrementally
- **Status:** complete

### Phase 4: Testing & Verification
- [x] Verify all requirements met
- [x] Document test results in progress.md
- [x] Fix any issues found
- **Status:** complete

### Phase 5: Delivery
- [x] Review all output files
- [x] Ensure deliverables are complete
- [ ] Deliver to user
- **Status:** in_progress

## Key Questions
1. Which components currently trigger PDF export with hardcoded English filenames?
2. Can the filename localization be centralized so all pages stay consistent?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use the department list flow as the reference behavior | The user explicitly requested parity with that page |
| Add a shared `getTranslatedFileName` helper on `BaseListComponent` | The PDF export buttons can reuse existing translation keys without duplicating filename construction logic in every component |
| Localize the QR visit-request PDF with a dedicated translation key | The popup saves a PDF directly via `jsPDF`, so it needs its own translated filename source |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Angular build could not validate templates in this environment | 1 | `npm run build` failed before app compilation because `node_modules` contains Windows-native `esbuild` and is missing Linux `lightningcss` binaries |

## Notes
- Prefer a shared solution over repetitive per-page filename logic if the codebase structure allows it.
