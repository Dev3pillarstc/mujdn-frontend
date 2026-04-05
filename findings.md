# Findings & Decisions

## Requirements

- Implement temporary management role assignment in the Angular app.
- Follow the layered CRUD architecture used across the project.
- Use the City feature as the reference for file structure and UI/UX behavior.
- Update routes, sidebar links, and Arabic/English translations.
- Base the implementation on `TemporaryRoleAssignments-Api.md`.

## Research Findings

- No prior session context was found by the planning skill catch-up script.
- No existing temporary-role-assignment frontend implementation was found under `src`.
- `TemporaryRoleAssignments-Api.md` defines CRUD endpoints under `/api/TemporaryRoleAssignments` with a `POST /GetWithPaging` listing endpoint.
- The row model includes `fkUserProfileId`, optional `fkRoleId`, `dateFrom`, `dateTo`, `userFullNameAr`, `userFullNameEn`, `roleName`, `isCurrentlyActive`, `id`, and `concurrencyUpdateVersion`.
- Frontend behavior constraints from the API doc:
  - Create requires `fkUserProfileId`, `dateFrom`, `dateTo`; `fkRoleId` can be omitted.
  - Update always requires `id` and `concurrencyUpdateVersion`.
  - Started active records can only change `dateTo`.
  - Past records or records ending today cannot be updated.
  - Delete is allowed only when `dateFrom` is in the future.
- The first UI version can omit a role picker and rely on the backend default role.
- The City feature model pattern:
  - extends `BaseCrudModel<Entity, Service>`
  - sets `$$__service_name__$$`
  - uses `@InterceptModel({ send, receive })`
  - exposes a `buildForm()` method with Angular validators
- The City service pattern:
  - extends `BaseCrudService<Entity>`
  - sets `serviceName`
  - overrides `getUrlSegment()`
  - uses `@CastResponseContainer` with `$default` and `$pagination` mappings
  - may expose additional lookup endpoints with explicit casting
- The City resolver pattern preloads `loadPaginated(new PaginationParams())` and swallows failures with `catchError(() => of(null))` so the route can still activate.
- The City filter model is minimal and maps directly to the list screen filter inputs.
- The City list component pattern:
  - extends `BaseListComponent<Model, Popup, Service, Filter>`
  - provides the feature service locally
  - defines `filterModel`
  - fetches auxiliary lookups in `initListComponent()`
  - opens the popup via `openBaseDialog(...)`
  - uses a breadcrumb + filter card + table card layout
  - exposes add, edit, delete, export, search, reset, and pagination behaviors
- The City popup pattern:
  - extends `BasePopupComponent<Model>`
  - reads `model`, `viewMode`, and `lookups` from `MAT_DIALOG_DATA`
  - builds the form from `model.buildForm()`
  - shows validation messages next to controls
  - uses project button/input/select styles and a simple footer with cancel/save actions
- Feature routes are registered centrally in `src/routes/app.routes.ts` with:
  - `canActivate: [authGuard]`
  - `data.roles`
  - `data.routeId`
  - a resolver for list-style pages
  - a lazy `loadComponent`
- Sidebar entries are registered in `src/services/shared/side-bar-links.service.ts` through `rawMenuConfig`, then filtered by route permissions and translated label keys.
- Lookup/admin-style pages like Cities live under the `MENU.SETTINGS` group in the sidebar.
- `src/enums/route-ids-enum.ts` is the enum source backing both route definitions and sidebar items; a new feature route likely needs a new enum member.
- Existing reusable pieces likely relevant to this feature:
  - `CustomValidators.validateDateRange` logic in `src/validators/custom-validators.ts`
  - `userProfileService.getLookup()` usage in `src/resolvers/business/work-missions.resolver.ts`
  - existing datepicker styling in `src/rtl.scss`
- `UserProfileService` already extends `LookupBaseService` and inherits the generic `getLookup()` pattern through `URLS.USERS`, so it can likely supply employee options without creating a new service.
- Existing list screens use PrimeNG `p-select` with `BaseLookupModel[]` and language-aware `optionLabel` properties (`nameAr` / `nameEn`) for user-driven filters.
- Existing date filters use PrimeNG `p-datepicker` with `showIcon`, `showClear`, and the shared calendar icon template.
- Some list UIs gate row actions with model-derived booleans such as `visit.isEditable`; temporary role assignments can follow the same approach for edit/delete availability.
- `BaseCrudService.loadPaginated()` already posts to `/<segment>/GetWithPaging` with query-string pagination and date-only filter normalization, which matches the temporary role assignment API.
- `BaseCrudService` also already provides the standard `create`, `update`, `delete`, and `getById` calls needed for this feature.
- URL strings are centralized through `src/constants/endpoints` and surfaced by `UrlService`; the new feature will require an endpoint constant there rather than changes in `UrlService` itself.
- `RouteIdsEnum` currently has no temporary-role-assignment entry.
- Endpoint constants live in `src/constants/endpoints.ts`; there is no existing temporary-role-assignment endpoint key.
- Translation files have top-level grouped sections such as `COMMON`, `CITIES_PAGE`, and `MENU`, so the new feature should follow the same grouped-key structure in both `en.json` and `ar.json`.
- `en.json` already contains analogous wording in `USER_WORK_SHIFT_ASSIGNMENT` and `USER_WORK_SHIFT_PAGE` for employee/date-related labels that can guide naming consistency.
- The existing `dateRangeValidator` in `src/validators/custom-validators.ts` validates a form group using hardcoded control names `startDate` and `endDate`, so it is not a direct fit for `dateFrom` / `dateTo` without adaptation.
- `UserService` already exposes `getMyDepartmentUsersLookup()`, which is a better fit than a generic user lookup for a department-manager-only temporary role assignment popup.
- `UserService.getMyDepartmentUsersLookup()` calls `/userprofiles/myDepartmentUsersLookup` and returns `UsersWithDepartmentLookup[]`.
- `UsersWithDepartmentLookup` extends `BaseLookupModel`, so the popup can use the usual localized `nameAr` / `nameEn` option labels while still having `departmentId` and `nationalId` available if needed.
- `BaseLookupModel.id` is numeric, so `fkUserProfileId` should be modeled as `number`.
- Existing date-heavy CRUD features convert date fields in interceptors using `toDateTime` on receive and `toDateOnly` on send; the temporary role assignment model should follow that pattern for `dateFrom` and `dateTo`.
- The relevant shared date helpers are `toDateOnly` and `toDateTime` from `src/utils/general-helper.ts`.
- The shared validation message component already knows the `startAfterEnd` error key, so the popup can reuse the standard translated start/end-date error message.
- The new route fits alongside the other business and department-manager pages and was registered as `/temporary-role-assignments` with `ROLES_ENUM.DEPARTMENT_MANAGER`.
- The new sidebar item fits best as a top-level entry near work missions and work shifts instead of under Settings.
- The implemented frontend now includes:
  - a dedicated temporary role assignment model/filter/interceptor/service/resolver
  - a City-style list page with employee/date filters, Excel export, and date-driven action states
  - a popup that locks employee and `dateFrom` once the assignment has started and validates the end date
  - route, sidebar, endpoint, and translation wiring
- Code-level verification passed with `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit`.
- Full `npm run build` is currently blocked by platform-mismatched native packages in `node_modules` (`@esbuild/win32-x64` present under Linux/WSL, plus missing Linux `lightningcss` binary).
- `BaseListComponent` already covers:
  - resolver-backed initial list loading
  - filter application/reset
  - paginator state
  - export-to-Excel
  - dialog open/reload flow
  - delete confirmation and post-delete reload
- `BasePopupComponent` already covers the save pipeline:
  - `beforeSave` validation gate
  - `prepareModel`
  - `model.save()`
  - `saveFail`
  - `afterSave`
    This means the feature popup only needs to enforce business rules and form setup.
- Existing popups already disable controls conditionally by mode and business state, so this feature can safely disable employee/date controls on started records while leaving `dateTo` editable.

## Technical Decisions

| Decision                                                                                                       | Rationale                                                                                                             |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Start with API doc and City feature inspection before any code changes                                         | The backend contract and the established frontend pattern determine the correct model, service, and UX implementation |
| Start with a no-role-picker UI unless City patterns or surrounding code strongly require one                   | The API doc explicitly recommends omitting `fkRoleId` in the first frontend version                                   |
| Use the standard model/service inheritance and cast-response setup used by City                                | This keeps the new feature aligned with the existing CRUD architecture and minimizes framework drift                  |
| Follow City’s resolver and list/popup composition instead of inventing a new flow                              | The user explicitly requested City as the UX and structure guide                                                      |
| Route and sidebar changes will need a new `RouteIdsEnum` entry if one does not already exist                   | Both systems use `routeId` as the shared permission/navigation key                                                    |
| Reuse existing lookup and date validation infrastructure where possible                                        | The project already has established services and validators for these concerns                                        |
| Represent edit/delete availability on the frontend model instead of scattering date logic through the template | Existing list screens already use model-backed booleans for action gating and it keeps the template simpler           |
| Use the existing `BaseCrudService` pagination flow instead of adding custom service methods                    | The API path naming already conforms to the app’s standard CRUD conventions                                           |
| Add a dedicated translation group for the feature and a matching sidebar menu key                              | That is how existing pages organize labels and navigation text                                                        |
| Implement a small feature-local date validation rule instead of forcing the shared `dateRangeValidator`        | The shared validator is bound to different control names and would need awkward workarounds                           |
| Use `UserService.getMyDepartmentUsersLookup()` for employee selection in the popup                             | It matches the department-manager scope in the API contract better than the generic user lookup                       |
| Use an interceptor to normalize `dateFrom` and `dateTo`                                                        | That matches existing date-based CRUD features and keeps the form/model types consistent                              |

## Issues Encountered

| Issue | Resolution |
| ----- | ---------- |
| Bulk `apply_patch` creation failed after corrupted patch data | Split the implementation into smaller patches and retried file creation |
| Full Angular build failed because `node_modules` contains Windows-native packages while running in Linux/WSL | Used TypeScript compile for code verification; full Angular build needs a platform-correct dependency reinstall |

## Resources

- `TemporaryRoleAssignments-Api.md`
- `src/models/features/lookups/city/city.ts`
- `src/resolvers/lookups/city.resolver.ts`
- `src/models/features/lookups/city/city-filter.ts`
- `src/services/features/lookups/city.service.ts`
- `src/model-interceptors/features/lookups/city.interceptor.ts`
- `src/views/features/lookups/city/city-list`
- `src/views/features/lookups/city/city-popup`
- `public/assets/i18n/en.json`
- `public/assets/i18n/ar.json`
- `src/routes/app.routes.ts`
- `src/services/shared/side-bar-links.service.ts`

## Visual/Browser Findings

- No browser or image inspection yet.

---

_Update this file after every 2 view/browser/search operations_
_This prevents visual information from being lost_
