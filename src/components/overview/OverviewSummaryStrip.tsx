import { StatCard, type StatCardProps } from "../ui";

type OverviewSummaryStripProps = {
  cards: readonly StatCardProps[];
};

const OverviewSummaryStrip = ({ cards }: OverviewSummaryStripProps) => (
  <section
    aria-label="Overview summary"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
  >
    {cards.map((c) => (
      <StatCard key={c.label} {...c} />
    ))}
  </section>
);

export default OverviewSummaryStrip;
