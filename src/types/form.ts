export type CouponStatus = 'locked' | 'idle' | 'validating' | 'valid' | 'invalid' | 'error';

export interface RegistrationFormData {
  fullName: string;
  mobileMoneyNumber: string;
  whatsAppNumber: string;
  couponCode: string;
}

export interface RegistrationFormErrors {
  fullName?: string;
  mobileMoneyNumber?: string;
  whatsAppNumber?: string;
  couponCode?: string;
  general?: string;
}

export interface CouponValidationState {
  status: CouponStatus;
  message?: string;
  appliedCode?: string;
  discountPesewas: number;
}

