/**
 * SPLASH & VIBEZ — n8n API Service
 *
 * Handles client-side communication with trusted n8n webhooks.
 * Implements strict runtime validation, timeouts, sanitized error reporting,
 * and safeguards against logging or leaking sensitive customer data.
 */

import {
  CouponValidateRequest,
  CouponValidateSuccessResponse,
  RegistrationRequest,
  RegistrationSuccessResponse,
  PaymentStatusRequest,
  PaymentStatusSuccessResponse,
  TicketRetrievalRequest,
  TicketRetrievalSuccessResponse,
} from '../types/api';

const DEFAULT_TIMEOUT_MS = 15000;

class N8nApiError extends Error {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'N8nApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Validates whether an endpoint URL is configured and not a placeholder.
 */
function getEndpointUrl(envKey: keyof ImportMetaEnv, fallbackName: string): string {
  // Check runtime environment variables (injected via Docker env-config.js) first,
  // falling back to Vite build-time import.meta.env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowEnv = typeof window !== 'undefined' ? (window as any).__ENV__ : undefined;
  const rawUrl = windowEnv?.[envKey] || import.meta.env[envKey];
  const url = typeof rawUrl === 'string' ? rawUrl.trim() : '';

  if (!url || url.includes('REPLACE-') || url.includes('YOUR-N8N-HOST')) {
    throw new N8nApiError(
      `${fallbackName} endpoint is not configured. Please supply a valid deployed n8n webhook URL.`,
      'ENDPOINT_NOT_CONFIGURED'
    );
  }
  return url;
}

/**
 * Generic fetch wrapper with AbortController timeout and robust error handling.
 */
async function postJson<TRequest, TResponse>(
  url: string,
  body: TRequest,
  endpointLabel: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<TResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    let data: unknown;
    let rawText = '';

    if (typeof response.text === 'function') {
      rawText = await response.text();
    }

    if (rawText.trim()) {
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new N8nApiError(
          `Unexpected response format from ${endpointLabel}`,
          'INVALID_RESPONSE_FORMAT',
          response.status
        );
      }
    } else if (typeof response.json === 'function') {
      try {
        data = await response.json();
      } catch {
        // empty response
      }
    }

    if (!data) {
      throw new N8nApiError(
        `The ${endpointLabel} returned an empty response. Please verify that your n8n Respond to Webhook node has a response body configured.`,
        'EMPTY_RESPONSE',
        response.status
      );
    }

    // Automatically unwrap single-element n8n item arrays: [ { ... } ]
    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    if (!response.ok) {
      const errorMsg =
        (data as { error?: { message?: string } })?.error?.message ||
        (data as { message?: string })?.message ||
        `Request to ${endpointLabel} failed with status ${response.status}`;

      const errorCode =
        (data as { error?: { code?: string } })?.error?.code || 'API_ERROR';

      throw new N8nApiError(errorMsg, errorCode, response.status);
    }

    return data as TResponse;
  } catch (err: unknown) {
    if (err instanceof N8nApiError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new N8nApiError(
        `Connection to ${endpointLabel} timed out. Please check your network and retry.`,
        'REQUEST_TIMEOUT'
      );
    }
    throw new N8nApiError(
      `Unable to reach ${endpointLabel}. Please check your connection and try again.`,
      'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Endpoint A — Validate coupon code
 */
export async function validateCoupon(
  payload: CouponValidateRequest
): Promise<CouponValidateSuccessResponse> {
  const endpoint = getEndpointUrl('VITE_N8N_COUPON_VALIDATE_URL', 'Coupon validation');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = await postJson<CouponValidateRequest, any>(
    endpoint,
    payload,
    'coupon validation service'
  );

  // Handle nested data envelope if present
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    response = response.data;
  }

  // Check for presence of validation field (valid or isValid)
  const rawValid = response?.valid ?? response?.isValid;
  if (rawValid === undefined) {
    throw new N8nApiError('Invalid response shape from coupon validation service', 'MALFORMED_RESPONSE');
  }

  // Coerce boolean in case n8n returned "true", 1, true, etc.
  const isValid =
    rawValid === true ||
    rawValid === 'true' ||
    rawValid === 1 ||
    rawValid === '1';

  const amount = Number(response.amount) || (isValid ? 10000 : 12000);
  const displayAmount =
    response.displayAmount || (amount / 100).toFixed(2);
  const discount =
    response.discount !== undefined ? Number(response.discount) : (isValid ? 2000 : 0);

  return {
    success: true,
    valid: isValid,
    couponCode: response.couponCode || payload.couponCode,
    currency: response.currency || 'GHS',
    amount,
    displayAmount,
    discount,
    message:
      response.message ||
      (isValid
        ? 'Coupon applied! You saved GH₵20.'
        : 'This coupon code is not valid.'),
  };
}

/**
 * Endpoint B — Submit registration and initialize Paystack transaction
 */
export async function registerAndInitializePayment(
  payload: RegistrationRequest
): Promise<RegistrationSuccessResponse> {
  const endpoint = getEndpointUrl('VITE_N8N_REGISTRATION_URL', 'Registration');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any = await postJson<RegistrationRequest, any>(
    endpoint,
    payload,
    'registration service'
  );

  if (Array.isArray(raw) && raw.length > 0) {
    raw = raw[0];
  }

  // Handle case where n8n returns Paystack's raw payload: { data: { authorization_url: "...", reference: "..." } }
  if (raw?.data && typeof raw.data === 'object') {
    raw = {
      ...raw,
      authorizationUrl: raw.data.authorization_url || raw.data.authorizationUrl || raw.authorizationUrl,
      paymentReference: raw.data.reference || raw.data.paymentReference || raw.paymentReference,
    };
  }

  const authorizationUrl = raw?.authorizationUrl || raw?.authorization_url;
  const paymentReference = raw?.paymentReference || raw?.reference;

  if (!authorizationUrl || !paymentReference) {
    throw new N8nApiError(
      'Registration response did not return a valid Paystack authorization URL',
      'MISSING_AUTHORIZATION_URL'
    );
  }

  const amount = Number(raw.amount) || 12000;
  const displayAmount = raw.displayAmount || (amount / 100).toFixed(2);

  return {
    success: true,
    registrationId: raw.registrationId || paymentReference,
    paymentReference,
    currency: raw.currency || 'GHS',
    amount,
    displayAmount,
    authorizationUrl,
    statusUrl: raw.statusUrl,
  };
}

/**
 * Endpoint C — Authoritative payment status lookup
 */
export async function getPaymentStatus(
  payload: PaymentStatusRequest
): Promise<PaymentStatusSuccessResponse> {
  const endpoint = getEndpointUrl('VITE_N8N_PAYMENT_STATUS_URL', 'Payment status');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = await postJson<PaymentStatusRequest, any>(
    endpoint,
    payload,
    'payment status service'
  );

  if (Array.isArray(response) && response.length > 0) {
    response = response[0];
  }

  // Handle nested data if n8n returns { data: { paymentStatus: ... } }
  if (response?.data && typeof response.data === 'object' && response.data.paymentStatus) {
    response = { ...response, ...response.data };
  }

  if (!response?.paymentStatus) {
    throw new N8nApiError(
      'Payment status response did not return paymentStatus',
      'MALFORMED_STATUS_RESPONSE'
    );
  }

  return {
    success: true,
    paymentStatus: response.paymentStatus,
    ticketStatus: response.ticketStatus || (response.paymentStatus === 'success' ? 'issued' : 'not_issued'),
    ticketAccessToken: response.ticketAccessToken || response.ticket_access_token,
    message: response.message,
  };
}

/**
 * Endpoint D — Protected ticket retrieval
 */
export async function getTicket(
  payload: TicketRetrievalRequest
): Promise<TicketRetrievalSuccessResponse> {
  const endpoint = getEndpointUrl('VITE_N8N_TICKET_URL', 'Ticket service');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = await postJson<TicketRetrievalRequest, any>(
    endpoint,
    payload,
    'ticket retrieval service'
  );

  if (Array.isArray(response) && response.length > 0) {
    response = response[0];
  }

  if (response?.data && typeof response.data === 'object' && (response.data.ticket || response.data.ticketId)) {
    response = { ...response, ...response.data };
  }

  // If response has ticket directly or nested
  const ticket = response?.ticket || (response?.ticketId ? response : undefined);

  if (!ticket?.ticketId) {
    throw new N8nApiError(
      'Ticket response did not return valid ticket data',
      'MALFORMED_TICKET_RESPONSE'
    );
  }

  return {
    success: true,
    ticket: {
      ticketId: ticket.ticketId,
      eventName: ticket.eventName || 'SPLASH & VIBEZ',
      eventDate: ticket.eventDate || '12 December 2026',
      venue: ticket.venue || 'Triple Hill Hotel',
      holderName: ticket.holderName || ticket.fullName || 'Guest',
      status: ticket.status || 'valid',
    },
  };
}

export const n8nApi = {
  validateCoupon,
  registerAndInitializePayment,
  getPaymentStatus,
  getTicket,
};

export default n8nApi;
