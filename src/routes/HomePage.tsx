import {
  Button,
  FeatureCard,
  Pill,
  SectionHeader,
  ShortCard,
  StatGrid,
  StreamPreview,
} from "../components/ui";
import type { Stat, StreamPreviewItem } from "../components/ui";
import { useAuth } from "../features/auth/AuthContext";
import { routes } from "../config/routes";

const steps = [
  {
    step: 1,
    title: "Paste your URL",
    description:
      "Add the product or landing page link, how many posts you want, and when the campaign should start.",
  },
  {
    step: 2,
    title: "Brief gets built",
    description:
      "The agent turns the site into a marketing brief that every post in the run will reuse.",
  },
  {
    step: 3,
    title: "Stream & refine",
    description:
      "Watch progress stream in. When it pauses, approve, tweak, or regenerate before moving on.",
  },
  {
    step: 4,
    title: "Ready-to-post copy",
    description:
      "Leave with dated posts aligned to your brief, ready to ship or hand to a reviewer.",
  },
];

const stats: Stat[] = [
  { value: "9", label: "Posts per run, max" },
  { value: "1 URL", label: "All it takes to start" },
  { value: "HITL", label: "Human-in-the-loop" },
  { value: "S3", label: "Briefs persisted" },
];

const features: Array<{ title: string; body: string; span?: string }> = [
  {
    title: "Brief that travels with every post",
    body: "One marketing brief, generated from your site, anchors every post the agent writes.",
    span: "lg:col-span-2",
  },
  {
    title: "Streamed by design",
    body: "NDJSON over HTTP, see thinking, drafts, and decisions land as they happen.",
  },
  {
    title: "You stay in the loop",
    body: "At each draft you can accept, tweak, or regenerate before the run continues.",
  },
  {
    title: "Calendar-ready output",
    body: "Posts come back with publish dates and platforms so your scheduler does the rest.",
    span: "lg:col-span-2",
  },
];

const previewItems: StreamPreviewItem[] = [
  { body: "Pulled brand voice and key offers from URL." },
  { body: "Drafting post 2 of 4, short hook + product proof." },
  { body: "Awaiting your review on draft 1." },
];

const HomePage = () => {
  const { status } = useAuth();
  const isAuthed = status === "authenticated";

  return (
    <div className="relative">
      {/* HERO ------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-grid mask-[radial-gradient(ellipse_60%_55%_at_50%_30%,black_30%,transparent_75%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-112 w-md rounded-full opacity-60 blur-3xl bg-aurora animate-float-slow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/30 to-transparent dark:via-white/30"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:pt-32">
          <Pill className="mx-auto mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
            Marketing Agent
            <span className="text-black/30 dark:text-white/30">•</span>
            <span className="text-black/60 dark:text-white/60">v0.1</span>
          </Pill>

          <h1 className="text-balance text-center text-5xl font-semibold leading-[1.05] tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
            Turn one URL into a{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-b from-black via-black to-black/40 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-white/40">
                full campaign
              </span>
              <span
                className="absolute -bottom-1 left-1 right-1 h-px bg-linear-to-r from-transparent via-black/60 to-transparent dark:via-white/60"
                aria-hidden
              />
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-base text-black/70 dark:text-white/70 sm:text-lg">
            A brief, a stream of drafts, and human checkpoints so what ships
            actually sounds like you. No spinners, no surprises.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {isAuthed ? (
              <>
                <Button to="/dashboard/form" variant="invert" showArrow>
                  Start a campaign
                </Button>
                <Button to="/dashboard" variant="outline">
                  Open dashboard
                </Button>
              </>
            ) : (
              <>
                <Button to={routes.login} variant="invert" showArrow>
                  Sign in to start
                </Button>
                <Button to={routes.register} variant="outline">
                  Create account
                </Button>
              </>
            )}
          </div>

          <StreamPreview
            className="mx-auto mt-16 max-w-3xl"
            items={previewItems}
          />
        </div>
      </section>

      {/* STATS ------------------------------------------------------------ */}
      <StatGrid stats={stats} />

      {/* PIPELINE --------------------------------------------------------- */}
      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeader
          align="center"
          eyebrow="Pipeline"
          title="Four steps from link to launch"
          description="Each step is observable, pausable, and replayable. The agent doesn't guess what you want — it asks."
          className="mb-12 sm:mb-14"
        />

        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 text-black/20 dash-march lg:block dark:text-white/20"
            aria-hidden
          />
          <ul className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((item) => (
              <li key={item.step} className="list-none">
                <ShortCard
                  step={item.step}
                  title={item.title}
                  description={item.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURES (bento) ------------------------------------------------- */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
        <SectionHeader
          eyebrow="Why it works"
          title="Built around the parts marketing teams actually do."
          className="mb-10 sm:mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              description={f.body}
              className={f.span}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
