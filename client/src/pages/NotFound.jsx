import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Mr. Vikas Maurya</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md space-y-4">
          <span className="text-7xl font-extrabold text-cyan-400 block font-mono">404</span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
