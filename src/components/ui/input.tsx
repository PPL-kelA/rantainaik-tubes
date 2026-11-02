import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[4px] border border-[#8B93A1] bg-white px-3.5 py-2 text-sm text-[#0E1422] placeholder:text-[#8B93A1] transition-colors duration-150 motion-reduce:transition-none focus:border-[#2862E0] focus:outline-none focus:ring-2 focus:ring-[#2862E0]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
