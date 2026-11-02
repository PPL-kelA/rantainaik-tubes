import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2862E0] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-[4px] shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#2862E0] text-white hover:bg-[#2858B8] active:bg-[#1E40AF]",
        neutral:
          "bg-[#0E1422] text-white hover:bg-[#1E293B] active:bg-[#000000]",
        secondary:
          "bg-white text-[#0E1422] border border-[#8B93A1] hover:bg-[#FAFBFC] active:bg-[#F3F4F6]",
        destructive:
          "bg-[#B91C1C] text-white hover:bg-[#991B1B] active:bg-[#7F1D1D]",
        outline:
          "border border-[#8B93A1] bg-transparent text-[#0E1422] hover:bg-[#FAFBFC]",
        ghost: "text-[#5B6475] hover:bg-[#EFF4FE] hover:text-[#2862E0]",
        link: "text-[#2862E0] underline-offset-4 hover:underline hover:text-[#2858B8] p-0 h-auto font-normal",
        tokyo:
          "bg-[#1A1B26] text-[#C0CAF5] border border-[rgba(192,202,245,0.2)] hover:bg-[#24283B] font-mono text-xs",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild, ...props }, ref) => {
    void _asChild;
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
