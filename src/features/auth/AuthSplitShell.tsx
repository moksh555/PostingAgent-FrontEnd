import type { ReactNode } from "react";
import AuthNavbar from "../../components/layout/AuthNavbar";
import AuthBrandPanel from "./AuthBrandPanel";

type CardWidth = "md" | "lg";

type AuthSplitShellProps = {
  children: ReactNode;
  cardWidth?: CardWidth;
  brandEyebrow?: ReactNode;
};

const cardMax: Record<CardWidth, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
};

const AuthSplitShell = ({
  children,
  cardWidth = "md",
  brandEyebrow,
}: AuthSplitShellProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthNavbar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative order-2 flex-1 overflow-hidden border-b border-black/10 dark:border-white/10 lg:order-none lg:min-h-0 lg:w-1/2 lg:border-b-0 lg:border-r">
          <AuthBrandPanel eyebrow={brandEyebrow} />
        </div>
        <div className="order-1 flex flex-1 flex-col justify-center px-4 py-12 sm:px-8 lg:order-none lg:py-10">
          <div className={`mx-auto w-full ${cardMax[cardWidth]}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitShell;
