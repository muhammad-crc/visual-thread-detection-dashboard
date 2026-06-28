import { useEffect, useMemo, useRef, useState } from "react";
import {
  Terminal,
  Search,
  Download,
  Trash2,
  Filter,
  ChevronRight,
} from "lucide-react";
import {
  TacticalCard,
  TacticalInput,
  TacticalButton,
} from "./TacticalComponents";
import { useAlerts } from "../useAlerts";
import { Alert } from "../types";

type Level = "INFO" | "WARN" | "ERROR" | "DEBUG";

// The browser's local IANA timezone (e.g. "Asia/Karachi"), shown in the footer.
const LOCAL_TZ = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
  } catch {
    return "local";
  }
})();

/**
 * Parse a backend timestamp into a Date. The backend stores UTC; if a stored
 * value happens to lack a timezone marker, assume UTC (append 'Z') so the
 * browser does not misread it as local time and shift it.
 */
function parseTs(ts: string): Date {
  const hasTz = /([zZ])$|[+-]\d{2}:?\d{2}$/.test(ts);
  return new Date(hasTz ? ts : ts + "Z");
}

/** HH:MM:SS in the viewer's local timezone. */
function formatLogTime(ts: string): string {
  return parseTs(ts).toLocaleTimeString([], { hour12: false });
}

/** Full local date + time (used as a hover tooltip on each line). */
function formatLogDateTime(ts: string): string {
  return parseTs(ts).toLocaleString();
}

interface LogEntry {
  id: string;
  timestamp: string;
  subsystem: string;
  level: Level;
  message: string;
}

// Each detection alert is rendered as a log line.
function alertToLog(alert: Alert): LogEntry {
  const level: Level =
    alert.severity === "critical" ? "ERROR" : alert.severity === "warning" ? "WARN" : "INFO";
  return {
    id: alert.id,
    timestamp: alert.timestamp,
    subsystem: alert.cameraId || "CAM",
    level,
    message: `${alert.type.toUpperCase()} @ ${alert.location} - conf ${(alert.confidence * 100).toFixed(1)}% - ${alert.description}`,
  };
}

export const LogsScreen = () => {
  const { alerts, connected } = useAlerts();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<Level | null>(null);
  const [subsystemFilter, setSubsystemFilter] = useState<string | null>(null);

  const logs = useMemo(() => alerts.map(alertToLog), [alerts]);

  // Distinct cameras present in the data, for the sidebar filter.
  const subsystems = useMemo(
    () => Array.from(new Set(logs.map((l) => l.subsystem))).sort(),
    [logs]
  );

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.message.toLowerCase().includes(q) ||
      log.subsystem.toLowerCase().includes(q) ||
      log.level.toLowerCase().includes(q);
    const matchesLevel = !levelFilter || log.level === levelFilter;
    const matchesSub = !subsystemFilter || log.subsystem === subsystemFilter;
    return matchesSearch && matchesLevel && matchesSub;
  });

  // `alerts` is newest-first; show logs chronologically (newest at the bottom)
  // like a real `tail -f`, then auto-scroll to the latest line as they stream in.
  const displayLogs = useMemo(() => [...filteredLogs].reverse(), [filteredLogs]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Only auto-stick to the bottom if the operator is already near it,
    // so manual scroll-up to read history isn't yanked away.
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [displayLogs.length]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-accent-error";
      case "WARN":
        return "text-secondary-glow";
      case "DEBUG":
        return "text-white/40";
      default:
        return "text-primary-glow";
    }
  };

  const exportLogs = () => {
    const text = displayLogs
      .map((l) => `[${formatLogDateTime(l.timestamp)}] ${l.level} [${l.subsystem}] ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vtd_logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-headline font-black tracking-widest text-white uppercase">
            System_Logs
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-high border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-primary-glow animate-pulse" : "bg-accent-error"}`}></div>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${connected ? "text-primary-glow" : "text-accent-error"}`}>
              {connected ? "Live_Stream" : "Offline"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <TacticalButton variant="ghost" className="text-[10px] py-2" onClick={exportLogs}>
            <Download className="w-3 h-3 mr-2" />
            Download
          </TacticalButton>
          <TacticalButton
            variant="ghost"
            className="text-[10px] py-2 text-accent-error/60 hover:text-accent-error"
            onClick={() => { setSearchQuery(""); setLevelFilter(null); setSubsystemFilter(null); }}
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Reset
          </TacticalButton>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <TacticalCard title="SEARCH_LOGS" icon={Search}>
            <TacticalInput
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </TacticalCard>

          <TacticalCard title="CAMERAS" icon={Filter}>
            <div className="space-y-2">
              {subsystems.length === 0 && (
                <div className="text-[10px] font-mono text-text-dim/40 uppercase p-2">No cameras yet</div>
              )}
              {subsystems.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubsystemFilter(subsystemFilter === sub ? null : sub)}
                  className={`w-full flex justify-between items-center p-2 bg-surface-lowest border transition-colors group ${subsystemFilter === sub ? "border-primary-glow/60" : "border-white/5 hover:border-primary-glow/30"}`}
                >
                  <span className={`text-[10px] font-mono uppercase ${subsystemFilter === sub ? "text-primary-glow" : "text-text-dim group-hover:text-white"}`}>
                    {sub}
                  </span>
                  <ChevronRight className="w-3 h-3 text-text-dim/20 group-hover:text-primary-glow" />
                </button>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard title="LOG_LEVELS">
            <div className="grid grid-cols-2 gap-2">
              {(["INFO", "WARN", "ERROR", "DEBUG"] as Level[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                  className={`p-2 bg-surface-lowest border text-[9px] font-mono uppercase ${levelFilter === level ? "border-primary-glow/60 text-primary-glow" : "border-white/5 text-text-dim hover:text-white"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Terminal View */}
        <div className="col-span-12 lg:col-span-9 bg-surface-lowest border border-white/5 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none"></div>

          <div className="p-3 bg-surface-high border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary-glow" />
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                root@VTD:~# tail -f /var/log/detections
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar">
            {displayLogs.length === 0 && (
              <div className="text-text-dim/40 px-2">No log entries match the current filters.</div>
            )}
            {displayLogs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 group hover:bg-white/5 py-0.5 px-2 -mx-2 transition-colors"
              >
                <span className="text-text-dim/30 shrink-0" title={formatLogDateTime(log.timestamp)}>
                  [{formatLogTime(log.timestamp)}]
                </span>
                <span className={`w-16 shrink-0 font-bold ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-secondary-glow/60 shrink-0 w-24">
                  [{log.subsystem}]
                </span>
                <span className="text-white/80">{log.message}</span>
              </div>
            ))}
            <div className="flex gap-4 py-0.5 px-2 -mx-2">
              <span className="text-primary-glow animate-pulse">_</span>
            </div>
          </div>

          <div className="p-2 bg-surface-low border-t border-white/5 flex justify-between items-center px-4">
            <span className="text-[9px] font-mono text-text-dim/40 uppercase">
              Showing {displayLogs.length} entries
            </span>
            <div className="flex gap-4 text-[9px] font-mono text-text-dim/40 uppercase">
              <span className="text-text-dim/60" title="Times shown in your local timezone">TZ: {LOCAL_TZ}</span>
              <span>UTF-8</span>
              <span>VTD_OS v2.04</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
