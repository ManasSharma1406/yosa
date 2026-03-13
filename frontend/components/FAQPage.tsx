
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, Mail, MessageCircle } from 'lucide-react';

const faqCategories = [
  {
    title: "New Students",
    questions: [
      {
        q: "I am a beginner. Which class should I take?",
        a: "Welcome! We recommend starting with our 'Hatha for Posture' or 'Lunchtime Reset' classes. These sessions move at a slower pace with detailed instruction on alignment and modifications, making them perfect for building a strong foundation."
      },
      {
        q: "What should I wear?",
        a: "Wear comfortable, breathable clothing that allows you to move freely. Leggings or shorts and a fitted top are ideal so your shirt doesn't fall over your head during inversions. No shoes or socks are needed in the yoga room."
      },
      {
        q: "Do I need to bring my own mat?",
        a: "For hygiene reasons, we highly recommend bringing your own mat. However, we have high-quality Manduka mats available for rent ($2) or complimentary for Monthly Unlimited members. We also sell mats in our shop."
      },
      {
        q: "How early should I arrive?",
        a: "Please arrive 10-15 minutes before class starts. This gives you time to check in, change, and set up your mat without rushing. For the respect of the practice, we lock the doors exactly at the start time."
      }
    ]
  },
  {
    title: "Memberships & Pricing",
    questions: [
      {
        q: "What are your specific membership options?",
        a: "We offer three main tiers: a Drop-In Class for $25, a 10 Class Pack for $220 (valid for 6 months), and a Monthly Unlimited Membership for $150/month which includes perks like free mat storage and guest passes."
      },
      {
        q: "Can I share my class pack?",
        a: "Yes! The 10 Class Pack is shareable with a friend or family member. However, our Monthly Unlimited membership is strictly for individual use only."
      },
      {
        q: "What is your cancellation policy?",
        a: "Classes must be cancelled at least 4 hours in advance to avoid a late fee. For early morning classes (before 9am), cancellations must be submitted by 9pm the previous evening."
      },
      {
        q: "Can I freeze my membership?",
        a: "Yes, Monthly Unlimited members can freeze their membership for up to 3 months per year for a nominal administrative fee of $15/month, or free of charge with a doctor's note."
      }
    ]
  },
  {
    title: "Personal Yoga Therapy",
    questions: [
      {
        q: "How is Personal Yoga different from private classes?",
        a: "Personal Yoga at FlowNest is a therapeutic journey. Unlike standard private lessons, these 1:1 sessions evolve week-by-week based on your energy, lifestyle, and specific healing needs—addressing issues like back pain, anxiety, or posture."
      },
      {
        q: "What packages do you offer?",
        a: "We offer a Discovery Session ($85) to start. For deeper work, we recommend our 'Immersive Journey' (4 sessions/month for $300) or the 'Deep Transformation' package (8 sessions over 2 months for $550)."
      },
      {
        q: "Do you offer consultations?",
        a: "Yes, we offer a complimentary 30-minute consultation. It's a no-pressure conversation to discuss your body's needs and see if our therapeutic approach aligns with your goals."
      }
    ]
  },
  {
    title: "Family Wellness Plan",
    questions: [
      {
        q: "How does the Family Plan work?",
        a: "Our Family Plan is designed for up to 5 members. It includes 40 shared private sessions and 10 group class passes per person. It allows you to practice individually or together, sharing the resources as needed."
      },
      {
        q: "Is it suitable for children or seniors?",
        a: "Absolutely. The plan is perfect for introducing safe, therapeutic practices to children or elders. Our instructors tailor strategies for each family member's unique health background and goals."
      },
      {
        q: "What is the validity of the Family Plan?",
        a: "The Family Plan is valid for 2 months. We offer flexible top-up and renewal options to ensure it suits your family's pace and busy schedule."
      }
    ]
  }
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("New Students");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const activeQuestions = faqCategories.find(c => c.title === activeCategory)?.questions || [];

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white">

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-sans font-light text-white mb-6 tracking-tight"
        >
          Frequently Asked <br />
          <span className="font-serif italic text-stone-400">Questions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-400 max-w-xl mx-auto text-lg font-light leading-relaxed"
        >
          Find answers to common questions about our studio, classes, and memberships.
        </motion.p>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Sidebar / Category Select */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-40 bg-white/5 p-6 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md">
              <h3 className="text-stone-400 font-bold uppercase tracking-widest text-xs mb-6">Categories</h3>
              <div className="flex flex-col gap-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => { setActiveCategory(cat.title); setOpenQuestion(null); }}
                    className={`text-left py-3 px-4 rounded-xl text-sm transition-all duration-300 ${activeCategory === cat.title
                      ? 'bg-white text-stone-900 font-medium shadow-md'
                      : 'text-stone-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="w-full md:w-3/4">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/5 rounded-[2rem] shadow-sm border border-white/10 overflow-hidden backdrop-blur-md">
                {activeQuestions.map((item, index) => (
                  <div key={index} className="border-b border-white/10 last:border-0">
                    <button
                      onClick={() => setOpenQuestion(openQuestion === item.q ? null : item.q)}
                      className="w-full py-8 px-8 md:px-10 flex items-center justify-between text-left group hover:bg-white/5 transition-colors"
                    >
                      <span className={`text-lg md:text-xl font-poppins pr-8 transition-colors ${openQuestion === item.q ? 'text-white' : 'text-stone-300'}`}>
                        {item.q}
                      </span>
                      <span className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${openQuestion === item.q
                        ? 'bg-white border-white text-stone-900 rotate-180'
                        : 'border-white/20 text-stone-400 group-hover:border-white group-hover:text-white'
                        }`}>
                        {openQuestion === item.q ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </span>
                    </button>

                    <AnimatePresence>
                      {openQuestion === item.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 md:px-10 pb-8 pt-0">
                            <p className="text-stone-400 font-sans font-light leading-relaxed text-base md:text-lg">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Still have questions */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <h3 className="text-2xl font-sans font-light text-white mb-8">Still have questions?</h3>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a href="mailto:support@flownest.com" className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-stone-900 hover:border-white transition-all group">
            <Mail className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            <span className="text-sm font-medium text-stone-300 group-hover:text-stone-900">Email Support</span>
          </a>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-stone-900 hover:border-white transition-all group">
            <MessageCircle className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            <span className="text-sm font-medium text-stone-300 group-hover:text-stone-900">Live Chat</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default FAQPage;
