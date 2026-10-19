import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, CheckCircle2, Award, Download, ArrowRight, Code2, ShieldCheck, HeartHandshake, Mail, Phone } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const About = ({ onOpenHireModal }) => {
  const { profile } = usePortfolio();

  return (
    <>
      <Helmet>
        <title>About Mr. Vikas Maurya | Web Developer & Software Engineer</title>
        <meta
          name="description"
          content="Learn about Mr. Vikas Maurya, a MERN stack web developer with a passion for clean design, responsive interfaces, and secure architectures."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
            Get To Know Me
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Hi, I'm <span className="text-gradient">Mr. Vikas Maurya</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            {profile?.subHeadline ||
              'I build modern, responsive and user-friendly websites for businesses, creators and individuals.'}
          </p>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16">
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] p-6 text-center shadow-sm dark:shadow-xl">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 mb-4 shadow-lg shadow-cyan-500/20">
                <img
                  src={
                    profile?.avatarUrl ||
                    '/vikas-maurya.png'
                  }
                  alt={profile?.fullName || 'Mr. Vikas Maurya'}
                  className="w-full h-full object-cover object-[center_18%]"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.fullName || 'Mr. Vikas Maurya'}</h3>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">{profile?.headline}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{profile?.location || 'India'}</p>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
                <button
                  type="button"
                  onClick={onOpenHireModal}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  Hire Me
                </button>
                <Link
                  to="/contact"
                  className="w-full py-2.5 rounded-xl border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Me</span>
                </Link>
                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.05] font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </a>
                )}
              </div>

              {/* Quick Direct Contacts */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2 text-left">
                <a
                  href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`}
                  className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition break-all"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                  <span className="truncate">{profile?.email || 'vikasmaurya195771@gmail.com'}</span>
                </a>
                <a
                  href={`tel:${profile?.phone || '+916394195771'}`}
                  className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                  title="Call Directly"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{profile?.phone || '+91 6394195771'}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            {/* Story */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Mission & Background</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {profile?.aboutIntro ||
                  'I am a web developer specializing in the MERN stack (MongoDB, Express, React, Node.js) with hands-on proficiency in Tailwind CSS, modern JavaScript, and responsive design systems.'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {profile?.background ||
                  'Computer Science & Engineering background with deep interest in full-stack web architectures, algorithms, and practical web security fundamentals.'}
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
                <Code2 className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Clean Code</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Maintainable, modular code adhering to industry standards and best practices.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
                <ShieldCheck className="w-6 h-6 text-purple-500 dark:text-purple-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Security First</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sanitized inputs, rate limiting, secure cookies, and strict headers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
                <HeartHandshake className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Client Centric</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Transparent communication, prompt turnaround, and measurable ROI.
                </p>
              </div>
            </div>

            {/* Career Goals */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Career Goals & Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile?.careerGoals}
              </p>
            </div>
          </div>
        </div>

        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
