import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  Globe2,
  Cpu,
  Scale,
  FileText,
  Settings,
  Radar,
  Bot,
  AlertTriangle,
} from "lucide-react";

const items = [
  { to: "/", label: "대시보드", icon: LayoutDashboard },
  { to: "/ai-products", label: "해외 제품/서비스", icon: Cpu },
  { to: "/foreign-dpa", label: "해외 DPA", icon: Globe2 },
  { to: "/cases", label: "판례 및 규제", icon: Scale },
  { to: "/ai-agent", label: "AI Agent", icon: Bot },
  { to: "/security", label: "보안 및 위험", icon: ShieldAlert },
  { to: "/risks", label: "전체 신규", icon: AlertTriangle },
  { to: "/drafts", label: "생성된 초안", icon: FileText },
  { to: "/settings", label: "설정", icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-60 shrink-0 border-r border-glass-border glass-strong h-screen sticky top-0 hidden md:flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-glass-border">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-mint to-purple grid place-items-center">
          <Radar className="h-5 w-5 text-background" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-mint animate-pulse-glow" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-base">Privacy Radar</div>
          <div className="terminal text-[10px] text-mint/70">v0.4.2 · internal</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((i) => {
          const active = path === i.to || (i.to !== "/" && path.startsWith(i.to));
          const Icon = i.icon;
          return (
            <Link
              key={i.to}
              to={i.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? "bg-mint/15 text-mint border border-mint/30 shadow-[inset_0_0_20px_oklch(0.82_0.16_165/0.08)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{i.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-mint" />}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-xl glass">
        <div className="terminal text-[10px] text-muted-foreground">SYSTEM</div>
        <div className="mt-1 text-xs flex items-center justify-between">
          <span>모니터링</span>
          <span className="text-mint">정상</span>
        </div>
        <div className="mt-1 text-xs flex items-center justify-between">
          <span>소스</span>
          <span>42</span>
        </div>
      </div>
    </aside>
  );
}
