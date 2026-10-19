import React, { useState } from 'react';
import {
  Code,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Terminal,
  FileCode,
  Palette,
  Wind,
  Smartphone,
  Server,
  Network,
  Coffee,
  GitBranch,
  GitPullRequest,
  Binary,
  Atom,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const ICON_MAP = {
  FileCode,
  Palette,
  Code,
  Atom,
  Wind,
  Smartphone,
  Server,
  Cpu,
  Network,
  Database,
  Terminal,
  Binary,
  Coffee,
  GitBranch,
  GitPullRequest,
  ShieldCheck,
  Layers,
};

export const SkillsSection = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Programming Languages', 'Tools & DevOps', 'Security & Fundamentals'];

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === 'All') return true;
    return skill.category === selectedCategory;
  });

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Code className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Technical Arsenal</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Technologies and frameworks I genuinely use to build production-grade web solutions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white font-semibold shadow-md shadow-purple-500/25'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.map((skill) => {
          const IconComponent = ICON_MAP[skill.iconName] || Code;
          return (
            <div
              key={skill._id || skill.name}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-[#11192e] shadow-sm dark:shadow-none transition duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  {skill.proficiencyPercentage}%
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition mb-1">
                  {skill.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-3">{skill.category}</span>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${skill.proficiencyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
