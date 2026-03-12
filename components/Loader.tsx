import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

// Helper to get random unique items from an array
const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  if (!arr.length) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  // If we have fewer items than requested, duplicate them to fill the count
  if (shuffled.length < count) {
    return [...shuffled, ...shuffled, ...shuffled].slice(0, count);
  }
  return shuffled.slice(0, count);
};

// Defaults in case something goes wrong
const DEFAULT_IMAGES = [
  { url: '/assets/loader-images/personal.jpg', title: 'Personal' },
  { url: '/assets/loader-images/group.jpg', title: 'Group' },
  { url: '/assets/loader-images/family.jpg', title: 'Family' }
];

const quotes = [
  "Inhale the future, exhale the past.",
  "Yoga is the journey of the self, through the self, to the self.",
  "The body benefits from movement, and the mind benefits from stillness.",
  "Peace comes from within. Do not seek it without.",
  "Your life is a sacred journey. It is about change, discovery, movement, transformation.",
  "Quiet the mind, and the soul will speak."
];

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState<{ url: string, title: string }[]>([]);

  // Motion value for the displacement scale
  const displacementScale = useMotionValue(0);

  useEffect(() => {
    // 1. Dynamic Image Loading Logic
    const loadImages = async () => {
      // Glob import to find all images in the specific directory
      const imageModules = import.meta.glob('/src/assets/loader-images/*.{jpg,jpeg,png,webp,svg}', { eager: true });

      const loadedImages = Object.entries(imageModules).map(([path, module]: [string, any]) => {
        // Extract filename to use as title (capitalize first letter)
        const filename = path.split('/').pop()?.split('.')[0] || '';
        const title = filename.charAt(0).toUpperCase() + filename.slice(1);

        return {
          url: module.default, // The resolved URL from Vite
          title: title
        };
      });

      // If we found images, pick 3 random ones. Otherwise use defaults.
      if (loadedImages.length > 0) {
        setImages(getRandomItems(loadedImages, 3));
      } else {
        // Fallback if directory is empty or not found
        console.warn("No images found in src/assets/loader-images. Using defaults if available.");
        setImages(getRandomItems(DEFAULT_IMAGES, 3));
      }
    };

    loadImages();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Trigger the displacement animation when isVisible becomes false
  useEffect(() => {
    if (!isVisible) {
      animate(displacementScale, 200, { duration: 1.5, ease: "easeIn" });
    }
  }, [isVisible, displacementScale]);

  // Render a black screen immediately while images are loading/selecting
  if (images.length === 0) {
    return <div className="fixed inset-0 z-[100] bg-black" />;
  }

  const welcomeText = "Welcome";

  return (
    <>
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="displacementFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              className="displacement-map-target"
            />
          </filter>
        </defs>
      </svg>

      <AnimatePresence onExitComplete={onComplete}>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeIn" } }}
            style={{ filter: "url(#displacementFilter)" }}
            onAnimationStart={() => {
              // We need to manually bind the motion value to the SVG element attribute
              // because standard style binding doesn't work for SVG primitive attributes like 'scale' in a filter
              // However, since we can't easily animate the ref's attribute directly via React state during unmount
              // efficiently without re-renders, we use a subscription.
              // A cleaner way in Framer Motion is to use useTransform if we were rendering the motion.feDisplacementMap
              // But since the filter is separate, we'll use a small subscriber.
              const displacementMap = document.querySelector('.displacement-map-target');
              if (displacementMap) {
                displacementScale.on("change", (latest) => {
                  displacementMap.setAttribute('scale', latest.toString());
                });
              }
            }}
          >
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 overflow-hidden">
              {images.map((image, index) => (
                <motion.div
                  key={`${image.url}-${index}`}
                  className="relative h-full w-full overflow-hidden border-r border-white/5 last:border-r-0"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.1,
                    ease: [0.76, 0, 0.24, 1]
                  }}
                >
                  <motion.div
                    className="absolute inset-0 grayscale transition-all duration-700"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 3.5, ease: "easeOut" }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="h-full w-full object-cover opacity-40"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-black/50" />
                </motion.div>
              ))}

              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
                <motion.h1
                  className="text-white text-5xl md:text-7xl font-poppins mb-6 tracking-wide"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 1.2
                      }
                    }
                  }}
                >
                  {welcomeText.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.div
                  className="max-w-xl mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 1 }}
                >
                  <p className="text-white/80 text-lg md:text-xl font-light font-sans tracking-wider leading-relaxed">
                    "{quote}"
                  </p>
                </motion.div>

                <motion.div
                  className="w-24 h-px bg-white/30 mt-8"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                />
              </div>

              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1, duration: 2 }}
              >
                <div className="w-full h-px bg-white absolute top-1/2 -translate-y-1/2" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Loader;