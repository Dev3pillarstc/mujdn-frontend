# Findings

## 2026-04-26

- `src/views/features/temporary-role-assignment/temporary-role-assignment-popup/temporary-role-assignment-popup.component.ts`
  already keeps `dateFrom` and `dateTo` synchronized with separate `timeFrom` and `timeTo` UI controls.
- `src/model-interceptors/features/temporary-role-assignment.interceptor.ts`
  currently calls `toDateTime()` during send, which returns a `Date` object and does not serialize the combined value for the backend.
- `src/views/features/lookups/work-shifts/work-shifts-list-popup/work-shifts-list-popup.component.ts`
  uses explicit outbound conversion in `prepareModel`, which is the reference pattern for turning UI values into backend-safe strings.
- `src/utils/general-helper.ts`
  has date-only and time-only helpers, but no reusable formatter for a `Date` -> `yyyy-MM-dd HH:mm:ss` style string.
- The popup had a behavioral gap: default or previously selected times were not guaranteed to be re-applied when the date picker changed later, which could leave `dateFrom`/`dateTo` at midnight.
- The repo had timezone helper names and usages already (`convertUtcToSystemTimeZone`, `convertKsaToUtc`), but the implementation was a zero-offset placeholder.
- There was no configured system/business timezone in the runtime config, so helper logic could not distinguish browser-local time from business time.
