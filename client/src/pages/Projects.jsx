import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layers, Search, ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../components/common/SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const Projects = ({ onOpenHireModal }) => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Full Stack MERN', 'Frontend Web App', 'E-commerce', 'Landing Page', 'Business Website'];

  const filteredProjects = projects.filter((project) => {
    if (!project.isPublished) return false;
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const techs = Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === 'string'
      ? project.technologies.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
      : [];

    const matchesSearch =
      (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      techs.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Portfolio Projects & Case Studies | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Explore real-world projects engineered by Mr. Vikas Maurya: Full-Stack MERN applications, responsive business websites, and high-performance frontend interfaces."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
            Proven Track Record
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Featured <span className="text-gradient">Projects & Works</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            A curated collection of web applications, custom business portals, and responsive websites built with modern engineering principles.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-500/25'
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
              placeholder="Search projects or tech..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
            <Layers className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <div
                key={project._id || project.slug}
                className="group rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 shadow-sm dark:shadow-none overflow-hidden transition duration-300 flex flex-col justify-between"
              >
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

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition mb-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : typeof project.technologies === 'string'
                        ? project.technologies.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
                        : []
                      ).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.04]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

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
                          title="Source Code"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-500 text-cyan-600 hover:text-white border border-cyan-200 hover:border-cyan-500 dark:bg-cyan-500/10 dark:hover:bg-cyan-500 dark:text-cyan-400 dark:hover:text-white dark:border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
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
        )}

        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
