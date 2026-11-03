"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onSubmit"
> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  wrapperClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      wrapperClassName,
      placeholder = "Cari...",
      value,
      onChange,
      onSearch,
      onClear,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
    };

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        <Search
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6475] pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-[4px] border border-[#8B93A1] bg-white pl-10 pr-9 text-xs sm:text-sm text-[#0E1422] placeholder:text-[#5B6475] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0] transition-colors",
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6475] hover:text-[#0E1422] p-0.5 rounded-[2px]"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
