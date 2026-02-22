# V0.9 Dark Mode Support

| Status | Set On |
|--------|--------|
| Draft | 2026-02-22 |
| Active | 2026-02-22 |

## Context

### Situation

Skiploom's frontend is a React 19 + TypeScript SPA using Tailwind CSS v4.1.18. All ~13 custom components use hardcoded Tailwind utility classes for colors — blue (primary), slate (neutral), red (danger), green (success), and white backgrounds. There is no theme system, no CSS variables, and no design tokens. The app renders identically regardless of the user's OS color scheme preference.

### Opportunity

Users with dark OS preferences see a bright white interface that does not respect their system setting. Tailwind CSS v4's `dark:` variant supports `prefers-color-scheme` out of the box — the infrastructure is already present in the framework, just not used.

### Approach

Use Tailwind v4's default `dark:` variant (`prefers-color-scheme` media query) to add dark mode support. Each component gains additive `dark:` utility classes alongside existing light classes. The browser applies dark styles automatically when the OS preference is dark. A passive sun/moon icon in the header indicates the active color scheme — informational only, not a toggle.

No CSS configuration changes are needed. `@import "tailwindcss"` in `index.css` already activates the `dark:` variant. No backend changes. No new dependencies.

#### Alternatives not chosen

- **Class-based toggle** — Adds a theme toggle component, `@custom-variant` CSS override, localStorage persistence, `matchMedia` listener, and a flash-of-wrong-theme prevention script. Per-app theme toggling is unnecessary for ~5 users who can control their OS preference directly. Violates YAGNI.
- **CSS custom properties theme system** — Replaces all Tailwind utility classes with semantic CSS variable references. Disproportionate refactoring effort for a light/dark switch that Tailwind's built-in `dark:` variant handles natively. Departs from idiomatic Tailwind usage.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark mode activation | `prefers-color-scheme` (Tailwind v4 default) | Zero configuration. Browser-native. Users control it via OS settings. Stepping stone to class-based toggle if demand emerges. |
| Theme indicator | Passive sun/moon icon in header | Communicates active mode without introducing interaction logic. Consistent with FLUX (view reflects state). |
| Feature flag | Not used | Dark mode via system preference is not a gradually-rollable feature. CSS-only change with no backend impact. Revert commit is simpler than flag lifecycle overhead. |

## Goals

- All components render appropriately in both light and dark color schemes
- Dark mode activates automatically based on OS `prefers-color-scheme` preference
- A passive sun/moon icon in the header indicates the active color scheme
- Consistent color palette mapping across all components

## Non-Goals

- User-controlled theme toggle (users control via OS settings)
- CSS custom properties or design token system
- Feature flag gating
- Backend changes
- Per-component theme testing (E2E smoke test covers integration)

## Exit Criteria

- [ ] Layout page background and header render correctly in dark mode
- [ ] Error and success banners render correctly in dark mode
- [ ] Card, Button, ButtonLink, and BackLink components render correctly in dark mode
- [ ] All recipe content components (RecipeCard, RecipeDetail, RecipeForm, RecipeList, IngredientList, StepList) render correctly in dark mode
- [ ] Form inputs (text, number, textarea) have appropriate dark backgrounds and borders
- [ ] Step number circles maintain visual contrast in dark mode
- [ ] Passive sun/moon icon in header indicates the active color scheme
- [ ] E2E smoke test validates dark mode rendering via Playwright `emulateMedia`
- [ ] All existing unit tests pass
- [ ] All existing E2E tests pass

## References

- [Milestone: V0.9 Dark Mode Support](https://github.com/travisfrels/skiploom/milestone/4)
- [Issue #104: Create V0.9 Dark Mode Support project definition](https://github.com/travisfrels/skiploom/issues/104)
- [Issue #100: Add dark mode foundation and Layout dark styling](https://github.com/travisfrels/skiploom/issues/100)
- [Issue #101: Add dark mode to shared UI components](https://github.com/travisfrels/skiploom/issues/101)
- [Issue #102: Add dark mode to recipe content components](https://github.com/travisfrels/skiploom/issues/102)
- [Issue #103: Add E2E dark mode smoke test](https://github.com/travisfrels/skiploom/issues/103)

### Follow-Up Issues

### Pull Requests

- [PR #105: #104 Create V0.9 Dark Mode Support project definition](https://github.com/travisfrels/skiploom/pull/105)
- [PR #106: #100 Add dark mode foundation and Layout dark styling](https://github.com/travisfrels/skiploom/pull/106)
- [PR #107: #101 Add dark mode to shared UI components](https://github.com/travisfrels/skiploom/pull/107)
- [PR #108: #102 Add dark mode to recipe content components](https://github.com/travisfrels/skiploom/pull/108)
- [PR #109: #103 Add E2E dark mode smoke test](https://github.com/travisfrels/skiploom/pull/109)

### Design References

- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode)
