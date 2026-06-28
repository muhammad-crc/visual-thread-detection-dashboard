import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Factory,
  Gauge,
  GraduationCap,
  Landmark,
  MonitorCheck,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Siren,
  Warehouse
} from 'lucide-react';
import { TacticalCard } from './TacticalComponents';

const useCases = [
  {
    title: 'Factories and production floors',
    icon: Factory,
    risk: 'Aggression, weapon risk, unsafe crowd behavior',
    result: 'Supervisors get verified alerts before an incident spreads.'
  },
  {
    title: 'Warehouses and logistics',
    icon: Warehouse,
    risk: 'Blind aisles, night shifts, theft, worker conflict',
    result: 'CCTV becomes a live prevention layer, not just evidence after the fact.'
  },
  {
    title: 'Retail and supermarkets',
    icon: ShoppingBag,
    risk: 'Shoplifting patterns and escalations near exits',
    result: 'Staff can respond early with confidence instead of watching every screen manually.'
  },
  {
    title: 'Schools and campuses',
    icon: GraduationCap,
    risk: 'Fighting, crowd tension, dangerous objects',
    result: 'Security teams receive fast visual context with a clear incident summary.'
  },
  {
    title: 'Banks and public counters',
    icon: Landmark,
    risk: 'Armed threat signals and panic situations',
    result: 'Critical alerts can reach the control room immediately with snapshot evidence.'
  },
  {
    title: 'Command rooms',
    icon: MonitorCheck,
    risk: 'Too many feeds, too few operators',
    result: 'The dashboard ranks attention by verified risk instead of raw camera volume.'
  }
];

const valuePoints = [
  ['Reduce missed threats', 'The system watches every frame while humans focus on decisions.'],
  ['Suppress weak alarms', 'Fusion and verifier logic reduce noise from phone-like objects or isolated frames.'],
  ['Explain what happened', 'GenAI summaries translate evidence into supervisor-ready incident language.'],
  ['Keep evidence visible', 'Snapshots, logs, analytics, and live camera context stay connected.']
];

export const UseCasesScreen = () => {
  return (
    <div className="space-y-7 pb-10">
      <section className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
        <div className="min-h-[370px] flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase text-text-dim">
            <span className="h-2 w-2 bg-primary-glow animate-pulse"></span>
            Built for real CCTV environments
          </div>
          <h1 className="hero-title text-[clamp(3rem,7vw,7.4rem)] font-black text-white">
            Why users need VTD
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-dim leading-relaxed">
            Most CCTV systems record incidents after they happen. VTD helps teams detect danger while there is still
            time to respond, verify, and document it.
          </p>
        </div>

        <div className="noise-card min-h-[370px] p-5 sm:p-7 overflow-hidden">
          <div className="relative h-full min-h-[320px] border border-white/10 bg-black/25">
            <div className="absolute inset-0 blueprint-grid opacity-20"></div>
            <div className="absolute inset-0 scanline opacity-20"></div>
            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
              <Camera className="w-12 h-12 text-white" />
              <ArrowRight className="w-6 h-6 text-white/70" />
              <ShieldAlert className="w-12 h-12 text-primary-glow" />
              <ArrowRight className="w-6 h-6 text-white/70" />
              <Siren className="w-12 h-12 text-accent-error" />
            </div>
            <div className="absolute left-6 right-6 bottom-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Observe', 'Verify', 'Respond'].map((label, index) => (
                <div key={label} className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-mono text-[10px] text-primary-glow">0{index + 1}</p>
                  <h3 className="mt-3 font-headline text-xl font-bold text-white uppercase">{label}</h3>
                  <p className="mt-2 text-sm text-text-dim">
                    {index === 0 && 'Camera streams are continuously watched by AI.'}
                    {index === 1 && 'Fusion logic confirms strong threat evidence.'}
                    {index === 2 && 'Operators receive snapshot, severity, and report.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {valuePoints.map(([title, text]) => (
          <TacticalCard key={title}>
            <CheckCircle2 className="w-6 h-6 text-primary-glow" />
            <h3 className="mt-5 font-headline text-xl font-bold text-white uppercase">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-dim">{text}</p>
          </TacticalCard>
        ))}
      </section>

      <section className="noise-card p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white uppercase">High-impact use cases</h2>
            <p className="mt-2 text-text-dim">Where manual CCTV monitoring fails, verified AI attention helps.</p>
          </div>
          <span className="font-mono text-[10px] text-primary-glow uppercase">Supervisor-ready evidence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {useCases.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/[0.03] p-5 min-h-[260px] flex flex-col">
              <item.icon className="w-9 h-9 text-primary-glow" />
              <h3 className="mt-6 font-headline text-xl font-bold text-white uppercase">{item.title}</h3>
              <div className="mt-5 space-y-3 text-sm">
                <div className="border-l-2 border-accent-error pl-3">
                  <p className="font-mono text-[10px] uppercase text-accent-error">Risk</p>
                  <p className="mt-1 text-text-dim">{item.risk}</p>
                </div>
                <div className="border-l-2 border-primary-glow pl-3">
                  <p className="font-mono text-[10px] uppercase text-primary-glow">VTD outcome</p>
                  <p className="mt-1 text-text-dim">{item.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <div className="noise-card p-5 sm:p-7">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white uppercase">What makes it different</h2>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Normal CCTV', 'Records video, but operators must discover danger manually.'],
              ['Single detector AI', 'Can trigger on weak frames, reflections, phones, or partial objects.'],
              ['VTD fusion AI', 'Requires multiple evidence signals and verifier approval before final alerts.'],
              ['VTD dashboard', 'Shows live feed, incident snapshots, logs, analytics, and documentation in one place.']
            ].map(([title, text], index) => (
              <div key={title} className={`border p-5 min-h-40 ${index >= 2 ? 'border-primary-glow/50 bg-primary-glow/10' : 'border-white/10 bg-black/25'}`}>
                <p className="font-mono text-[10px] text-text-dim uppercase">0{index + 1}</p>
                <h3 className="mt-4 font-headline text-xl font-bold text-white uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-dim">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="noise-card p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <Gauge className="w-8 h-8 text-primary-glow" />
            <h2 className="font-headline text-3xl font-bold text-white uppercase">Panel pitch</h2>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-white">
            VTD is a real-time visual intelligence layer for CCTV. It detects firearm risk, fighting, and shoplifting
            patterns, verifies the evidence, and gives the operator a clean alert with proof.
          </p>
          <div className="mt-7 space-y-3">
            {[
              'For supervisors: faster awareness and clearer reports.',
              'For guards: fewer screens to manually watch every second.',
              'For industry: safer sites, lower response time, better audit evidence.'
            ].map((text) => (
              <div key={text} className="flex gap-3 border border-white/10 bg-white/[0.03] p-4">
                <AlertTriangle className="w-5 h-5 text-primary-glow shrink-0 mt-0.5" />
                <span className="text-sm text-text-dim">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 border border-white/10 bg-primary-glow p-5 text-white">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              <h3 className="font-headline text-xl font-bold uppercase">Ideal buyer</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Any site with CCTV, human safety risk, theft risk, or high monitoring workload: factories, warehouses,
              campuses, public counters, and security command rooms.
            </p>
          </div>
        </div>
      </section>

      <section className="noise-card p-5 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center">
          <div>
            <ShieldCheck className="w-14 h-14 text-primary-glow" />
            <h2 className="mt-5 font-headline text-3xl font-bold text-white uppercase">Operator workflow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              ['1', 'Alert appears live'],
              ['2', 'Operator opens snapshot'],
              ['3', 'Checks confidence and report'],
              ['4', 'Responds or archives evidence']
            ].map(([num, text]) => (
              <div key={num} className="border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-primary-glow">{num}</p>
                <p className="mt-4 text-sm text-text-dim">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
