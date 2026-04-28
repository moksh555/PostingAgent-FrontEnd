import type { ComponentType, SVGProps } from "react";
import { PauseIcon } from "./icons";
import type { RunStatus } from "./types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

type StatusMeta = {
  label: string;
  icon?: IconComponent;
  pulse?: boolean;
};

const STATUS_META: Record<RunStatus, StatusMeta> = {
  idle: { label: "Idle" },
  connecting: { label: "Connecting…", pulse: true },
  streaming: { label: "Streaming", pulse: true },
  paused: { label: "Paused — review", icon: PauseIcon },
  complete: { label: "Complete" },
  error: { label: "Error" },
};

const StatusPill = ({ status }: { status: RunStatus }) => {
  const { label, icon: Icon, pulse } = STATUS_META[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        "border-black/15 bg-white/70 text-black/80",
        "dark:border-white/15 dark:bg-white/8 dark:text-white/85",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      {Icon ? (
        <Icon size={12} />
      ) : (
        <span
          className={[
            "h-1.5 w-1.5 rounded-full bg-black/70 dark:bg-white/80",
            pulse ? "animate-pulse" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        />
      )}
      <span>{label}</span>
    </span>
  );
};

export default StatusPill;
