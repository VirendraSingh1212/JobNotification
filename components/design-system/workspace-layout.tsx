import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  primary: ReactNode;
  secondary: ReactNode;
}

export function WorkspaceLayout({ primary, secondary }: WorkspaceLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)]">
      {/* Primary Workspace: 70% */}
      <main className="flex-1 lg:w-[70%] lg:flex-none p-6 lg:p-10">
        {primary}
      </main>

      {/* Secondary Panel: 30% */}
      <aside className="lg:w-[30%] border-t lg:border-t-0 lg:border-l border-border bg-card p-6 lg:p-10">
        {secondary}
      </aside>
    </div>
  );
}
