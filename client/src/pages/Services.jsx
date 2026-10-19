import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ServicesSection } from '../components/home/ServicesSection';
import { Check, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const Services = ({ onSelectService, onOpenHireModal }) => {
  const pricingTiers = [
    {
      name: 'Starter Plan',
      tagline: 'Ideal for individuals, personal brands & landing pages',
      price: '$149',
      features: [
        'Single / Multi-page responsive design',
        'Custom visual identity & modern typography',
        'Dark / Light mode theme toggle',
        'Working contact form with email notifications',
        'SEO meta tags & fast loading speeds',
        'Social media & WhatsApp integration',
      ],
      popular: false,
      serviceName: 'Personal Portfolio Websites',
    },
    {
      name: 'Business Pro Plan',
      tagline: 'Best for coaching institutes, local businesses & agencies',
      price: '$299',
      features: [
        'Up to 8 custom responsive pages',
        'Course catalog / service breakdown showcase',
        'Lead capture funnel with duplicate prevention',
        'Google Maps & customer reviews integration',
        'Lighthouse 95+ Performance score',
        'Direct WhatsApp click-to-chat button',
        '30 days post-launch support & maintenance',
      ],
      popular: true,
      serviceName: 'Business Websites',
    },
    {
      name: 'Full Stack MERN Plan',
      tagline: 'Custom web application with database & admin dashboard',
      price: '$599',
      features: [
        'React frontend + Node.js/Express backend',
        'MongoDB Atlas database architecture',
        'Protected Admin Dashboard for content management',
        'Secure JWT authentication & role authorization',
        'RESTful API endpoints & file uploads',
        'Full deployment on Vercel & Render',
        '60 days warranty & maintenance support',
      ],
      popular: false,
      serviceName: 'React & MERN Stack Development',
    },
  ];

  const faqs = [
    {
      q: 'How long does it take to deliver a completed website?',
      a: 'A standard personal portfolio or landing page typically takes 3 to 5 business days. A multi-page business website takes 7 to 10 days, while custom MERN stack applications take 2 to 3 weeks depending on feature complexity.',
    },
    {
      q: 'Will my website work properly on mobile phones and tablets?',
      a: 'Yes, 100%. Every website I build uses a mobile-first responsive approach, tested across iPhones, Android devices, iPads, and high-resolution desktop screens.',
    },
    {
      q: 'Can I edit the content of my website after it is launched?',
      a: 'Absolutely. For clients needing regular content updates, I provide a protected admin dashboard where you can easily modify services, project showcases, skills, and testimonials without touching code.',
    },
    {
      q: 'What is required from my side to start the project?',
      a: 'We will begin with a brief discussion regarding your goals, target audience, any reference websites you like, and your text/logo assets. If you do not have content ready, I can help you structure it.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Web Development Services & Pricing | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Explore web development services offered by Mr. Vikas Maurya: Personal Portfolios, Business Websites, Coaching Portals, MERN Stack Development, and Website Redesign."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServicesSection onSelectService={onSelectService} />

        {/* Pricing Packages inspired by reference design */}
        <div className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Popular Website Development <span className="text-gradient">Packages</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Clear deliverables with no hidden charges. Custom requirements are always welcome.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl bg-white dark:bg-[#0c1322] border p-8 flex flex-col justify-between transition duration-300 shadow-sm dark:shadow-none ${
                  tier.popular
                    ? 'border-cyan-500 shadow-xl shadow-cyan-500/10 dark:border-cyan-500/60 dark:shadow-2xl dark:shadow-cyan-500/20'
                    : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/30">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{tier.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/[0.08]">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">one-time project fee</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(tier.serviceName)}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    tier.popular
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:opacity-95'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Choose This Package</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="py-16 border-t border-slate-200 dark:border-white/[0.06] max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Got Questions? I Have Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
