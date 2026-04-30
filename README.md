# Posting Agent — Frontend

Web UI for **campaign setup**, **streaming agent runs**, and **human-in-the-loop review**: start a LangGraph-backed run against the backend, stream pipeline updates + NDJSON chunks, pause at draft review (**Accept / Reject / Regenerate** with **`resumeAgent`**), browse **past runs / thread states** per user via **`getUserThreadStates`**, and skim **Overview**, **marketing home**, and design-oriented dashboard chrome.

Runs as a SPA next to FastAPI (**dev:** Vite proxies **`/api`** to the backend; env lives under **`configurations/`**, e.g. **`VITE_DEV_USER_ID`**, **`VITE_BASE_URL`**).

## Stack

| Area        | Choices |
|------------|---------|
| UI         | **React 19**, **React Router 7**, **Tailwind CSS v4** (via **`@tailwindcss/vite`**) |
| Tooling    | **Vite 8**, **TypeScript** (~6), **ESLint** + **typescript-eslint**, **eslint-plugin-react-hooks** |
| HTTP       | **Axios** |

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173 — restart after changing configurations/.env*
npm run build
npm run lint
npm run preview
```

Backend API this app talks to belongs in the **PostingAgent** (Python/FastAPI) repo
