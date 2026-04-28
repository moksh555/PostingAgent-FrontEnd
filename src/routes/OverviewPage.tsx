import OverviewSummaryStrip from "../components/overview/OverviewSummaryStrip";
import type { StatCardProps } from "../components/ui";

const SUMMARY_CARDS: readonly StatCardProps[] = [
  { label: "Active runs", value: "2", hint: "In progress or review" },
  { label: "Posts this week", value: "12", hint: "Published or approved" },
  { label: "Last completed", value: "Apr 12", hint: "Most recent campaign" },
  { label: "Agent status", value: "Ready", hint: "All systems idle" },
];

const OverviewPage = () => (
  <div className="px-6 py-8 lg:px-10 lg:py-10">
    <header className="mb-8 flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Overview</h1>
      <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
        Activity at a glance for your marketing agent.
      </p>
    </header>

    <OverviewSummaryStrip cards={SUMMARY_CARDS} />
  </div>
);

export default OverviewPage;
