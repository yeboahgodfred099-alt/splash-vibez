import React from 'react';
import { Tag, CheckCircle2, AlertCircle, Info, Lock, X, RefreshCw } from 'lucide-react';
import Button from '../common/Button';
import { CouponStatus } from '../../types/form';

export interface CouponValidatorProps {
  couponCode: string;
  onCouponChange: (code: string) => void;
  status: CouponStatus;
  message?: string;
  onValidate: () => void;
  isGated: boolean;
  onClear?: () => void;
}

export const CouponValidator: React.FC<CouponValidatorProps> = ({
  couponCode,
  onCouponChange,
  status,
  message,
  onValidate,
  isGated,
  onClear,
}) => {
  const isValidating = status === 'validating';
  const isValid = status === 'valid';
  const isInvalid = status === 'invalid';
  const isError = status === 'error';

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onCouponChange('');
    }
  };

  return (
    <div className="w-full pt-2">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor="couponCode"
          className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Coupon Code (Optional)</span>
        </label>
        {isGated && (
          <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
            <Lock className="w-3 h-3" />
            <span>Complete required fields above to unlock</span>
          </span>
        )}
      </div>

      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            id="couponCode"
            type="text"
            value={couponCode}
            disabled={isGated || isValidating}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder={isGated ? 'Locked — fill required fields first' : 'Enter code (e.g. VIBEZ20)'}
            autoCapitalize="characters"
            spellCheck={false}
            className={`w-full rounded-xl bg-brand-surface/90 border transition-all duration-200 text-sm text-slate-100 placeholder:text-slate-500 py-3 pl-4 pr-16 uppercase ${
              isGated
                ? 'opacity-40 cursor-not-allowed bg-brand-dark/40 border-brand-border'
                : isValid
                ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                : isInvalid
                ? 'border-brand-coral/60 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : isError
                ? 'border-amber-500/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                : 'border-brand-border hover:border-slate-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan'
            }`}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {/* Clear button if text exists and not gated */}
            {!isGated && Boolean(couponCode) && !isValidating && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear coupon code"
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isValid && (
              <div className="text-emerald-400 pointer-events-none" title="Coupon Valid">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {isInvalid && (
              <div className="text-brand-coral pointer-events-none" title="Coupon Invalid">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {isError && (
              <div className="text-amber-400 pointer-events-none" title="Validation Error">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant={isError ? 'outline' : isValid ? 'secondary' : 'primary'}
          size="md"
          disabled={isGated || !couponCode.trim() || isValidating}
          isLoading={isValidating}
          loadingText="Checking..."
          onClick={onValidate}
          leftIcon={isError ? <RefreshCw className="w-3.5 h-3.5" /> : undefined}
          className="shrink-0"
        >
          {isError ? 'Retry' : isValid ? 'Revalidate' : 'Validate'}
        </Button>
      </div>

      {/* Accessible Dynamic Status Feedback */}
      <div aria-live="polite">
        {isGated && (
          <p className="text-xs text-brand-muted mt-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Enter your Full Name, Mobile Money Number, and WhatsApp Number to enable coupon validation.</span>
          </p>
        )}

        {!isGated && isValid && (
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message || 'Coupon applied successfully! You saved GH₵20.'}</span>
          </div>
        )}

        {!isGated && isInvalid && (
          <div className="mt-2 text-xs text-brand-coral flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message || 'This coupon code is not valid. Standard price applies.'}</span>
          </div>
        )}

        {!isGated && isError && (
          <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message || 'Coupon validation is temporarily unavailable. You may retry or proceed at standard price.'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponValidator;
