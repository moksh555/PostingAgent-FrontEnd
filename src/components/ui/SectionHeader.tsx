import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) => {
  const isCenter = align === "center";

  return (
    <div className={[isCenter ? "text-center" : "", className].filter(Boolean).join(" ")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={[
          "text-balance text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl",
          eyebrow ? "mt-3" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {title}
      </h2>
      {description && (
        <p
          className={[
            "mt-3 max-w-xl text-pretty text-black/65 dark:text-white/65",
            isCenter ? "mx-auto" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
