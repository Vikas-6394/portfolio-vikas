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
    <section className="py-12 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-[#0df2a3]/10 text-emerald-600 dark:text-[#0df2a3] border border-[#0df2a3]/20">
          <Code className="w-4 h-4" />
        </span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-[#0df2a3]">
          Technical Arsenal
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl font-sans">
            Technologies and frameworks I genuinely use to build production-grade web solutions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition ${
                selectedCategory === cat
                  ? 'bg-[#0df2a3] text-black font-bold shadow-md shadow-[#0df2a3]/25'
                  : 'bg-slate-100 dark:bg-[#0c0d12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
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
              className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/[0.08] hover:border-[#0df2a3]/40 hover:bg-slate-50 dark:hover:bg-[#10121a] shadow-sm dark:shadow-none transition duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0df2a3]/10 border border-[#0df2a3]/20 flex items-center justify-center text-emerald-600 dark:text-[#0df2a3] group-hover:scale-110 transition">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  {skill.proficiencyPercentage}%
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#0df2a3] transition mb-1 font-display">
                  {skill.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-3 font-mono">{skill.category}</span>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden border border-slate-300/40 dark:border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0df2a3] to-cyan-400 transition-all duration-500 shadow-[0_0_8px_#0df2a3]"
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
