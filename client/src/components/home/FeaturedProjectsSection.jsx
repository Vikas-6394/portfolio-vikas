import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSafeImageUrl } from '../../utils/imageHelper';

export const FeaturedProjectsSection = () => {
  const { projects } = usePortfolio();

  const featuredList = projects.filter((p) => p.isPublished).slice(0, 4);

  return (
    <section className="py-12 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-[#0df2a3]/10 text-emerald-600 dark:text-[#0df2a3] border border-[#0df2a3]/20">
          <Layers className="w-4 h-4" />
        </span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-[#0df2a3]">
          Recent Work
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl font-sans">
            Selected client and showcase applications built with React, Node.js, and modern full-stack architectures.
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs font-mono font-bold text-emerald-600 hover:text-emerald-700 dark:text-[#0df2a3] dark:hover:text-[#00ff88] flex items-center gap-1.5 transition"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredList.map((project) => (
          <div
            key={project._id || project.slug}
            className="group rounded-3xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/[0.08] hover:border-[#0df2a3]/40 shadow-sm dark:shadow-none overflow-hidden transition duration-300 flex flex-col justify-between"
          >
            {/* Project Image */}
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src={getSafeImageUrl(project.coverImage)}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-700 dark:text-[#0df2a3] border border-slate-200 dark:border-[#0df2a3]/20 shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#0df2a3] transition mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                  {project.shortDescription}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(Array.isArray(project.technologies)
                    ? project.technologies
                    : typeof project.technologies === 'string'
                    ? project.technologies.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
                    : []
                  ).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                <Link
                  to={`/projects/${project.slug}`}
                  className="text-xs font-mono font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-[#0df2a3] transition flex items-center gap-1"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 transition"
                      title="View Source Code"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#0df2a3] text-emerald-800 hover:text-black border border-emerald-200 hover:border-[#0df2a3] dark:bg-[#0df2a3]/10 dark:hover:bg-[#0df2a3] dark:text-[#0df2a3] dark:hover:text-black dark:border-[#0df2a3]/30 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
