/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_COUPON_VALIDATE_URL: string;
  readonly VITE_N8N_REGISTRATION_URL: string;
  readonly VITE_N8N_PAYMENT_STATUS_URL: string;
  readonly VITE_N8N_TICKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

