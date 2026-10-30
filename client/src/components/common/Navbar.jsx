import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ArrowRight, Shield, Mail } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

export const Navbar = ({ onOpenHireModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { profile } = usePortfolio();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Skills', path: '/skills' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Templates', path: '/templates' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact', path: '/contact' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#070b14]/80 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition duration-300">
            VM
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition">
              {profile?.fullName || 'Mr. Vikas Maurya'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
              MERN Stack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/30 transition text-xs flex items-center gap-1"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={onOpenHireModal}
            type="button"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:opacity-95 transition hover:scale-105 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.08] px-4 pt-4 pb-6 animate-in slide-in-from-top-4 duration-200">
          {/* Profile header inside mobile drawer */}
          <div className="flex items-center gap-3 pb-4 mb-3 border-b border-slate-200/80 dark:border-white/[0.06]">
            <img
              src={profile?.avatarUrl || '/vikas-maurya.png'}
              alt={profile?.fullName || 'Mr. Vikas Maurya'}
              className="w-11 h-11 rounded-full object-cover border border-cyan-500/30"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {profile?.fullName || 'Mr. Vikas Maurya'}
              </h3>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                {profile?.availabilityStatus || 'Available for Freelance'}
              </p>
            </div>
            {/* Quick social links */}
            <div className="flex items-center gap-1.5">
              <a
                href={profile?.socialLinks?.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onOpenHireModal();
                }}
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hire Me</span>
              </button>
              <Link
                to="/contact"
                onClick={closeMenu}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
