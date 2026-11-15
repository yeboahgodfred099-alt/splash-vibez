/**
 * n8n Integration API Types
 * Based on docs/N8N_INTEGRATION.md
 */

// --- Endpoint A: Coupon Validation ---
export interface CouponValidateRequest {
  fullName: string;
  mobileMoneyNumber: string;
  whatsAppNumber: string;
  couponCode: string;
}

export interface CouponValidateSuccessResponse {
  success: true;
  valid: boolean;
  couponCode?: string;
  currency: string;
  amount: number; // in pesewas (integer)
  displayAmount: string; // "100.00" or "120.00"
  discount: number; // in pesewas (e.g. 2000 or 0)
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type CouponValidateResponse = CouponValidateSuccessResponse | ApiErrorResponse;

// --- Endpoint B: Registration & Payment Initialization ---
export interface RegistrationRequest {
  fullName: string;
  mobileMoneyNumber: string;
  whatsAppNumber: string;
  couponCode?: string;
}

export interface RegistrationSuccessResponse {
  success: true;
  registrationId?: string;
  paymentReference: string;
  currency: string;
  amount: number; // in pesewas
  displayAmount: string; // "120.00" or "100.00"
  authorizationUrl: string;
  statusUrl?: string;
}

export type RegistrationResponse = RegistrationSuccessResponse | ApiErrorResponse;

// --- Endpoint C: Payment Status ---
export interface PaymentStatusRequest {
  paymentReference: string;
}

export type PaymentStatusType = 'pending' | 'success' | 'failed';
export type TicketStatusType = 'not_issued' | 'issued';

export interface PaymentStatusSuccessResponse {
  success: true;
  paymentStatus: PaymentStatusType;
  ticketStatus: TicketStatusType;
  ticketAccessToken?: string;
  message?: string;
}

export type PaymentStatusResponse = PaymentStatusSuccessResponse | ApiErrorResponse;

// --- Endpoint D: Ticket Retrieval ---
export interface TicketRetrievalRequest {
  ticketAccessToken: string;
}

export interface TicketData {
  ticketId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  holderName: string;
  status: 'valid' | 'used' | 'cancelled';
}

export interface TicketRetrievalSuccessResponse {
  success: true;
  ticket: TicketData;
}

export type TicketRetrievalResponse = TicketRetrievalSuccessResponse | ApiErrorResponse;

