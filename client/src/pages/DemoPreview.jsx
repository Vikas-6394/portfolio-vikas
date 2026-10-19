import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const DemoPreview = ({ onRequestTemplate }) => {
  const { slug } = useParams();
  const { templates } = usePortfolio();
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile

  const template = templates.find((t) => t.slug === slug) || {
    name: 'Sample Template Preview',
    category: 'Website Template',
    shortDescription: 'Live visual concept preview.',
    startingPrice: 69,
  };

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <>
      <Helmet>
        <title>Live Preview: {template.name} | Mr. Vikas Maurya</title>
      </Helmet>

      <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] flex flex-col transition-colors">
        {/* Top Control Bar */}
        <header className="sticky top-0 z-50 bg-white dark:bg-[#0c1322] border-b border-slate-200 dark:border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/templates"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition"
              title="Back to Templates"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{template.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  Visual Sample Demo
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{template.category}</span>
            </div>
          </div>

          {/* Device viewport switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                device === 'desktop'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                device === 'tablet'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                device === 'mobile'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onRequestTemplate(template.name)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request This Website</span>
            </button>
          </div>
        </header>

        {/* Disclaimer Notice */}
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/20 dark:text-amber-300 px-4 py-2.5 text-center text-xs flex items-center justify-center gap-2 font-medium">
          <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Note: This is an interactive visual demonstration preview. When ordered, Mr. Vikas Maurya delivers a full custom build personalized with your content, domain, and colors.
          </span>
        </div>

        {/* Simulated Browser Body */}
        <div className="flex-1 p-4 md:p-8 flex justify-center items-start overflow-y-auto">
          <div
            className={`transition-all duration-300 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b101d] shadow-2xl ${getContainerWidth()}`}
          >
            {/* Mock Interactive Template Preview Content */}
            <div className="p-6 md:p-12 space-y-12 text-slate-900 dark:text-slate-100">
              {/* Demo Hero */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 inline-block">
                  {template.category} Demo
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {template.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {template.shortDescription}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => onRequestTemplate(template.name)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition"
                  >
                    Get This Template (${template.startingPrice || 49})
                  </button>
                </div>
              </div>

              {/* Demo Screenshot Showcase */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 shadow-xl">
                <img
                  src={
                    template.thumbnail ||
                    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt={template.name}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Demo Features Bento Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">Included In This Design</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(template.keyFeatures && template.keyFeatures.length > 0
                    ? template.keyFeatures
                    : ['Modern Responsive Layout', 'Dark & Light Mode Ready', 'Interactive Contact Modal']
                  ).map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.06] text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2.5 shadow-sm dark:shadow-none"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo CTA Footer */}
              <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 dark:from-blue-950/60 dark:to-purple-950/60 dark:border-white/10 text-center space-y-3 shadow-sm dark:shadow-none">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Like This Design For Your Business?</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Mr. Vikas Maurya can customize and deploy this template for your coaching class, agency, brand, or store within 48 to 72 hours.
                </p>
                <button
                  type="button"
                  onClick={() => onRequestTemplate(template.name)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition"
                >
                  Request Customization Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
