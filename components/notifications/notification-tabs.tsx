"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Tab {
  label: string;
  value: string;
  count?: number;
}

const tabs: Tab[] = [
  { label: "Important", value: "important" },
  { label: "Other", value: "other" },
  { label: "Snoozed", value: "snoozed" },
  { label: "Cleared", value: "cleared" },
];

export function NotificationTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "inbox";
  const currentFilter = searchParams.get("filter");

  return (
    <div className="border-b">
      <nav className="flex items-center gap-4 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.value;
          const href = `${pathname}?tab=${tab.value}${currentFilter ? `&filter=${currentFilter}` : ""}`;

          return (
            <Link
              key={tab.value}
              href={href}
              className={cn(
                "relative flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors hover:text-foreground/80",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-foreground/60"
              )}
            >
              {tab.label}
              {tab.count && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
