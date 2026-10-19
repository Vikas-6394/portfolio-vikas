import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Mr. Vikas Maurya Portfolio</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Legal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mb-8">Last Updated: October 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information Collected</h2>
            <p>
              When you submit a project enquiry on this website, we collect your name, email address, optional phone number, service requested, budget range, and project details. This information is collected solely to respond to your inquiry and provide a tailored website development proposal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Use of Information</h2>
            <p>
              The information provided is used exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Review your website project requirements and communicate proposals.</li>
              <li>Coordinate project milestones, deliverables, and consultations.</li>
              <li>Send email confirmations and enquiry reference numbers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Sharing & Security</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. All submissions are processed through secure, rate-limited backend endpoints protected by industry-standard encryption, strict Content Security Policies, and HTTPS.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Cookies & Preferences</h2>
            <p>
              This website uses local storage exclusively for persisting user display preferences (such as Dark/Light theme mode) and maintaining authenticated administrative sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request deletion of your enquiry data, please contact Mr. Vikas Maurya at: <a href="mailto:vikasmaurya195771@gmail.com" className="text-cyan-600 dark:text-cyan-400 underline font-medium">vikasmaurya195771@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
