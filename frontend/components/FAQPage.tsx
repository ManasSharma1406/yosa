
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, Mail, MessageCircle } from 'lucide-react';

const faqCategories = [
  {
    title: "About YogSamskara",
    questions: [
      {
        q: "What is the YogSamskara approach?",
        a: "YogSamskara focuses on authentic, traditional yoga rooted in the 5 Koshas (Annamaya, Pranamaya, Manomaya, Vijnanamaya, Anandamaya). Our holistic approach balances the physical body, breath, mind, wisdom, and inner joy for true wellness."
      },
      {
        q: "I am a beginner. Which class should I take?",
        a: "Welcome! If you're new to the practice or dealing with specific health concerns, we highly recommend starting with our 1:1 Personal Yoga sessions. Alternatively, our Regular Group Classes are open to all levels and offer a structured, supportive environment."
      },
      {
        q: "How do I book a session?",
        a: "You can book directly through our website by creating an account and selecting an available time slot on our booking calendar. We offer a complimentary 30-minute consultation to help you get started."
      }
    ]
  },
  {
    title: "Memberships & Policies",
    questions: [
      {
        q: "Is there a pause membership option?",
        a: "No, we do not offer an option to pause or freeze memberships. Maintaining a consistent practice is essential to the YogSamskara methodology, and our plans are structured to encourage ongoing commitment."
      },
      {
        q: "What is your refund policy?",
        a: "We have a strict no-refund policy for all purchases, including 1:1 sessions, group classes, and family plans. Please ensure you are committed to the practice before completing your purchase."
      },
      {
        q: "How do I cancel or reschedule a booked session?",
        a: "Booked sessions can be managed through your student dashboard. Please provide adequate notice if you need to reschedule."
      },
      {
        q: "When does my package expire? What happens to unused sessions?",
        a: "Your package remains active until all your sessions have been used — there is no fixed expiry date based on time alone. However, if you have not used any of your sessions within 2 months of purchase, all unused sessions will automatically vanish and your package will be deactivated. This policy encourages a consistent practice. We recommend booking your sessions soon after purchase to make the most of your plan."
      }
    ]
  },
  {
    title: "Our Offerings",
    questions: [
      {
        q: "What is the difference between Regular and Premium Small Group classes?",
        a: "Regular Group Classes are 60-minute sessions open to a wider community. Premium Small Group classes are 90-minute sessions limited to a maximum of 5 members, allowing for intimate, highly focused guidance."
      },
      {
        q: "How does the Family Wellness Plan work?",
        a: "The Family Wellness Plan is designed to strengthen family bonds and build healthy habits together. It provides shared access to therapeutic practices tailored for all ages, from children to seniors."
      },
      {
        q: "What happens in a 1:1 Personal Yoga session?",
        a: "Personal Yoga is a highly therapeutic journey. These sessions evolve week-by-week based on your wellness questionnaire, energy, and specific healing needs, addressing issues like back pain, posture, or anxiety."
      }
    ]
  }
];


const FAQPage: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  // Flatten all FAQs into a single array
  const allFaqs = faqCategories.flatMap(cat => cat.questions);

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

      <section className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
        >
            {allFaqs.map((item, index) => (
              <div key={index} className="bg-white/5 rounded-[2rem] shadow-sm border border-white/10 overflow-hidden backdrop-blur-md flex flex-col transition-all">
                <button
                  onClick={() => setOpenQuestion(openQuestion === item.q ? null : item.q)}
                  className="w-full py-6 px-6 md:px-8 flex items-start justify-between text-left group hover:bg-white/5 transition-colors"
                >
                  <span className={`text-base md:text-lg font-poppins pr-4 transition-colors ${openQuestion === item.q ? 'text-white' : 'text-stone-300'}`}>
                    {item.q}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${openQuestion === item.q
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
                      <div className="px-6 md:px-8 pb-6 pt-0">
                        <p className="text-stone-400 font-sans font-light leading-relaxed text-sm md:text-base">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </motion.div>
      </section>

      {/* Still have questions */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <h3 className="text-2xl font-sans font-light text-white mb-8">Still have questions or facing an issue?</h3>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a href="https://wa.me/919399441405" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500 transition-all group">
            <MessageCircle className="w-5 h-5 text-stone-400 group-hover:text-white" />
            <span className="text-sm font-medium text-stone-300 group-hover:text-white">Contact us on WhatsApp (+91 93994 41405)</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default FAQPage;
