import React from 'react';
import { Music, MapPin, Calendar, Clock, MessageSquare, ShieldCheck, Tag } from 'lucide-react';
import { EVENT_DETAILS } from '../../utils/constants';

export const EventDetails: React.FC = () => {
  const highlights = [
    {
      icon: <Music className="w-5 h-5 text-brand-cyan" />,
      title: 'Poolside Atmosphere',
      description: 'An evening of music, vibrant ambiance, and poolside energy under the night sky.',
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-coral" />,
      title: EVENT_DETAILS.venue,
      description: 'Hosted at the scenic Triple Hill Hotel. Convenient access and premium event spaces.',
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-cyan" />,
      title: '8:00 PM – 3:00 AM',
      description: 'Extended night event on Saturday, 12 December 2026 for the complete weekend experience.',
    },
    {
      icon: <Tag className="w-5 h-5 text-brand-coral" />,
      title: 'Fair & Simple Pricing',
      description: `Standard admission is ${EVENT_DETAILS.pricing.currencySymbol}120. Apply a valid promo code to enjoy admission at ${EVENT_DETAILS.pricing.currencySymbol}100.`,
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-brand-cyan" />,
      title: 'WhatsApp Ticket Delivery',
      description: 'Your verified electronic ticket details are delivered straight to your WhatsApp number upon payment confirmation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-coral" />,
      title: 'Verified Paystack Checkout',
      description: 'Protected Mobile Money and card payments processed securely through Paystack.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 max-w-5xl mx-auto border-t border-brand-border/60">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Event Highlights</h2>
        <p className="text-sm text-brand-muted">
          Everything you need to know before joining us for SPLASH & VIBEZ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-brand-card/70 border border-brand-border/80 hover:border-brand-cyan/40 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold text-white text-base mb-2">{item.title}</h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Schedule & Information Summary Bar */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-brand-surface to-brand-card border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-brand-cyan shrink-0" />
          <div>
            <div className="text-sm font-bold text-white">Save the Date</div>
            <div className="text-xs text-brand-muted">
              {EVENT_DETAILS.dateFormatted} • Doors open at 8:00 PM
            </div>
          </div>
        </div>

        <a
          href="/register"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-brand-surface border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan hover:text-brand-dark transition-all duration-200"
        >
          Book Your Spot
        </a>
      </div>
    </section>
  );
};

export default EventDetails;

