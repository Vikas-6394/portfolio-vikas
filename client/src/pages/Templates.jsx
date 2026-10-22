import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout, Search, Eye, Sparkles, Check, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactCtaSection } from '../components/home/ContactCtaSection';
import { getSafeImageUrl } from '../utils/imageHelper';

export const Templates = ({ onRequestTemplate, onOpenHireModal }) => {
  const { templates } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Personal Portfolio',
    'Business Website',
    'Coaching Institute',
    'E-commerce Store',
    'Restaurant Website',
    'Travel and Tourism Website',
    'Landing Page',
    'Real Estate Website',
  ];

  const filteredTemplates = templates.filter((template) => {
    if (!template.isPublished) return false;
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Website Templates Gallery | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Browse modern, previewable website templates for portfolios, business sites, coaching institutes, e-commerce, and real estate. Custom-tailored and launched fast."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3 inline-block">
            Ready-Made Designs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Website <span className="text-gradient">Templates Gallery</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            High-converting, fully responsive website concepts built with modern tech. Preview designs live, choose the one you love, and have it personalized with your branding.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/25'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-white/[0.08]">
            <Layout className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Templates Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredTemplates.map((template) => (
              <div
                key={template._id || template.slug}
                className="group rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 shadow-sm dark:shadow-none overflow-hidden transition duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={getSafeImageUrl(
                      template.thumbnail,
                      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
                    )}
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

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition mb-2">
                      {template.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                      {template.shortDescription}
                    </p>

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
        )}

        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
