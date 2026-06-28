import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Maximize2,
  Activity,
  ImageOff,
  Video,
  VideoOff,
  RefreshCw
} from 'lucide-react';
import { TacticalInput, TacticalButton } from './TacticalComponents';
import { ImageLightbox } from './ImageLightbox';
import { useAlerts } from '../useAlerts';
import { streamUrl } from '../api';
import { Alert } from '../types';

type CamStatus = 'online' | 'offline' | 'alert';

interface DerivedCamera {
  id: string;
  name: string;
  status: CamStatus;
  thumbnail: string | null;
  total: number;
  critical: number;
  lastSeen: string | null;
  latest?: Alert;
}

const RECENT_MS = 5 * 60 * 1000; // a camera is "alert" if it had a critical alert in the last 5 min
const DEFAULT_CAMERA_ID: string = (import.meta as any).env?.VITE_DEFAULT_CAMERA_ID || 'CAM_01';
const DEFAULT_CAMERA_LOCATION: string = (import.meta as any).env?.VITE_DEFAULT_CAMERA_LOCATION || 'Lab';

export const CamerasScreen = () => {
  const { alerts, connected } = useAlerts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(true);   // prefer live video over snapshot
  const [streamFailed, setStreamFailed] = useState(false); // device stream unreachable
  const [streamNonce, setStreamNonce] = useState(0); // bump to force the <img> to reconnect

  // Build a camera list from the alerts we've received.
  const cameras = useMemo<DerivedCamera[]>(() => {
    const byCam = new Map<string, Alert[]>();
    for (const a of alerts) {
      if (!byCam.has(a.cameraId)) byCam.set(a.cameraId, []);
      byCam.get(a.cameraId)!.push(a);
    }
    const now = Date.now();
    const derived: DerivedCamera[] = Array.from(byCam.entries()).map(([id, list]) => {
      const sorted = [...list].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
      const latest = sorted[0];
      const recentCritical = sorted.some(
        (a) => a.severity === 'critical' && now - +new Date(a.timestamp) < RECENT_MS
      );
      const withImage = sorted.find((a) => a.imageUrl);
      return {
        id,
        name: latest?.location || id,
        status: recentCritical ? 'alert' : connected ? 'online' : 'offline',
        thumbnail: withImage?.imageUrl ?? null,
        total: list.length,
        critical: list.filter((a) => a.severity === 'critical').length,
        lastSeen: latest?.timestamp ?? null,
        latest
      };
    });

    if (!derived.some((cam) => cam.id === DEFAULT_CAMERA_ID)) {
      derived.unshift({
        id: DEFAULT_CAMERA_ID,
        name: DEFAULT_CAMERA_LOCATION,
        status: 'online',
        thumbnail: null,
        total: 0,
        critical: 0,
        lastSeen: null
      });
    }

    return derived;
  }, [alerts, connected]);

  // Auto-select the first camera once data arrives.
  useEffect(() => {
    if (!selectedId && cameras.length) setSelectedId(cameras[0].id);
  }, [cameras, selectedId]);

  // When the selected camera changes, retry the live stream from scratch.
  useEffect(() => {
    setStreamFailed(false);
    setStreamNonce((n) => n + 1);
  }, [selectedId]);

  const filtered = cameras.filter(
    (cam) =>
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = cameras.find((c) => c.id === selectedId) || null;

  // Show the live MJPEG feed when the operator wants it and the device stream is reachable.
  const showLive = !!selected && liveMode && !streamFailed;
  const liveSrc = selected ? `${streamUrl(selected.id)}&n=${streamNonce}` : '';

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <ImageLightbox url={lightbox} title={selected?.id} subtitle={selected?.name} onClose={() => setLightbox(null)} />

      {/* Left: Camera List */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        <div className="space-y-4">
          <TacticalInput placeholder="Search nodes..." icon={Search} value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
          <div className="flex gap-2">
            <TacticalButton variant="ghost" className="flex-1 text-[10px] py-2">
              <Filter className="w-3 h-3 mr-2" />
              Filter
            </TacticalButton>
            <TacticalButton variant="ghost" className="flex-1 text-[10px] py-2">
              <Activity className="w-3 h-3 mr-2" />
              Status
            </TacticalButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {filtered.length === 0 && (
            <div className="text-[10px] font-mono text-text-dim/50 uppercase p-3">No cameras match this search.</div>
          )}
          {filtered.map((cam) => (
            <button
              key={cam.id}
              onClick={() => setSelectedId(cam.id)}
              className={`
                w-full text-left p-3 border transition-all duration-300 relative group
                ${selectedId === cam.id ? 'bg-surface-high border-primary-glow/50' : 'bg-surface-low border-white/5 hover:border-white/20'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-mono font-bold ${selectedId === cam.id ? 'text-primary-glow' : 'text-text-dim'}`}>{cam.id}</span>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-primary-glow' : cam.status === 'alert' ? 'bg-accent-error animate-pulse' : 'bg-text-dim/30'}`}></span>
                  <span className="text-[8px] font-mono text-text-dim/60 uppercase">{cam.status}</span>
                </div>
              </div>
              <div className="text-xs font-headline font-bold text-white mb-1">{cam.name}</div>
              <div className="text-[9px] font-mono text-text-dim/40 tracking-widest">{cam.total} ALERTS // {cam.critical} CRITICAL</div>
              {selectedId === cam.id && (
                <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-primary-glow shadow-[0_0_10px_#00ffaa]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Main Viewport (live feed / latest snapshot) */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
        <div className="relative flex-1 bg-surface-lowest border border-white/5 overflow-hidden group min-h-[300px]">
          <AnimatePresence mode="wait">
            {showLive ? (
              <motion.img
                key={'live-' + selected!.id + '-' + streamNonce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={liveSrc}
                alt={`${selected!.name} live`}
                className="w-full h-full object-cover"
                onError={() => setStreamFailed(true)}
              />
            ) : selected?.thumbnail ? (
              <motion.img
                key={selected.id + selected.thumbnail}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={selected.thumbnail}
                alt={selected.name}
                className="w-full h-full object-cover opacity-80 cursor-zoom-in"
                onClick={() => selected.thumbnail && setLightbox(selected.thumbnail)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-dim/30">
                <ImageOff className="w-10 h-10" />
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  {liveMode && streamFailed ? 'Live stream offline - no snapshot yet' : 'No snapshot available'}
                </span>
              </div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none"></div>

          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {showLive ? (
                <div className="bg-accent-error text-white px-3 py-1 font-headline font-black text-xs tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
              ) : (
                <div className="bg-primary-glow text-surface-lowest px-3 py-1 font-headline font-black text-xs tracking-widest uppercase">LATEST_SNAPSHOT</div>
              )}
              <div className="bg-background/80 border border-white/10 px-3 py-1 font-mono text-xs text-white">{selected ? `${selected.id} // ${selected.name}` : '-'}</div>
            </div>
            {selected?.status === 'alert' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-error rounded-full animate-pulse"></span>
                <span className="font-mono text-[10px] text-accent-error tracking-widest uppercase">Active_Threat</span>
              </div>
            )}
          </div>

          <div className="absolute top-6 right-6 flex gap-2">
            {/* Reconnect - only useful while attempting a live feed */}
            {liveMode && (
              <button
                title="Reconnect live stream"
                onClick={() => { setStreamFailed(false); setStreamNonce((n) => n + 1); }}
                className="p-2 bg-background/60 hover:bg-primary-glow hover:text-surface-lowest transition-all border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            {/* Toggle between live video and latest snapshot */}
            <button
              title={liveMode ? 'Switch to latest snapshot' : 'Switch to live video'}
              onClick={() => { setLiveMode((v) => !v); setStreamFailed(false); setStreamNonce((n) => n + 1); }}
              className={`p-2 transition-all border border-white/10 ${liveMode ? 'bg-accent-error/80 text-white' : 'bg-background/60 hover:bg-primary-glow hover:text-surface-lowest'}`}
            >
              {liveMode ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button
              title={showLive ? 'Fullscreen live feed' : 'Fullscreen snapshot'}
              onClick={() => {
                const url = showLive ? liveSrc : selected?.thumbnail;
                if (url) setLightbox(url);
              }}
              className="p-2 bg-background/60 hover:bg-primary-glow hover:text-surface-lowest transition-all border border-white/10"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="font-mono text-lg text-white tracking-widest">
              {selected?.lastSeen ? new Date(selected.lastSeen).toLocaleTimeString() : '--:--:--'}
              <span className="text-primary-glow/40 text-sm ml-2">LAST</span>
            </div>
          </div>
        </div>

        <div className="h-16 bg-surface-low border border-white/5 flex items-center px-6 gap-6 font-mono text-[10px] text-text-dim">
          <span>NODE: <span className="text-white">{selected?.id ?? '-'}</span></span>
          <span>STATUS: <span className={selected?.status === 'alert' ? 'text-accent-error' : connected ? 'text-primary-glow' : 'text-text-dim'}>{selected?.status ?? '-'}</span></span>
          <span>TOTAL: <span className="text-white">{selected?.total ?? 0}</span></span>
          <span className="ml-auto text-text-dim/40">
            {showLive
              ? 'Live video stream connected'
              : liveMode && streamFailed
                ? 'Live stream offline - check the pipeline (VITE_STREAM_URL). Showing snapshots.'
                : 'Snapshot mode - showing latest detection image'}
          </span>
        </div>
      </div>
    </div>
  );
};
