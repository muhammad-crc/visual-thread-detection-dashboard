import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Clock,
  MapPin,
  Eye,
  Trash2,
  Filter,
  Download,
  Siren,
  Video,
  Wifi,
  WifiOff,
  ImageOff
} from 'lucide-react';
import { TacticalCard, TacticalButton } from './TacticalComponents';
import { ImageLightbox } from './ImageLightbox';
import { useAlerts } from '../useAlerts';

export const AlertsScreen = () => {
  const { alerts, connected, loading, error, remove } = useAlerts();
  const [lightbox, setLightbox] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <ImageLightbox
        url={lightbox?.url ?? null}
        title={lightbox?.title}
        subtitle={lightbox?.subtitle}
        onClose={() => setLightbox(null)}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-headline font-black tracking-widest text-white uppercase">Alert_Log</h1>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-accent-error/20 text-accent-error text-[10px] font-mono font-bold border border-accent-error/30">{criticalCount} CRITICAL</span>
            <span className="px-2 py-0.5 bg-secondary-glow/20 text-secondary-glow text-[10px] font-mono font-bold border border-secondary-glow/30">{warningCount} WARNING</span>
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border flex items-center gap-1 ${connected ? 'bg-primary-glow/20 text-primary-glow border-primary-glow/30' : 'bg-white/10 text-text-dim border-white/20'}`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <TacticalButton variant="ghost" className="text-[10px] py-2">
            <Filter className="w-3 h-3 mr-2" />
            Filter
          </TacticalButton>
          <TacticalButton variant="ghost" className="text-[10px] py-2">
            <Download className="w-3 h-3 mr-2" />
            Export
          </TacticalButton>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 font-mono text-[10px] text-primary-glow uppercase tracking-widest animate-pulse">
          Loading_Alerts...
        </div>
      )}

      {error && !loading && (
        <div className="bg-accent-error/10 border border-accent-error/30 p-4 font-mono text-[11px] text-accent-error">
          Could not reach backend ({error}). Is the FastAPI server running on the configured VITE_API_URL?
        </div>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div className="text-center py-12 font-mono text-[10px] text-text-dim/60 uppercase tracking-widest">
          No alerts yet. Waiting for detections...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, i) => {
          const subtitle = `${alert.type.toUpperCase()} · ${alert.cameraId} · ${alert.location} · ${(alert.confidence * 100).toFixed(1)}%`;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              className={`
                bg-surface-low border-l-4 p-6 flex gap-6 relative group
                ${alert.severity === 'critical' ? 'border-accent-error' :
                  alert.severity === 'warning' ? 'border-secondary-glow' : 'border-primary-glow'}
              `}
            >
              {/* Thumbnail (or icon if no snapshot) */}
              {alert.imageUrl ? (
                <button
                  onClick={() => setLightbox({ url: alert.imageUrl!, title: alert.type, subtitle })}
                  className="relative w-28 h-28 shrink-0 overflow-hidden border border-white/10 group/thumb"
                  title="Click to enlarge"
                >
                  <img src={alert.imageUrl} alt={alert.type} className="w-full h-full object-cover opacity-80 group-hover/thumb:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary-glow" />
                  </div>
                </button>
              ) : (
                <div className={`
                  w-28 h-28 flex flex-col items-center justify-center shrink-0 gap-1 border border-white/5
                  ${alert.severity === 'critical' ? 'bg-accent-error/10 text-accent-error' :
                    alert.severity === 'warning' ? 'bg-secondary-glow/10 text-secondary-glow' : 'bg-primary-glow/10 text-primary-glow'}
                `}>
                  {alert.severity === 'critical' ? <Siren className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                  <span className="text-[8px] font-mono uppercase text-text-dim/50 flex items-center gap-1"><ImageOff className="w-2.5 h-2.5" /> No snap</span>
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono font-bold text-text-dim/60">{alert.id.slice(-6).toUpperCase()}</span>
                      <h3 className="text-lg font-headline font-black text-white uppercase tracking-tight">{alert.type}</h3>
                    </div>
                    <div className="flex gap-4 text-[10px] font-mono text-text-dim/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location}</span>
                      <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {alert.cameraId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-text-dim/40 uppercase mb-1">AI_Confidence</div>
                    <div className={`text-sm font-mono font-bold ${alert.confidence > 0.9 ? 'text-primary-glow' : 'text-secondary-glow'}`}>
                      {(alert.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-dim leading-relaxed max-w-3xl">
                  {alert.description}
                </p>

                <div className="flex gap-3 pt-2">
                  {alert.imageUrl ? (
                    <TacticalButton variant="primary" className="text-[9px] py-1.5 px-4" onClick={() => setLightbox({ url: alert.imageUrl!, title: alert.type, subtitle })}>
                      <Eye className="w-3 h-3 mr-2" />
                      View Footage
                    </TacticalButton>
                  ) : (
                    <TacticalButton variant="ghost" className="text-[9px] py-1.5 px-4 opacity-50 cursor-not-allowed" disabled>
                      <ImageOff className="w-3 h-3 mr-2" />
                      No Snapshot
                    </TacticalButton>
                  )}
                  <TacticalButton
                    variant="ghost"
                    className="text-[9px] py-1.5 px-4 text-accent-error hover:bg-accent-error/10"
                    onClick={() => {
                      const msg = alert.imageUrl
                        ? 'Delete this alert and its snapshot from Cloudinary? This cannot be undone.'
                        : 'Delete this alert? This cannot be undone.';
                      if (window.confirm(msg)) remove(alert.id);
                    }}
                    title={alert.imageUrl ? 'Deletes the record and its Cloudinary image' : 'Deletes the record'}
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </TacticalButton>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none opacity-10">
                <div className="absolute top-[-25px] right-[-25px] w-[50px] h-[50px] bg-white rotate-45"></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <TacticalCard title="INCIDENT_TRENDS">
          <div className="h-24 flex items-end gap-1">
            {[40, 60, 30, 80, 50, 90, 40, 70, 30, 60, 80, 40].map((h, i) => (
              <div key={i} className="flex-1 bg-surface-high relative group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary-glow/40 group-hover:bg-primary-glow transition-all"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[8px] font-mono text-text-dim/40 uppercase">
            <span>T-12H</span>
            <span>T-0H</span>
          </div>
        </TacticalCard>

        <TacticalCard title="RESPONSE_METRICS">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-dim">Total Alerts</span>
                <span className="text-white">{alerts.length}</span>
              </div>
              <div className="w-full h-1 bg-surface-highest">
                <div className="h-full bg-secondary-glow" style={{ width: `${Math.min(alerts.length * 5, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-dim">Critical Share</span>
                <span className="text-white">{alerts.length ? ((criticalCount / alerts.length) * 100).toFixed(0) : 0}%</span>
              </div>
              <div className="w-full h-1 bg-surface-highest">
                <div className="h-full bg-accent-error" style={{ width: `${alerts.length ? (criticalCount / alerts.length) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard title="SYSTEM_HEALTH">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-surface-highest stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={connected ? 'text-primary-glow stroke-current' : 'text-accent-error stroke-current'}
                  strokeWidth="3"
                  strokeDasharray={connected ? '100, 100' : '20, 100'}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">
                {connected ? 'UP' : 'DN'}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-headline font-bold text-white uppercase">Backend_Link</div>
              <div className="text-[9px] font-mono text-text-dim/60">{connected ? 'LIVE STREAM ACTIVE' : 'DISCONNECTED'}</div>
            </div>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};
