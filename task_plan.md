# Task Plan: Split Shift Attendance and Leave Buffers

## Goal
Update the Angular work-shift flow from one attendance buffer and one leave buffer to four directional buffers, following `shift-buffer-frontend-guide.md`, including all related display, form, payload, and frontend calculation code.

## Phases
- [x] Phase 1: Read the backend guide and inventory every current buffer reference.
- [x] Phase 2: Define the four-field mapping, validation, display, and calculation changes.
- [x] Phase 3: Implement focused model/component/template/translation changes.
- [x] Phase 4: Run targeted searches, TypeScript/build checks, and review the diff.

### Phase 1: Guide and inventory
**Status:** complete

### Phase 2: Four-field design
**Status:** complete

### Phase 3: Implementation
**Status:** complete

### Phase 4: Verification
**Status:** complete

## Guardrails
- Preserve unrelated user changes in the dirty worktree.
- Follow the established Angular CRUD architecture and naming conventions.
- Do not retain legacy buffer fields unless the backend guide explicitly requires compatibility.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---:|---|
| Initial `git diff --stat` inspection produced no useful output within the yield window. | 1 | Switched to scoped status and file reads; no task files existed. |
| `git diff --check` reported every CRLF line as trailing whitespace in this pre-existing CRLF working tree. | 1 | Used whitespace-insensitive scoped diffs and successful compilation instead. |
| Prettier reflowed unrelated markup/documentation in two touched files. | 1 | Restored their baseline content and reapplied only the buffer-specific hunks. |
| Planning completion script detected zero phases because the initial plan used checklist syntax rather than its required heading/status format. | 1 | Added the script-compatible phase sections without repeating the failed format. |

## Current Status
Complete.
