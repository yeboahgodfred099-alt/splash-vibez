import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { PaymentStatusType } from '../../types/api';

export interface PaymentStatusCardProps {
  status: 'loading' | PaymentStatusType | 'missing_reference' | 'error';
  reference?: string;
  ticketAccessToken?: string;
  errorMessage?: string;
  onRecheck?: () => void;
  isRechecking?: boolean;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  status,
  reference,
  ticketAccessToken,
  errorMessage,
  onRecheck,
  isRechecking = false,
}) => {
  if (status === 'loading') {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border text-center shadow-card-elevated">
        <Spinner size="lg" label="Verifying payment status with Paystack..." className="mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Verifying Payment Status</h2>
        <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
          Please wait while we consult the authoritative payment service to confirm your transaction.
        </p>
      </div>
    );
  }

  if (status === 'missing_reference') {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border text-center shadow-card-elevated">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Payment Reference Found</h2>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mb-6 leading-relaxed">
          This page requires a valid transaction reference returned by Paystack. If you recently attempted a payment, please check your WhatsApp for ticket delivery confirmation.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm bg-brand-cyan text-brand-dark hover:bg-brand-cyan-hover transition-colors"
        >
          Go to Registration
        </Link>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border text-center shadow-card-elevated">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Payment Is Pending Confirmation</h2>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mb-4 leading-relaxed">
          Your payment transaction is still being processed by the network or awaiting Mobile Money authorization.
        </p>
        {reference && (
          <div className="inline-block px-3 py-1 rounded-lg bg-brand-surface border border-brand-border text-xs text-slate-300 font-mono mb-6">
            Ref: {reference}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRecheck && (
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isRechecking}
              loadingText="Checking status..."
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={onRecheck}
            >
              Re-check Status
            </Button>
          )}
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-brand-muted hover:text-white bg-brand-surface border border-brand-border transition-colors"
          >
            Return to Registration
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'failed' || status === 'error') {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border text-center shadow-card-elevated">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-brand-coral/40 text-brand-coral flex items-center justify-center mx-auto mb-4 shadow-glow-coral/30">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Payment Not Confirmed</h2>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mb-4 leading-relaxed">
          {errorMessage ||
            'The payment transaction could not be confirmed as successful. No funds have been captured or your payment was declined.'}
        </p>
        {reference && (
          <div className="inline-block px-3 py-1 rounded-lg bg-brand-surface border border-brand-border text-xs text-slate-400 font-mono mb-6">
            Ref: {reference}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRecheck && (
            <Button
              type="button"
              variant="outline"
              size="md"
              isLoading={isRechecking}
              loadingText="Checking..."
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={onRecheck}
            >
              Try Re-checking
            </Button>
          )}
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-brand-coral text-white hover:bg-brand-coral-hover transition-colors shadow-glow-coral"
          >
            Retry Registration
          </Link>
        </div>
      </div>
    );
  }

  // Success state: verified by server
  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border text-center shadow-card-elevated">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-glow-cyan">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Payment Verified!</h2>
      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
        Your payment has been successfully confirmed. Your official event ticket has been issued.
      </p>

      <div className="p-4 rounded-2xl bg-brand-surface/80 border border-brand-border text-left mb-6 max-w-md mx-auto space-y-2">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>WhatsApp delivery initiated to your submitted WhatsApp number.</span>
        </div>
        {reference && (
          <div className="text-[11px] text-brand-subtle font-mono pt-1 border-t border-brand-border/60">
            Payment Ref: {reference}
          </div>
        )}
      </div>

      {ticketAccessToken ? (
        <Link
          to={`/ticket?token=${encodeURIComponent(ticketAccessToken)}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-cyan text-brand-dark hover:bg-brand-cyan-hover shadow-glow-cyan transition-all duration-200"
        >
          <span>View Your Ticket Pass</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <p className="text-xs text-brand-muted">
          Your ticket access token is being prepared. Please check your WhatsApp messages.
        </p>
      )}
    </div>
  );
};

export default PaymentStatusCard;

