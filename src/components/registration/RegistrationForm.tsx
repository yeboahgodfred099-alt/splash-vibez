import React, { useState, useMemo } from 'react';
import { User, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import CouponValidator from './CouponValidator';
import PriceSummary from './PriceSummary';
import { validateGhanaPhone } from '../../utils/phone';
import { CouponStatus, RegistrationFormData, RegistrationFormErrors } from '../../types/form';

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onValidateCoupon?: (payload: {
    fullName: string;
    mobileMoneyNumber: string;
    whatsAppNumber: string;
    couponCode: string;
  }) => Promise<{ isValid: boolean; message?: string }>;
  isSubmitting?: boolean;
  externalError?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onValidateCoupon,
  isSubmitting = false,
  externalError,
}) => {
  // Form input state — strictly independent phone states
  const [fullName, setFullName] = useState('');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Field validation touched state
  const [touched, setTouched] = useState({
    fullName: false,
    mobileMoneyNumber: false,
    whatsAppNumber: false,
  });

  // Coupon state
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('locked');
  const [couponMessage, setCouponMessage] = useState<string>('');

  // Local form-level error
  const [formError, setFormError] = useState<string | null>(null);

  // Validate fields in real time
  const errors = useMemo<RegistrationFormErrors>(() => {
    const errs: RegistrationFormErrors = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    const momoResult = validateGhanaPhone(mobileMoneyNumber);
    if (!momoResult.isValid) {
      errs.mobileMoneyNumber = momoResult.error;
    }

    const waResult = validateGhanaPhone(whatsAppNumber);
    if (!waResult.isValid) {
      errs.whatsAppNumber = waResult.error;
    }

    return errs;
  }, [fullName, mobileMoneyNumber, whatsAppNumber]);

  // The Required-Field Gate condition: all 3 required fields must pass validation
  const areRequiredFieldsValid = useMemo(() => {
    return !errors.fullName && !errors.mobileMoneyNumber && !errors.whatsAppNumber;
  }, [errors]);

  // Synchronize coupon status with the required fields gate
  const effectiveCouponStatus: CouponStatus = useMemo(() => {
    if (!areRequiredFieldsValid) {
      return 'locked';
    }
    return couponStatus === 'locked' ? 'idle' : couponStatus;
  }, [areRequiredFieldsValid, couponStatus]);

  // Handle phone changes independently — never auto-copy
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    setFormError(null);
  };

  const handleMobileMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileMoneyNumber(e.target.value);
    setFormError(null);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsAppNumber(e.target.value);
    setFormError(null);
  };

  // When coupon changes or is cleared, immediately invalidate previous validation status
  const handleCouponChange = (code: string) => {
    setCouponCode(code);
    setCouponStatus('idle');
    setCouponMessage('');
    setFormError(null);
  };

  const handleCouponClear = () => {
    setCouponCode('');
    setCouponStatus('idle');
    setCouponMessage('');
    setFormError(null);
  };

  // Coupon validation trigger
  const handleValidateCoupon = async () => {
    if (!areRequiredFieldsValid || !couponCode.trim()) return;

    setCouponStatus('validating');
    setCouponMessage('');

    if (onValidateCoupon) {
      try {
        const result = await onValidateCoupon({
          fullName: fullName.trim(),
          mobileMoneyNumber: mobileMoneyNumber.trim(),
          whatsAppNumber: whatsAppNumber.trim(),
          couponCode: couponCode.trim(),
        });
        if (result.isValid) {
          setCouponStatus('valid');
          setCouponMessage(result.message || 'Coupon applied! GH₵20 discount.');
        } else {
          setCouponStatus('invalid');
          setCouponMessage(result.message || 'This coupon code is not valid.');
        }
      } catch (err: unknown) {
        setCouponStatus('error');
        setCouponMessage(
          err instanceof Error
            ? err.message
            : 'Coupon validation is temporarily unavailable.'
        );
      }
    } else {
      setCouponStatus('idle');
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      mobileMoneyNumber: true,
      whatsAppNumber: true,
    });

    if (!areRequiredFieldsValid) {
      setFormError('Please complete all required fields with valid information before proceeding.');
      return;
    }

    setFormError(null);

    await onSubmit({
      fullName: fullName.trim(),
      mobileMoneyNumber: mobileMoneyNumber.trim(),
      whatsAppNumber: whatsAppNumber.trim(),
      couponCode: effectiveCouponStatus === 'valid' ? couponCode.trim() : couponCode.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
      {(externalError || formError) && (
        <Alert type="error" title="Registration Error">
          {externalError || formError}
        </Alert>
      )}

      {/* Input 1: Full Name */}
      <InputField
        label="Full Name"
        id="fullName"
        type="text"
        placeholder="e.g. Kwame Mensah"
        value={fullName}
        onChange={handleFullNameChange}
        onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
        error={touched.fullName ? errors.fullName : undefined}
        isRequired
        disabled={isSubmitting}
        leftIcon={<User className="w-4 h-4" />}
      />

      {/* Input 2: Mobile Money Number */}
      <InputField
        label="Mobile Money Number"
        id="mobileMoneyNumber"
        type="tel"
        placeholder="024XXXXXXX or +23324XXXXXXX"
        value={mobileMoneyNumber}
        onChange={handleMobileMoneyChange}
        onBlur={() => setTouched((prev) => ({ ...prev, mobileMoneyNumber: true }))}
        error={touched.mobileMoneyNumber ? errors.mobileMoneyNumber : undefined}
        helperText="Used for Mobile Money payment authorization on Paystack"
        isRequired
        disabled={isSubmitting}
        leftIcon={<Phone className="w-4 h-4" />}
      />

      {/* Input 3: WhatsApp Number */}
      <InputField
        label="WhatsApp Number"
        id="whatsAppNumber"
        type="tel"
        placeholder="055XXXXXXX or +23355XXXXXXX"
        value={whatsAppNumber}
        onChange={handleWhatsAppChange}
        onBlur={() => setTouched((prev) => ({ ...prev, whatsAppNumber: true }))}
        error={touched.whatsAppNumber ? errors.whatsAppNumber : undefined}
        helperText="Your digital ticket will be sent to this WhatsApp number"
        isRequired
        disabled={isSubmitting}
        leftIcon={<MessageSquare className="w-4 h-4" />}
      />

      {/* Input 4: Coupon Code (Gated) */}
      <CouponValidator
        couponCode={couponCode}
        onCouponChange={handleCouponChange}
        onClear={handleCouponClear}
        status={effectiveCouponStatus}
        message={couponMessage}
        onValidate={handleValidateCoupon}
        isGated={!areRequiredFieldsValid}
      />

      {/* Price Summary */}
      <PriceSummary
        isValidCoupon={effectiveCouponStatus === 'valid'}
        couponCode={effectiveCouponStatus === 'valid' ? couponCode : undefined}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        loadingText="Initializing Checkout..."
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="w-full text-base py-4"
      >
        Proceed to Paystack Checkout
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-brand-muted text-center pt-2">
        <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
        <span>Encrypted and secured by Paystack</span>
      </div>
    </form>
  );
};

export default RegistrationForm;
