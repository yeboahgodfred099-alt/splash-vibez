import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentStatusCard from '../components/payment/PaymentStatusCard';
import TicketCard from '../components/ticket/TicketCard';
import Ticket from '../pages/Ticket';

describe('Payment Status Card UI States', () => {
  it('renders loading state with accessible status label', () => {
    render(<PaymentStatusCard status="loading" />);
    expect(screen.getByRole('heading', { name: /Verifying Payment Status/i })).toBeInTheDocument();
  });

  it('renders missing reference state if customer navigates without a reference', () => {
    render(
      <MemoryRouter>
        <PaymentStatusCard status="missing_reference" />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Payment Reference Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Registration/i })).toBeInTheDocument();
  });

  it('renders pending state with recheck action', () => {
    const handleRecheck = vi.fn();
    render(
      <MemoryRouter>
        <PaymentStatusCard
          status="pending"
          reference="PAY-12345"
          onRecheck={handleRecheck}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Payment Is Pending Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Ref: PAY-12345/i)).toBeInTheDocument();

    const recheckBtn = screen.getByRole('button', { name: /Re-check Status/i });
    fireEvent.click(recheckBtn);
    expect(handleRecheck).toHaveBeenCalledTimes(1);
  });

  it('renders failed state with clear explanation and retry button', () => {
    render(
      <MemoryRouter>
        <PaymentStatusCard
          status="failed"
          reference="PAY-FAILED-001"
          errorMessage="Payment was declined by your mobile money provider."
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Payment Not Confirmed/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Payment was declined by your mobile money provider/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Retry Registration/i })).toBeInTheDocument();
  });

  it('renders success state with View Ticket Pass action and reference', () => {
    render(
      <MemoryRouter>
        <PaymentStatusCard
          status="success"
          reference="PAY-SUCCESS-777"
          ticketAccessToken="SECURE_TOKEN_XYZ"
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Payment Verified!/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp delivery initiated/i)).toBeInTheDocument();
    const ticketLink = screen.getByRole('link', { name: /View Your Ticket Pass/i });
    expect(ticketLink).toHaveAttribute(
      'href',
      '/ticket?token=SECURE_TOKEN_XYZ'
    );
  });
});

describe('Ticket Display & Security Pass Card', () => {
  const mockTicket = {
    ticketId: 'SV-UNGUESSABLE-888',
    eventName: 'SPLASH & VIBEZ',
    eventDate: '2026-12-12',
    venue: 'Triple Hill Hotel',
    holderName: 'Esi Annan',
    status: 'valid' as const,
  };

  it('renders ticket details correctly without exposing private credentials', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText(/Esi Annan/i)).toBeInTheDocument();
    expect(screen.getByText(/Triple Hill Hotel/i)).toBeInTheDocument();
    expect(screen.getByText(/SV-UNGUESSABLE-888/i)).toBeInTheDocument();
    expect(screen.getByText(/Single admission pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered via WhatsApp/i)).toBeInTheDocument();

    // Verify phone numbers or payment secrets are never exposed on ticket
    expect(screen.queryByText(/024/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/233/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Paystack Secret/i)).not.toBeInTheDocument();
  });

  it('renders access token required when customer opens /ticket without a token', () => {
    render(
      <MemoryRouter initialEntries={['/ticket']}>
        <Ticket />
      </MemoryRouter>
    );
    expect(screen.getByText(/Access Token Required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tickets can only be viewed using a secure, verified access token/i)
    ).toBeInTheDocument();
  });
});
