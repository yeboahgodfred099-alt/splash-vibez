import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  action,
  className = '',
}) => {
  const styles = {
    info: {
      container: 'bg-brand-surface/80 border-brand-accent/30 text-slate-200',
      icon: <Info className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />,
      titleColor: 'text-brand-accent',
    },
    success: {
      container: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-400',
    },
    warning: {
      container: 'bg-amber-950/30 border-amber-500/30 text-amber-100',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-400',
    },
    error: {
      container: 'bg-rose-950/30 border-brand-coral/40 text-rose-100',
      icon: <AlertCircle className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />,
      titleColor: 'text-brand-coral',
    },
  };

  const current = styles[type];
  const role = type === 'error' || type === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`rounded-xl border p-4 flex gap-3 text-sm transition-all duration-200 ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1 min-w-0">
        {title && <h3 className={`font-semibold text-sm mb-1 ${current.titleColor}`}>{title}</h3>}
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
};

export default Alert;

