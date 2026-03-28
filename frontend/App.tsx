import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorksSection from './components/HowItWorksSection';
import HotspotSection from './components/HotspotSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import Loader from './components/Loader';
import InstructorPage from './components/InstructorPage';
import PersonalYogaPage from './components/PersonalYogaPage';
import FAQPage from './components/FAQPage';
import WhatWeOffer from './components/WhatWeOffer';
import GroupOfferingsPage from './components/GroupOfferingsPage';
import FamilyPlanPage from './components/FamilyPlanPage';
import WhatsAppButton from './components/WhatsAppButton';
import CalendarButton from './components/CalendarButton';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';
import Dashboard from './components/Dashboard';
import SmoothScroll from './components/SmoothScroll';
import ContactPopup from './components/ContactPopup';
import { BookingProvider, useBooking } from './context/BookingContext';
import ScheduleModal from './components/ScheduleModal';
import ScrollToTop from './components/ScrollToTop';
import QuestionnairePage from './components/QuestionnairePage';
import NotFoundPage from './components/NotFoundPage';
import TeacherDashboard from './components/admin/TeacherDashboard';

const TopRightAuth: React.FC<{ hidden: boolean }> = ({ hidden }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = !!localStorage.getItem('adminToken');

  if (location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up')) {
    return null;
  }

  return (
    <motion.div
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 pointer-events-auto"
    >
      {!user && !isAdmin ? (
        <>
          <button
            onClick={() => navigate('/sign-in')}
            className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white text-sm font-semibold hover:bg-white/10 transition-all font-poppins"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="px-6 py-2.5 rounded-full bg-white text-stone-900 text-sm font-semibold hover:bg-stone-200 transition-all shadow-xl font-poppins"
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate(isAdmin ? '/teacher-dashboard' : '/dashboard')}
            className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white text-sm font-semibold hover:bg-white/10 transition-all font-poppins"
          >
            Dashboard
          </button>
          <button
            onClick={async () => {
              if (isAdmin) {
                localStorage.removeItem('adminToken');
                navigate('/sign-in');
              } else {
                await logout();
                navigate('/');
              }
            }}
            className="px-6 py-2.5 rounded-full bg-white text-stone-900 text-sm font-semibold hover:bg-stone-200 transition-all shadow-xl font-poppins"
          >
            Logout
          </button>
        </>
      )}
    </motion.div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader onComplete={() => { }} />;
  if (!user) return <Navigate to="/sign-in" />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <SmoothScroll>
      <AuthProvider>
        <BookingProvider>
          <AppInner />
        </BookingProvider>
      </AuthProvider>
    </SmoothScroll>
  );
};

const AppInner: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  
  // Initialize from localStorage, default to true for autoplay policies
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('globalAudioMuted');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isScheduleModalOpen, closeBookingModal } = useBooking();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      const hasShown = localStorage.getItem('contactPopupShown');
      if (!hasShown) {
        const timer = setTimeout(() => {
          setShowContactPopup(true);
          localStorage.setItem('contactPopupShown', 'true');
        }, 1000); // Small delay after loader finishes
        return () => clearTimeout(timer);
      }
    }
  }, [loading, user]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Determine current page for Navbar highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.substring(1); // remove leading slash
  };

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo(0, 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('globalAudioMuted', String(newMuted));
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
      if (!newMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  // Global audio: play as soon as user first interacts with the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current) {
          audioRef.current.muted = false;
          setIsMuted(false);
          audioRef.current.play().catch(() => {
            // If autoplay fails even after interaction, stay muted
          });
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      }
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  // Sync mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const videoRef = useRef<HTMLVideoElement>(null);


  const isAuthPage = location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up');

  return (
    <>
      {/* Global persistent background audio – plays on ALL pages */}
      <audio
        ref={audioRef}
        src="/hero.mp4"
        loop
        muted={isMuted}
        preload="none"
        style={{ display: 'none' }}
      />

      {location.pathname === '/' && (
        <video
          ref={videoRef}
          autoPlay
          muted={true}
          loop
          playsInline
          preload="metadata"
          className="absolute top-0 left-0 w-full h-[100vh] object-cover z-[-1]"
          style={{ pointerEvents: 'none' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {loading && <Loader onComplete={() => setLoading(false)} />}

      <div className="transition-opacity duration-700 opacity-100">
        <Navbar
          onNavigate={handlePageChange}
          currentPage={getCurrentPage()}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <WhatsAppButton />
        <CalendarButton />
        <ContactPopup isOpen={showContactPopup} onClose={() => setShowContactPopup(false)} />

        <TopRightAuth hidden={hidden} />

        <main className={`w-full ${location.pathname === '/' ? 'bg-transparent' : isAuthPage ? 'bg-black' : 'bg-stone-50'}`}>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/" element={
                <PageTransition>
                  <Hero isMuted={isMuted} />
                  <WhatWeOffer />
                  <HowItWorksSection />
                  <HotspotSection />
                  <TestimonialsSection />
                </PageTransition>
              } />
              <Route path="/instructor" element={<PageTransition><InstructorPage /></PageTransition>} />
              <Route path="/personal-yoga" element={<PageTransition><PersonalYogaPage /></PageTransition>} />
              <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
              <Route path="/group-offerings" element={<PageTransition><GroupOfferingsPage /></PageTransition>} />
              <Route path="/family-plan" element={<PageTransition><FamilyPlanPage /></PageTransition>} />
              <Route path="/sign-in/*" element={<PageTransition><SignInPage /></PageTransition>} />
              <Route path="/sign-up/*" element={<PageTransition><SignUpPage /></PageTransition>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/teacher-dashboard" element={<PageTransition><TeacherDashboard /></PageTransition>} />
              <Route path="/questionnaire" element={<ProtectedRoute><PageTransition><QuestionnairePage /></PageTransition></ProtectedRoute>} />
              <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
          {!['/sign-in', '/sign-up', '/dashboard', '/teacher-dashboard', '/group-offerings', '/personal-yoga', '/family-plan', '/questionnaire'].some(path => location.pathname.startsWith(path)) && location.pathname !== '*' && !['/404'].includes(location.pathname) && <Footer />}
        </main>

        {/* Global Schedule Modal */}
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={closeBookingModal}
        />
      </div >
    </>
  );
};

export default App;