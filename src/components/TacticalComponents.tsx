import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export const TacticalButton = ({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'error' }) => {
  const variants = {
    primary: 'bg-primary-glow text-white hover:brightness-125 shadow-[0_0_28px_rgba(24,83,255,0.36)]',
    secondary: 'bg-white text-surface-lowest hover:bg-secondary-glow hover:text-white',
    ghost: 'bg-white/[0.03] border border-white/10 text-text-dim hover:bg-white/[0.07] hover:text-white hover:border-white/25',
    error: 'bg-accent-error/20 border border-accent-error/40 text-accent-error hover:bg-accent-error/30'
  };

  return (
    <button 
      className={`
        clipped-corner inline-flex items-center justify-center px-5 py-3 font-headline font-bold text-xs uppercase transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

interface TacticalCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export const TacticalCard = ({ children, className, title, subtitle, icon: Icon }: TacticalCardProps) => (
  <div className={`noise-card p-5 sm:p-6 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/20"></div>
    <div className="absolute left-0 top-0 h-full w-[2px] bg-primary-glow/70"></div>
    {(title || Icon) && (
      <div className="flex justify-between items-start mb-6">
        <div>
          {title && <h3 className="font-headline font-bold text-sm uppercase text-white">{title}</h3>}
          {subtitle && <p className="font-mono text-[10px] text-text-dim uppercase mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className="w-5 h-5 text-primary-glow/60" />}
      </div>
    )}
    {children}
  </div>
);

interface TacticalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const TacticalInput = ({ label, icon: Icon, ...props }: TacticalInputProps) => (
  <div className="space-y-2">
    {label && <label className="font-headline text-[10px] font-bold text-text-dim uppercase block">{label}</label>}
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 w-[2px] bg-border-tactical group-focus-within:bg-primary-glow transition-colors"></div>
      <input 
        className="w-full bg-white/[0.035] border border-white/10 text-white text-sm font-mono py-4 pl-6 pr-12 focus:ring-0 focus:bg-white/[0.07] focus:border-primary-glow/70 transition-all placeholder:text-white/25"
        {...props}
      />
      {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-primary-glow transition-all" />}
    </div>
  </div>
);

interface TacticalToggleProps {
  label: string;
  sublabel?: string;
  description?: string;
  active?: boolean;
  defaultChecked?: boolean;
  onToggle?: () => void;
}

export const TacticalToggle = ({ label, sublabel, description, active, defaultChecked, onToggle }: TacticalToggleProps) => {
  const [internalActive, setInternalActive] = useState(defaultChecked ?? false);
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : internalActive;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setInternalActive(prev => !prev);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div>
        <p className="font-headline text-[11px] uppercase font-bold text-white">{label}</p>
        <p className="text-[9px] text-text-dim font-mono uppercase">{sublabel ?? description}</p>
      </div>
      <button
        onClick={handleToggle}
        className={`w-10 h-5 p-0.5 flex transition-all ${isActive ? 'bg-primary-glow/20 border-primary-glow/50 justify-end' : 'bg-white/[0.05] border-border-tactical justify-start'} border`}
      >
        <div className={`w-3.5 h-3.5 ${isActive ? 'bg-primary-glow shadow-[0_0_12px_rgba(24,83,255,0.7)]' : 'bg-border-tactical'}`}></div>
      </button>
    </div>
  );
};
