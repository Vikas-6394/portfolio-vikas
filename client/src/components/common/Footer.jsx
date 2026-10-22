import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Heart, Shield, Lock } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer = () => {
  const { profile } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#050507] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0df2a3] text-black flex items-center justify-center font-black text-sm shadow-md shadow-[#0df2a3]/20 font-mono">
                VM
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Mr. Vikas Maurya</span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              MERN Stack Developer & Web Specialist. Crafting high-performance websites, custom web apps, and modern templates.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={profile?.socialLinks?.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-200/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-white/[0.08] transition"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-200/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-[#0df2a3] dark:hover:text-[#0df2a3] hover:bg-slate-300/80 dark:hover:bg-white/[0.08] transition"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={profile?.socialLinks?.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-200/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-cyan-400 dark:hover:text-cyan-400 hover:bg-slate-300/80 dark:hover:bg-white/[0.08] transition"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">About Me</Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Skills & Tech Stack</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Services & Pricing</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Featured Projects</Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Website Templates</Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">Core Services</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Personal Portfolio Sites</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Business & Corporate Sites</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Coaching Institute Portals</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Custom MERN Applications</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">Website Redesign & Speed</Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-[#0df2a3] flex-shrink-0" />
                <a href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`} className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition break-all font-mono">
                  {profile?.email || 'vikasmaurya195771@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-[#0df2a3] flex-shrink-0" />
                <a href={`tel:${profile?.phone || '+916394195771'}`} className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition font-mono font-medium">
                  {profile?.phone || '+91 6394195771'}
                </a>
              </li>
              <li className="pt-2 flex flex-wrap items-center gap-2">
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-block px-3.5 py-1.5 rounded-lg bg-[#0df2a3]/10 border border-[#0df2a3]/30 text-emerald-700 dark:text-[#0df2a3] hover:bg-[#0df2a3]/20 transition font-mono font-semibold"
                >
                  Contact Me
                </Link>
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-block px-3.5 py-1.5 rounded-lg bg-slate-200/80 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition font-mono font-semibold"
                >
                  Start a Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {currentYear} Mr. Vikas Maurya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-emerald-600 dark:hover:text-[#0df2a3] transition">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="flex items-center gap-1 text-slate-500 hover:text-[#0df2a3] transition">
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
