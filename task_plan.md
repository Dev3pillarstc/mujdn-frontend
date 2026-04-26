# Task Plan

## Goal
Fix temporary role assignment date-range submission so the popup sends combined date+time values for `dateFrom` and `dateTo` in the configured system time zone and round-trips them correctly.

## Phases
- [completed] Inspect current popup, model, helper, and interceptor flow.
- [completed] Implement combined datetime serialization for temporary role assignment.
- [completed] Verify behavior and document results.

## Decisions
- The popup already maintains `dateFrom` and `dateTo` as full `Date` values by splicing `timeFrom` and `timeTo` into the selected dates.
- The current outbound interceptor is the main bug source because it converts values to `Date` objects instead of backend-safe strings.
- The popup also needed a sync fix so selected dates always retain the chosen/default time, even if the user changes the date after the time picker already has a value.
- The right transport format for a .NET `DateTime` backend here is ISO 8601.
- To keep behavior stable across countries, the app needs one configured business/system time zone and must convert `system time zone -> UTC ISO` on send and `UTC -> system time zone` on receive.

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| None yet | - | - |
