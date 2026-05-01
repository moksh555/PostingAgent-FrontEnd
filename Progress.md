# Frontend — progress since last commit

This folder is **`PostingAgent-FrontEnd`** (its **own Git repo** — `origin` → `PostingAgent-FrontEnd.git`; `main` tracks `origin/main`). Do **not** point the baseline at the MarketingAgent **backend** mono-repo’s SHAs (`69e9100`, …); use **this** repo’s `git log`.

**HEAD** `566613caaefe294b5e80fba4c85ca184af60b626` — _resume route, snapshot hydration, multi-post carousel_

**Last two commits (changelog-style):**

| Short     | Subject                                                         |
| --------- | --------------------------------------------------------------- |
| `566613c` | feat(dashboard): resume URLs, snapshots, and multi-post review carousel |
| `edd848f` | progress update: connected last runs                            |

**Current:** after you **commit**, bump **HEAD** and the table, and extend **Stage N** below if behavior changes.

---

Earlier work below is grouped by **stage** (dependency order). **Stages 9–12** summarize recent shipped work (**Stage 12** ↔ **`566613c`** feature snapshot; **HEAD** in the banner tracks the literal Git tip).

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
- **`components/runs/`**: `RunListStatus` / `RunSummary`, `RunStatusPill`, `RunsSummaryStats`, `RunsTable` / `RunCard` / `RunsList`, `format.ts`; list wiring to live API (**Stage 10**); **`OPEN`** → **`/dashboard/resume/:threadId`** (**optional** `campaignName`, `totalPosts` query params) so refresh/share works (**Stage 12**).

## Stage 7 — Overview + shared stats primitive

- **`StatCard`** in **`components/ui`** (shared KPI card); **`RunsSummaryStats`** composes it.
- **`OverviewPage`** + **`components/overview/OverviewSummaryStrip.tsx`** (four tiles only per Overview spec — no on-page CTAs or recent list).
- **`App.tsx`**: **`/dashboard` index** → Overview; **`/dashboard/form`** New run; **`/dashboard/resume/:threadId`** resume/hydrate path (**Stage 12**).
- **Sidebar**: Overview → **`/dashboard`** with `end`; New run → **`/dashboard/form`** with `end`; Runs → **`/dashboard/pastRun`** without `end`. **`DashboardSidebar.tsx`** keeps **Runs** active when path is **`/dashboard/resume/...`**.

## Stage 8 — Repo notes

- **`plan.md`** — target module layout.
- **`Progress.md`** (this file) — staged snapshot vs Git **HEAD** in this repo.

## Stage 9 — Agent API + streaming (`1952037`)

- **`vite.config.ts`** — dev proxy toward the backend agent API.
- **`UseAgentStream.ts`** — SSE consumer for start/resume flows; **`handleStreamChunkRef`** synced in **`useEffect`** (avoid “Cannot update ref during render”); shared chunk handling.
- **`FormPage.tsx`** — real run lifecycle: campaign form → stream → `awaiting_review` → actions wired to **`/api/v1/resumeAgent`** with `threadId` + `decision` (`Accept` / `Reject` / `Regenerate` + optional notes).
- **`agentStreamNormalize.ts`**, **`types.ts`**, **`formatPipelineStepLabel.ts`** — event parsing and UI labels.
- **`HumanReviewPanel`**, **`CurrentDraftReview`**, **`CampaignSetupForm`** — review UI (e.g. regenerate requires feedback); **post carousel** (prev/next, gated actions — **Stage 12**).
- **`StateLessApiClient.ts`**, **`ServicesAgent.ts`**, **`.env.production`**, **`vite-env.d.ts`** — API base URL and env typing.

## Stage 10 — Past runs listing + row normalization (`094f681`)

- **`ServicesAgent.ts`** — **`getUserThreadStates`**, **`normalizeUserThreadStateRow`**, **`threadsListErrorMessage`**, **`getAgentThreadSnapshot`**; **`GET /api/v1/getUserThreadStates/:userId`**, **`GET /api/v1/agentThreadSnapshot/:thread_id`**; maps backend **`Paused` / `Assigned` / `Completed`** → UI statuses; sorts by **`startedAt`** desc.
- **`PastRun.tsx`** — **`useEffect`** load with **`VITE_DEV_USER_ID`** ( **`configurations/.env.local`** ); loading / empty / FastAPI **`AppError`**-shaped Axios payloads (`message`); **`buildStats`** on live rows.
- **`types.ts` (`runs`)** — **`RunSummary`** shape matches **`RunsTable`** / **`RunCard`** (**`id`**, **`startedAt`**, **`url`**, **`postsDone`**, **`postsTotal`**, **`threadId`**).
- **`RunStatusPill.tsx`** — three pill labels aligned with API (**Assigned / Paused — review / Completed**).
- **`ApiClient.ts`** — **`VITE_BASE_URL`** ( **`envDir`** = **`configurations/`** ).
- **`FormPage.tsx`** — **`location.state.resumeThreadId`** bridged via **`startTransition`** for **`/dashboard/form`** legacy path; primary resume is **`/dashboard/resume/:threadId`** + snapshot (**Stage 12**).

## Stage 11 — README (`c5da19d`)

- **`README.md`** — project purpose (dashboard, streaming agent, HITL), stack table (React / Vite / Tailwind / Router / Axios), dev scripts, proxy + env pointers.

## Stage 12 — Resume URL, snapshot hydration, post carousel (`566613c`)

- **`services/ServicesAgent.ts`** — **`getAgentThreadSnapshot`**; **`GET /api/v1/agentThreadSnapshot/:thread_id`** (`thread_id`); types for snapshot body + checkpoints.
- **`FormPage.tsx`** — **`resume`** URL segment + optional **`campaignName`** / **`totalPosts`** queries; hydrate from **`getAgentThreadSnapshot`**; **`buildCampaignSlidesFromResultBody`**, **`campaignSlides`** / **`postViewerIndex`**, **`effectiveViewerIndex`**; clear carousel/thread state on navigate, error, new start, cancel, or mismatched resume.
- **`campaignPosts.ts`** — checkpoint **`posts`** + pending **`draft`** → ordered slides.
- **`HumanReviewPanel`**, **`CurrentDraftReview`** — chevron prev/next, browse hint; **Accept/Reject/Regenerate** only on the pending slide when actions apply.
- **`icons.tsx`** — chevron icons for carousel controls.

---

## How to keep this file useful

1. Before a PR or release, adjust stages or add **Stage N** bullets as the product grows.
2. **After you commit**, update **HEAD**, the commit table at the top, and **Stage N** bullets (or archive old stages)—or copy to **`CHANGELOG.md`** / **`docs/sessions/YYYY-MM-DD.md`**.
