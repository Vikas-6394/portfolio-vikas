import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Mr. Vikas Maurya Portfolio</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Terms of Service</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mb-8">Last Updated: October 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Scope of Services</h2>
            <p>
              Mr. Vikas Maurya provides professional freelance website development, UI/UX implementation, full-stack MERN application engineering, and website optimization services. Project scopes, timelines, deliverables, and payment terms are agreed upon in writing prior to project kickoff.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Visual Demos vs. Deliverable Projects</h2>
            <p>
              Website templates showcased in the "Website Templates" gallery are visual sample concepts. A template preview does not automatically constitute a turnkey production website until purchased, personalized, and deployed under an agreed project scope.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Intellectual Property</h2>
            <p>
              Upon full settlement of agreed project fees, complete source code and associated assets developed for the client are transferred to the client, excluding any third-party open-source libraries or frameworks used under their respective licenses (e.g. MIT, Apache).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Payment & Revisions</h2>
            <p>
              Standard engagements require an initial deposit with milestone or completion balances. Projects include standard revision rounds to refine styling, layout, and content as specified in the agreed project proposal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. For inquiries regarding specific service contracts, please contact <a href="mailto:vikasmaurya195771@gmail.com" className="text-cyan-600 dark:text-cyan-400 underline font-medium">vikasmaurya195771@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
