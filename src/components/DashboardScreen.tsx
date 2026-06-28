import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Camera,
  Cpu,
  Eye,
  Gauge,
  Layers3,
  Radar,
  ShieldCheck,
  Siren,
  TrendingUp,
  Workflow
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TacticalCard } from './TacticalComponents';
import { ImageLightbox } from './ImageLightbox';
import { useAlerts } from '../useAlerts';

const AnimatedWorkflow = () => (
  <div className="relative h-full min-h-[360px] overflow-hidden noise-card">
    <div className="absolute inset-0 blueprint-grid opacity-20"></div>
    <div className="absolute inset-y-0 right-0 w-[68%] bg-primary-glow"></div>
    <div className="absolute inset-y-0 left-0 w-[36%] bg-black/40 border-r border-white/40"></div>
    <div className="absolute inset-0 scanline opacity-20"></div>

    <div className="absolute top-5 left-6 right-6 z-10 flex justify-between font-mono text-xs uppercase text-white/90">
      <span>Before</span>
      <span>After</span>
    </div>

    <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
      <div className="float-lines space-y-5 text-white/75">
        <div className="flex items-center gap-3">
          <Camera className="w-9 h-9 outline-icon" />
          <div className="h-px w-20 bg-white/55"></div>
          <span className="font-mono text-[10px] uppercase">raw cctv</span>
        </div>
        <div className="flex items-center gap-3 ml-8">
          <Radar className="w-10 h-10 outline-icon" />
          <div className="h-px w-16 bg-white/55"></div>
          <span className="font-mono text-[10px] uppercase">weak signal</span>
        </div>
        <div className="flex items-center gap-3">
          <Workflow className="w-9 h-9 outline-icon" />
          <div className="h-px w-24 bg-white/55"></div>
          <span className="font-mono text-[10px] uppercase">manual review</span>
        </div>
      </div>
    </div>

    <div className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-surface-lowest flex items-center justify-center shadow-2xl">
      <ArrowRight className="w-5 h-5" />
    </div>

    <div className="absolute right-6 top-20 bottom-8 left-[42%] z-10 flex flex-col justify-between">
      <div className="font-mono text-white/90 text-[11px] sm:text-sm leading-7">
        <p>pipeline.run()</p>
        <p>{'{'}</p>
        <p>  yolo.firearm(frame)</p>
        <p>  action.bigru(sequence)</p>
        <p>  fusion.verify(evidence)</p>
        <p>  flanT5.report(alert)</p>
        <p>{'}'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono uppercase">
        {[
          ['YOLO', 'firearm evidence'],
          ['BiGRU', 'temporal action'],
          ['Verifier', 'false alert guard'],
          ['FLAN-T5', 'incident report']
        ].map(([label, value]) => (
          <div key={label} className="border border-white/30 bg-black/10 px-3 py-2 text-white">
            <p className="font-bold">{label}</p>
            <p className="text-white/70 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProcessCarousel = () => {
  const steps = [
    {
      index: '01',
      title: 'Watch CCTV live',
      text: 'Every frame is scored without changing how operators already monitor cameras.',
      icon: Camera
    },
    {
      index: '02',
      title: 'Fuse the evidence',
      text: 'Firearm confidence, action probability, person context, and temporal votes are combined.',
      icon: Layers3
    },
    {
      index: '03',
      title: 'Verify before alert',
      text: 'The offline AI verifier suppresses weak single-frame detections before alarms reach the dashboard.',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="noise-card overflow-hidden p-5 sm:p-8">
      <div className="overflow-hidden">
        <div className="slide-track flex w-[300%]">
          {steps.map((step) => (
            <div key={step.index} className="w-1/3 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-center pr-6">
              <div className="min-h-48 flex items-center justify-center">
                <step.icon className="w-36 h-36 sm:w-44 sm:h-44 outline-icon stroke-[1.2]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-primary-glow"></span>
                  <span className="font-mono text-white">{step.index}</span>
                </div>
                <h2 className="font-headline text-3xl sm:text-5xl font-bold text-white uppercase">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-xl text-text-dim text-base sm:text-lg leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 step-rail"></div>
        <div className="h-px flex-1 bg-white/20"></div>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
    </section>
  );
};

export const DashboardScreen = () => {
  const { alerts, connected } = useAlerts();
  const [lightbox, setLightbox] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const snapshots = alerts.filter((a) => a.imageUrl);
  const cameras = new Set(alerts.map((a) => a.cameraId));
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentCount = alerts.filter((a) => new Date(a.timestamp).getTime() >= oneHourAgo).length;
  const recentCritical = alerts.filter(
    (a) => a.severity === 'critical' && new Date(a.timestamp).getTime() >= oneHourAgo
  ).length;
  const threatIndex = recentCount ? recentCritical / recentCount : 0;

  const countByType = (type: string) => alerts.filter((a) => a.type.toLowerCase() === type).length;
  const clusters = [
    { label: 'FIREARM', count: countByType('weapon'), color: 'bg-accent-error' },
    { label: 'FIGHTING', count: countByType('fighting'), color: 'bg-primary-glow' },
    { label: 'SHOPLIFTING', count: countByType('shoplifting'), color: 'bg-secondary-glow' }
  ];
  const maxCluster = Math.max(1, ...clusters.map((c) => c.count));

  const chartData = useMemo(() => {
    const series = alerts
      .slice(0, 7)
      .reverse()
      .map((a, i) => ({ time: i, value: Math.round(a.confidence * 100) }));
    return series.length ? series : [{ time: 0, value: 0 }];
  }, [alerts]);

  const avgConf = alerts.length
    ? (alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length) * 100
    : 0;

  const kpis = [
    { label: 'Active cameras', value: String(cameras.size || 0), trend: connected ? 'Live link' : 'Offline', icon: Camera },
    { label: 'Threat index', value: threatIndex.toFixed(2), trend: threatIndex > 0.5 ? 'Elevated' : 'Stable', icon: Gauge },
    { label: 'Critical alerts', value: String(criticalCount).padStart(2, '0'), trend: criticalCount ? 'Action needed' : 'Clear', icon: Siren },
    { label: 'Total alerts', value: String(alerts.length), trend: `${recentCount} in 1h`, icon: Activity }
  ];

  const borderForSeverity = (sev: string) =>
    sev === 'critical' ? 'border-accent-error' : sev === 'warning' ? 'border-secondary-glow' : 'border-primary-glow';

  return (
    <div className="space-y-7 pb-10">
      <ImageLightbox
        url={lightbox?.url ?? null}
        title={lightbox?.title}
        subtitle={lightbox?.subtitle}
        onClose={() => setLightbox(null)}
      />

      <section className="grid grid-cols-1 xl:grid-cols-[0.82fr_1.18fr] gap-6 items-stretch">
        <div className="min-h-[420px] flex flex-col justify-center py-10">
          <div className="mb-6 inline-flex w-fit items-center gap-2 border border-white/20 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase text-text-dim">
            <span className={`h-2 w-2 ${connected ? 'bg-primary-glow animate-pulse' : 'bg-accent-error'}`}></span>
            {connected ? 'Live backend connected' : 'Backend waiting'}
          </div>
          <h1 className="hero-title text-[clamp(3.7rem,8vw,8.5rem)] font-black text-white">
            Threats do not have to be missed
          </h1>
          <p className="mt-7 max-w-xl text-lg text-text-dim leading-relaxed">
            VTD turns ordinary CCTV into a verified AI security layer: firearm evidence, temporal action detection,
            fusion scoring, and GenAI incident summaries in one operator dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['YOLOv8 firearm', 'MobileNetV3 + BiGRU', 'AI verifier', 'FLAN-T5 report'].map((item) => (
              <span key={item} className="border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase text-white/80">
                {item}
              </span>
            ))}
          </div>
        </div>
        <AnimatedWorkflow />
      </section>

      <ProcessCarousel />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <TacticalCard key={i}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-text-dim uppercase">{kpi.label}</span>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-4xl font-mono font-black text-white">{kpi.value}</span>
                  <span className="text-[10px] text-primary-glow uppercase">{kpi.trend}</span>
                </div>
              </div>
              <kpi.icon className="w-6 h-6 text-primary-glow/70" />
            </div>
          </TacticalCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 xl:col-span-3 noise-card flex flex-col overflow-hidden min-h-[520px]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xs font-headline font-bold text-white uppercase">Live threat stream</h2>
            <span className={`text-[9px] font-mono flex items-center gap-1 uppercase ${connected ? 'text-primary-glow animate-pulse' : 'text-text-dim'}`}>
              {connected ? 'REC' : 'OFF'} <span className={`w-1.5 h-1.5 ${connected ? 'bg-primary-glow' : 'bg-text-dim'}`}></span>
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {alerts.length === 0 && (
              <div className="text-center py-10 text-[10px] font-mono text-text-dim/60 uppercase">No threats detected</div>
            )}
            {alerts.slice(0, 30).map((alert) => (
              <div key={alert.id} className={`p-3 bg-black/30 border-l-2 ${borderForSeverity(alert.severity)} flex flex-col gap-1`}>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-white/90 uppercase truncate">{alert.type} - {alert.cameraId}</span>
                  <span className="text-[9px] font-mono text-text-dim/50 shrink-0">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-[11px] text-text-dim leading-relaxed">{alert.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 xl:col-span-6 noise-card flex flex-col overflow-hidden min-h-[520px]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xs font-headline font-bold text-white uppercase">Recent snapshots</h2>
            <span className="text-[9px] font-mono text-text-dim/60 uppercase">{snapshots.length} captured</span>
          </div>
          {snapshots.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-dim/40">
              <Activity className="w-7 h-7" />
              <span className="text-[10px] font-mono uppercase">No snapshots yet</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                {snapshots.map((alert) => {
                  const subtitle = `${alert.type.toUpperCase()} - ${alert.cameraId} - ${alert.location} - ${(alert.confidence * 100).toFixed(1)}%`;
                  return (
                    <button
                      key={alert.id}
                      onClick={() => setLightbox({ url: alert.imageUrl!, title: alert.type, subtitle })}
                      className="relative group aspect-video bg-surface-lowest overflow-hidden border border-white/10 hover:border-primary-glow/70 transition-colors"
                      title="Click to enlarge"
                    >
                      <img src={alert.imageUrl!} alt={alert.type} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-primary-glow/0 group-hover:bg-primary-glow/20 transition-colors flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-background/80 px-1.5 py-0.5 text-[8px] font-mono border border-white/10 text-white">{alert.cameraId}</span>
                        <span className="bg-accent-error/80 px-1.5 text-[8px] font-bold text-white flex items-center">{alert.type.toUpperCase()}</span>
                      </div>
                      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/70 bg-background/70 px-1.5">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="col-span-12 xl:col-span-3 space-y-6">
          <TacticalCard title="AI confidence" icon={TrendingUp}>
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1853ff" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#1853ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#8fb0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-text-dim/60 uppercase">
              <span>Recent</span>
              <span>Avg {avgConf.toFixed(1)}%</span>
              <span>Live</span>
            </div>
          </TacticalCard>

          <TacticalCard title="Detection clusters" icon={BrainCircuit}>
            <div className="space-y-4">
              {clusters.map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-text-dim">{stat.label}</span>
                    <span className="text-white">{stat.count}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.count / maxCluster) * 100}%` }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard title="System diagnostics" icon={Cpu}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Backend', value: connected ? 'Online' : 'Offline', color: connected ? 'text-primary-glow' : 'text-accent-error' },
                { label: 'Stream', value: connected ? 'Live' : 'Down', color: connected ? 'text-primary-glow' : 'text-accent-error' },
                { label: 'Cameras', value: String(cameras.size || 0), color: 'text-secondary-glow' },
                { label: 'Alerts', value: String(alerts.length), color: 'text-white' }
              ].map((diag, i) => (
                <div key={i} className="bg-black/30 p-2 border border-white/10">
                  <div className="text-[8px] text-text-dim/70 font-mono uppercase">{diag.label}</div>
                  <div className={`text-xs font-mono ${diag.color}`}>{diag.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 ${connected ? 'bg-primary-glow animate-pulse' : 'bg-accent-error'}`}></div>
              <span className={`text-[9px] font-mono uppercase ${connected ? 'text-primary-glow' : 'text-accent-error'}`}>
                {connected ? 'Network backbone stable' : 'Backend unreachable'}
              </span>
            </div>
          </TacticalCard>
        </section>
      </div>
    </div>
  );
};
