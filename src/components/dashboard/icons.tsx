import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const baseProps = (size: number, props: Omit<IconProps, "size">) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const SparkleIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);

export const HomeIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

export const PlusCircleIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const ListIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
  </svg>
);

export const CogIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01c.27.62.86 1.03 1.56 1.03H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.56 1.03z" />
  </svg>
);

export const LogoutIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h12" />
  </svg>
);

export const MapPinIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const FileTextIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M9 13h6M9 17h6M9 9h2" />
  </svg>
);

export const PauseIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M9 5v14M15 5v14" />
  </svg>
);

export const CalendarIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="m14 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="m10 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="m5 12 5 5 9-11" />
  </svg>
);

export const XIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const RefreshIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 4v4h-4M21 12a9 9 0 0 1-15.5 6.3L3 16M3 20v-4h4" />
  </svg>
);

export const BanIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m5.6 5.6 12.8 12.8" />
  </svg>
);

export const ArrowRightIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
