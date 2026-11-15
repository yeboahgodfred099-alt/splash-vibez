import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import Alert from '../components/common/Alert';

describe('Landing Page & Routing', () => {
  it('renders landing page with SPLASH & VIBEZ title and confirmed event details', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/SPLASH/i);
    expect(heading).toHaveTextContent(/VIBEZ/i);
    expect(screen.getAllByText(/Triple Hill Hotel/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Saturday, 12 December 2026/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/8:00 PM – 3:00 AM/i).length).toBeGreaterThan(0);
  });

  it('renders the standard ticket price of GH₵120 and discount info on landing page', () => {
    render(<App />);
    expect(screen.getAllByText(/120/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/100/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Get Your Ticket|Register Now/i }).length).toBeGreaterThan(0);
  });
});

describe('Shared UI Components', () => {
  it('renders Button with loading state and disabled behavior', () => {
    render(
      <Button isLoading loadingText="Validating...">
        Submit
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/Validating.../i)).toBeInTheDocument();
  });

  it('renders InputField with persistent label and accessible error', () => {
    render(
      <InputField
        label="Full Name"
        error="Name is required"
        isRequired
        placeholder="Enter name"
      />
    );
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });

  it('renders Alert with appropriate accessible role', () => {
    render(<Alert type="error" title="Validation Failed">Invalid coupon code</Alert>);
    const alertBox = screen.getByRole('alert');
    expect(alertBox).toBeInTheDocument();
    expect(screen.getByText(/Validation Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Invalid coupon code/i)).toBeInTheDocument();
  });
});
