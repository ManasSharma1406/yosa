
import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Volume2, VolumeOff, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';


interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, isMuted, onToggleMute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = !!localStorage.getItem('adminToken');
  const { openBookingModal } = useBooking();

  const handleScheduleClick = () => {
    openBookingModal();
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setIsOpen(false); // Close mobile menu on click

    if (target === 'instructor') {
      onNavigate('instructor');
      window.scrollTo(0, 0);
    } else if (target === 'personal-yoga') {
      onNavigate('personal-yoga');
      window.scrollTo(0, 0);
    } else if (target === 'faq') {
      onNavigate('faq');
      window.scrollTo(0, 0);
    } else if (target === 'group-offerings') {
      onNavigate('group-offerings');
      window.scrollTo(0, 0);
    } else if (target === 'family-plan') {
      onNavigate('family-plan');
      window.scrollTo(0, 0);
    } else {
      onNavigate('home');
      // If target is an anchor link (starts with #), we need to let the home page render first
      if (target.startsWith('#')) {
        setTimeout(() => {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const isInstructorPage = currentPage === 'instructor' || currentPage === 'teacher-dashboard';

  return (
    <>
      <motion.div
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center items-start pointer-events-none px-4"
      >
        <nav className="bg-white/10 backdrop-blur-xl pointer-events-auto rounded-full p-2 flex items-center shadow-2xl w-auto gap-4 md:gap-12 relative border border-white/20">

          {/* Auth buttons moved to top-right floating container in App.tsx */}

          {/* Logo - Red Circle */}
          <div
            className="w-12 h-12 flex items-center justify-center shrink-0 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <motion.img
              src="/red.png"
              alt="YogSamskara Logo"
              className="w-12 h-12 rounded-full object-cover"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Desktop Links - Centered */}
          <div className="hidden md:flex items-center gap-8 text-white font-poppins text-base tracking-wide font-medium">
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 'home')}
              className={`hover:text-white transition-colors ${currentPage === 'home' ? 'text-white' : ''}`}
            >
              Home
            </a>

            <a
              href="#instructor"
              onClick={(e) => handleNavClick(e, 'instructor')}
              className={`hover:text-white transition-colors ${currentPage === 'instructor' ? 'text-white' : ''}`}
            >
              Instructor
            </a>

            <div className="relative group h-full flex items-center">
              <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-3">
                <span className={currentPage === 'personal-yoga' ? 'text-white' : ''}>Online Offerings</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </div>

              {/* Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
                <div className={`backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-2 flex flex-col gap-1 ${currentPage === 'home' ? 'bg-black/60' : 'bg-black'}`}>
                  <a
                    href="#personal-yoga"
                    onClick={(e) => handleNavClick(e, 'personal-yoga')}
                    className="block px-4 py-2 text-sm text-white hover:text-white hover:bg-white/20 rounded-lg transition-colors text-center"
                  >
                    Personal Yoga
                  </a>
                  <a
                    href="#group-offerings"
                    onClick={(e) => handleNavClick(e, 'group-offerings')}
                    className="block px-4 py-2 text-sm text-white hover:text-white hover:bg-white/20 rounded-lg transition-colors text-center"
                  >
                    Group Offerings
                  </a>
                  <a
                    href="#family-plan"
                    onClick={(e) => handleNavClick(e, 'family-plan')}
                    className="block px-4 py-2 text-sm text-white hover:text-white hover:bg-white/20 rounded-lg transition-colors text-center"
                  >
                    Family Plan
                  </a>
                </div>
              </div>
            </div>

            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className={`hover:text-white transition-colors ${currentPage === 'faq' ? 'text-white' : ''}`}
            >
              FAQs
            </a>
          </div>

          {/* Right Buttons Group */}
          <div className="flex items-center gap-2">
            {/* Schedule Button (Hidden on small mobile if needed, or kept small) */}
            <button
              onClick={handleScheduleClick}
              className="hidden sm:flex bg-white text-stone-900 rounded-full px-6 py-3 text-base font-semibold hover:bg-stone-200 transition-colors items-center justify-center gap-2 whitespace-nowrap font-poppins"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={onToggleMute}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors shrink-0"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeOff className="w-6 h-6 text-stone-900" fill="currentColor" />
              ) : (
                <Volume2 className="w-6 h-6 text-stone-900" fill="currentColor" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 flex flex-col items-center gap-8 md:hidden"
          >
            <div className="flex flex-col gap-6 w-full max-w-sm text-center">
              <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-2xl text-white font-light">Home</a>
              <a href="#instructor" onClick={(e) => handleNavClick(e, 'instructor')} className="text-2xl text-white font-light">Instructor</a>

              <div className="border-y border-white/10 py-4 w-full">
                <p className="text-stone-400 text-sm uppercase tracking-widest mb-4">Offerings</p>
                <a href="#personal-yoga" onClick={(e) => handleNavClick(e, 'personal-yoga')} className="block text-xl text-white py-2">Personal Yoga</a>
                <a href="#group-offerings" onClick={(e) => handleNavClick(e, 'group-offerings')} className="block text-xl text-white py-2">Group Offerings</a>
                <a href="#family-plan" onClick={(e) => handleNavClick(e, 'family-plan')} className="block text-xl text-white py-2">Family Plan</a>
              </div>

              <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="text-2xl text-white font-light">FAQs</a>

              {/* Login/Signup/Dashboard/Logout buttons - hidden on instructor page */}
              {!isInstructorPage && (isAdmin || user) && (
                <div className="flex flex-col gap-4 mt-4">
                  {(isAdmin || user) && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(isAdmin ? '/instructor' : '/dashboard');
                      }}
                      className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-all"
                    >
                      Dashboard
                    </button>
                  )}
                  {(isAdmin || user) && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        if (isAdmin) {
                          localStorage.removeItem('adminToken');
                          navigate('/sign-in');
                        } else {
                          logout();
                        }
                      }}
                      className="w-full px-6 py-4 rounded-full bg-white text-stone-900 text-lg font-semibold hover:bg-stone-200 transition-all"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  handleScheduleClick();
                  setIsOpen(false);
                }}
                className="w-full bg-white text-stone-900 rounded-full px-6 py-4 text-lg font-semibold mt-4"
              >
                Schedule Class
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
