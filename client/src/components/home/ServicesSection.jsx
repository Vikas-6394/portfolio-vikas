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
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-[#ea580c]/10 text-[#ea580c]">
          <Briefcase className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">What I Offer</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 dark:text-[#f7f4ed]">
            Professional Web <span className="text-gradient italic font-serif">Services</span>
          </h2>
          <p className="text-slate-600 dark:text-[#a1b5a8] text-sm mt-1 max-w-xl">
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
              className={`relative rounded-3xl bg-white dark:bg-[#0c1322] border transition duration-300 p-6 flex flex-col justify-between group shadow-sm dark:shadow-none ${
                service.isPopular
                  ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/30'
              }`}
            >
              {service.isPopular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-extrabold tracking-wide uppercase shadow-md shadow-cyan-500/20">
                  Most Requested
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5 group-hover:scale-110 transition duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Features Checklist */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
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
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                        {service.priceUnit || 'Starting from'}
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        ${service.startingPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Custom Quote</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-500 text-cyan-600 hover:text-white border border-cyan-200 hover:border-cyan-500 dark:bg-cyan-500/10 dark:hover:bg-cyan-500 dark:text-cyan-400 dark:hover:text-white dark:border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
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
