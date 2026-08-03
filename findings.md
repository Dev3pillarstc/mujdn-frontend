# Findings: Shift Buffer Split

## Repository State
- The worktree already contains broad unrelated modifications. All edits for this task must be scoped and reviewed with whitespace-insensitive diffs if needed.

## Guide Requirements
- Remove `attendanceBuffer` and `leaveBuffer` entirely; the API rejects unknown legacy JSON properties.
- Add `beforeAttendanceBuffer`, `afterAttendanceBuffer`, `beforeLeaveBuffer`, and `afterLeaveBuffer` everywhere shift buffer data is modeled, sent, mapped, calculated, or displayed.
- Create forms must initialize all four fields to `0`; edit forms bind each API value independently.
- Values are numeric minute counts and must reject negative values.
- Employee current-shift, shift-history, and employee-shift-day responses return the same four fields.
- Search the entire frontend for old properties and remove every occurrence.

## Current Implementation
- `Shift.buildForm()` currently declares and validates only `attendanceBuffer` and `leaveBuffer`.
- `EmployeeShift` and `EmployeeShiftDay` expose the same two legacy fields.
- The work-shift popup uses the attendance value to extend before start and the leave value to extend after end in overlap/day-boundary calculations.
- List table/export, work-day details, my-shift mapping, and shift-view mapping still read the legacy properties.
- Existing translations contain only generic attendance/leave buffer labels.
- A full repository search found additional legacy reads in the shared `crossDateShiftEndNotPassNextDayStart` validator and the global header current-shift display.
- `shift-frontend-migration.md` contains legacy example JSON; it is documentation, not runtime code, but the guide checklist asks the frontend repository to contain no old properties.
- The popup duplicates the shared cross-day validator locally. Both currently define the outer permitted event span as scheduled duration plus the pre-attendance and post-leave margins.
- The list and Excel export currently have two buffer columns; these must become four independent columns.
- Current-shift/header and work-day detail UI each show two generic buffer values and must show the four directional values returned by their APIs.
- `my-shifts-view` and `shifts-view` manually copy `EmployeeShiftDay` into `EmployeeShift`; these mappings must copy all four values independently.
- Interceptors do not explicitly map buffer properties, so the model decorators will preserve the new camel-case API fields without interceptor changes.
- The active popup uses a local cross-day validator; the similarly named exported shared validator is currently unused but still contains legacy property names and must be updated to satisfy the repository-wide removal requirement.
- Translation changes are needed under `WORK_SHIFTS`/`WORK_SHIFTS_POPUP` for list/form labels and under `MY_SHIFTS` for detail/current-shift labels.
- `CustomValidators.positiveNumber()` permits zero and rejects negative/non-numeric values, matching the new field requirements; each new control can reuse it plus the existing 60-minute maximum.
- The popup's four config-derived min/max members are unrelated and unused; form inputs currently hard-code the model validator range of 0–60.

## Implementation Decisions
- Each allowed event interval will be modeled directionally: attendance `[timeFrom - beforeAttendanceBuffer, timeFrom + afterAttendanceBuffer]` and leave `[timeTo - beforeLeaveBuffer, timeTo + afterLeaveBuffer]`.
- The buffered shift span used by the 24-hour validator and day-boundary calculation will be the earliest start/latest end across both intervals. This consumes all four values without incorrectly treating the two inward-facing buffers as extra shift duration.
- New forms will use `value ?? 0` so only absent values default to zero while edit values remain independent.
- All four table/export/detail labels will be explicit “before”/“after” labels in English and Arabic.

## Verification
- Repository-wide runtime search has zero exact references to `attendanceBuffer` or `leaveBuffer`.
- English and Arabic translation files parse as valid JSON.
- Production Angular build completes successfully.
- Remaining build output is limited to the repository's existing bundle-budget and CommonJS optimization warnings.
- Whitespace-insensitive diff review confirms the final edits are scoped to the four-buffer contract and related displays/calculations.
