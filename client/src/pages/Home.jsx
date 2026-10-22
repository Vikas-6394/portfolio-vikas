import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { FeaturedProjectsSection } from '../components/home/FeaturedProjectsSection';
import { WebsiteTemplatesSection } from '../components/home/WebsiteTemplatesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ContactCtaSection } from '../components/home/ContactCtaSection';
import { SidebarProfileCard } from '../components/common/SidebarProfileCard';
import { usePortfolio } from '../context/PortfolioContext';

export const Home = ({ onOpenHireModal, onSelectService, onRequestTemplate }) => {
  const { profile } = usePortfolio();

  return (
    <>
      <Helmet>
        <title>{profile?.fullName || 'Mr. Vikas Maurya'} | Official Portfolio & Web Developer</title>
        <meta
          name="description"
          content="Official Portfolio of Mr. Vikas Maurya. Explore full stack web development projects, creative website templates, client testimonials, and hire me for custom web development."
        />
        <link rel="canonical" href="https://portfolio-mr-vikas.vercel.app/" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Full-Width Futuristic Cyber Hero & Intelligence Bento (Matching user reference layout) */}
        <HeroSection onOpenHireModal={onOpenHireModal} />

        {/* Portfolio Showcase Grid (Profile Sidebar + Main Feed) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-8 border-t border-slate-200 dark:border-white/[0.08]">
          {/* Left Column Profile Card */}
          <SidebarProfileCard onOpenHireModal={onOpenHireModal} />

          {/* Right Column / Projects & Services Feed */}
          <main className="flex-1 w-full min-w-0 space-y-12">
            <FeaturedProjectsSection />
            <SkillsSection />
            <ServicesSection onSelectService={onSelectService} />
            <WebsiteTemplatesSection onRequestTemplate={onRequestTemplate} />
            <AboutSection />
            <TestimonialsSection />
            <ContactCtaSection onOpenHireModal={onOpenHireModal} />
          </main>
        </div>
      </div>
    </>
  );
};
