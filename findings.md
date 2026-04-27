# Findings & Decisions

## Requirements
- Update all PDF export pages so the downloaded filename follows the active UI language.
- Match the department list pattern where Arabic UI yields an Arabic filename and English UI yields an English filename.
- Check the referenced files and any other page that includes PDF export.

## Research Findings
- `BaseListComponent` owns the common `exportPdf` flow and has a default `getPdfFileName()` returning `data.pdf`.
- Most export buttons currently pass hardcoded English filenames from templates.
- `department-list.component.html` already passes a localized value using `getTranslatedDepartmentLabel() + '.pdf'`.
- `my-shifts.component.ts` already overrides `getPdfFileName()` with a translated label, which suggests the shared export flow can support localized names cleanly.
- There is also a direct `jsPDF` save in `qrcode-visit-request-popup.component.ts` that uses a hardcoded English filename.
- Existing page headings already expose the right translation keys for almost every export page, so filenames can follow the visible page label without adding new labels everywhere.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Inspect the shared export path before patching templates | A central fix may reduce repetition and future drift |
| Treat direct `jsPDF.save(...)` usage as part of the scope | The user asked for all pages that include PDF export |
| Add a reusable filename helper in `BaseListComponent` and swap hardcoded template names to translation keys | Keeps page-specific labels accurate while avoiding repeated string concatenation logic |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `session-catchup.py` produced no actionable output | Proceeded as a fresh planning session |
| `npm run build` could not complete in this Linux environment | The workspace `node_modules` is installed for Windows (`@esbuild/win32-x64`) and also lacks `lightningcss.linux-x64-gnu.node`, so verification stopped before Angular template compilation |

## Resources
- `src/abstracts/base-components/base-list/base-list.component.ts`
- `src/views/features/department/department-list/department-list.component.ts`
- `src/views/features/department/department-list/department-list.component.html`
- `public/assets/i18n/ar.json`
- `public/assets/i18n/en.json`
- `src/abstracts/base-components/base-list/base-list.component.ts`

## Visual/Browser Findings
- No browser work performed.
