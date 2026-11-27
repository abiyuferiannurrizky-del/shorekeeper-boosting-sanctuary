import { Link, createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, History, LayoutDashboard, ListOrdered, Settings, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/Butterfly";
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
          </header>
          <div className="flex items-start gap-2 border-b border-border bg-secondary/40 px-4 py-2 text-xs text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Prototype mode: changes stay in this browser and admin sign-in is not active yet. Both arrive when the database is connected.
          </div>
          <main className="flex-1 p-4 md:p-8"><Body /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
