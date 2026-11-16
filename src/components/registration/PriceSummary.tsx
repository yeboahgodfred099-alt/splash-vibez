import React from 'react';
import { Tag, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../../utils/constants';

export interface PriceSummaryProps {
  isValidCoupon: boolean;
  couponCode?: string;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ isValidCoupon, couponCode }) => {
  const standardPrice = EVENT_DETAILS.pricing.standardDisplay;
  const finalPrice = isValidCoupon
    ? EVENT_DETAILS.pricing.couponDisplay
    : EVENT_DETAILS.pricing.standardDisplay;
  const discount = EVENT_DETAILS.pricing.discountDisplay;
  const currency = EVENT_DETAILS.pricing.currencySymbol;

  return (
    <div className="w-full rounded-2xl bg-brand-surface/90 border border-brand-border p-5 my-6 text-sm">
      <div className="text-xs uppercase tracking-wider text-brand-muted font-bold mb-3">
        Order Summary
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-slate-300">
          <span>Standard Ticket (1x)</span>
          <span className="font-semibold text-white">{currency}{standardPrice}</span>
        </div>

        {isValidCoupon && (
          <div className="flex justify-between items-center text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon Discount {couponCode ? `(${couponCode.toUpperCase()})` : ''}</span>
            </span>
            <span className="font-semibold">-{currency}{discount}</span>
          </div>
        )}

        <div className="pt-3 border-t border-brand-border flex justify-between items-baseline">
          <span className="font-bold text-base text-white">Total Amount</span>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-cyan">
              {currency}{finalPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-center gap-1.5 text-xs text-brand-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
        <span>Secure checkout powered by Paystack</span>
      </div>
    </div>
  );
};

export default PriceSummary;

