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
    <section className="dark-banner my-16 relative overflow-hidden rounded-[2.5rem] bg-[#0c0d12] border border-white/[0.08] p-8 sm:p-14 text-center shadow-2xl">
      {/* Ambient Cyber Neon Glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#0df2a3]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#0df2a3]/10 text-[#0df2a3] border border-[#0df2a3]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Available for New Projects</span>
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold !text-white tracking-tight font-display leading-[1.15]">
          Have a project in mind? <br />
          <span className="text-gradient">Let's build something great.</span>
        </h2>

        <p className="!text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl mx-auto">
          Whether you need a personal portfolio, business website, coaching portal, or custom MERN stack SaaS, I'm ready to turn your concept into reality with cutting-edge performance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/contact"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
            className="btn-cyber-pill px-7 py-3.5 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 group"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] !text-white font-mono font-semibold text-xs border border-white/10 hover:border-white/20 backdrop-blur-sm transition flex items-center gap-2 shadow-sm"
          >
            <Mail className="w-4 h-4 text-[#0df2a3]" />
            <span className="!text-white">Send Enquiry</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 !text-white border border-emerald-400/40 font-mono font-semibold text-xs transition flex items-center gap-2 shadow-md hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="!text-white">WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </section>
  );
};
