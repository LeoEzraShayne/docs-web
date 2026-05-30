import { AuthGate } from "@/components/auth-gate";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="grid gap-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <WorkspaceSidebar />
        <div>{children}</div>
      </div>
    </AuthGate>
  );
}
