import { useEffect, useState } from 'react';
import { Shield, Network, Cpu, Bell, Eye, Lock, Save, RefreshCw, Check } from 'lucide-react';
import { TacticalCard, TacticalToggle, TacticalInput, TacticalButton } from './TacticalComponents';

const API_URL: string = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'vtd_dashboard_settings';

interface DashboardSettings {
  nodeId: string;
  backendUrl: string;
  detectionSensitivity: number; // 0-100
  fpFilter: number; // 0-100
  threatIsolation: boolean;
  encryptedUplink: boolean;
  pushAlerts: boolean;
  emailSummaries: boolean;
  audioCues: boolean;
}

const DEFAULTS: DashboardSettings = {
  nodeId: 'NODE_ALPHA_01',
  backendUrl: API_URL,
  detectionSensitivity: 85,
  fpFilter: 60,
  threatIsolation: true,
  encryptedUplink: true,
  pushAlerts: true,
  emailSummaries: false,
  audioCues: true
};

function loadSettings(): DashboardSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export const ConfigScreen = () => {
  const [settings, setSettings] = useState<DashboardSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const update = <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const fpLabel = settings.fpFilter > 66 ? 'Aggressive' : settings.fpFilter > 33 ? 'Balanced' : 'Lenient';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-black tracking-widest text-white uppercase">System_Configuration</h1>
        <div className="flex gap-3">
          <TacticalButton variant="ghost" className="text-[10px] py-2" onClick={handleReset}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Reset
          </TacticalButton>
          <TacticalButton variant="primary" className="text-[10px] py-2" onClick={handleSave}>
            {saved ? <Check className="w-3 h-3 mr-2" /> : <Save className="w-3 h-3 mr-2" />}
            {saved ? 'Saved' : 'Save Changes'}
          </TacticalButton>
        </div>
      </div>

      <p className="text-[11px] font-mono text-text-dim/60 leading-relaxed bg-surface-low border-l-2 border-secondary-glow/30 p-4">
        These are <span className="text-secondary-glow">dashboard-side preferences</span> (saved in your browser). Detection
        thresholds on the camera device are set when launching the pipeline, e.g.
        <span className="text-white"> --fight-conf 0.55 --weapon-conf 0.70</span>. The values here are a reference for the operator.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TacticalCard title="SECURITY_PROTOCOLS" icon={Shield}>
          <div className="space-y-6">
            <TacticalToggle label="AI Threat Isolation" description="Highlight critical-threat nodes automatically." active={settings.threatIsolation} onToggle={() => update('threatIsolation', !settings.threatIsolation)} />
            <TacticalToggle label="Encrypted Uplink" description="Force 256-bit AES encryption on outgoing streams." active={settings.encryptedUplink} onToggle={() => update('encryptedUplink', !settings.encryptedUplink)} />
          </div>
        </TacticalCard>

        <TacticalCard title="NETWORK_TOPOLOGY" icon={Network}>
          <div className="space-y-4">
            <TacticalInput label="Primary Node ID" value={settings.nodeId} onChange={(e: any) => update('nodeId', e.target.value)} icon={Cpu} />
            <TacticalInput label="Backend URL" value={settings.backendUrl} onChange={(e: any) => update('backendUrl', e.target.value)} icon={Network} />
            <p className="text-[9px] font-mono text-text-dim/40 pt-1">Backend in use: {API_URL} (set via VITE_API_URL)</p>
          </div>
        </TacticalCard>

        <TacticalCard title="NOTIFICATION_ENGINE" icon={Bell}>
          <div className="space-y-6">
            <TacticalToggle label="Push Alerts" description="Show live toast notifications on new detections." active={settings.pushAlerts} onToggle={() => update('pushAlerts', !settings.pushAlerts)} />
            <TacticalToggle label="Email Summaries" description="Generate daily intelligence reports." active={settings.emailSummaries} onToggle={() => update('emailSummaries', !settings.emailSummaries)} />
            <TacticalToggle label="Audio Cues" description="Enable terminal alerts for critical events." active={settings.audioCues} onToggle={() => update('audioCues', !settings.audioCues)} />
          </div>
        </TacticalCard>

        <TacticalCard title="AI_MODEL_PARAMETERS" icon={Eye}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span className="text-text-dim">Detection Sensitivity</span>
                <span className="text-primary-glow">{settings.detectionSensitivity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.detectionSensitivity}
                onChange={(e) => update('detectionSensitivity', Number(e.target.value))}
                className="w-full accent-primary-glow bg-surface-highest h-1 appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span className="text-text-dim">False Positive Filter</span>
                <span className="text-secondary-glow">{fpLabel}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.fpFilter}
                onChange={(e) => update('fpFilter', Number(e.target.value))}
                className="w-full accent-secondary-glow bg-surface-highest h-1 appearance-none cursor-pointer"
              />
            </div>
          </div>
        </TacticalCard>
      </div>

      <div className="bg-accent-error/5 border border-accent-error/20 p-6 flex items-start gap-4">
        <Lock className="w-6 h-6 text-accent-error shrink-0" />
        <div>
          <h3 className="text-sm font-headline font-black text-accent-error uppercase mb-1">Danger Zone</h3>
          <p className="text-xs text-text-dim mb-4">
            Clears all saved dashboard preferences from this browser and restores defaults.
          </p>
          <TacticalButton variant="error" className="text-[10px] py-2 px-6" onClick={handleReset}>
            Clear Saved Settings
          </TacticalButton>
        </div>
      </div>
    </div>
  );
};
