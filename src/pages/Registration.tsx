import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import RegistrationForm from '../components/registration/RegistrationForm';
import Button from '../components/common/Button';
import { RegistrationFormData } from '../types/form';
import { EVENT_DETAILS } from '../utils/constants';
import { normalizeGhanaPhone } from '../utils/phone';
import { n8nApi } from '../services/n8nApi';

interface PendingPriceConfirmation {
  serverAmount: string;
  authorizationUrl: string;
}

export const Registration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [priceDiscrepancy, setPriceDiscrepancy] = useState<PendingPriceConfirmation | null>(null);

  // Validate coupon via n8n
  const handleValidateCoupon = async (payload: {
    fullName: string;
    mobileMoneyNumber: string;
    whatsAppNumber: string;
    couponCode: string;
  }): Promise<{ isValid: boolean; message?: string }> => {
    const response = await n8nApi.validateCoupon({
      fullName: payload.fullName,
      mobileMoneyNumber: normalizeGhanaPhone(payload.mobileMoneyNumber),
      whatsAppNumber: normalizeGhanaPhone(payload.whatsAppNumber),
      couponCode: payload.couponCode.trim(),
    });

    return {
      isValid: response.valid,
      message: response.message,
    };
  };

  // Submit registration & initialize Paystack
  const handleSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setPriceDiscrepancy(null);

    try {
      const response = await n8nApi.registerAndInitializePayment({
        fullName: data.fullName,
        mobileMoneyNumber: normalizeGhanaPhone(data.mobileMoneyNumber),
        whatsAppNumber: normalizeGhanaPhone(data.whatsAppNumber),
        couponCode: data.couponCode ? data.couponCode.trim() : undefined,
      });

      // Price Consistency Check (Numerical):
      // Compare the server-calculated amount with what the customer was shown
      const expectedNum = data.couponCode && data.couponCode.trim()
        ? Number(EVENT_DETAILS.pricing.couponDisplay)
        : Number(EVENT_DETAILS.pricing.standardDisplay);
      const serverNum = Number(response.displayAmount) || (Number(response.amount) / 100);

      if (serverNum && Math.abs(serverNum - expectedNum) > 0.01) {
        // Price discrepancy detected: Show confirmation pop-up modal
        setPriceDiscrepancy({
          serverAmount: serverNum.toFixed(2),
          authorizationUrl: response.authorizationUrl,
        });
        return;
      }

      // Safe to redirect to Paystack authorization URL
      window.location.assign(response.authorizationUrl);
    } catch (err: unknown) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : 'Unable to initialize checkout. Please check your network and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm updated amount if price discrepancy was detected
  const handleConfirmDiscrepancy = () => {
    if (priceDiscrepancy?.authorizationUrl) {
      window.location.assign(priceDiscrepancy.authorizationUrl);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-muted hover:text-brand-cyan mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to event details
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-border shadow-card-elevated backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-brand-border/80">
          <div className="w-10 h-10 rounded-2xl bg-brand-surface border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-glow-cyan/30">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Event Registration</h1>
            <p className="text-xs text-brand-muted">
              {EVENT_DETAILS.name} • {EVENT_DETAILS.venue}
            </p>
          </div>
        </div>

        <RegistrationForm
          onSubmit={handleSubmit}
          onValidateCoupon={handleValidateCoupon}
          isSubmitting={isSubmitting}
          externalError={submissionError}
        />
      </div>

      <div className="mt-6 text-center text-xs text-brand-muted flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Secure checkout powered by Paystack</span>
      </div>

      {/* Price Update Pop-up Modal */}
      {priceDiscrepancy && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="price-update-title"
        >
          <div className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => setPriceDiscrepancy(null)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white rounded-full hover:bg-brand-surface transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 id="price-update-title" className="text-xl font-bold text-white mb-2">
              Price Confirmation
            </h3>
            <p className="text-sm text-brand-muted mb-6 leading-relaxed">
              The total amount calculated for this checkout is{' '}
              <strong className="text-brand-cyan font-bold text-base">
                {EVENT_DETAILS.pricing.currencySymbol}{priceDiscrepancy.serverAmount}
              </strong>
              . Would you like to proceed with this updated total?
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={handleConfirmDiscrepancy}
              >
                Proceed to Payment
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setPriceDiscrepancy(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
