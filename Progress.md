# Frontend — progress since last commit

This folder is **`PostingAgent-FrontEnd`** (its **own Git repo** — `origin` → `PostingAgent-FrontEnd.git`; `main` tracks `origin/main`). Do **not** point the baseline at the MarketingAgent **backend** mono-repo’s SHAs (`69e9100`, …); use **this** repo’s `git log`.

**HEAD** `195203711dc6766bd3fda8eef1b110cfbe8cbab8` — _connected to apis_

**Previous two commits (for changelog-style context):**

| Short     | Subject                                                            |
| --------- | ------------------------------------------------------------------ |
| `1952037` | connected to apis                                                  |
| `0819713` | update progress.md: made readme file for cursor agent to work with |

**Current:** working tree (uncommitted changes may exist outside the last push) — after you **commit**, refresh the table above and add **Stage N** bullets.

---

Earlier work below is grouped by **stage** (dependency order). **Stage 9** matches the latest pushed commit (`1952037`).

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
- **`Progress.md`** (this file) — staged snapshot vs Git **HEAD** in this repo.

## Stage 9 — Agent API + streaming (`1952037`)

- **`vite.config.ts`** — dev proxy toward the backend agent API.
- **`UseAgentStream.ts`** — SSE consumer for start/resume flows; shared chunk handling.
- **`FormPage.tsx`** — real run lifecycle: campaign form → stream → `awaiting_review` → actions wired to **`/api/v1/resumeAgent`** with `threadId` + `decision` (`Accept` / `Reject` / `Regenerate` + optional notes).
- **`agentStreamNormalize.ts`**, **`types.ts`**, **`formatPipelineStepLabel.ts`** — event parsing and UI labels.
- **`HumanReviewPanel`**, **`CurrentDraftReview`**, **`CampaignSetupForm`** — review UI and validation (e.g. regenerate requires feedback).
- **`StateLessApiClient.ts`**, **`agentServices.ts`**, **`.env.production`**, **`vite-env.d.ts`** — API base URL and env typing.

---

## How to keep this file useful

1. Before a PR or release, adjust stages or add **Stage N** bullets as the product grows.
2. **After you commit**, update **HEAD**, the commit table at the top, and **Stage N** bullets (or archive old stages)—or copy to **`CHANGELOG.md`** / **`docs/sessions/YYYY-MM-DD.md`**.
