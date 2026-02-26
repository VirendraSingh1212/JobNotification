"use client";

import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  appName?: string;
  currentStep?: number;
  totalSteps?: number;
  status?: "not-started" | "in-progress" | "shipped";
}

const statusConfig = {
  "not-started": { label: "Not Started", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "shipped": { label: "Shipped", variant: "success" as const },
};

export function TopBar({
  appName = "Job Notification App",
  currentStep = 1,
  totalSteps = 5,
  status = "not-started",
}: TopBarProps) {
  const statusInfo = statusConfig[status];

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 lg:px-10">
      {/* Left: App Name */}
      <div className="flex items-center">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {appName}
        </span>
      </div>

      {/* Center: Progress Indicator */}
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Step {currentStep}</span>
        <span>/</span>
        <span>{totalSteps}</span>
      </div>

      {/* Right: Status Badge */}
      <div className="flex items-center">
        <Badge
          variant={statusInfo.variant}
          className="px-3 py-1 text-xs font-medium"
        >
          {statusInfo.label}
        </Badge>
      </div>
    </header>
  );
}
