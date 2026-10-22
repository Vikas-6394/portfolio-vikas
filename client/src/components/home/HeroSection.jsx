import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  Check,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Terminal,
  Cpu,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  Star,
  Search,
  ExternalLink,
  Sliders,
  ChevronDown,
  Play,
  Server,
  Lock,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const HeroSection = ({ onOpenHireModal }) => {
  const { profile } = usePortfolio();

  // Interactive slider/meter states matching the "Command Future" panel
  const [securityScore, setSecurityScore] = useState(98);
  const [innovationScore, setInnovationScore] = useState(99);

  // Candlestick timescale state
  const [activeTimescale, setActiveTimescale] = useState('1D');

  // Command prompt terminal state
  const [terminalOutput, setTerminalOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunPing = () => {
    setIsExecuting(true);
    setTerminalOutput('Connecting to edge gateway...');
    setTimeout(() => {
      setTerminalOutput('HTTP/2 200 OK — Latency: 22ms | Cluster: Asia-South1 | Status: HEALTHY');
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-16">
      {/* =====================================================================
          1. MAIN FUTURISTIC HERO SECTION (MATCHING SCREENSHOT TOP HALF)
          ===================================================================== */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#050507] text-[#f8fafc] border border-white/[0.08] shadow-2xl p-6 sm:p-10 lg:p-14 transition-all">
        {/* Ambient Holographic Neon Mint Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0df2a3]/15 via-[#00ff88]/5 to-transparent rounded-full blur-[110px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0df2a3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* GIANT GHOST WATERMARK HEADLINE (MATCHING "INNOVATIVE" IN SCREENSHOT) */}
        <div className="relative w-full text-center overflow-hidden pt-2 pb-4 select-none pointer-events-none">
          <span className="cyber-watermark text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-widest block leading-none">
            INNOVATIVE
          </span>
        </div>

        {/* HERO CENTERPIECE & FLANKING CONTROL PANELS */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center -mt-6 sm:-mt-10 lg:-mt-16">
          {/* LEFT PANEL: "Command Future" + Interactive Neon Sliders */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#0df2a3] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0df2a3] animate-ping"></span>
                Next-Gen Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                Command Future
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                {profile?.heroDescription
                  ? profile.heroDescription.slice(0, 140) + '...'
                  : 'Engineering AI-ready web platforms, lightning-fast fullstack systems, and robust digital experiences built for scale.'}
              </p>
            </div>

            {/* Futuristic Progress Sliders */}
            <div className="space-y-4 pt-2">
              {/* Security Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0df2a3]" /> Security
                  </span>
                  <span className="text-[#0df2a3] font-bold">{securityScore}%</span>
                </div>
                <div className="relative h-2 w-full bg-slate-900 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0df2a3] to-[#00ff88] rounded-full shadow-[0_0_12px_#0df2a3]"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Innovation Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#0df2a3]" /> Innovation
                  </span>
                  <span className="text-[#0df2a3] font-bold">{innovationScore}%</span>
                </div>
                <div className="relative h-2 w-full bg-slate-900 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0df2a3] via-cyan-400 to-[#00ff88] rounded-full shadow-[0_0_12px_#0df2a3]"
                    style={{ width: `${innovationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenHireModal}
                className="btn-cyber-pill px-5 py-2.5 rounded-full text-xs flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hire Developer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/projects"
                className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition"
              >
                View Works
              </Link>
            </div>
          </div>

          {/* CENTERPIECE: 3D CYBER ASTRONAUT AVATAR VISUAL (MATCHING CENTER OF SCREENSHOT) */}
          <div className="lg:col-span-4 flex justify-center items-center relative order-1 lg:order-2">
            <div className="relative w-64 sm:w-72 md:w-80 aspect-square group">
              {/* Glowing Ambient Halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#0df2a3]/30 via-[#00ff88]/10 to-transparent blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Outer Glass Ring */}
              <div className="relative w-full h-full rounded-full p-2 border border-white/15 bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(13,242,163,0.15)]">
                {/* 3D Cyber Astronaut Image */}
                <div className="w-full h-full rounded-full overflow-hidden bg-black border border-[#0df2a3]/30 relative">
                  <img
                    src="/cyber-hero.jpg"
                    alt="Futuristic AI Cyber Visual"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Glass Sheen Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"></div>
                  {/* Radial Vignette */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"></div>
                </div>

                {/* Floating HUD Indicator Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0c0d12]/95 border border-[#0df2a3]/40 shadow-lg flex items-center gap-2 text-[10px] font-mono text-[#0df2a3] whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#0df2a3] animate-pulse"></span>
                  <span>SYSTEM ONLINE • v2.6</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: "Our Rate" + Stats & Vertical Status Stepper */}
          <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end space-y-6 text-left lg:text-right order-3">
            {/* "Our Rate" Header with Neon Check Badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white font-display">Our Rate</span>
                <span className="text-[10px] text-slate-400 font-mono">Performance Metric</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0df2a3]/20 border border-[#0df2a3] flex items-center justify-center text-[#0df2a3] shadow-[0_0_15px_#0df2a3]">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Primary Stat: 98% Accuracy/Satisfaction */}
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight block">
                {profile?.clientSatisfaction || 98}%
              </span>
              <span className="text-xs text-slate-400 font-sans block">Accuracy / Client Satisfaction</span>
            </div>

            {/* Secondary Stat: 300+ Processed/Delivered */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0df2a3] font-mono tracking-tight block">
                {profile?.completedProjects ? `${profile.completedProjects * 20}+` : '300+'}
              </span>
              <span className="text-xs text-slate-400 font-sans block">Production Milestones Handled</span>
            </div>

            {/* Vertical Status Pill Stepper */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0c0d12] border border-white/10">
              <span className="px-2.5 py-1 rounded-full bg-[#0df2a3] text-black text-[10px] font-mono font-bold">
                PRO
              </span>
              <span className="px-2.5 py-1 text-slate-400 text-[10px] font-mono">
                SLA 99.9%
              </span>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BOTTOM DOCK: 4 SLEEK GLASS CAPSULES (MATCHING SCREENSHOT)
            ===================================================================== */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/[0.08]">
          {/* Capsule 1: PRELUDE */}
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Sparkles className="w-4 h-4 text-[#0df2a3]" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider font-mono uppercase text-white block">
                  PRELUDE
                </span>
                <span className="text-[10px] text-slate-400 block">React 19 & Next.js</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#0df2a3]/60 group-hover:bg-[#0df2a3] transition"></div>
          </div>

          {/* Capsule 2: OPTIMAL */}
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                <Cpu className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider font-mono uppercase text-white block">
                  OPTIMAL
                </span>
                <span className="text-[10px] text-slate-400 block">Node.js & Express</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-pink-500/60 group-hover:bg-pink-400 transition"></div>
          </div>

          {/* Capsule 3: VISUALY */}
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider font-mono uppercase text-white block">
                  VISUALY
                </span>
                <span className="text-[10px] text-slate-400 block">Tailwind & UI/UX</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500/60 group-hover:bg-amber-400 transition"></div>
          </div>

          {/* Capsule 4: SIGNET */}
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider font-mono uppercase text-white block">
                  SIGNET
                </span>
                <span className="text-[10px] text-slate-400 block">MongoDB & Atlas Cloud</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-cyan-500/60 group-hover:bg-cyan-400 transition"></div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. LOWER BENTO SHOWCASE (MATCHING SCREENSHOT LOWER HALF)
          ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT BENTO CARD: "AI & Humanity A Shared Vision" */}
        <div className="lg:col-span-7 rounded-[2.5rem] bg-[#0c0d12] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          {/* Subtle Ambient Mint Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0df2a3]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-5 relative z-10">
            {/* Pill Chip Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-300">
              <Search className="w-3 h-3 text-[#0df2a3]" />
              <span>CONNECTION YOUR BRAND</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
              AI & Humanity <br />
              <span className="text-gradient">A Shared Vision</span>
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-sans">
              Empower your brand through seamless integration with next-gen systems. Build fast, reactive, and intuitive web solutions that adapt, evolve, and resonate across every digital touchpoint — from interactive landing pages to enterprise fullstack clouds.
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="pt-8 relative z-10 flex flex-wrap items-center gap-4">
            <Link
              to="/projects"
              className="btn-cyber-pill px-6 py-3 rounded-full text-xs flex items-center gap-2 group"
            >
              <span>Explore Work</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/services"
              className="px-5 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition"
            >
              Browse Services
            </Link>
          </div>
        </div>

        {/* RIGHT BENTO CARD: 3D CYBERNETIC FIGURE WITH GLOWING HEADSET */}
        <div className="lg:col-span-5 rounded-[2.5rem] bg-[#0c0d12] border border-white/[0.08] p-4 relative overflow-hidden flex items-center justify-center min-h-[320px] shadow-xl group">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative border border-white/10 bg-black">
            <img
              src="/cyber-bento.jpg"
              alt="Cybernetic Avatar Figure with Headphones"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Ambient Lighting Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

            {/* Bottom floating badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-[#0c0d12]/90 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0df2a3] animate-pulse"></span>
                <span className="text-xs font-mono text-white font-medium">Neural Web Engine</span>
              </div>
              <span className="text-[10px] font-mono text-[#0df2a3]">100% RESPONSIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. INSTITUTIONAL-GRADE ANALYTICS & INTELLIGENCE BENTO 
             (MATCHING THE ENTIRE RIGHT-HAND SYSTEM IN THE USER'S SCREENSHOT)
          ===================================================================== */}
      <section className="space-y-6 pt-4">
        {/* Section Heading Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0df2a3] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0df2a3]"></span>
              DATA & ARCHITECTURE TELEMETRY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Institutional-Grade Web Intelligence
            </h3>
          </div>
          <Link
            to="/skills"
            className="text-xs font-mono text-[#0df2a3] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore Technical Stack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Bento Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: Live Candlestick / System Performance Chart */}
          <div className="rounded-[2rem] bg-[#0c0d12] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0df2a3] animate-pulse"></div>
                <span className="text-xs font-mono text-white font-bold">API Throughput & Health</span>
              </div>
              {/* Timescale Selector */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
                {['1H', '1D', '1W', '1M'].map((ts) => (
                  <button
                    key={ts}
                    onClick={() => setActiveTimescale(ts)}
                    className={`px-2 py-0.5 rounded ${
                      activeTimescale === ts
                        ? 'bg-[#0df2a3] text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Candlestick / Volatility Chart with Neon Mint Curve */}
            <div className="relative h-44 w-full bg-black/50 rounded-xl p-3 border border-white/5 flex flex-col justify-end">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 400 120" fill="none">
                {/* Background Grid Lines */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                {/* Candlestick Bars */}
                <rect x="25" y="70" width="8" height="25" fill="#0df2a3" rx="1" />
                <line x1="29" y1="60" x2="29" y2="105" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="65" y="55" width="8" height="35" fill="#0df2a3" rx="1" />
                <line x1="69" y1="45" x2="69" y2="98" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="105" y="65" width="8" height="20" fill="#f43f5e" rx="1" />
                <line x1="109" y1="58" x2="109" y2="92" stroke="#f43f5e" strokeWidth="1.5" />

                <rect x="145" y="40" width="8" height="40" fill="#0df2a3" rx="1" />
                <line x1="149" y1="30" x2="149" y2="88" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="185" y="45" width="8" height="25" fill="#0df2a3" rx="1" />
                <line x1="189" y1="35" x2="189" y2="80" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="225" y="30" width="8" height="35" fill="#0df2a3" rx="1" />
                <line x1="229" y1="20" x2="229" y2="75" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="265" y="35" width="8" height="20" fill="#f43f5e" rx="1" />
                <line x1="269" y1="25" x2="269" y2="65" stroke="#f43f5e" strokeWidth="1.5" />

                <rect x="305" y="20" width="8" height="35" fill="#0df2a3" rx="1" />
                <line x1="309" y1="10" x2="309" y2="65" stroke="#0df2a3" strokeWidth="1.5" />

                <rect x="345" y="15" width="8" height="30" fill="#0df2a3" rx="1" />
                <line x1="349" y1="5" x2="349" y2="55" stroke="#0df2a3" strokeWidth="1.5" />

                {/* Glowing Neon Trendline Curve */}
                <path
                  d="M 29 80 Q 80 60, 149 50 T 229 35 T 309 25 T 380 15"
                  fill="none"
                  stroke="#0df2a3"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_8px_#0df2a3]"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Current Velocity: <strong className="text-white">34.8k req/s</strong></span>
              <span className="text-[#0df2a3] font-bold">+18.4% Efficiency</span>
            </div>
          </div>

          {/* Bento Card 2: Real-time Code Execution & Latency Curve */}
          <div className="rounded-[2rem] bg-[#0c0d12] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-white font-bold">Execution Latency</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                EDGE RUNTIME
              </span>
            </div>

            {/* Live Metrics Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Global Ping</span>
                <span className="text-2xl font-mono font-bold text-white block">22.4 ms</span>
                <span className="text-[10px] text-[#0df2a3] font-mono">⚡ Ultra Low Latency</span>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">SLA Availability</span>
                <span className="text-2xl font-mono font-bold text-white block">99.98%</span>
                <span className="text-[10px] text-cyan-400 font-mono">🛡 Zero Downtime</span>
              </div>
            </div>

            {/* Mini Sparkline Bar Feed */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Vercel & Atlas Server Load</span>
                <span className="text-white font-bold">14% Normal</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-[#0df2a3] w-[14%] rounded-full shadow-[0_0_8px_#0df2a3]"></div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Microservice Prevention & Status Capsule */}
          <div className="rounded-[2rem] bg-[#0c0d12] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0df2a3]" />
                Microservices Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0df2a3]/10 text-[#0df2a3] text-[10px] font-mono font-bold border border-[#0df2a3]/30">
                ACTIVE
              </span>
            </div>

            {/* Status Item Badges */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0df2a3]"></span>
                  Mongo Atlas DB Cluster
                </span>
                <span className="text-[#0df2a3] text-[11px]">Synced (100%)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0df2a3]"></span>
                  Cloudinary Asset CDN
                </span>
                <span className="text-[#0df2a3] text-[11px]">Edge Cached</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0df2a3]"></span>
                  JWT & HTTPS SSL Auth
                </span>
                <span className="text-[#0df2a3] text-[11px]">Encrypted</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Latest Deployments Ledger */}
          <div className="rounded-[2rem] bg-[#0c0d12] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Latest Deployments
              </span>
              <span className="text-[10px] font-mono text-slate-400">Live Webhook</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-white block font-medium">Portfolio Cyber Redesign</span>
                  <span className="text-[10px] text-slate-500">production • git push</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#0df2a3]/20 text-[#0df2a3] text-[10px] font-bold">
                  SUCCESS
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-white block font-medium">Clothing E-Commerce API</span>
                  <span className="text-[10px] text-slate-500">release v1.4 • nodejs</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-white block font-medium">Coaching Platform Portal</span>
                  <span className="text-[10px] text-slate-500">mern stack • vercel</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                  DEPLOYED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            INTERACTIVE TERMINAL COMMAND PROMPT BAR (MATCHING SCREENSHOT)
            ===================================================================== */}
        <div className="rounded-2xl bg-[#0c0d12] border border-white/[0.08] p-3 sm:p-4 shadow-xl space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 flex items-center gap-3 px-3 py-2 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-slate-300">
              <Search className="w-4 h-4 text-[#0df2a3] flex-shrink-0" />
              <input
                type="text"
                readOnly
                value="curl -s https://vikas-portfolio.api/v1/metrics --health"
                className="bg-transparent border-none outline-none w-full text-slate-300 cursor-default"
              />
            </div>
            <button
              type="button"
              onClick={handleRunPing}
              disabled={isExecuting}
              className="w-full sm:w-auto btn-cyber-pill px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Running...' : 'Run Ping'}</span>
            </button>
          </div>

          {terminalOutput && (
            <div className="px-4 py-2.5 rounded-xl bg-black/90 border border-[#0df2a3]/30 font-mono text-[11px] text-[#0df2a3] animate-in fade-in duration-200">
              {terminalOutput}
            </div>
          )}
        </div>

        {/* =====================================================================
            CLIENT TESTIMONIAL BENTO CARD (MATCHING SCREENSHOT LOWER-RIGHT)
            ===================================================================== */}
        <div className="rounded-[2.5rem] bg-[#0c0d12] border border-white/[0.08] p-6 sm:p-8 shadow-xl relative overflow-hidden group">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: 3 Stacked Cyber Avatars */}
            <div className="md:col-span-3 flex md:flex-col gap-3 justify-center items-center">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-md">
                <img
                  src="/cyber-hero.jpg"
                  alt="Avatar 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#0df2a3]/40 bg-slate-900 shadow-md">
                <img
                  src="/cyber-bento.jpg"
                  alt="Avatar 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-900 shadow-md">
                <img
                  src={profile?.avatarUrl || '/vikas-maurya.png'}
                  alt="Avatar 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Testimonial Quote & 5 Gold Stars */}
            <div className="md:col-span-9 space-y-4">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                ))}
                <span className="text-xs font-mono text-slate-400 ml-2">5.0 / 5.0 Rating</span>
              </div>

              <blockquote className="text-base sm:text-lg text-slate-200 font-sans italic leading-relaxed">
                “We needed a reliable, cutting-edge web solution built from scratch. Vikas delivered a high-performance MERN architecture with exquisite UI detail and zero friction. Our users were genuinely wowed!”
              </blockquote>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">Aman Sharma</h4>
                  <p className="text-xs text-slate-400 font-mono">Founder, Digital Commerce Platform</p>
                </div>
                <Link
                  to="/testimonials"
                  className="text-xs font-mono text-[#0df2a3] hover:underline flex items-center gap-1"
                >
                  <span>More Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
