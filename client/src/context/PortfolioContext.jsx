import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import {
  fallbackProfile,
  fallbackSkills,
  fallbackServices,
  fallbackProjects,
  fallbackTemplates,
  fallbackTestimonials,
} from '../utils/fallbackData';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(fallbackProfile);
  const [settings, setSettings] = useState({});
  const [skills, setSkills] = useState(fallbackSkills);
  const [services, setServices] = useState(fallbackServices);
  const [projects, setProjects] = useState(fallbackProjects);
  const [templates, setTemplates] = useState(fallbackTemplates);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [profileRes, skillsRes, servicesRes, projectsRes, templatesRes, testimonialsRes] =
        await Promise.allSettled([
          portfolioAPI.getProfile(),
          portfolioAPI.getSkills(),
          portfolioAPI.getServices(),
          portfolioAPI.getProjects(),
          portfolioAPI.getTemplates(),
          portfolioAPI.getTestimonials(),
        ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
        setProfile(profileRes.value.data.profile);
        setSettings(profileRes.value.data.settings || {});
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data.success) {
        setSkills(skillsRes.value.data.skills);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
        setServices(servicesRes.value.data.services);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data.success) {
        setProjects(projectsRes.value.data.projects);
      }
      if (templatesRes.status === 'fulfilled' && templatesRes.value.data.success) {
        setTemplates(templatesRes.value.data.templates);
      }
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.data.success) {
        setTestimonials(testimonialsRes.value.data.testimonials);
      }
    } catch (err) {
      console.warn('Portfolio data sync fallback enabled:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        settings,
        skills,
        services,
        projects,
        templates,
        testimonials,
        loading,
        refreshPortfolioData: fetchAllData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
