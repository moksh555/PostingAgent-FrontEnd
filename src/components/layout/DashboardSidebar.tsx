import { Link, NavLink, useMatch } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import { AgenticNavLockup } from "../branding/AgenticMark";
import {
  CogIcon,
  HomeIcon,
  ListIcon,
  LogoutIcon,
  PlusCircleIcon,
} from "../dashboard/icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

type NavItem = {
  label: string;
  icon: IconComponent;
  to?: string;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: HomeIcon, to: "/dashboard", end: true },
  { label: "New run", icon: PlusCircleIcon, to: "/dashboard/form", end: true },
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

function DashboardSidebarNav() {
  const resumeMatch = useMatch("/dashboard/resume/:threadId");

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {NAV_ITEMS.map(({ label, icon: Icon, to, end }) =>
        to ? (
          <NavLink
            key={label}
            to={to}
            className={
              to === "/dashboard/pastRun"
                ? ({ isActive }) =>
                    linkClass({
                      isActive: isActive || Boolean(resumeMatch),
                    })
                : linkClass
            }
            end={end}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ) : (
          <span
            key={label}
            className={[baseItem, disabledItem].join(" ")}
            aria-disabled="true"
          >
            <Icon size={18} />
            <span>{label}</span>
          </span>
        ),
      )}
    </nav>
  );
}

const DashboardSidebar = () => (
  <aside
    className={[
      "flex w-64 shrink-0 flex-col gap-6 border-r border-black/10 bg-white/40 px-5 py-6 backdrop-blur",
      "dark:border-white/10 dark:bg-black/40",
    ].join(" ")}
  >
    <Link
      to="/"
      className="flex min-w-0 shrink-0 items-center rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-black/25 dark:ring-offset-black dark:focus-visible:ring-white/30"
      aria-label="Home"
    >
      <AgenticNavLockup />
    </Link>

    <DashboardSidebarNav />

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
