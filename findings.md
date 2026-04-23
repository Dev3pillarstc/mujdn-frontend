# Findings & Decisions

## Requirements
- Replace frontend PDF generation with backend `/ExportPdf` downloads.
- Send `Language=ar` or `Language=en` as a query parameter.
- Send the current filtered list criteria in the POST body, matching the paging filter body used by list retrieval.
- Apply the change generically across lookup pages through the shared base list abstraction.
- Preserve current file download UX and no-data/error handling where practical.

## Research Findings
- [`src/abstracts/base-components/base-list/base-list.component.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/base-components/base-list/base-list.component.ts:354) currently generates PDFs in the browser with `jspdf` and `jspdf-autotable` after fetching all rows via `loadPaginated` or `loadPaginatedSP`.
- [`src/abstracts/base-crud-service.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/base-crud-service.ts:80) already centralizes list POST calls and has direct access to `HttpClient`, `HttpParams`, and each service's `getUrlSegment()`.
- Lookup list screens such as [`city-list.component.ts`](/mnt/e/mjd/mujdn-frontend/src/views/features/lookups/city/city-list/city-list.component.ts:36) inherit `BaseListComponent` without custom PDF behavior, so the shared export change will cover them automatically.
- `my-shifts` is the only lookup screen under `src/views/features/lookups` with a custom `exportPdf` override, so it needed a targeted change after the shared lookup-base refactor.
- The repository is in a very dirty state with widespread formatting or line-ending diffs, so edits must stay tightly scoped.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Add a generic PDF export method to `BaseCrudService` | The service layer already owns endpoint URLs and HTTP details, making it the right place to POST filters and receive a PDF blob |
| Keep the public `exportPdf(fileName, isStoredProcedure)` API in `BaseListComponent` | Templates already call this signature across the app, so preserving it avoids broad template churn |
| Export using the applied filter model, not raw form state | The user asked to export the data already filtered on the page, which corresponds to `_appliedFilterModel` |
| Add `BaseLookupListComponent` that opts lookup pages into backend PDF export | Avoids changing non-lookup lists that still depend on the frontend jsPDF implementation |
| Use a dedicated `downloadBlobData` helper for backend PDFs | Preserves normal browser download behavior and supports the caller-provided filename |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `git diff --stat` shows a large pre-existing dirty worktree | Work only in the minimal files needed for this task and do not revert unrelated changes |
| `apply_patch` initially rewrote edited TS files with CRLF | Ran a targeted normalization pass to restore LF and keep the diff readable |

## Resources
- [`src/abstracts/base-components/base-list/base-list.component.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/base-components/base-list/base-list.component.ts:1)
- [`src/abstracts/base-components/base-list/base-lookup-list.component.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/base-components/base-list/base-lookup-list.component.ts:1)
- [`src/abstracts/base-crud-service.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/base-crud-service.ts:1)
- [`src/abstracts/lookup-base.service.ts`](/mnt/e/mjd/mujdn-frontend/src/abstracts/lookup-base.service.ts:1)
- [`src/utils/utils.ts`](/mnt/e/mjd/mujdn-frontend/src/utils/utils.ts:1)
- [`src/views/features/lookups/city/city-list/city-list.component.ts`](/mnt/e/mjd/mujdn-frontend/src/views/features/lookups/city/city-list/city-list.component.ts:1)
- [`src/services/features/lookups/city.service.ts`](/mnt/e/mjd/mujdn-frontend/src/services/features/lookups/city.service.ts:1)

## Visual/Browser Findings
- No browser or image inspection was needed; this task is driven by Angular source and API contract details from the user.
