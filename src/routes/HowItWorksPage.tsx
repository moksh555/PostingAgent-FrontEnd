import { Link } from "react-router-dom";
import { SectionHeader } from "../components/ui";
import { routes } from "../config/routes";

const stages = [
  {
    step: 1,
    title: "Start from one URL",
    summary:
      "You choose the product or landing page the campaign should be about—plus how many posts you want and when the campaign starts.",
    youProvide: [
      "A full URL (HTTPS) to the page you want the agent to learn from.",
      "Post count within the product limit (for example up to 9 per run).",
      "A campaign start date and time so scheduled posts line up on your calendar.",
    ],
    systemDoes:
      "The agent fetches and reads that page (and linked context the pipeline is configured to use) so every later step shares the same facts and tone.",
    outcome:
      "A queued run tied to your account, ready for the agent to build the brief. Identity comes from your signed-in session—no manual user id field in the form.",
  },
  {
    step: 2,
    title: "Brief is generated and stored",
    summary:
      "The agent turns the site into a structured marketing brief that every post in the run will reuse, so messaging stays consistent.",
    youProvide: [
      "Usually nothing—this stage runs automatically after you start the run.",
    ],
    systemDoes:
      "Extracts value props, audience hints, and voice from the page; consolidates them into one brief; persists it (for example to object storage) so it survives refreshes and can be reviewed later.",
    outcome:
      "A single brief becomes the contract for the whole run. Every generated post is checked back against it.",
  },
  {
    step: 3,
    title: "Stream, review, decide",
    summary:
      "You watch progress as streamed updates arrive. When the pipeline hits a human-in-the-loop checkpoint, you approve, reject, or regenerate before the run continues.",
    youProvide: [
      "Attention at pause points: read each draft and pick the next action.",
      "Optional short instructions when you regenerate, so the model knows what to change.",
    ],
    systemDoes:
      "Streams intermediate state; stops at defined interrupts; on your decision, calls the backend to resume with your choice so the run continues or retries.",
    outcome:
      "Only copy that passed your checkpoints moves on—nothing “silent-ships” without you at a pause.",
  },
  {
    step: 4,
    title: "Finished posts you can ship",
    summary:
      "When the run completes, you get dated posts aligned to the brief—ready to paste into a scheduler or hand to legal.",
    youProvide: [
      "Any final checks your organization requires in its own tools.",
    ],
    systemDoes:
      "Packages each post with the metadata your backend defines (dates, titles, body); marks the run complete when all posts are resolved.",
    outcome:
      "A coherent mini-campaign from one URL, with a clear path from brief → drafts → your decisions.",
  },
] as const;

const panelClass =
  "rounded-2xl border border-black/12 bg-white/60 px-5 py-4 dark:border-white/12 dark:bg-black/40";

const HowItWorksPage = () => {
  return (
    <div className="relative mx-auto max-w-3xl px-3 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
          How it works
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-black/70 dark:text-white/70">
          Four stages from a single link to reviewer-ready posts. For each stage below:{" "}
          <strong className="font-semibold text-black dark:text-white">what you provide</strong>,{" "}
          <strong className="font-semibold text-black dark:text-white">what the system does</strong>, and{" "}
          <strong className="font-semibold text-black dark:text-white">what you have before the next stage</strong>.
        </p>
        <p className="mt-4 text-sm text-black/60 dark:text-white/55">
          <Link to={routes.home} className="font-medium underline-offset-4 hover:underline">
            Home
          </Link>
          {" · "}
          <Link to={routes.dashboardForm} className="font-medium underline-offset-4 hover:underline">
            New run
          </Link>{" "}
          (requires sign-in)
        </p>
      </header>

      <SectionHeader
        eyebrow="Pipeline"
        title="Stages in order"
        description="Run stages 1 → 4 in one flow. The agent needs the brief before drafts, and your decisions at pauses before completion."
        className="mb-8"
      />

      <ol className="flex flex-col gap-12">
        {stages.map((s) => (
          <li key={s.step} className="list-none">
            <div className="mb-5 border-b border-black/10 pb-5 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-black/45 dark:text-white/45">
                Stage {s.step} of 4
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-black dark:text-white sm:text-2xl">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/65">
                {s.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <section className={panelClass}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-black/55 dark:text-white/50">
                  What you provide
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-black/80 dark:text-white/75">
                  {s.youProvide.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section className={panelClass}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-black/55 dark:text-white/50">
                  What the system does
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/80 dark:text-white/75">
                  {s.systemDoes}
                </p>
              </section>
              <section className={panelClass}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-black/55 dark:text-white/50">
                  Outcome before the next stage
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/80 dark:text-white/75">
                  {s.outcome}
                </p>
              </section>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HowItWorksPage;
