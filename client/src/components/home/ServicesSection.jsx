import React from 'react';
import {
  Briefcase,
  UserCheck,
  Target,
  GraduationCap,
  ShoppingBag,
  Layers,
  RefreshCw,
  Wrench,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const ICON_MAP = {
  UserCheck,
  Briefcase,
  Target,
  GraduationCap,
  ShoppingBag,
  Layers,
  RefreshCw,
  Wrench,
};

export const ServicesSection = ({ onSelectService }) => {
  const { services } = usePortfolio();

  return (
    <section className="py-12 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-[#0df2a3]/10 text-emerald-600 dark:text-[#0df2a3] border border-[#0df2a3]/20">
          <Briefcase className="w-4 h-4" />
        </span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-[#0df2a3]">
          What I Offer
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Professional Web <span className="text-gradient">Services</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl font-sans">
            From modern personal portfolios to custom MERN applications, I deliver scalable, responsive websites tailored to your goals.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = ICON_MAP[service.iconName] || Briefcase;

          return (
            <div
              key={service._id || service.slug}
              className={`relative rounded-3xl bg-white dark:bg-[#0c0d12] border transition duration-300 p-6 flex flex-col justify-between group shadow-sm dark:shadow-none ${
                service.isPopular
                  ? 'border-[#0df2a3] shadow-[0_0_20px_rgba(13,242,163,0.15)]'
                  : 'border-slate-200 dark:border-white/[0.08] hover:border-[#0df2a3]/40'
              }`}
            >
              {service.isPopular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#0df2a3] text-black text-[10px] font-mono font-extrabold tracking-wide uppercase shadow-md shadow-[#0df2a3]/30">
                  Most Requested
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0df2a3]/10 border border-[#0df2a3]/20 flex items-center justify-center text-emerald-600 dark:text-[#0df2a3] mb-5 group-hover:scale-110 transition duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#0df2a3] transition mb-2 font-display">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  {service.shortDescription}
                </p>

                {/* Features Checklist */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#0df2a3] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price and Action Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  {service.startingPrice ? (
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono tracking-wider">
                        {service.priceUnit || 'Starting from'}
                      </span>
                      <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                        ₹{service.startingPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">Custom Quote</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-[#0df2a3] text-emerald-800 hover:text-black border border-emerald-200 hover:border-[#0df2a3] dark:bg-[#0df2a3]/10 dark:hover:bg-[#0df2a3] dark:text-[#0df2a3] dark:hover:text-black dark:border-[#0df2a3]/30 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
