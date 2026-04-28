import { Link, NavLink } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  CogIcon,
  HomeIcon,
  ListIcon,
  LogoutIcon,
  PlusCircleIcon,
  SparkleIcon,
} from "../dashboard/icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

type NavItem = {
  label: string;
  icon: IconComponent;
  to?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: HomeIcon },
  { label: "New run", icon: PlusCircleIcon, to: "/dashboard/form" },
  { label: "Runs", icon: ListIcon, to: "/dashboard/pastRun" },
  { label: "Settings", icon: CogIcon },
];

const baseItem =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

const idleItem =
  "text-black/70 hover:bg-black/4 hover:text-black dark:text-white/75 dark:hover:bg-white/6 dark:hover:text-white";

const activeItem = "surface-invert";

const disabledItem =
  "cursor-default text-black/40 dark:text-white/35";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [baseItem, isActive ? activeItem : idleItem].join(" ");

const DashboardSidebar = () => (
  <aside
    className={[
      "flex w-64 shrink-0 flex-col gap-6 border-r border-black/10 bg-white/40 px-5 py-6 backdrop-blur",
      "dark:border-white/10 dark:bg-black/40",
    ].join(" ")}
  >
    <Link to="/" className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/60 text-black dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-hidden
      >
        <SparkleIcon size={18} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-tight">Agentic</span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-black/55 dark:text-white/55">
          Marketing agent
        </span>
      </span>
    </Link>

    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {NAV_ITEMS.map(({ label, icon: Icon, to }) =>
        to ? (
          <NavLink key={label} to={to} className={linkClass} end={to === "/dashboard/form"}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ) : (
          <span key={label} className={[baseItem, disabledItem].join(" ")} aria-disabled="true">
            <Icon size={18} />
            <span>{label}</span>
          </span>
        ),
      )}
    </nav>

    <button
      type="button"
      className={[baseItem, idleItem, "w-full justify-start"].join(" ")}
    >
      <LogoutIcon size={18} />
      <span>Logout</span>
    </button>
  </aside>
);

export default DashboardSidebar;
