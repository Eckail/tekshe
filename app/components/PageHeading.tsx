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
    <header className="mb-8 flex flex-col gap-5 border-b border-charcoal/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65 sm:text-base sm:leading-7">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
