import React from 'react';
import { Link } from 'react-router-dom';
import { Waves } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-dark/80 border-b border-brand-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-coral flex items-center justify-center text-brand-dark font-black shadow-glow-cyan">
            <Waves className="w-5 h-5 text-brand-dark" />
          </div>
          <span className="font-extrabold tracking-wider text-lg text-white group-hover:text-brand-cyan transition-colors">
            SPLASH <span className="text-brand-cyan">&</span> VIBEZ
          </span>
        </Link>
        <Link
          to="/register"
          className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-brand-surface border border-brand-border text-slate-200 hover:text-white hover:border-brand-cyan transition-all duration-200"
        >
          Register Now
        </Link>
      </div>
    </header>
  );
};

export default Header;

