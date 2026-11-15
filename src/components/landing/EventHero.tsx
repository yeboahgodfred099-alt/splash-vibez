import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { EVENT_DETAILS } from '../../utils/constants';

export const EventHero: React.FC = () => {
  return (
    <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 text-center px-4 overflow-hidden">
      {/* Decorative gradient blur backdrop */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-brand-cyan/20 to-brand-coral/20 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Event category pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface/90 border border-brand-cyan/30 text-brand-cyan text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-glow-cyan/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Poolside Night Experience</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          SPLASH <span className="text-brand-cyan">&</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-teal-300 to-brand-coral">
            VIBEZ
          </span>
        </h1>

        {/* Short description */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal">
          {EVENT_DETAILS.description}
        </p>

        {/* Event Key Information Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-200 mb-10 w-full max-w-2xl">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/80 border border-brand-border">
            <MapPin className="w-4 h-4 text-brand-cyan shrink-0" />
            <span className="font-medium">{EVENT_DETAILS.venue}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/80 border border-brand-border">
            <Calendar className="w-4 h-4 text-brand-cyan shrink-0" />
            <span className="font-medium">{EVENT_DETAILS.dateFormatted}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/80 border border-brand-border">
            <Clock className="w-4 h-4 text-brand-cyan shrink-0" />
            <span className="font-medium">{EVENT_DETAILS.timeFormatted}</span>
          </div>
        </div>

        {/* Primary Pricing & CTA Card */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-brand-card/90 border border-brand-border shadow-card-elevated backdrop-blur-sm">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-brand-muted font-bold">Standard Ticket</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20">
              Coupon Eligible
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-extrabold text-white">
              {EVENT_DETAILS.pricing.currencySymbol}120
            </span>
            <span className="text-xs text-brand-muted">/ person</span>
          </div>

          <div className="p-2.5 rounded-lg bg-brand-surface/80 border border-brand-border/80 text-xs text-slate-300 mb-6 flex items-center justify-between">
            <span className="text-brand-muted">With valid discount coupon:</span>
            <span className="font-bold text-brand-cyan">
              {EVENT_DETAILS.pricing.currencySymbol}100{' '}
              <span className="text-[11px] font-normal text-emerald-400">(-GH₵20)</span>
            </span>
          </div>

          <Link
            to="/register"
            className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-brand-dark bg-brand-cyan hover:bg-brand-cyan-hover shadow-glow-cyan transition-all duration-200 text-base"
          >
            <span>Get Your Ticket</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="text-[11px] text-brand-subtle mt-3 text-center">
            Fast, secure checkout via Paystack. Ticket delivered instantly via WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventHero;

