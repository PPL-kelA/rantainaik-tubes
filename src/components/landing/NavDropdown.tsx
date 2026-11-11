"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export interface NavDropdownProps {
  label: string;
  columnOneTitle?: string;
  columnOneItems: DropdownItem[];
  columnTwoTitle?: string;
  columnTwoItems: DropdownItem[];
}

export function NavDropdown({
  label,
  columnOneTitle,
  columnOneItems,
  columnTwoTitle,
  columnTwoItems,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const allItems = [...columnOneItems, ...columnTwoItems];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
      setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 50);
    }
  };

  const handleItemKeyDown = (
    e: KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % allItems.length;
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + allItems.length) % allItems.length;
      itemRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2862E0] focus:ring-offset-2 rounded-[4px] px-2 py-1",
          isOpen ? "text-[#2862E0]" : "text-[#5B6475] hover:text-[#0E1422]"
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-150",
            isOpen && "rotate-180 text-[#2862E0]"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label={label}
          className="absolute left-0 mt-2 w-[540px] rounded-[4px] border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_16px_rgba(14,20,34,0.08)] z-50 animate-in fade-in-50 duration-150"
        >
          <div className="grid grid-cols-2 gap-4 divide-x divide-[#E5E7EB]">
            {/* Column 1 */}
            <div className="space-y-1">
              {columnOneTitle && (
                <div className="px-2 pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                  {columnOneTitle}
                </div>
              )}
              {columnOneItems.map((item, idx) => (
                <Link
                  key={item.title}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => setIsOpen(false)}
                  onKeyDown={(e) => handleItemKeyDown(e, idx)}
                  className="block rounded-[4px] p-2 hover:bg-[#FAFBFC] focus:bg-[#EFF4FE] focus:outline-none focus:ring-2 focus:ring-[#2862E0] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#0E1422]">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-[2px]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#5B6475] line-clamp-1">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-1 pl-4">
              {columnTwoTitle && (
                <div className="px-2 pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                  {columnTwoTitle}
                </div>
              )}
              {columnTwoItems.map((item, idx) => {
                const globalIndex = columnOneItems.length + idx;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    ref={(el) => {
                      itemRefs.current[globalIndex] = el;
                    }}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => setIsOpen(false)}
                    onKeyDown={(e) => handleItemKeyDown(e, globalIndex)}
                    className="block rounded-[4px] p-2 hover:bg-[#FAFBFC] focus:bg-[#EFF4FE] focus:outline-none focus:ring-2 focus:ring-[#2862E0] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#0E1422]">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-[2px]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#5B6475] line-clamp-1">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
