import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors",
    isActive
      ? "surface-invert"
      : "text-black/80 hover:bg-black/[0.06] hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
  ].join(" ");

const PageHeader = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-black/75">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-3 sm:px-6">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
      </nav>
    </header>
  );
};

export default PageHeader;
