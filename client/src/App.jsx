import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { HireMeModal } from './components/common/HireMeModal';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Skills } from './pages/Skills';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Templates } from './pages/Templates';
import { DemoPreview } from './pages/DemoPreview';
import { Testimonials } from './pages/Testimonials';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPreviewRoute = location.pathname.startsWith('/templates/preview');

  // Modal State
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [modalService, setModalService] = useState('');
  const [modalTemplate, setModalTemplate] = useState('');

  const handleOpenHireModal = (service = '', template = '') => {
    setModalService(service || '');
    setModalTemplate(template || '');
    setIsHireModalOpen(true);
  };

  const handleSelectService = (serviceTitle) => {
    handleOpenHireModal(serviceTitle, '');
  };

  const handleRequestTemplate = (templateName) => {
    handleOpenHireModal('', templateName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors duration-300">
      <ScrollToTop />
      {/* Hide navbar on Admin and Demo Preview frames */}
      {!isAdminRoute && !isPreviewRoute && (
        <Navbar onOpenHireModal={() => handleOpenHireModal()} />
      )}

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenHireModal={() => handleOpenHireModal()}
                onSelectService={handleSelectService}
                onRequestTemplate={handleRequestTemplate}
              />
            }
          />
          <Route
            path="/about"
            element={<About onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route
            path="/skills"
            element={<Skills onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route
            path="/services"
            element={
              <Services
                onSelectService={handleSelectService}
                onOpenHireModal={() => handleOpenHireModal()}
              />
            }
          />
          <Route
            path="/projects"
            element={<Projects onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route
            path="/projects/:slug"
            element={<ProjectDetail onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route
            path="/templates"
            element={
              <Templates
                onRequestTemplate={handleRequestTemplate}
                onOpenHireModal={() => handleOpenHireModal()}
              />
            }
          />
          <Route
            path="/templates/preview/:slug"
            element={<DemoPreview onRequestTemplate={handleRequestTemplate} />}
          />
          <Route
            path="/testimonials"
            element={<Testimonials onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route
            path="/blog"
            element={<Blog onOpenHireModal={() => handleOpenHireModal()} />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAdminRoute && !isPreviewRoute && <Footer />}
      {!isAdminRoute && !isPreviewRoute && <WhatsAppButton />}

      <HireMeModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        initialService={modalService}
        initialTemplate={modalTemplate}
      />
    </div>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <AppContent />
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
