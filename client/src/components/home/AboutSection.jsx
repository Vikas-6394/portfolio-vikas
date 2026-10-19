import React from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle, GraduationCap, Target, BookOpen, Download, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AboutSection = () => {
  const { profile } = usePortfolio();

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <User className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">About Me</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        Designing Digital Experiences That <span className="text-gradient">Convert</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bio & Background */}
        <div className="lg:col-span-2 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            {profile?.aboutIntro ||
              'I am a web developer specializing in the MERN stack (MongoDB, Express, React, Node.js) with hands-on proficiency in Tailwind CSS, modern JavaScript, and responsive design systems. My focus is delivering production-ready, accessible, and fast websites that deliver measurable value for clients.'}
          </p>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
            <h3 className="text-slate-900 dark:text-white text-base font-bold flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Professional Background</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {profile?.background ||
                'Computer Science & Engineering background with deep interest in full-stack web architectures, algorithms, and practical web security fundamentals.'}
            </p>
          </div>

          {/* Areas of Interest */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-3">
              Areas of Specialization
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(profile?.areasOfInterest || [
                'Full-Stack MERN Architecture',
                'Modern UI/UX & Responsive Design',
                'RESTful API Engineering',
                'Performance & Core Web Vitals',
                'Website Security Fundamentals',
              ]).map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none"
                >
                  <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Goals & Learning card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1322] dark:to-[#11192e] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Career Vision</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {profile?.careerGoals ||
                'To create high-impact web products, partner with growing businesses on custom web solutions, and continuously master cutting-edge modern web technologies.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1322] dark:to-[#11192e] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Current Learning & Growth</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {profile?.currentLearning ||
                'Exploring Next.js App Router, advanced TypeScript patterns, microservice architectures, and Cloud Native deployments.'}
            </p>
          </div>

          {profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Resume</span>
            </a>
          ) : (
            <Link
              to="/contact"
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm dark:shadow-none"
            >
              <span>Get in Touch with Mr. Vikas Maurya</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
