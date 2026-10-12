// types/razorpay.d.ts
// Global TypeScript declarations for the Razorpay Checkout JavaScript SDK.

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number | string; // In paise (e.g. 50000 = ₹500)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentSuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string | number | boolean>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
    confirm_close?: boolean;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed" | string,
    callback: (response: RazorpayPaymentErrorResponse | any) => void
  ) => void;
  close?: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};
