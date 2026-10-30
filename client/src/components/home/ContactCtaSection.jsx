import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const ContactCtaSection = ({ onOpenHireModal }) => {
  const { profile } = usePortfolio();
  const whatsappUrl = `https://wa.me/${profile?.whatsappNumber || '916394195771'}?text=${encodeURIComponent(
    'Hello Mr. Vikas Maurya, I want to discuss a new website project.'
  )}`;

  return (
    <section className="dark-banner my-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-[#0c1322] to-purple-950 border border-cyan-500/30 p-8 sm:p-12 text-center shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Available for New Projects</span>
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold !text-white tracking-tight">
          Have a project in mind? <br />
          <span className="text-gradient">Let's build something great.</span>
        </h2>

        <p className="!text-slate-200 text-sm sm:text-base leading-relaxed">
          Whether you need a personal portfolio, business website, coaching portal, or custom MERN stack development, I'm ready to turn your concept into reality.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/contact"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 !text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition flex items-center gap-2"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 !text-white font-semibold text-sm border border-white/20 hover:border-white/40 backdrop-blur-sm transition flex items-center gap-2 shadow-sm"
          >
            <Mail className="w-4 h-4 text-cyan-300" />
            <span className="!text-white">Send Enquiry</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 !text-white border border-emerald-400 font-semibold text-sm transition flex items-center gap-2 shadow-md hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="!text-white">Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
