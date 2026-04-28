import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export type ButtonVariant = "invert" | "outline" | "revert" | "revertOutline";
export type ButtonSize = "sm" | "md";

type ButtonProps = {
  to?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  invert: "surface-invert",
  outline: "surface-outline",
  revert: "surface-revert",
  revertOutline: "surface-revert-outline",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
};

const ArrowIcon = () => (
  <svg
    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const Button = ({
  to,
  variant = "invert",
  size = "md",
  showArrow = false,
  className = "",
  onClick,
  type = "button",
  disabled,
  children,
}: ButtonProps) => {
  const isFilled = variant === "invert" || variant === "revert";

  const cls = [
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl font-semibold no-underline transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60",
    variantClass[variant],
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {showArrow && <ArrowIcon />}
      </span>
      {isFilled && <span className="shimmer" aria-hidden />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} aria-disabled={disabled || undefined}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled}>
      {inner}
    </button>
  );
};

export default Button;
