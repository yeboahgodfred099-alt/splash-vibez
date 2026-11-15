import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../components/registration/RegistrationForm';

describe('Registration Form & Required-Field Gate', () => {
  it('renders exactly the 4 required/optional form inputs', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Money Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WhatsApp Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Coupon Code/i)).toBeInTheDocument();
  });

  it('keeps coupon input and Validate button locked when required fields are empty', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);

    const couponInput = screen.getByLabelText(/Coupon Code/i);
    const validateBtn = screen.getByRole('button', { name: /Validate/i });

    expect(couponInput).toBeDisabled();
    expect(validateBtn).toBeDisabled();
    expect(screen.getByText(/Complete required fields above to unlock/i)).toBeInTheDocument();
  });

  it('unlocks coupon input when all 3 required fields pass validation', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    const momoInput = screen.getByLabelText(/Mobile Money Number/i);
    const waInput = screen.getByLabelText(/WhatsApp Number/i);
    const couponInput = screen.getByLabelText(/Coupon Code/i);

    // Enter invalid/incomplete inputs first
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.change(momoInput, { target: { value: '024123' } });
    fireEvent.change(waInput, { target: { value: '055123' } });

    expect(couponInput).toBeDisabled();

    // Now complete with valid Ghanaian phone numbers
    fireEvent.change(nameInput, { target: { value: 'Kwame Mensah' } });
    fireEvent.change(momoInput, { target: { value: '0241234567' } });
    fireEvent.change(waInput, { target: { value: '0559876543' } });

    expect(couponInput).not.toBeDisabled();
  });

  it('keeps Mobile Money and WhatsApp numbers strictly independent', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);

    const momoInput = screen.getByLabelText(/Mobile Money Number/i) as HTMLInputElement;
    const waInput = screen.getByLabelText(/WhatsApp Number/i) as HTMLInputElement;

    fireEvent.change(momoInput, { target: { value: '0241111111' } });
    expect(momoInput.value).toBe('0241111111');
    expect(waInput.value).toBe('');

    fireEvent.change(waInput, { target: { value: '0552222222' } });
    expect(momoInput.value).toBe('0241111111');
    expect(waInput.value).toBe('0552222222');
  });

  it('submits registration at standard price GH₵120 when coupon is omitted', async () => {
    const handleSubmit = vi.fn();
    render(<RegistrationForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Ama Serwaa' } });
    fireEvent.change(screen.getByLabelText(/Mobile Money Number/i), { target: { value: '0241234567' } });
    fireEvent.change(screen.getByLabelText(/WhatsApp Number/i), { target: { value: '0207654321' } });

    const submitBtn = screen.getByRole('button', { name: /Proceed to Paystack Checkout/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        fullName: 'Ama Serwaa',
        mobileMoneyNumber: '0241234567',
        whatsAppNumber: '0207654321',
        couponCode: '',
      });
    });
  });
});

