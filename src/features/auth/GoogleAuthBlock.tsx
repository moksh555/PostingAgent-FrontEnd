import GoogleGIcon from "./GoogleGIcon";

type GoogleAuthBlockProps = {
  onContinueGoogle: () => void;
  disabled?: boolean;
  infoMessage?: string | null;
};

const GoogleAuthBlock = ({
  onContinueGoogle,
  disabled,
  infoMessage,
}: GoogleAuthBlockProps) => {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={onContinueGoogle}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-black/15 bg-black/[0.03] px-4 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-55 dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
      >
        <GoogleGIcon className="h-5 w-5 shrink-0" />
        Continue with Google
      </button>
      {infoMessage ? (
        <p className="text-center text-xs text-black/55 dark:text-white/50" role="status">
          {infoMessage}
        </p>
      ) : null}
      <div className="relative py-1">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10 dark:bg-white/10" />
        <p className="relative mx-auto w-fit bg-white px-3 text-center text-[0.7rem] font-medium uppercase tracking-wider text-black/45 dark:bg-black dark:text-white/40">
          Or continue with email
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthBlock;
