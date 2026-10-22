import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0df2a3]/40 ${
        theme === 'dark'
          ? 'bg-[#0c0d12] text-[#0df2a3] hover:text-[#00ff88] border border-white/10 hover:border-[#0df2a3]/40 shadow-inner'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-emerald-700 border border-slate-200 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
