import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
const Navbar = React.lazy(() => import('./components/Navbar'));
const Hero = React.lazy(() => import('./components/Hero'));
const HowItWorksSection = React.lazy(() => import('./components/HowItWorksSection'));
const HotspotSection = React.lazy(() => import('./components/HotspotSection'));
const TestimonialsSection = React.lazy(() => import('./components/TestimonialsSection'));
const Footer = React.lazy(() => import('./components/Footer'));
const Loader = React.lazy(() => import('./components/Loader'));
const InstructorPage = React.lazy(() => import('./components/InstructorPage'));
const PersonalYogaPage = React.lazy(() => import('./components/PersonalYogaPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const WhatWeOffer = React.lazy(() => import('./components/WhatWeOffer'));
const GroupOfferingsPage = React.lazy(() => import('./components/GroupOfferingsPage'));
const FamilyPlanPage = React.lazy(() => import('./components/FamilyPlanPage'));
const RetreatsPage = React.lazy(() => import('./components/RetreatsPage'));
const WhatsAppButton = React.lazy(() => import('./components/WhatsAppButton'));
const CalendarButton = React.lazy(() => import('./components/CalendarButton'));
const SignInPage = React.lazy(() => import('./components/auth/SignInPage'));
const SignUpPage = React.lazy(() => import('./components/auth/SignUpPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const SmoothScroll = React.lazy(() => import('./components/SmoothScroll'));
const ContactPopup = React.lazy(() => import('./components/ContactPopup'));
const ScheduleModal = React.lazy(() => import('./components/ScheduleModal'));
const ScrollToTop = React.lazy(() => import('./components/ScrollToTop'));
const QuestionnairePage = React.lazy(() => import('./components/QuestionnairePage'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));
const TeacherDashboard = React.lazy(() => import('./components/admin/TeacherDashboard'));

const FallbackLoader = () => <div className="h-screen w-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>;

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
      className="fixed top-6 right-6 z-50 flex items-center gap-3 pointer-events-auto max-md:hidden"
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
    const isExcludedPage = location.pathname.startsWith('/sign-in') || 
                           location.pathname.startsWith('/sign-up') || 
                           location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/teacher-dashboard');

    if (!loading && !user && !isExcludedPage) {
      const hasShown = localStorage.getItem('contactPopupShown');
      if (!hasShown) {
        const timer = setTimeout(() => {
          setShowContactPopup(true);
          localStorage.setItem('contactPopupShown', 'true');
        }, 1000); // Small delay after loader finishes
        return () => clearTimeout(timer);
      }
    }
  }, [loading, user, location.pathname]);

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
            <React.Suspense fallback={<FallbackLoader />}>
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
                <Route path="/retreats" element={<PageTransition><RetreatsPage /></PageTransition>} />
                <Route path="/sign-in/*" element={<PageTransition><SignInPage /></PageTransition>} />
                <Route path="/sign-up/*" element={<PageTransition><SignUpPage /></PageTransition>} />
                <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/teacher-dashboard" element={<PageTransition><TeacherDashboard /></PageTransition>} />
                <Route path="/questionnaire" element={<ProtectedRoute><PageTransition><QuestionnairePage /></PageTransition></ProtectedRoute>} />
                <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
              </Routes>
            </React.Suspense>
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