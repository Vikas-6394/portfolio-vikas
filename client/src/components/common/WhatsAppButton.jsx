import React from 'react';
import { MessageCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const WhatsAppButton = () => {
  const { profile } = usePortfolio();
  const whatsappNumber = profile?.whatsappNumber || '916394195771';
  const defaultMessage = encodeURIComponent(
    `Hello Mr. Vikas Maurya, I visited your website portfolio and would like to discuss a website project.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
      aria-label="Chat directly on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-sm font-semibold tracking-wide hidden sm:inline">WhatsApp</span>
    </a>
  );
};
