import React, { useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

// Canonical map to deduplicate variations (e.g. "React" vs "React.js")
const CANONICAL_SKILL_NAMES = {
  react: 'React.js',
  'react.js': 'React.js',
  javascript: 'JavaScript',
  'javascript (es6+)': 'JavaScript',
  'node.js': 'Node.js',
  node: 'Node.js',
  'express.js': 'Express.js',
  express: 'Express.js',
  'tailwind css': 'Tailwind CSS',
  tailwind: 'Tailwind CSS',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  'git & github': 'GitHub',
};

// Default curated skill categories matching the exact UI design
const SKILL_CATEGORIES_CONFIG = [
  {
    id: '01',
    title: 'FRONTEND',
    categoryKey: 'frontend',
    defaultSkills: [
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Redux Toolkit',
    ],
  },
  {
    id: '02',
    title: 'BACKEND',
    categoryKey: 'backend',
    defaultSkills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'JWT',
      'Socket.IO',
    ],
  },
  {
    id: '03',
    title: 'DATABASE',
    categoryKey: 'database',
    defaultSkills: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Prisma',
      'Mongoose',
    ],
  },
  {
    id: '04',
    title: 'AI & TOOLS',
    categoryKey: 'tools',
    defaultSkills: [
      'Claude AI',
      'Git',
      'GitHub',
      'Postman',
      'Chart.js',
      'Recharts',
      'Vercel',
    ],
  },
];

export const SkillsSection = () => {
  const { skills } = usePortfolio();

  // Dynamically merge skills from portfolio context/database with canonical deduplication
  const cardsData = useMemo(() => {
    return SKILL_CATEGORIES_CONFIG.map((group) => {
      const seen = new Set();
      const combined = [];

      // Helper to add skill if not seen (normalized)
      const addSkill = (rawName) => {
        if (!rawName || typeof rawName !== 'string') return;
        const trimmed = rawName.trim();
        const lower = trimmed.toLowerCase();
        const canonical = CANONICAL_SKILL_NAMES[lower] || trimmed;
        const normKey = canonical.toLowerCase();

        if (!seen.has(normKey)) {
          seen.add(normKey);
          combined.push(canonical);
        }
      };

      // 1. Add default skills first (preserves clean reference ordering)
      group.defaultSkills.forEach(addSkill);

      // 2. Add extra custom skills from database
      (skills || [])
        .filter((s) => {
          const cat = (s.category || '').toLowerCase();
          if (group.categoryKey === 'frontend') return cat.includes('front');
          if (group.categoryKey === 'backend') return cat.includes('back');
          if (group.categoryKey === 'database') return cat.includes('data');
          if (group.categoryKey === 'tools') {
            return (
              cat.includes('tool') ||
              cat.includes('ai') ||
              cat.includes('devops') ||
              cat.includes('programming')
            );
          }
          return false;
        })
        .forEach((s) => addSkill(s.name));

      return {
        ...group,
        skills: combined,
      };
    });
  }, [skills]);

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/20">
          &lt;/&gt;
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          Technical Arsenal
        </span>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">Technologies</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
          Core languages, frameworks, databases, and modern developer tooling I use to architect and ship production apps.
        </p>
      </div>

      {/* 4 Category Cards Grid (2-columns on laptop/desktop so skills flow in horizontal rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="group relative rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/40 dark:hover:border-cyan-400/40 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              {/* Card Header: </> Badge on Left, Number Index on Right */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm group-hover:scale-105 transition-all">
                  <span className="font-mono text-sm font-bold tracking-tighter">
                    &lt;/&gt;
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {card.id}
                </span>
              </div>

              {/* Category Title */}
              <h3 className="text-xs sm:text-sm font-black tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-4">
                {card.title}
              </h3>

              {/* Skills Tag Pills */}
              <div className="flex flex-wrap gap-2.5">
                {card.skills.map((skillName) => (
                  <span
                    key={skillName}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-[#11192e] text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/[0.08] hover:bg-cyan-50 dark:hover:bg-[#16223d] hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:text-cyan-700 dark:hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm cursor-default"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
