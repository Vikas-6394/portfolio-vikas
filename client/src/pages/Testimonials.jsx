import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ContactCtaSection } from '../components/home/ContactCtaSection';

export const Testimonials = ({ onOpenHireModal }) => {
  return (
    <>
      <Helmet>
        <title>Client Testimonials & Reviews | Mr. Vikas Maurya</title>
        <meta
          name="description"
          content="Read verified client reviews and feedback for web development work by Mr. Vikas Maurya. Real results from business owners, academies, and founders."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TestimonialsSection />
        <ContactCtaSection onOpenHireModal={onOpenHireModal} />
      </div>
    </>
  );
};
