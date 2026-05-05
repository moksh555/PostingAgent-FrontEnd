import type { ComponentProps } from "react";
import { AGENTIC_ICON_SRC, AGENTIC_LOCKUP_SRC } from "../../config/branding";

type ImgProps = ComponentProps<"img">;

export function AgenticIcon({
  alt = "Agentic",
  ...props
}: ImgProps) {
  return <img src={AGENTIC_ICON_SRC} alt={alt} decoding="async" {...props} />;
}

export function AgenticLockup({
  alt = "Agentic — Marketing agent",
  ...props
}: ImgProps) {
  return (
    <img
      src={AGENTIC_LOCKUP_SRC}
      alt={alt}
      decoding="async"
      {...props}
    />
  );
}

type AgenticNavLockupProps = {
  className?: string;
};

/** Navbar brand: icon + “Marketing” (white, bold, italic) / small “agent”. Home via parent link. */
export function AgenticNavLockup({ className = "" }: AgenticNavLockupProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 sm:gap-2.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={AGENTIC_ICON_SRC}
        alt=""
        width={36}
        height={36}
        decoding="async"
        className="h-9 w-9 shrink-0 rounded-lg object-cover dark:invert"
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="rounded-md bg-black px-2 py-1 shadow-sm ring-1 ring-black/20 dark:bg-neutral-950 dark:ring-white/15">
          <span className="block text-sm font-bold italic tracking-tight text-white">
            Marketing
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-medium lowercase tracking-wide text-white/80">
            agent
          </span>
        </span>
      </span>
    </span>
  );
}
