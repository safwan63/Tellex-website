import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ContactForm from './components/ContactForm';
import { MapPin, Phone, Clock, Mail, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ✅ FAQ scroll handler (works with your custom SPA router)
  useEffect(() => {
    const scrollToFaqs = () => {
      if (window.location.hash === '#faqs') {
        const faqsSection = document.getElementById('faqs');
        faqsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Run on mount
    scrollToFaqs();

    // Run when hash changes (important for SPA navigation)
    window.addEventListener('hashchange', scrollToFaqs);
    return () => window.removeEventListener('hashchange', scrollToFaqs);
  }, []);

  const faqs = [
    {
      question: 'What is a Mystery Pick?',
      answer: "A Mystery Pick is a hand-wrapped, curated book selected by our team based on a few cryptic clues, genres, or themes. You won't know the exact title or author until you unwrap your package!",
    },
    {
      question: 'How long does it take to receive my Mystery Pick?',
      answer: "A:Mystery Pick involves carefully matching the book to your preferences and the reading vibe you're looking for, each selection is thoughtfully curated, processing and delivery typically take 4–7 days.",
    },
    {
      question: "Can I return a book if it doesn't match my vibe?",
      answer: "If there's an issue or mismatch, reach out to us. We're always here to help.",
    },
    {
      question: 'Do you offer subscriptions?',
      answer: 'Not yet. Currently, Tellex focuses on one-time, meaningful book experiences.',
    },
    {
      question: 'What makes Tellex different from other bookstores?',
      answer: 'Tellex combines emotions, intelligent systems, and human insight to make book gifting personal not random.',
    },
    {
      question: 'What if I get a book I’ve already read?',
      answer: 'You can specify your previously read books right on the product page before adding the Mystery Pick to your cart, and we will make sure not to include them.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0E462B]">
      <Navbar />

      <Hero
        title="Get In Touch"
        subtitle="We'd love to hear from you and help you find your next great read"
        showCta={false}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-tellex-black mb-4 sm:mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Send Us a Message
              </h2>
              <p className="text-tellex-black/70 mb-6 sm:mb-8 text-sm sm:text-base">
                Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <div className="bg-tellex-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
                <ContactForm />
              </div>
            </div>

            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-tellex-black mb-4 sm:mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact Information
              </h2>

              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-[#0E462B]/10 rounded-lg">
                    <MapPin className="text-tellex-dark-green" size={20} />
                  </div>
                  <p className="text-tellex-black/70 text-xs sm:text-sm">
                    BAITHUL ZAKWAN, KIRALUR KIZHAKKUMMURI POST,
                    KAKKODI, KOZHIKODE, KERALA – 673611
                  </p>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-[#0E462B]/10 rounded-lg">
                    <Phone className="text-tellex-dark-green" size={20} />
                  </div>
                  <p className="text-tellex-black/70 text-xs sm:text-sm">+91 8590543842</p>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-[#0E462B]/10 rounded-lg">
                    <Mail className="text-tellex-dark-green" size={20} />
                  </div>
                  <p className="text-tellex-black/70 text-xs sm:text-sm">
                    tellexaiofficial@gmail.com
                  </p>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-[#0E462B]/10 rounded-lg">
                    <Clock className="text-tellex-dark-green" size={20} />
                  </div>
                  <p className="text-tellex-black/70 text-xs sm:text-sm">9am - 6pm (IST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FAQ SECTION */}
      <section id="faqs" className="py-12 sm:py-16 md:py-20 bg-[#0E462B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-white text-center mb-8 sm:mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-tellex-white rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center"
                >
                  <span className="text-tellex-dark-green font-semibold text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-4">
                    <p className="text-tellex-black/70 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

