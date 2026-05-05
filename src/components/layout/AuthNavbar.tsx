import { Link, NavLink } from "react-router-dom";
import { AgenticNavLockup } from "../branding/AgenticMark";
import { routes } from "../../config/routes";
import { useAuth } from "../../features/auth/AuthContext";
import ThemeOverflowMenu from "./ThemeOverflowMenu";
import { marketingNavLinkClass } from "./marketingNavLinkClass";

const AuthNavbar = () => {
  const { status } = useAuth();
  const showDashboard = status === "authenticated";

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
      <div className="flex w-full items-center gap-1 px-2 py-2.5 sm:gap-2 sm:px-3 sm:py-3">
        <Link
          to={routes.home}
          className="mr-1 flex min-w-0 shrink-0 items-center rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-black/25 dark:ring-offset-black dark:focus-visible:ring-white/30 sm:mr-2"
          aria-label="Home"
        >
          <AgenticNavLockup />
        </Link>
        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center gap-1"
          aria-label="Primary"
        >
          <NavLink to={routes.howItWorks} className={marketingNavLinkClass}>
            How it works
          </NavLink>
          {showDashboard ? (
            <NavLink to={routes.dashboard} className={marketingNavLinkClass}>
              Dashboard
            </NavLink>
          ) : null}
          <NavLink to={routes.login} className={marketingNavLinkClass}>
            Sign in
          </NavLink>
          <NavLink to={routes.register} className={marketingNavLinkClass}>
            Register
          </NavLink>
        </nav>
        <ThemeOverflowMenu />
      </div>
    </header>
  );
};

export default AuthNavbar;
