
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Award, Heart, Sun } from 'lucide-react';

const InstructorPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white">

      {/* Hero Profile Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ willChange: "transform" }}
            className="w-full md:w-[35%] relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/profile.JPG"
                alt="Bhumika"
                decoding="async"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden md:flex w-40 h-40 bg-stone-900 border border-white/20 rounded-full items-center justify-center text-white shadow-xl z-10 p-4 text-center">
              <span className="font-serif italic text-lg leading-tight">15+ Years Experience</span>
            </div>
          </motion.div>

          <div className="w-full md:w-1/2 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-6xl md:text-8xl font-sans font-light text-white mb-6 tracking-tight">
                Bhumika <br />
                <span className="font-serif italic text-stone-400">Hardiya</span>
              </h1>
              <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.2em] mb-8">
                Yoga Therapist | Founder of Yog Samskara | Sharing yoga as a path to healing, balance, and inner awareness
              </p>

              <div className="space-y-6 text-stone-300 text-lg font-light leading-relaxed">
                <p>
                  Welcome to Yog Samskara, a space where yoga becomes a journey of healing, awareness, and self-discovery.
                </p>
                <p>
                  I’m Bhumika Hardiya, a yoga therapist and teacher who has been practicing yoga since the age of 11. What began as a simple childhood practice gradually unfolded into a lifelong path that continues to shape the way I understand the body, the mind, and the deeper connection within ourselves.
                </p>
                <p>
                  Over the years, my journey with yoga has taken me through different communities, retreats, and natural landscapes, where I’ve had the opportunity to share the practice with people from diverse backgrounds. These experiences have shown me that yoga is not just about postures — it is a living practice that evolves with each individual.
                </p>
                <p>
                  With a Master’s degree in Yoga Therapy and teaching experience since 2017, my approach blends traditional yogic wisdom with a therapeutic understanding of the body. I work with students to help them relieve pain, improve mobility, build strength, and reconnect with themselves through breath, awareness, and mindful movement.
                </p>
                <p>
                  Through Yog Samskara, my intention is to create a supportive and conscious space where yoga is experienced not just as exercise, but as a path to balance, resilience, and inner transformation.
                </p>
              </div>

              <div className="mt-12 flex gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">9+</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">Years Teaching</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">Master's</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">in Yoga Therapy</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">1200 Ryt</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">Ashtanga Vinyasa - Hatha - Aerial Yoga</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">Tibetan</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">Singing Bowl Sound Healing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / Quote */}
      <section className="bg-white/5 border-y border-white/10 py-24 mb-24 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-12 h-12 text-stone-600 mx-auto mb-8 rotate-180" />
          <h2 className="text-3xl md:text-5xl font-serif italic text-stone-200 leading-snug mb-8">
            "Yoga transformed my life, and I want to share that transformation with you."
          </h2>
          <div className="w-24 h-[1px] bg-white/20 mx-auto"></div>
        </div>
      </section>

      {/* My Approach / Details */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform" }}
            className="bg-stone-900/50 p-10 rounded-3xl shadow-sm border border-white/10"
          >
            <Award className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Heal</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Whether it’s physical pain, emotional stress, or life’s challenges, I use yoga therapy and sound healing to address the root cause and bring you relief.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ willChange: "transform" }}
            className="bg-stone-900/50 p-10 rounded-3xl shadow-sm border border-white/10"
          >
            <Heart className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Grow</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Through personalized guidance and thoughtfully crafted practices, I help you discover your potential, build strength, and cultivate resilience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ willChange: "transform" }}
            className="bg-stone-900/50 p-10 rounded-3xl shadow-sm border border-white/10"
          >
            <Sun className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Connect</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Yoga is not just about the body; it’s about the mind and spirit too. My approach integrates the physical, mental, and spiritual aspects of yoga, helping you feel whole and centered.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Education Timeline */}
      <section className="max-w-3xl mx-auto px-6 md:px-12">
        <h3 className="text-3xl font-sans font-light text-center mb-16 text-white">Journey & Experience</h3>

        <div className="space-y-12 border-l border-stone-800 pl-8 ml-4">
          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-500 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Global</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Online Yoga & International Clients</h4>
            <p className="text-stone-400 font-light mt-2">Working with students globally through personalized online sessions focused on mobility, strength, breathwork, and holistic wellness. Supporting individuals with therapeutic yoga as well as athletes and active individuals in improving recovery, flexibility, and body awareness.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Wellness</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Sound Healing & Wellness Sessions</h4>
            <p className="text-stone-400 font-light mt-2">Facilitating online and in-person sound healing circles using Tibetan singing bowls to promote deep relaxation, emotional balance, and stress relief.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Community</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Teaching & Community Wellness (Since 2017)</h4>
            <p className="text-stone-400 font-light mt-2">Leading yoga classes, therapy sessions, and workshops across India including Indore, Udaipur, Rishikesh, Goa, Hampi, and Kasar Devi.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Lead Teacher</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Lead Ashtanga Teacher – Kranti Yoga, Goa</h4>
            <p className="text-stone-400 font-light mt-2">Guiding Ashtanga and Vinyasa alignment classes and conducting workshops on back care, knee health, yoga therapy, and sound healing.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Himalayan</span>
            <h4 className="text-xl font-serif italic text-white mt-2">High-Altitude Yoga – Himalayan Treks</h4>
            <p className="text-stone-400 font-light mt-2">Conducting yoga sessions during treks at Bhrigu Lake and Sar Pass in Himachal Pradesh, helping trekkers maintain mobility, recovery, and mental balance in challenging environments.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InstructorPage;
