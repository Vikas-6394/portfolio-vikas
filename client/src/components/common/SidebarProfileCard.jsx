import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  Layers,
  Layout,
  MessageSquare,
  Mail,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export const SidebarProfileCard = ({ onOpenHireModal }) => {
  const { profile } = usePortfolio();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'About Me', path: '/about', icon: User },
    { label: 'Services', path: '/services', icon: Briefcase },
    { label: 'Projects', path: '/projects', icon: Layers },
    { label: 'Templates', path: '/templates', icon: Layout },
    { label: 'Testimonials', path: '/testimonials', icon: MessageSquare },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#0c0d12] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-xl dark:shadow-2xl flex flex-col items-center text-center transition-colors">
        {/* Profile Avatar with glowing cyber ring */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0df2a3] via-[#00ff88] to-cyan-400 opacity-60 blur group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-slate-900">
            <img
              src={profile?.avatarUrl || '/vikas-maurya.png'}
              alt={profile?.fullName || 'Mr. Vikas Maurya'}
              className="w-full h-full object-cover object-[center_18%] group-hover:scale-105 transition duration-500"
            />
          </div>
          <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-[#0df2a3] border-2 border-white dark:border-[#0c0d12] shadow-[0_0_8px_#0df2a3]" title="Available for projects"></span>
        </div>

        {/* Name and Designation */}
        <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-[#0df2a3] font-mono font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#0df2a3]/10 border border-emerald-200 dark:border-[#0df2a3]/20 mb-2">
          {profile?.availabilityStatus || 'Available for Freelance'}
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">{profile?.fullName || 'Mr. Vikas Maurya'}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 max-w-[240px] leading-relaxed font-sans">
          {profile?.headline || 'Web Developer | MERN Stack Specialist'}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-3 my-4">
          <a
            href={profile?.socialLinks?.github || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-[#0df2a3] dark:hover:text-[#0df2a3] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={profile?.socialLinks?.twitter || 'https://twitter.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-cyan-400 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition"
            aria-label="Twitter Profile"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-[#0df2a3] dark:hover:text-[#0df2a3] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition"
            aria-label="Send direct email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2.5 my-2">
          <button
            type="button"
            onClick={onOpenHireModal}
            className="flex-1 py-2.5 px-4 rounded-full btn-cyber-pill text-xs flex items-center justify-center gap-1.5"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/contact"
            className="flex-1 py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/10 transition"
          >
            Contact
          </Link>
        </div>

        {/* Quick Vertical Navigation Links (Hidden on mobile, visible on laptop) */}
        <nav className="hidden lg:block w-full mt-5 pt-5 border-t border-slate-200/80 dark:border-white/[0.06] space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-[#0df2a3]/10 dark:text-[#0df2a3] border border-emerald-500/30 dark:border-[#0df2a3]/30 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500 dark:text-[#0df2a3]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Resume Download or Highlights (Hidden on mobile, visible on laptop) */}
        {profile?.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex mt-4 w-full py-2 px-3 rounded-xl border border-emerald-500/30 dark:border-[#0df2a3]/30 text-emerald-600 dark:text-[#0df2a3] hover:bg-emerald-500/10 dark:hover:bg-[#0df2a3]/10 text-xs font-semibold items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </a>
        )}
      </div>
    </aside>
  );
};
