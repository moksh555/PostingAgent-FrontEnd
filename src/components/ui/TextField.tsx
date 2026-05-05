import type { ComponentProps } from "react";

type TextFieldProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  inputMode?: ComponentProps<"input">["inputMode"];
};

const inputClass =
  "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-[box-shadow,border-color] " +
  "border-black/15 text-black placeholder:text-black/40 " +
  "focus-visible:border-black/40 focus-visible:ring-2 focus-visible:ring-black/10 " +
  "dark:border-white/15 dark:text-white dark:placeholder:text-white/35 " +
  "dark:focus-visible:border-white/35 dark:focus-visible:ring-white/10 " +
  "disabled:opacity-55";

const TextField = ({
  id,
  label,
  type = "text",
  name,
  autoComplete,
  value,
  onChange,
  error,
  hint,
  disabled,
  inputMode,
}: TextFieldProps) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-black/65 dark:text-white/60"
      >
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-black/50 dark:text-white/45">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-black/70 dark:text-white/65">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;
