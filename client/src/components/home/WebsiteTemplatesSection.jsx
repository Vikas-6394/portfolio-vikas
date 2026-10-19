import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Eye, Sparkles, ArrowRight, Check } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const WebsiteTemplatesSection = ({ onRequestTemplate }) => {
  const { templates } = usePortfolio();
  const featuredTemplates = templates.filter((t) => t.isPublished).slice(0, 3);

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Layout className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ready-Made Designs</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Website <span className="text-gradient">Templates Gallery</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Pre-designed, fully responsive website concepts ready for rapid customization and deployment.
          </p>
        </div>

        <Link
          to="/templates"
          className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1.5 transition"
        >
          <span>Explore All Templates</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTemplates.map((template) => (
          <div
            key={template._id || template.slug}
            className="group rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 shadow-sm dark:shadow-none overflow-hidden transition duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src={template.thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  {template.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-slate-300">
                  {template.availabilityStatus || 'Available Now'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition mb-2">
                  {template.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {template.shortDescription}
                </p>

                {/* Key Features */}
                {template.keyFeatures && template.keyFeatures.length > 0 && (
                  <ul className="space-y-1.5 mb-6">
                    {template.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Customization & Setup:</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {template.startingPrice ? `$${template.startingPrice}` : 'Custom Quote'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={template.demoRoute || `/templates/preview/${template.slug}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Live Preview</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => onRequestTemplate(template.name)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request This</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
