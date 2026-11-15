import React, { useId } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      isRequired,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="w-full text-left">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          {label}
          {isRequired && (
            <span className="text-brand-coral ml-1" title="Required">
              *
            </span>
          )}
        </label>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full rounded-xl bg-brand-surface/90 border transition-all duration-200 text-sm text-slate-100 placeholder:text-slate-500 py-3 ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightElement ? 'pr-24' : 'pr-4'} ${
              error
                ? 'border-brand-coral/80 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : 'border-brand-border hover:border-slate-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan'
            } ${
              disabled
                ? 'opacity-50 cursor-not-allowed bg-brand-dark/40'
                : 'focus:outline-none'
            } ${className}`}
          />

          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-brand-coral mt-1.5 font-medium flex items-center gap-1">
            <span>•</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-brand-subtle mt-1.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;

