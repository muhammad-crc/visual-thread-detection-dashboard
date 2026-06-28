import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  Camera,
  CheckCircle2,
  Cpu,
  FileText,
  Layers3,
  Network,
  ShieldCheck,
  Workflow,
  Zap
} from 'lucide-react';
import { TacticalCard } from './TacticalComponents';

const pipeline = [
  {
    title: 'CCTV input',
    text: 'Live camera, webcam, or recorded video enters the V7 runtime.',
    icon: Camera
  },
  {
    title: 'YOLOv8 firearm',
    text: 'Detects firearm evidence frame by frame with hard-negative training.',
    icon: Zap
  },
  {
    title: 'Action detection',
    text: 'MobileNetV3-Large extracts frame features; BiGRU reads temporal behavior.',
    icon: BrainCircuit
  },
  {
    title: 'Fusion layer',
    text: 'Combines firearm confidence, action score, margin, and person context.',
    icon: Layers3
  },
  {
    title: 'AI verifier',
    text: 'A trained offline verifier approves only strong multi-signal evidence.',
    icon: ShieldCheck
  },
  {
    title: 'FLAN-T5 report',
    text: 'Verified alerts receive short professional incident summaries.',
    icon: FileText
  }
];

const metrics = [
  ['V7 accuracy', '96.17%'],
  ['Precision', '98.12%'],
  ['F1 score', '96.94%'],
  ['False alert reduction', '44.4%']
];

const modelCards = [
  {
    title: 'YOLOv8 Firearm Detector',
    subtitle: 'Object evidence',
    body: 'Finds firearm-like regions in CCTV frames and provides confidence evidence for the fusion layer.',
    detail: 'mAP50 73.04% - best threshold 0.20'
  },
  {
    title: 'MobileNetV3-Large + BiGRU',
    subtitle: 'Action evidence',
    body: 'Reads 16-frame sequences to classify normal, fighting, and shoplifting patterns over time.',
    detail: 'Action accuracy 95.94% - macro F1 96.20%'
  },
  {
    title: 'Offline AI Verifier',
    subtitle: 'Decision guard',
    body: 'Learns when fused evidence is strong enough to become an alert, reducing phone-like and weak-frame false alarms.',
    detail: 'GradientBoosting verifier on V7 evidence'
  },
  {
    title: 'FLAN-T5 Small',
    subtitle: 'GenAI incident writer',
    body: 'Generates a concise report from verified evidence without requiring an external API during the live demo.',
    detail: 'Local offline GenAI report mode'
  }
];

export const DocumentationScreen = () => {
  return (
    <div className="space-y-7 pb-10">
      <section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch">
        <div className="min-h-[360px] flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase text-text-dim">
            <span className="h-2 w-2 bg-primary-glow animate-pulse"></span>
            V7 multimodal AI architecture
          </div>
          <h1 className="hero-title text-[clamp(3rem,7vw,7rem)] font-black text-white">
            How the system works
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-dim leading-relaxed">
            Visual Threat Detection does not trust one detector alone. It builds evidence from object detection,
            temporal action recognition, fusion scoring, and an offline AI verifier before the dashboard receives an alarm.
          </p>
        </div>

        <div className="noise-card p-5 sm:p-7 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metrics.map(([label, value]) => (
              <div key={label} className="border border-white/10 bg-black/25 p-4">
                <p className="font-mono text-[10px] text-text-dim uppercase">{label}</p>
                <p className="mt-3 font-mono text-2xl sm:text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 relative min-h-[230px] border border-white/10 bg-primary-glow overflow-hidden">
            <div className="absolute inset-0 blueprint-grid opacity-20"></div>
            <div className="absolute inset-0 scanline opacity-20"></div>
            <div className="absolute inset-x-5 top-5 flex items-center justify-between text-white">
              <Camera className="w-9 h-9" />
              <ArrowRight className="w-5 h-5" />
              <Workflow className="w-9 h-9" />
              <ArrowRight className="w-5 h-5" />
              <ShieldCheck className="w-9 h-9" />
              <ArrowRight className="w-5 h-5" />
              <BellRing className="w-9 h-9" />
            </div>
            <div className="absolute left-5 right-5 bottom-5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[10px] uppercase text-white">
              {['Camera', 'Fusion', 'Verify', 'Alert'].map((label) => (
                <div key={label} className="border border-white/30 bg-black/10 p-3">{label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="noise-card p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white uppercase">Evidence pipeline</h2>
            <p className="mt-2 text-text-dim">A short path from raw video to verified security intelligence.</p>
          </div>
          <span className="font-mono text-[10px] text-primary-glow uppercase">No cloud AI dependency required for the demo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          {pipeline.map((step, index) => (
            <div key={step.title} className="relative border border-white/10 bg-white/[0.03] p-4 min-h-[210px]">
              <div className="flex items-center justify-between">
                <step.icon className="w-7 h-7 text-primary-glow" />
                <span className="font-mono text-[10px] text-text-dim">0{index + 1}</span>
              </div>
              <h3 className="mt-8 font-headline text-lg font-bold text-white uppercase">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-dim">{step.text}</p>
              {index < pipeline.length - 1 && (
                <ArrowRight className="hidden xl:block absolute -right-3 top-1/2 z-10 w-6 h-6 bg-background text-white" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modelCards.map((card) => (
            <TacticalCard key={card.title}>
              <p className="font-mono text-[10px] uppercase text-primary-glow">{card.subtitle}</p>
              <h3 className="mt-3 font-headline text-xl font-bold text-white uppercase">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-dim">{card.body}</p>
              <div className="mt-5 border-t border-white/10 pt-3 font-mono text-[10px] text-white/75 uppercase">
                {card.detail}
              </div>
            </TacticalCard>
          ))}
        </div>

        <div className="noise-card p-5 sm:p-7">
          <h2 className="font-headline text-3xl font-bold text-white uppercase">Decision logic</h2>
          <p className="mt-3 text-text-dim leading-relaxed">
            The system raises alerts when multiple evidence channels agree. Weak firearm confidence, uncertain action
            scores, or isolated frames can be suppressed before they reach the operator.
          </p>

          <div className="mt-7 space-y-4">
            {[
              ['Collect evidence', 'firearm confidence, action probability, margin, person context'],
              ['Score risk', 'fusion vector estimates whether the scene is operationally dangerous'],
              ['Verify alert', 'offline AI verifier approves or suppresses the candidate incident'],
              ['Explain incident', 'FLAN-T5 produces a short report for the supervisor']
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4 border border-white/10 bg-black/25 p-4">
                <CheckCircle2 className="w-5 h-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-headline text-sm font-bold text-white uppercase">{title}</h3>
                  <p className="mt-1 text-sm text-text-dim">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 border border-white/10 bg-primary-glow p-5 text-white">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6" />
              <h3 className="font-headline text-xl font-bold uppercase">Operator promise</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Fewer panic alerts, faster verified response, and clear incident language for supervisors, guards,
              and industrial safety teams.
            </p>
          </div>
        </div>
      </section>

      <section className="noise-card p-5 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-center">
          <div>
            <Network className="w-14 h-14 text-primary-glow" />
            <h2 className="mt-5 font-headline text-3xl font-bold text-white uppercase">Deployment flow</h2>
            <p className="mt-3 text-text-dim leading-relaxed">
              The camera device detects threats, the FastAPI backend stores and broadcasts alerts, and this React
              dashboard gives operators live command visibility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              ['Camera device', 'Python V7 pipeline, annotated MJPEG stream, snapshots'],
              ['Backend', 'FastAPI ingest, MongoDB/Cloudinary, WebSocket broadcast'],
              ['Dashboard', 'React/Vite UI, live alerts, history, analytics, lightbox']
            ].map(([title, text]) => (
              <div key={title} className="min-h-44 border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-headline text-lg font-bold text-white uppercase">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text-dim">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
