import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-[4px] border border-[#8B93A1] bg-white px-3.5 pr-9 py-2 text-sm text-[#0E1422] transition-colors duration-150 motion-reduce:transition-none focus:border-[#2862E0] focus:outline-none focus:ring-2 focus:ring-[#2862E0]/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6475]" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
