import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FolderGit2, CheckCircle2, Star, Layers, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const HeroSection = ({ onOpenHireModal }) => {
  const { profile } = usePortfolio();

  return (
    <section className="relative overflow-hidden pt-8 pb-16">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-inner mb-6 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {profile?.availabilityStatus || 'Available for Freelance & Contract Projects'}
          </span>
        </div>

        {/* Heading */}
        <p className="text-cyan-500 dark:text-cyan-400 text-base md:text-lg font-semibold tracking-wide mb-2 text-center">
          {profile?.heroHeading || "Hi, I'm Mr. Vikas Maurya."}
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mb-6 text-center">
          I Create <span className="text-gradient">Modern Websites</span> That Help Businesses Grow.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-8 text-center mx-auto">
          {profile?.heroDescription ||
            'I build responsive, user-friendly websites tailored to personal brands, startups, coaching institutes, and businesses. From custom UI/UX design to robust full-stack web solutions, I craft high-speed digital experiences engineered to turn visitors into loyal clients. Every project is built with clean code, modern aesthetics, and SEO optimization to help your brand stand out and scale.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            type="button"
            onClick={onOpenHireModal}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hire Me Now</span>
          </button>

          <Link
            to="/projects"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 shadow-sm dark:shadow-md transition-all flex items-center gap-2"
          >
            <FolderGit2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>View My Work</span>
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium text-sm transition"
          >
            Contact Me →
          </Link>
        </div>

        {/* Genuine Business & Experience Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/[0.07] text-center shadow-sm dark:shadow-none transition-colors">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block">
              {profile?.completedProjects || 15}+
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              Websites Delivered
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/[0.07] text-center shadow-sm dark:shadow-none transition-colors">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-500 dark:text-cyan-400 block">
              {profile?.clientSatisfaction || 100}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              Client Satisfaction
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/[0.07] text-center shadow-sm dark:shadow-none transition-colors">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-500 dark:text-purple-400 block">
              {profile?.yearsExperience || 2}+
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              Years Experience
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/[0.07] text-center shadow-sm dark:shadow-none transition-colors">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 block">
              100%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              Mobile Responsive
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
