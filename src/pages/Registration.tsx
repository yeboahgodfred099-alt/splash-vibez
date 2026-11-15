import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, AlertTriangle, ShieldCheck } from 'lucide-react';
import RegistrationForm from '../components/registration/RegistrationForm';
import Alert from '../components/common/Alert';
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

      // Price Consistency Check:
      // Compare the server-calculated amount with what the customer was shown
      const expectedAmount = data.couponCode.trim()
        ? EVENT_DETAILS.pricing.couponDisplay
        : EVENT_DETAILS.pricing.standardDisplay;

      if (response.displayAmount && response.displayAmount !== expectedAmount) {
        // Price discrepancy detected: DO NOT redirect automatically!
        setPriceDiscrepancy({
          serverAmount: response.displayAmount,
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

        {/* Price discrepancy guard alert */}
        {priceDiscrepancy && (
          <div className="mb-6">
            <Alert
              type="warning"
              title="Price Update Required"
              action={
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmDiscrepancy}
                  >
                    Confirm & Proceed ({EVENT_DETAILS.pricing.currencySymbol}
                    {priceDiscrepancy.serverAmount})
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriceDiscrepancy(null)}
                  >
                    Cancel
                  </Button>
                </div>
              }
            >
              <div className="flex items-start gap-2 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  The authoritative amount calculated by the server is{' '}
                  <strong className="text-white">
                    {EVENT_DETAILS.pricing.currencySymbol}
                    {priceDiscrepancy.serverAmount}
                  </strong>
                  . Please confirm if you wish to proceed with this updated total.
                </span>
              </div>
            </Alert>
          </div>
        )}

        <RegistrationForm
          onSubmit={handleSubmit}
          onValidateCoupon={handleValidateCoupon}
          isSubmitting={isSubmitting}
          externalError={submissionError}
        />
      </div>

      <div className="mt-6 text-center text-xs text-brand-subtle flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Authoritative pricing and transaction tokens are verified server-side.</span>
      </div>
    </div>
  );
};

export default Registration;
