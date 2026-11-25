
import type { ReactNode } from "react";

export default function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-dark">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
