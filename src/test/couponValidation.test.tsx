import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../components/registration/RegistrationForm';

describe('Coupon Validation State Machine & Price Summary', () => {
  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Kofi Mensah' } });
    fireEvent.change(screen.getByLabelText(/Mobile Money Number/i), { target: { value: '0241234567' } });
    fireEvent.change(screen.getByLabelText(/WhatsApp Number/i), { target: { value: '0551234567' } });
  };

  it('handles valid coupon: updates price display to GH₵100 and shows success feedback', async () => {
    const mockValidator = vi.fn().mockResolvedValue({
      isValid: true,
      message: 'Coupon applied! GH₵20 discount.',
    });

    render(<RegistrationForm onSubmit={vi.fn()} onValidateCoupon={mockValidator} />);
    fillRequiredFields();

    const couponInput = screen.getByLabelText(/Coupon Code/i);
    fireEvent.change(couponInput, { target: { value: 'VIBEZ20' } });

    const validateBtn = screen.getByRole('button', { name: /Validate/i });
    fireEvent.click(validateBtn);

    await waitFor(() => {
      expect(mockValidator).toHaveBeenCalledWith({
        fullName: 'Kofi Mensah',
        mobileMoneyNumber: '0241234567',
        whatsAppNumber: '0551234567',
        couponCode: 'VIBEZ20',
      });
      expect(screen.getByText(/Coupon applied! GH₵20 discount/i)).toBeInTheDocument();
      // Price summary shows GH₵100.00
      expect(screen.getByText(/100.00/i)).toBeInTheDocument();
      expect(screen.getByText(/-GH₵20.00/i)).toBeInTheDocument();
    });
  });

  it('handles invalid coupon: leaves price at GH₵120 and shows error message', async () => {
    const mockValidator = vi.fn().mockResolvedValue({
      isValid: false,
      message: 'This coupon code is not valid.',
    });

    render(<RegistrationForm onSubmit={vi.fn()} onValidateCoupon={mockValidator} />);
    fillRequiredFields();

    const couponInput = screen.getByLabelText(/Coupon Code/i);
    fireEvent.change(couponInput, { target: { value: 'EXPIRED99' } });

    const validateBtn = screen.getByRole('button', { name: /Validate/i });
    fireEvent.click(validateBtn);

    await waitFor(() => {
      expect(mockValidator).toHaveBeenCalled();
      expect(screen.getByText(/This coupon code is not valid/i)).toBeInTheDocument();
      // Price summary remains GH₵120.00
      expect(screen.getAllByText(/120.00/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(/-GH₵20.00/i)).not.toBeInTheDocument();
    });
  });

  it('handles technical validation error: distinguishes from invalid coupon and allows retry', async () => {
    const mockValidator = vi.fn().mockRejectedValue(new Error('Network timeout. Please retry.'));

    render(<RegistrationForm onSubmit={vi.fn()} onValidateCoupon={mockValidator} />);
    fillRequiredFields();

    const couponInput = screen.getByLabelText(/Coupon Code/i);
    fireEvent.change(couponInput, { target: { value: 'DISCOUNT' } });

    const validateBtn = screen.getByRole('button', { name: /Validate/i });
    fireEvent.click(validateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Network timeout. Please retry/i)).toBeInTheDocument();
      // Must NOT claim code is invalid, and must leave price at standard GH₵120
      expect(screen.queryByText(/This coupon code is not valid/i)).not.toBeInTheDocument();
      expect(screen.getAllByText(/120.00/i).length).toBeGreaterThan(0);
      // Offers retry button
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    });
  });

  it('immediately invalidates coupon and resets price to GH₵120 when code is edited after validation', async () => {
    const mockValidator = vi.fn().mockResolvedValue({
      isValid: true,
      message: 'Coupon applied!',
    });

    render(<RegistrationForm onSubmit={vi.fn()} onValidateCoupon={mockValidator} />);
    fillRequiredFields();

    const couponInput = screen.getByLabelText(/Coupon Code/i);
    fireEvent.change(couponInput, { target: { value: 'VIBEZ20' } });
    fireEvent.click(screen.getByRole('button', { name: /Validate/i }));

    await waitFor(() => {
      expect(screen.getByText(/100.00/i)).toBeInTheDocument();
    });

    // Edit the coupon input
    fireEvent.change(couponInput, { target: { value: 'VIBEZ2' } });

    // Instantly resets to GH₵120 and clears success message
    expect(screen.getAllByText(/120.00/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Coupon applied!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/-GH₵20.00/i)).not.toBeInTheDocument();
  });

  it('clears coupon when clear button is clicked', async () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);
    fillRequiredFields();

    const couponInput = screen.getByLabelText(/Coupon Code/i) as HTMLInputElement;
    fireEvent.change(couponInput, { target: { value: 'TESTCODE' } });
    expect(couponInput.value).toBe('TESTCODE');

    const clearBtn = screen.getByRole('button', { name: /Clear coupon code/i });
    fireEvent.click(clearBtn);

    expect(couponInput.value).toBe('');
    expect(screen.getAllByText(/120.00/i).length).toBeGreaterThan(0);
  });
});
