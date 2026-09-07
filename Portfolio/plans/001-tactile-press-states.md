# 001 — Tactile Press States for CTA and Theme Toggle

- **Status**: DONE
- **Commit**: 0fbaece
- **Severity**: MEDIUM
- **Category**: Feedback
- **Estimated scope**: 1 file (ayan-nazm-portfolio.html)

## Problem

The primary CTA button (`.btn`) and the theme toggle (`.theme-toggle`) lack tactile press states. This makes them feel "flat" - the user receives no physical feedback upon interaction, and the generic `transition: all 0.2s` on the theme toggle is unoptimized.

```css
/* ayan-nazm-portfolio.html:324 — current */
.btn {
  transition: background 0.2s, transform 0.2s;
}

/* ayan-nazm-portfolio.html:103 — current */
.theme-toggle {
  transition: all 0.2s;
}
```

## Target

Implement distinct tactile press states.

```css
/* target */
.btn {
  transition: background 160ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
}
@media (hover: hover) and (pointer: fine) {
  .btn:active { transform: scale(0.97); }
}

.theme-toggle {
  transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1), background-color 180ms cubic-bezier(0.23, 1, 0.32, 1);
}
.theme-toggle:active { transform: scale(0.92); }
```

## Repo conventions to follow

- Use `cubic-bezier(0.23, 1, 0.32, 1)` for outbound ease-out interactions.
- Scope hover-specific transforms to `@media (hover: hover) and (pointer: fine)`.
- Use specific properties in `transition` instead of `all`.

## Steps

1. In `ayan-nazm-portfolio.html`, find `.btn` (line ~324) and update `transition` property and add `:active` state within the specified media query.
2. In `ayan-nazm-portfolio.html`, find `.theme-toggle` (line ~103) and update `transition` property to `transform 180ms cubic-bezier(0.23, 1, 0.32, 1), background-color 180ms cubic-bezier(0.23, 1, 0.32, 1)` and add the `:active` state.

## Boundaries

- Do NOT touch other components.
- Do NOT change markup.

## Verification

- **Feel check**: Click the call-to-action button and theme toggle. Confirm they perceptibly scale down locally and instantly, and feel responsive.
- Done when the button and toggle feel tactile and robust.
