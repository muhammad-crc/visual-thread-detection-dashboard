import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  LayoutGrid,
  Lock,
  Menu,
  Network,
  Radar,
  Settings,
  Shield,
  Terminal,
  Video,
  X,
} from "lucide-react";
import { Screen } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onLogout: () => void;
}

const navItems: Array<{ id: Screen; label: string; icon: typeof LayoutGrid; group: string }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, group: "Command" },
  { id: "cameras", label: "Live Cameras", icon: Video, group: "Command" },
  { id: "alerts", label: "Alerts", icon: AlertTriangle, group: "Command" },
  { id: "analytics", label: "Analytics", icon: Activity, group: "Command" },
  { id: "logs", label: "Logs", icon: Terminal, group: "Command" },
  { id: "docs", label: "Architecture", icon: BookOpen, group: "Explain" },
  { id: "usecases", label: "Use Cases", icon: BriefcaseBusiness, group: "Explain" },
  { id: "config", label: "Settings", icon: Settings, group: "System" },
];

export const Layout = ({
  children,
  activeScreen,
  onScreenChange,
  onLogout,
}: LayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileSidebarOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`
        ${mobile ? "fixed top-16 bottom-0 left-0 z-[56] w-[min(320px,86vw)]" : "hidden lg:flex"}
        noise-card lg:static lg:w-72 shrink-0 flex-col overflow-hidden border-r border-white/10
      `}
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-glow text-white flex items-center justify-center blue-pulse">
            <Network className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-headline text-sm font-bold text-white uppercase">
              Visual Threat Detection
            </p>
            <p className="font-mono text-[10px] text-text-dim uppercase">
              AI CCTV command layer
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase">
          <div className="border border-white/10 bg-white/[0.03] p-3">
            <p className="text-text-dim">Node</p>
            <p className="text-white mt-1">Alpha 01</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-3">
            <p className="text-text-dim">Status</p>
            <p className="text-primary-glow mt-1">Live</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="mb-5">
            <p className="px-3 py-2 font-mono text-[10px] text-text-dim/60 uppercase">
              {group}
            </p>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onScreenChange(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 text-left transition-all border
                    ${
                      activeScreen === item.id
                        ? "bg-primary-glow text-white border-primary-glow shadow-[0_0_26px_rgba(24,83,255,0.28)]"
                        : "bg-white/[0.02] text-text-dim border-transparent hover:text-white hover:border-white/20 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="font-headline text-sm font-semibold uppercase">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4 flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3">
          <Radar className="w-4 h-4 text-primary-glow animate-pulse" />
          <div className="min-w-0">
            <p className="font-mono text-[10px] text-white uppercase">Fusion verifier ready</p>
            <p className="font-mono text-[9px] text-text-dim uppercase">False alerts suppressed</p>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="p-2 text-text-dim hover:text-white hover:bg-white/[0.06] transition-colors" aria-label="Security">
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-text-dim hover:text-accent-error hover:bg-accent-error/10 transition-colors"
            aria-label="Logout"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background text-white flex flex-col overflow-hidden">
      <header className="fixed top-0 w-full z-[60] h-16 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((o) => !o)}
              className="lg:hidden shrink-0 p-2 -ml-1 text-white hover:bg-white/[0.08] transition-colors"
              aria-expanded={mobileSidebarOpen}
              aria-label={mobileSidebarOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="w-9 h-9 bg-white text-surface-lowest flex items-center justify-center font-headline font-black">
              V
            </div>
            <div className="min-w-0">
              <p className="font-headline font-bold text-sm sm:text-base uppercase truncate">
                Visual Threat Detection
              </p>
              <p className="hidden sm:block font-mono text-[10px] text-text-dim uppercase truncate">
                CCTV intelligence dashboard
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase text-text-dim">
            <span className="h-2 w-2 bg-primary-glow animate-pulse"></span>
            <span>WebSocket armed</span>
            <span className="mx-3 h-4 w-px bg-white/20"></span>
            <span>V7 fusion stack</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-text-dim hover:text-white hover:bg-white/[0.07] transition-all" aria-label="Shield">
              <Shield className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-dim hover:text-white hover:bg-white/[0.07] transition-all relative" aria-label="Notifications">
              <BellRing className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-error ring-2 ring-background"></span>
            </button>
          </div>
        </div>
      </header>

      <div
        role="presentation"
        className={`fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {mobileSidebarOpen && <Sidebar mobile />}

      <div className="flex flex-1 pt-16 h-screen min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 blueprint-grid opacity-[0.025] pointer-events-none"></div>
          <div className="absolute inset-0 scanline opacity-[0.035] pointer-events-none"></div>
          <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            {children}
          </div>
        </main>
      </div>

      <footer className="hidden sm:flex fixed bottom-0 left-0 right-0 z-50 h-8 bg-surface-lowest/80 backdrop-blur-md border-t border-white/10 items-center justify-between px-4 lg:pl-[18rem]">
        <span className="font-mono text-[9px] uppercase text-white/30">
          SYSTEM STABLE // encrypted alert transport
        </span>
        <span className="font-mono text-[9px] uppercase text-primary-glow">
          heartbeat active
        </span>
      </footer>
    </div>
  );
};
