import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-brand-cyan text-brand-dark hover:bg-brand-cyan-hover focus-visible:ring-brand-cyan shadow-glow-cyan active:scale-[0.99]',
    secondary:
      'bg-brand-surface text-slate-100 border border-brand-border hover:bg-brand-card hover:border-brand-cyan focus-visible:ring-brand-cyan active:scale-[0.99]',
    outline:
      'bg-transparent text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan/10 focus-visible:ring-brand-cyan active:scale-[0.99]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-brand-surface focus-visible:ring-slate-400 active:scale-[0.99]',
    danger:
      'bg-brand-coral text-white hover:bg-brand-coral-hover focus-visible:ring-brand-coral shadow-glow-coral active:scale-[0.99]',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

