# Frontend — progress since last commit

Frontend-only delta log. Baseline refers to **the parent repo’s** last commit that touched this workstream.

**Baseline (last commit):** `69e9100` — _added tools for llm_  
**Current:** working tree (uncommitted) — refresh this file at milestones; after you **commit**, bump **Baseline** to `HEAD` and start new stages (or archive this block with a date).

---

Whole **`Frontend/`** tree is new relative to baseline `69e9100`. Below is the work grouped by **stage** (dependency order).

## Stage 1 — Foundation

- Vite + React 19 + TypeScript, ESLint, `@vitejs/plugin-react`.
- Tailwind CSS v4 + `@tailwindcss/vite`; global styles in `src/index.css`.
- `BrowserRouter` in `main.tsx`; nested `/dashboard` routes wired in `App.tsx` (structure evolves in later stages).
- `PageHeader` (marketing) with `NavLink`; sticky header.
- Theme: `src/lib/theme.ts` (`initTheme`, `setTheme`, `toggleTheme`), default `html.dark`, `@custom-variant dark`, light/dark body gradients (black/white only).
- Surface utilities (`surface-invert`, `surface-outline`, `surface-revert`, …); global `a` via `:where()` so utilities win.
- Decorative helpers: `bg-grid`, `bg-dots`, `bg-aurora`, `.shimmer`, `.dash-march`; `prefers-reduced-motion` respected.

## Stage 2 — Marketing home + UI kit

- **`HomePage`**: hero, stats strip, pipeline `ShortCard`s, bento grid, stream preview mock, bottom CTA.
- **`src/components/ui/`**: `Button`, `Pill`, `Eyebrow`, `SectionHeader`, `FeatureCard`, `StatGrid`, `StreamPreview`, `CTABanner`, `ShortCard`, barrel `index.ts`.

## Stage 3 — Design documentation

- **`design/README.md`** → **`designDoc.md`**: workflow (latest **`photos/versionN.png`** → README → TEMPLATE → code).
- **`design/Dashboard/`** — New run + HITL; **`photos/version1.png`**.
- **`design/Runs/`** — run list + summary stats in spec; **`photos/version1.png`**; maps to `PastRun` / `components/runs/`.
- **`design/Overview/`** — landing (**summary strip only** in v1); **`photos/version1.png`**.
- Reference art lives under each area’s **`photos/`** (`version1.png`, …).

## Stage 4 — Dashboard app shell

- **`MarketingLayout`**: `/` keeps `PageHeader` + marketing pages.
- **`DashBoardPage`**: sidebar + `Outlet`; no top marketing header on dashboard routes.
- **`DashboardSidebar`**: brand, nav placeholders (wired in Stage 7), Logout.

## Stage 5 — New run (HITL + form)

- **`components/dashboard/`**: icons, types, `StatusPill`, `CampaignSetupForm`, `HumanReviewPanel`, `CurrentDraftReview`.
- **`FormPage`**: two-column layout (setup + review), local demo lifecycle for streaming/paused states.

## Stage 6 — Runs

- **`PastRun`**: page shell + header + stats row.
- **`components/runs/`**: `RunListStatus` / `RunSummary`, `RunStatusPill`, `RunsSummaryStats`, `RunsTable` / `RunCard` / `RunsList`, `format.ts`; sample data; `OPEN` → future detail route.

## Stage 7 — Overview + shared stats primitive

- **`StatCard`** in **`components/ui`** (shared KPI card); **`RunsSummaryStats`** composes it.
- **`OverviewPage`** + **`components/overview/OverviewSummaryStrip.tsx`** (four tiles only per Overview spec — no on-page CTAs or recent list).
- **`App.tsx`**: `/dashboard` **index** → Overview; `/dashboard/form` still New run.
- **Sidebar**: Overview → `/dashboard` with `end`; New run → `/dashboard/form` with `end`; Runs → `/dashboard/pastRun` without `end` (detail routes later).

## Stage 8 — Repo notes

- **`plan.md`** — target module layout.
- This **`Progress.md`** — staged snapshot vs parent baseline.

---

## How to keep this file useful

1. Before a PR or release, adjust stages or add **Stage N** bullets as the product grows.
2. **After you commit**, set **Baseline** to the new `HEAD` and reset or archive stages—or copy to **`CHANGELOG.md`** / **`docs/sessions/YYYY-MM-DD.md`**.
