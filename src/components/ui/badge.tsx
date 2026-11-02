import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Status pills without stroke (border-0), pure solid soft backgrounds per status
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[2px] px-2 py-0.5 text-xs font-medium transition-colors border-0",
  {
    variants: {
      variant: {
        default: "bg-[#EFF4FE] text-[#2862E0]",
        neutral: "bg-[#0E1422] text-white",
        secondary: "bg-[#F1F3F5] text-[#4B5563]",
        success: "bg-[#DCFCE7] text-[#15803D]",
        warning: "bg-[#FEF3C7] text-[#B45309]",
        destructive: "bg-[#FEE2E2] text-[#B91C1C]",
        outline: "bg-[#F1F3F5] text-[#0E1422]",
        tokyo: "bg-[#1A1B26] text-[#C0CAF5] font-mono text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

function Badge({
  className,
  variant,
  dot,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-[1px] shrink-0",
            dotColor ||
              (variant === "success" && "bg-[#15803D]") ||
              (variant === "warning" && "bg-[#B45309]") ||
              (variant === "destructive" && "bg-[#B91C1C]") ||
              (variant === "default" && "bg-[#2862E0]") ||
              "bg-current"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
