import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import TicketCard from '../components/ticket/TicketCard';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { n8nApi } from '../services/n8nApi';
import { TicketData } from '../types/api';

export const Ticket: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token));
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await n8nApi.getTicket({ ticketAccessToken: accessToken });
      setTicket(response.ticket);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve ticket pass. The access token may be expired or invalid.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTicket(token);
    }
  }, [token, fetchTicket]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 text-center">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-muted hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <span className="text-xs text-brand-subtle">Electronic Ticket</span>
      </div>

      {!token ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border shadow-card-elevated">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Token Required</h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto mb-6 leading-relaxed">
            Tickets can only be viewed using a secure, verified access token issued after payment confirmation.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm bg-brand-cyan text-brand-dark hover:bg-brand-cyan-hover transition-colors"
          >
            Get a Ticket
          </Link>
        </div>
      ) : isLoading ? (
        <div className="p-12 rounded-3xl bg-brand-card/90 border border-brand-border shadow-card-elevated">
          <Spinner size="lg" label="Retrieving authorized ticket..." className="mb-4" />
          <h2 className="text-lg font-bold text-white mb-1">Retrieving Ticket Pass</h2>
          <p className="text-xs text-brand-muted">Verifying your token credentials with the server...</p>
        </div>
      ) : error ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-card/90 border border-brand-border shadow-card-elevated">
          <Alert type="error" title="Ticket Unavailable" className="mb-6 text-left">
            {error}
          </Alert>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => fetchTicket(token)}
            className="mr-3"
          >
            Retry Retrieval
          </Button>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-brand-muted hover:text-white bg-brand-surface border border-brand-border transition-colors"
          >
            Return to Home
          </Link>
        </div>
      ) : ticket ? (
        <TicketCard ticket={ticket} />
      ) : null}
    </div>
  );
};

export default Ticket;
