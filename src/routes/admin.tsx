import { Link, createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, History, LayoutDashboard, ListOrdered, LogOut, Settings } from "lucide-react";
import { Logo } from "@/components/brand/Butterfly";
import { AdminGate } from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { HistorySection, ImportExportSection, OverviewSection, QueueSection, SettingsSection } from "@/components/admin/sections";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

const SECTIONS = {
  overview: { label: "Overview", icon: LayoutDashboard, el: OverviewSection },
  queue: { label: "Queue Management", icon: ListOrdered, el: QueueSection },
  history: { label: "Order History", icon: History, el: HistorySection },
  data: { label: "Import / Export", icon: FileSpreadsheet, el: ImportExportSection },
  settings: { label: "Settings", icon: Settings, el: SettingsSection },
} as const;
type SectionKey = keyof typeof SECTIONS;

export const Route = createFileRoute("/admin")({
  validateSearch: (s: Record<string, unknown>): { section?: SectionKey } => {
    const v = s["section"];
    return typeof v === "string" && v in SECTIONS ? { section: v as SectionKey } : {};
  },
  head: () => ({ meta: [{ title: "Admin — BONGJOKI" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { section = "overview" } = Route.useSearch();
  const current = SECTIONS[section];
  const Body = current.el;
  return (
    <AdminGate>
      {(signOut, email) => (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="px-3 py-4"><Link to="/"><Logo className="group-data-[collapsible=icon]:hidden" /></Link></SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {(Object.keys(SECTIONS) as SectionKey[]).map((k) => {
                    const S = SECTIONS[k];
                    return (
                      <SidebarMenuItem key={k}>
                        <SidebarMenuButton asChild isActive={k === section} tooltip={S.label}>
                          <Link to="/admin" search={{ section: k }}><S.icon className="h-4 w-4" /><span>{S.label}</span></Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border px-4">
            <SidebarTrigger />
            <h1 className="font-display text-2xl text-silver">{current.label}</h1>
            <span className="ml-auto hidden truncate text-xs text-muted-foreground sm:block">{email}</span>
            <Button variant="ghost" size="sm" className="sm:ml-0 ml-auto" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </header>
          <main className="flex-1 p-4 md:p-8"><Body /></main>
        </div>
      </div>
    </SidebarProvider>
      )}
    </AdminGate>
  );
}
