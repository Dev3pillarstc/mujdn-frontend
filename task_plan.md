# Task Plan: Temporary Management Role Assignment Feature

## Goal

Implement temporary management role assignment in the Angular app using the existing CRUD architecture and matching the City feature's structure, routing, translations, and UI/UX conventions.

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
- [x] Map API contract to frontend models/services/components
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation

- [x] Create models, interceptor, service, and resolver
- [x] Build list and popup views following City patterns
- [x] Wire routes, sidebar links, and translations
- [x] Test incrementally
- **Status:** complete

### Phase 4: Testing & Verification

- [x] Verify feature builds and route wiring
- [x] Document test results in progress.md
- [x] Fix any issues found
- **Status:** complete

### Phase 5: Delivery

- [x] Review all modified files
- [x] Ensure deliverables are complete
- [ ] Deliver to user
- **Status:** in_progress

## Key Questions

1. What exact API fields, endpoints, and payload shapes does `TemporaryRoleAssignments-Api.md` define?
   Answer: Standard CRUD plus `POST /GetWithPaging`, with `fkUserProfileId`, optional `fkRoleId`, `dateFrom`, `dateTo`, display fields, `id`, and `concurrencyUpdateVersion`.
2. Which existing feature best matches the desired UI behavior beyond City's structure?
   Answer: City is the main structural/UI reference; visit and attendance screens provide reusable select and datepicker patterns.
3. Where should the new feature live in routing and sidebar navigation?
   Answer: As a protected route with a new `RouteIdsEnum` value and a sidebar item visible to `DEPARTMENT_MANAGER`.

## Decisions Made

| Decision                                                                                  | Rationale                                                                                               |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Use the City feature as the primary structural reference                                  | The user explicitly identified it as the pattern to follow for architecture and UX                      |
| Build the feature on top of the standard CRUD abstractions with feature-local popup rules | The API fits the app's CRUD conventions, but the update/delete constraints are specific to this feature |
| Use `UserService.getMyDepartmentUsersLookup()` for employee selection                     | It matches the API's department-manager scope and already exists in the project                         |
| Omit the role picker in the first UI version                                              | The API documentation explicitly recommends relying on the backend default role                         |
| Add model-backed action helpers for edit and delete availability                          | This keeps templates simple and centralizes date-based business rules                                   |

## Errors Encountered

| Error                                                        | Attempt | Resolution                                                                 |
| ------------------------------------------------------------ | ------- | -------------------------------------------------------------------------- |
| `apply_patch` context mismatch while updating `task_plan.md` | 1       | Re-read the file and reapplied a narrower patch with exact current context |
| `apply_patch` bulk creation failed due corrupted patch data  | 1       | Split the implementation into smaller patches and retried file creation    |
| `npm run build` failed because Windows-native packages were installed in `node_modules` | 1 | Verified the feature with `tsc --noEmit`; full Angular build needs platform-correct dependency install |

## Notes

- Re-read this plan before major decisions.
- Record API/UX findings in findings.md after exploration.
- Keep edits aligned with the existing Angular CRUD base classes and conventions.
- `tsc -p tsconfig.app.json --noEmit` passed after implementation.
- `npm run build` is blocked by WSL/Windows native dependency mismatch in `node_modules` (`esbuild` and `lightningcss`).
