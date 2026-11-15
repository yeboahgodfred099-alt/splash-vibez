import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateCoupon,
  registerAndInitializePayment,
  getPaymentStatus,
  getTicket,
} from '../services/n8nApi';

describe('n8n API Service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('throws helpful error if environment variable is unconfigured or a placeholder', async () => {
    const origCoupon = import.meta.env.VITE_N8N_COUPON_VALIDATE_URL;
    const origReg = import.meta.env.VITE_N8N_REGISTRATION_URL;
    // @ts-expect-error mocking placeholder for test
    import.meta.env.VITE_N8N_COUPON_VALIDATE_URL = 'https://YOUR-N8N-HOST/webhook/REPLACE-COUPON-VALIDATE';
    // @ts-expect-error mocking placeholder for test
    import.meta.env.VITE_N8N_REGISTRATION_URL = 'https://YOUR-N8N-HOST/webhook/REPLACE-REGISTRATION';

    await expect(
      validateCoupon({
        fullName: 'Kwame Mensah',
        mobileMoneyNumber: '+233241234567',
        whatsAppNumber: '+233551234567',
        couponCode: 'VIBEZ20',
      })
    ).rejects.toThrow(/Coupon validation endpoint is not configured/i);

    await expect(
      registerAndInitializePayment({
        fullName: 'Kwame Mensah',
        mobileMoneyNumber: '+233241234567',
        whatsAppNumber: '+233551234567',
      })
    ).rejects.toThrow(/Registration endpoint is not configured/i);

    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_COUPON_VALIDATE_URL = origCoupon;
    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_REGISTRATION_URL = origReg;
  });

  it('validates coupon successfully when configured endpoint responds', async () => {
    const originalUrl = import.meta.env.VITE_N8N_COUPON_VALIDATE_URL;
    // @ts-expect-error mutating for test
    import.meta.env.VITE_N8N_COUPON_VALIDATE_URL = 'https://n8n.example.com/webhook/coupon';

    const mockData = {
      success: true,
      valid: true,
      couponCode: 'VIBEZ20',
      currency: 'GHS',
      amount: 10000,
      displayAmount: '100.00',
      discount: 2000,
      message: 'Coupon applied.',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      text: async () => JSON.stringify(mockData),
      json: async () => mockData,
    });

    const result = await validateCoupon({
      fullName: 'Kwame Mensah',
      mobileMoneyNumber: '+233241234567',
      whatsAppNumber: '+233551234567',
      couponCode: 'VIBEZ20',
    });

    expect(result.valid).toBe(true);
    expect(result.amount).toBe(10000);
    expect(result.displayAmount).toBe('100.00');

    // Restore env
    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_COUPON_VALIDATE_URL = originalUrl;
  });

  it('initializes Paystack registration successfully when configured', async () => {
    const originalUrl = import.meta.env.VITE_N8N_REGISTRATION_URL;
    // @ts-expect-error mutating for test
    import.meta.env.VITE_N8N_REGISTRATION_URL = 'https://n8n.example.com/webhook/register';

    const mockData = {
      success: true,
      registrationId: 'reg-12345',
      paymentReference: 'PAY-REF-XYZ',
      currency: 'GHS',
      amount: 12000,
      displayAmount: '120.00',
      authorizationUrl: 'https://checkout.paystack.com/auth123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      text: async () => JSON.stringify(mockData),
      json: async () => mockData,
    });

    const result = await registerAndInitializePayment({
      fullName: 'Kwame Mensah',
      mobileMoneyNumber: '+233241234567',
      whatsAppNumber: '+233551234567',
    });

    expect(result.paymentReference).toBe('PAY-REF-XYZ');
    expect(result.authorizationUrl).toBe('https://checkout.paystack.com/auth123');
    expect(result.displayAmount).toBe('120.00');

    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_REGISTRATION_URL = originalUrl;
  });

  it('retrieves payment status correctly', async () => {
    const originalUrl = import.meta.env.VITE_N8N_PAYMENT_STATUS_URL;
    // @ts-expect-error mutating for test
    import.meta.env.VITE_N8N_PAYMENT_STATUS_URL = 'https://n8n.example.com/webhook/status';

    const mockData = {
      success: true,
      paymentStatus: 'success',
      ticketStatus: 'issued',
      ticketAccessToken: 'SECURE_OPAQUE_TOKEN_999',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      text: async () => JSON.stringify(mockData),
      json: async () => mockData,
    });

    const result = await getPaymentStatus({ paymentReference: 'PAY-REF-XYZ' });
    expect(result.paymentStatus).toBe('success');
    expect(result.ticketAccessToken).toBe('SECURE_OPAQUE_TOKEN_999');

    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_PAYMENT_STATUS_URL = originalUrl;
  });

  it('retrieves ticket details with valid opaque token', async () => {
    const originalUrl = import.meta.env.VITE_N8N_TICKET_URL;
    // @ts-expect-error mutating for test
    import.meta.env.VITE_N8N_TICKET_URL = 'https://n8n.example.com/webhook/ticket';

    const mockData = {
      success: true,
      ticket: {
        ticketId: 'SV-987654',
        eventName: 'SPLASH & VIBEZ',
        eventDate: '2026-12-12',
        venue: 'Triple Hill Hotel',
        holderName: 'Kwame Mensah',
        status: 'valid',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      text: async () => JSON.stringify(mockData),
      json: async () => mockData,
    });

    const result = await getTicket({ ticketAccessToken: 'SECURE_OPAQUE_TOKEN_999' });
    expect(result.ticket.ticketId).toBe('SV-987654');
    expect(result.ticket.holderName).toBe('Kwame Mensah');
    expect(result.ticket.venue).toBe('Triple Hill Hotel');

    // @ts-expect-error restoring
    import.meta.env.VITE_N8N_TICKET_URL = originalUrl;
  });
});
