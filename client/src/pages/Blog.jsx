import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const Blog = ({ onOpenHireModal }) => {
  const articles = [
    {
      title: '5 Reasons Why a Fast, Responsive Website Directly Increases Sales in 2026',
      slug: 'fast-responsive-website-increases-sales',
      excerpt: 'How Core Web Vitals, mobile UX optimization, and clean MERN architecture transform casual web visitors into paying customers.',
      date: 'October 2026',
      readTime: '4 min read',
      tag: 'Web Strategy',
    },
    {
      title: 'Why Coaching Institutes and Academies Need a Custom Web Portal',
      slug: 'coaching-institutes-custom-web-portal',
      excerpt: 'Moving beyond WhatsApp groups to dedicated course catalogs, batch timetables, and automated admission enquiry pipelines.',
      date: 'September 2026',
      readTime: '5 min read',
      tag: 'Education Tech',
    },
    {
      title: 'Modern Portfolio Architecture: Dark Mode, Glassmorphism & SEO',
      slug: 'modern-portfolio-architecture-design',
      excerpt: 'A technical breakdown of building high-performance portfolio applications with React, Tailwind CSS, and RESTful backends.',
      date: 'August 2026',
      readTime: '6 min read',
      tag: 'Full Stack',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Web Insights & Blog | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Articles, technical guides, and business website optimization tips written by Mr. Vikas Maurya."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3 inline-block">
            Articles & Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Web Development <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Practical guides and case studies on building faster, more secure, and higher-converting digital products.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {articles.map((art, idx) => (
            <article
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-purple-500/40 shadow-sm dark:shadow-none transition duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-semibold border border-purple-500/20">
                  {art.tag}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{art.date}</span>
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-300 transition">
                {art.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {art.excerpt}
              </p>

              <button
                type="button"
                onClick={onOpenHireModal}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Discuss This Topic for Your Business</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>

        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
