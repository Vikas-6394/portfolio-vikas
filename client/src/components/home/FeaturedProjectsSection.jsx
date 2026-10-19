import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export const FeaturedProjectsSection = () => {
  const { projects } = usePortfolio();

  const featuredList = projects.filter((p) => p.isPublished).slice(0, 4);

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Layers className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Recent Work</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Selected client and showcase applications built with React, Node.js, and modern full-stack architectures.
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1.5 transition"
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
            className="group rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 shadow-sm dark:shadow-none overflow-hidden transition duration-300 flex flex-col justify-between"
          >
            {/* Project Image */}
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-white/10 shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {project.shortDescription}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.04]"
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
                  className="text-xs font-semibold text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-white transition flex items-center gap-1"
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
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent transition"
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
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-500 text-cyan-600 hover:text-white border border-cyan-200 hover:border-cyan-500 dark:bg-cyan-500/10 dark:hover:bg-cyan-500 dark:text-cyan-400 dark:hover:text-white dark:border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
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
