import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, CheckCircle, Sparkles, Layers } from 'lucide-react';
import { GithubIcon } from '../components/common/SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';

export const ProjectDetail = ({ onOpenHireModal }) => {
  const { slug } = useParams();
  const { projects } = usePortfolio();

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The project you requested does not exist or has been removed.</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} — Case Study | Mr. Vikas Maurya</title>
        <meta name="description" content={project.shortDescription} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
              >
                <span>Launch Live Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}

            <button
              type="button"
              onClick={onOpenHireModal}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:border-white/10 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>Request Similar Project</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-slate-900 mb-12 shadow-sm dark:shadow-2xl">
          <img
            src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
            alt={project.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Case Study Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Project Overview & Objectives</h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>{project.fullCaseStudy || project.shortDescription}</p>
              </div>
            </div>

            {project.features && project.features.length > 0 && (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Engineering Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Technologies Applied
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-cyan-50/60 dark:bg-gradient-to-br dark:from-cyan-950/40 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-500/20 text-center space-y-3 shadow-sm dark:shadow-none">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Need a Similar Project?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                I can customize this architecture for your brand or build a completely bespoke solution.
              </p>
              <button
                type="button"
                onClick={onOpenHireModal}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
