import React from 'react';
import { Ticket as TicketIcon, Calendar, MapPin, Clock, User, Printer, MessageSquare, Waves } from 'lucide-react';
import Button from '../common/Button';
import { TicketData } from '../../types/api';
import { EVENT_DETAILS } from '../../utils/constants';

export interface TicketCardProps {
  ticket: TicketData;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Printable Ticket Container */}
      <div className="relative rounded-3xl bg-brand-card border border-brand-cyan/40 shadow-glow-cyan/20 overflow-hidden text-left">
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-brand-surface via-brand-card to-brand-surface border-b border-brand-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-coral flex items-center justify-center text-brand-dark shadow-glow-cyan">
                <Waves className="w-4 h-4 text-brand-dark" />
              </div>
              <span className="font-extrabold tracking-wider text-sm text-white">
                SPLASH <span className="text-brand-cyan">&</span> VIBEZ
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Verified Pass
            </span>
          </div>

          <div className="text-xs text-brand-cyan font-medium">
            {EVENT_DETAILS.tagline}
          </div>
        </div>

        {/* Perforated Divider Styling */}
        <div className="relative flex items-center justify-between px-2 -my-2.5 z-10">
          <div className="w-5 h-5 -ml-5 rounded-full bg-brand-dark border-r border-brand-border" />
          <div className="flex-1 border-t-2 border-dashed border-brand-border/80 mx-2" />
          <div className="w-5 h-5 -mr-5 rounded-full bg-brand-dark border-l border-brand-border" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 sm:p-7 space-y-5 bg-brand-card/90">
          {/* Holder Name */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-4 h-4 text-brand-cyan" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-brand-muted font-bold">
                Ticket Holder
              </div>
              <div className="text-lg font-bold text-white capitalize">
                {ticket.holderName}
              </div>
            </div>
          </div>

          {/* Event Venue & Date Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border/60">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                  Venue
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200">
                  {ticket.venue || EVENT_DETAILS.venue}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                  Date & Time
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200">
                  {EVENT_DETAILS.dateFormatted}
                </div>
                <div className="text-[11px] text-brand-muted flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-brand-cyan" />
                  <span>{EVENT_DETAILS.timeFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Identifier Code Box */}
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-brand-surface/90 border border-brand-border text-center">
              <div className="text-[10px] uppercase tracking-wider text-brand-muted font-bold mb-1">
                Unique Pass ID
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-brand-cyan tracking-widest">
                {ticket.ticketId}
              </div>
              <div className="text-[10px] text-brand-subtle mt-1.5 flex items-center justify-center gap-1">
                <TicketIcon className="w-3 h-3" />
                <span>Single admission pass • Non-transferable</span>
              </div>
            </div>
          </div>

          {/* Entry Instructions */}
          <div className="text-xs text-brand-muted leading-relaxed bg-brand-surface/40 p-3 rounded-xl border border-brand-border/40">
            <p className="font-semibold text-slate-300 mb-0.5">Entry Instructions:</p>
            <p>Present this digital pass or your WhatsApp ticket confirmation at the entrance gate on arrival.</p>
          </div>
        </div>

        {/* Ticket Footer Bar */}
        <div className="p-4 bg-brand-surface/90 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-subtle">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Delivered via WhatsApp</span>
          </div>
          <span className="font-mono">SV-2026</span>
        </div>
      </div>

      {/* Action Buttons (Hidden when printed) */}
      <div className="mt-6 flex items-center justify-center gap-3 print:hidden">
        <Button
          type="button"
          variant="secondary"
          size="md"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print / Save Pass
        </Button>
      </div>
    </div>
  );
};

export default TicketCard;

