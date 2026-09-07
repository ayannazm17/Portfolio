# Plans — Animation Improvements

## Status Table

| # | Title | Severity | Category | Status |
|---|---|---|---|---|
| 001 | Tactile Press States for CTA and Theme Toggle | MEDIUM | Feedback | DONE |

## Recommended Execution Order

1. 001 — Tactile press states (prerequisite: none; standalone feedback fix)

## Dependencies

None between plans. Plan 001 is independent and can be executed in isolation.

## Notes

- Each plan is self-contained per `PLAN-TEMPLATE.md`; an executor with zero session context should be able to implement from the file alone.
- Execution path: `improve-animations execute <plan>` (dispatches to isolated worktree + review).
