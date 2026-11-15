import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PaymentStatusCard from '../components/payment/PaymentStatusCard';
import { n8nApi } from '../services/n8nApi';
import { PaymentStatusType } from '../types/api';

export const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || undefined;

  const [status, setStatus] = useState<'loading' | PaymentStatusType | 'missing_reference' | 'error'>(
    reference ? 'loading' : 'missing_reference'
  );
  const [ticketAccessToken, setTicketAccessToken] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isRechecking, setIsRechecking] = useState(false);

  const fetchStatus = useCallback(async (ref: string, isManualRecheck = false) => {
    if (isManualRecheck) {
      setIsRechecking(true);
    } else {
      setStatus('loading');
    }
    setErrorMessage(undefined);

    try {
      const response = await n8nApi.getPaymentStatus({ paymentReference: ref });
      setStatus(response.paymentStatus);

      if (response.paymentStatus === 'success' && response.ticketAccessToken) {
        setTicketAccessToken(response.ticketAccessToken);
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to communicate with the payment verification service. Please try rechecking.'
      );
    } finally {
      setIsRechecking(false);
    }
  }, []);

  useEffect(() => {
    if (reference) {
      fetchStatus(reference);
    } else {
      setStatus('missing_reference');
    }
  }, [reference, fetchStatus]);

  const handleRecheck = () => {
    if (reference) {
      fetchStatus(reference, true);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-muted hover:text-brand-cyan mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>

      <PaymentStatusCard
        status={status}
        reference={reference}
        ticketAccessToken={ticketAccessToken}
        errorMessage={errorMessage}
        onRecheck={handleRecheck}
        isRechecking={isRechecking}
      />
    </div>
  );
};

export default PaymentStatus;
