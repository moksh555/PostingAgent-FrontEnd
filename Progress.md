# Frontend — progress since last commit

Frontend-only delta log. Baseline refers to **the parent repo’s** last commit that touched this workstream.

**Baseline (last commit):** `69e9100` — _added tools for llm_  
**Current:** working tree (uncommitted) — update this file whenever you want a snapshot; after you **commit**, replace the baseline above and start a fresh step list (or move old steps to an appendix with a date).

---

## New application (currently **untracked** in the parent repo)

Whole `Frontend/` tree is new relative to baseline `69e9100`. Steps below are the logical order of what was built:

1. **Scaffold** — Vite + React 19 + TypeScript, ESLint, `@vitejs/plugin-react`.
2. **Styling** — Tailwind CSS v4 with `@tailwindcss/vite`; global styles in `src/index.css`.
3. **Routing** — `BrowserRouter` in `main.tsx`; `Routes` / nested `/dashboard` with `form`, `output`, `pastRun` child routes in `App.tsx`.
4. **Layout** — `PageHeader` with `NavLink` active state; sticky header.
5. **Theme** — `<html class="dark">` by default; `src/lib/theme.ts` (`initTheme`, `setTheme`, `toggleTheme`) + `initTheme()` in `main.tsx`; `@custom-variant dark` for class-based dark mode; light/dark body gradients (black/white only).
6. **Global fixes** — `surface-invert`, `surface-outline`, `surface-revert`, `surface-revert-outline` in CSS so inverted buttons/links keep correct text color in dark mode; global `a` rules use `:where()` so utilities win.
7. **Decorative utilities** — `bg-grid`, `bg-dots`, `bg-aurora`, `.shimmer`, `.dash-march`, `prefers-reduced-motion` cuts animation.
8. **Home page** — hero (grid + aurora + headline + CTAs), stats strip, pipeline with `ShortCard`, bento feature grid, stream preview mock, bottom CTA banner.
9. **UI modularization** — extracted reusable pieces under `src/components/ui/` (`Button`, `Pill`, `Eyebrow`, `SectionHeader`, `FeatureCard`, `StatGrid`, `StreamPreview`, `CTABanner`, `ShortCard`, `index.ts` barrel); `HomePage` composes them.
10. **Docs in Frontend** — `plan.md` (target module layout); this **`Progress.md`** (delta since last commit).

---

## How to keep this file useful

1. Before a PR or release, fill in the steps above (or run `git diff`/inspect status).
2. **After you commit**, set **Baseline** to the new `HEAD` and clear the step list—or copy this block to **`CHANGELOG.md`** / **`docs/sessions/YYYY-MM-DD.md`** and reset.
