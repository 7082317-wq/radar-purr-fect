import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { CatAgent } from "@/components/cat-agent";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 min-w-0 p-6 md:p-8 max-w-[1500px] mx-auto w-full">
        <Outlet />
      </main>
      <CatAgent />
    </div>
  );
}
