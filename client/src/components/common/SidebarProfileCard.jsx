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
      <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-xl dark:shadow-2xl flex flex-col items-center text-center transition-colors">
        {/* Profile Avatar with glowing ring */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-70 blur group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-slate-900">
            <img
              src={profile?.avatarUrl || '/vikas-maurya.png'}
              alt={profile?.fullName || 'Mr. Vikas Maurya'}
              className="w-full h-full object-cover object-[center_18%] group-hover:scale-105 transition duration-500"
            />
          </div>
          <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1322]" title="Available for projects"></span>
        </div>

        {/* Name and Designation */}
        <span className="text-xs uppercase tracking-widest text-cyan-500 dark:text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2">
          {profile?.availabilityStatus || 'Available for Freelance'}
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{profile?.fullName || 'Mr. Vikas Maurya'}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 max-w-[240px] leading-relaxed">
          {profile?.headline || 'Web Developer | MERN Stack Specialist'}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-3 my-4">
          <a
            href={profile?.socialLinks?.github || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={profile?.socialLinks?.twitter || 'https://twitter.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Twitter Profile"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
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
            className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/contact"
            className="flex-1 py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
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
                    ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
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
            className="hidden lg:flex mt-4 w-full py-2 px-3 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </a>
        )}
      </div>
    </aside>
  );
};
