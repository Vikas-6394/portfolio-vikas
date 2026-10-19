import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SkillsSection } from '../components/home/SkillsSection';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const Skills = ({ onOpenHireModal }) => {
  return (
    <>
      <Helmet>
        <title>Skills & Tech Stack | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Explore the technologies and frameworks Mr. Vikas Maurya uses: React, Tailwind CSS, Node.js, Express, MongoDB, JavaScript, Python, and web security fundamentals."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkillsSection />
        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
