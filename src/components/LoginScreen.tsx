import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Fingerprint,
  AlertCircle,
  Eye,
  Lock,
  Hash,
} from "lucide-react";
import { TacticalButton, TacticalInput } from "./TacticalComponents";

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [operatorId, setOperatorId] = useState("");
  const [accessSequence, setAccessSequence] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-start md:justify-center relative overflow-x-hidden overflow-y-auto pb-28 md:pb-0">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 scanline opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none">
          <Eye size={600} className="text-primary-glow" />
        </div>
        <div className="hidden md:flex absolute top-1/2 right-12 -translate-y-1/2 flex-col gap-2 opacity-10">
          <div className="w-1 h-32 bg-secondary-glow"></div>
          <div className="w-1 h-8 bg-secondary-glow"></div>
          <div className="w-1 h-16 bg-secondary-glow"></div>
        </div>
        <div className="hidden md:flex absolute top-1/2 left-12 -translate-y-1/2 flex-col gap-2 opacity-10">
          <div className="w-1 h-12 bg-primary-glow"></div>
          <div className="w-1 h-48 bg-primary-glow"></div>
          <div className="w-1 h-24 bg-primary-glow"></div>
        </div>
      </div>

      {/* Mobile: compact header - status stacked below title to avoid overlap */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-sm pt-[max(0.75rem,env(safe-area-inset-top))] px-4 pb-3">
        <div className="font-headline font-black text-lg leading-tight tracking-[0.12em] text-primary-glow">
          Visual Threat Detection
        </div>
        <div className="mt-1 font-mono text-[11px] text-text-dim tracking-widest uppercase">
          Global Surveillance Network // v2.04
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 pt-3">
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
              Uplink status
            </span>
            <span className="font-mono text-[11px] text-secondary-glow flex items-center gap-2">
              <span className="w-1.5 h-1.5 shrink-0 bg-secondary-glow rounded-full animate-pulse"></span>
              <span className="truncate">ACTIVE_ENCRYPTED</span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5 border-l border-white/10 pl-4">
            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
              Latency
            </span>
            <span className="font-mono text-[11px] text-primary-glow">14MS</span>
          </div>
        </div>
      </header>

      {/* Desktop: Top Left Identity Anchor */}
      <div className="hidden md:flex fixed top-6 left-8 flex-col gap-1 z-50">
        <div className="font-headline font-black text-2xl tracking-[0.2em] text-primary-glow">
          Visual Threat Detection
        </div>
        <div className="font-mono text-[10px] text-text-dim tracking-widest uppercase">
          Global Surveillance Network // v2.04
        </div>
      </div>

      {/* Desktop: Top Right Status Indicators */}
      <div className="hidden md:flex fixed top-6 right-8 gap-6 z-50">
        <div className="flex flex-col items-end">
          <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">
            UPLINK STATUS
          </span>
          <span className="font-mono text-[10px] text-secondary-glow flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-secondary-glow rounded-full animate-pulse"></span>
            ACTIVE_ENCRYPTED
          </span>
        </div>
        <div className="flex flex-col items-end border-l border-white/10 pl-6">
          <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">
            LATENCY
          </span>
          <span className="font-mono text-[10px] text-primary-glow">14MS</span>
        </div>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px] px-4 sm:px-6 flex-1 md:flex-none flex flex-col justify-start md:justify-center py-6 md:py-0"
      >
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="w-16 h-16 bg-surface-high border border-primary-glow/30 flex items-center justify-center mb-5 md:mb-6 relative">
            <div className="absolute inset-0 bg-primary-glow/5 blur-xl"></div>
            <Shield className="text-primary-glow w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-glow"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary-glow"></div>
          </div>
          <h1 className="hidden md:block font-headline text-3xl font-black text-white uppercase text-center mb-2">
            Visual Threat Detection
          </h1>
          <p className="font-mono text-[11px] md:text-[10px] text-text-dim tracking-[0.2em] md:tracking-[0.25em] uppercase border-y border-white/10 py-1.5 px-1 text-center">
            Biometric Verification Required
          </p>
        </div>

        <div className="bg-surface-low border-l-2 border-secondary-glow p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TacticalInput
              label="Operator Identifier"
              placeholder="NODE_ADMIN_XXXX"
              icon={Hash}
              value={operatorId}
              onChange={(e: any) => setOperatorId(e.target.value)}
            />
            <TacticalInput
              label="Access Sequence"
              type="password"
              placeholder="************"
              icon={Lock}
              value={accessSequence}
              onChange={(e: any) => setAccessSequence(e.target.value)}
            />

            <TacticalButton
              type="submit"
              className="w-full flex items-center justify-center gap-3"
            >
              Authorize Access
              <Fingerprint className="w-5 h-5" />
            </TacticalButton>

            <div className="flex justify-between items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                className="font-headline text-[10px] md:text-[9px] font-bold tracking-widest text-text-dim hover:text-secondary-glow transition-colors uppercase text-left"
              >
                Terminal Recovery
              </button>
              <button
                type="button"
                className="font-headline text-[10px] md:text-[9px] font-bold tracking-widest text-text-dim hover:text-secondary-glow transition-colors uppercase text-right"
              >
                Secure Proxy
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 md:mt-8 flex items-start gap-3 px-3 py-3 sm:px-4 bg-accent-error/10 border border-accent-error/20">
          <AlertCircle className="text-accent-error w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] sm:text-[11px] md:text-[9px] text-accent-error/95 leading-snug uppercase tracking-wide md:tracking-wider">
            Warning: Unauthorized access attempts will trigger local node
            isolation and authorities notification.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-3 py-2.5 min-h-10 h-auto bg-surface-lowest border-t border-white/5 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:flex-nowrap md:justify-between md:px-4 md:py-0 md:h-8 md:min-h-0">
        <span className="font-mono text-[10px] md:text-[9px] uppercase tracking-widest text-white/25 text-center md:text-left">
          SYSTEM_STABLE // 128-BIT_ENC
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:gap-8">
          <span className="font-mono text-[10px] md:text-[9px] uppercase tracking-widest text-white/25">
            UPLINK_PRIMARY
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary-glow shadow-[0_0_5px_#00ffaa]"></div>
            <span className="font-mono text-[10px] md:text-[9px] uppercase tracking-widest text-secondary-glow">
              HEARTBEAT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
