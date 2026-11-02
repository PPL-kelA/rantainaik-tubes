import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  category?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  category,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-[#E5E7EB] bg-white pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {category && (
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            {category}
          </p>
        )}
        <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[#0E1422] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm leading-relaxed text-[#5B6475] max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 sm:self-end">
          {actions}
        </div>
      )}
    </div>
  );
}
