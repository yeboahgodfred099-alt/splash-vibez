import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border/60 bg-brand-dark/90 py-8 px-4 text-center text-xs text-brand-muted">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-cyan" />
          <span>Secure checkout powered by Paystack</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} SPLASH & VIBEZ. Triple Hill Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

