import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

// Safe storage helper to preserve the latest database records permanently in browser
const getCachedData = (key, fallback) => {
  try {
    const cached = localStorage.getItem(`vm_cache_${key}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) ? parsed.length > 0 : (parsed && typeof parsed === 'object')) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return fallback;
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`vm_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    // Ignore storage quota errors
  }
};

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => getCachedData('profile', fallbackProfile));
  const [settings, setSettings] = useState(() => getCachedData('settings', {}));
  const [skills, setSkills] = useState(() => getCachedData('skills', fallbackSkills));
  const [services, setServices] = useState(() => getCachedData('services', fallbackServices));
  const [projects, setProjects] = useState(() => getCachedData('projects', fallbackProjects));
  const [templates, setTemplates] = useState(() => getCachedData('templates', fallbackTemplates));
  const [testimonials, setTestimonials] = useState(() => getCachedData('testimonials', fallbackTestimonials));
  const [loading, setLoading] = useState(false);

  const fetchAllData = useCallback(async () => {
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
        setCachedData('profile', profileRes.value.data.profile);
        setCachedData('settings', profileRes.value.data.settings || {});
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data.success) {
        setSkills(skillsRes.value.data.skills);
        setCachedData('skills', skillsRes.value.data.skills);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
        setServices(servicesRes.value.data.services);
        setCachedData('services', servicesRes.value.data.services);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data.success) {
        const fetchedProjects = projectsRes.value.data.projects;
        setProjects(fetchedProjects);
        setCachedData('projects', fetchedProjects);
      }
      if (templatesRes.status === 'fulfilled' && templatesRes.value.data.success) {
        setTemplates(templatesRes.value.data.templates);
        setCachedData('templates', templatesRes.value.data.templates);
      }
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.data.success) {
        setTestimonials(testimonialsRes.value.data.testimonials);
        setCachedData('testimonials', testimonialsRes.value.data.testimonials);
      }
    } catch (err) {
      console.warn('Portfolio data sync fallback enabled:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Method to immediately update local projects and cache without delay
  const updateLocalProjects = useCallback((newProjects) => {
    setProjects(newProjects);
    setCachedData('projects', newProjects);
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
        updateLocalProjects,
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
