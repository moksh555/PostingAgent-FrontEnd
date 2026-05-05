import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routes } from "../config/routes";
import { useAuth } from "../features/auth/AuthContext";

const RequireAuth = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-black/60 dark:text-white/55">
        Loading…
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <Navigate
        to={routes.login}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
