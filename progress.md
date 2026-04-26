# Progress Log

## 2026-04-26

- Checked for previous session context with the skill catchup script; no recovery output.
- Read the temporary role assignment popup, temporary role assignment interceptor, general helper utilities, and work shifts popup reference.
- Confirmed the form layer already combines time into the date controls in memory; outbound serialization still needs implementation.
- Added `toDateTimeString()` in `src/utils/general-helper.ts` and updated the temporary role assignment interceptor to send combined datetime strings instead of `Date` objects.
- Updated the temporary role assignment popup so date changes and save-time validation both re-merge the selected/default time into `dateFrom` and `dateTo`.
- Verification: `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit` completed successfully.
- Verification note: `npm run build` started and reached Angular's `Building...` phase but did not finish within the time window.
- Revised the datetime transport to UTC ISO based on .NET `DateTime` expectations.
- Added `SYSTEM_TIME_ZONE` runtime config wiring and replaced the helper timezone placeholders with real conversions between UTC and the configured system time zone.
- Updated temporary role assignment receive/send to use the system-timezone conversion path.
