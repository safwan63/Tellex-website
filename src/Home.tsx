import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ImageMarquee from './components/ImageMarquee';
import {
  Users, Heart, Sparkles, Gift, ChevronLeft, ChevronRight, Star,
  Moon, Wand2, type LucideIcon,
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import mysteryBoxImage from './components/Image/boxhold.webp';
import howTellexMysteryImg from './components/Image/tellexboxorg.webp';
import CL1 from './components/Image/CL1.webp';
import CL2 from './components/Image/CL2.webp';

/* ─── Journey Strip step data ──────────────────────── */
const JOURNEY_STEPS = [
  {
    num: '01',
    Icon: Sparkles,
    title: 'Tell Us Your Vibe',
    desc: 'Share your mood, genre preferences, and reading style with us.',
  },
  {
    num: '02',
    Icon: Moon,
    title: 'We Curate in Mystery',
    desc: 'Our experts handpick a book that matches your unique vibe perfectly.',
  },
  {
    num: '03',
    Icon: Gift,
    title: 'Your Book Arrives Wrapped',
    desc: 'Beautifully packaged and delivered to your doorstep as a surprise.',
  },
  {
    num: '04',
    Icon: Wand2,
    title: 'Unbox the Surprise',
    desc: 'Unwrap, discover, and fall in love with a story chosen just for you.',
  },
];

const WHY_CHOOSE_TELLEX: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Users,
    title: 'Personalised, Not Random',
    description:
      'Books are thoughtfully chosen using smart systems and human insight matched to your vibe, never picked blindly.',
  },
  {
    Icon: Heart,
    title: 'Mystery With Meaning',
    description:
      'The surprise goes beyond hiding the title. Every mystery book fits your mood and feels emotionally right.',
  },
  {
    Icon: Sparkles,
    title: 'More Than a Bookstore',
    description:
      'Tellex feels like a friend listening, understanding, and recommending the right book at the right time.',
  },
  {
    Icon: Gift,
    title: 'Gift',
    description: 'Crafted with care and personalized through emotion and personality insights, creating a gift that truly resonates with the recipient.',
  },
];

/* ─── Main Section — Journey Strip ───────────────────── */
function HowTellexWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-16 lg:pt-24 pb-20 bg-[#0E462B] relative overflow-visible"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Journey Strip keyframes */}
      <style>{`
        @keyframes journeyFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .journey-card {
          opacity: 0;
          transform: translateY(24px);
        }
        .journey-card.is-visible {
          animation: journeyFadeUp 0.55s ease forwards;
        }
        .journey-card.is-visible:nth-child(1) { animation-delay: 0s; }
        .journey-card.is-visible:nth-child(2) { animation-delay: 0.1s; }   /* skip arrows via nth-child on cards */
        .journey-card.is-visible:nth-child(3) { animation-delay: 0.2s; }
        .journey-card.is-visible:nth-child(4) { animation-delay: 0.3s; }
        .journey-arrow {
          opacity: 0;
        }
        .journey-arrow.is-visible {
          animation: journeyFadeUp 0.45s ease forwards;
          animation-delay: 0.15s;
        }
        .journey-banner {
          opacity: 0;
          transform: translateY(20px);
        }
        .journey-banner.is-visible {
          animation: journeyFadeUp 0.6s ease forwards;
          animation-delay: 0.4s;
        }
      `}</style>

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(43,128,17,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-12" style={{ maxWidth: 1280 }}>

        {/* ── Title — tight spacing, no subtext ── */}
        <div className="w-full mb-6 lg:mb-8" style={{ textAlign: 'center' }}>
          <h2
            className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-tight tracking-tight w-full"
            style={{ fontFamily: "'Playfair Display', serif", textAlign: 'center' }}
          >
            How Tellex Works
          </h2>
        </div>

        {/* ── 4-Card Journey Strip ── */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-0 lg:gap-0" style={{ width: '100%' }}>
          {JOURNEY_STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row items-stretch" style={{ flex: '1 1 0', minWidth: 0 }}>
              {/* Card */}
              <div
                className={`journey-card ${visible ? 'is-visible' : ''} w-full rounded-2xl p-6 lg:p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.09] cursor-default`}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  minWidth: 0,
                  flex: '1 1 0',
                }}
              >
                {/* Step number */}
                <span
                  className="block font-bold leading-none mb-3"
                  style={{
                    fontSize: 56,
                    color: '#c8963e',
                    opacity: 0.85,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {step.num}
                </span>
                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-4"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(200,150,62,0.12)',
                    border: '1px solid rgba(200,150,62,0.25)',
                  }}
                >
                  <step.Icon size={22} strokeWidth={1.5} color="#c8963e" />
                </div>
                {/* Title */}
                <h3
                  className="text-white font-bold mb-2"
                  style={{ fontSize: 18, lineHeight: 1.3 }}
                >
                  {step.title}
                </h3>
                {/* Description */}
                <p
                  className="font-light leading-relaxed"
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 220 }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Connecting arrow (not after last card) */}
              {idx < JOURNEY_STEPS.length - 1 && (
                <div className={`journey-arrow ${visible ? 'is-visible' : ''} flex items-center justify-center px-2 py-3 lg:py-0 lg:px-3 flex-shrink-0`} style={{ alignSelf: 'center' }}>
                  {/* Desktop arrow → */}
                  <span
                    className="hidden lg:block text-3xl font-light select-none"
                    style={{ color: '#c8963e', opacity: 0.7 }}
                  >
                    →
                  </span>
                  {/* Mobile arrow ↓ */}
                  <span
                    className="block lg:hidden text-3xl font-light select-none"
                    style={{ color: '#c8963e', opacity: 0.7 }}
                  >
                    ↓
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── CTA Button ── */}
        <div className={`journey-banner ${visible ? 'is-visible' : ''} mt-12 lg:mt-16 flex justify-center w-full`}>
          <a
            href="/flow?type=mystery"
            className="flex items-center justify-center gap-3 bg-[#c8963e] text-[#0E462B] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d6a54f] transition-all duration-300 transform hover:-translate-y-1 shadow-[0_12px_24px_rgba(200,150,62,0.25)] hover:shadow-[0_16px_32px_rgba(200,150,62,0.35)] group"
          >
            Try Mystery Pick
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}

export default function Home() {
  const picksRef = useRef<HTMLDivElement>(null);

  return (
    <main className="bg-tellex-dark-green">
      <Navbar />

      <HeroSection />

      {/* Separate Testimonial Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden" style={{ background: 'radial-gradient(circle at top left, #1e6a42, #0E462B)' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="text-center max-w-2xl">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stories of <span className="text-[#e1cfbc] italic">Surprise</span>
              </h2>
              <p className="text-[17px] sm:text-[19px] text-white/80 leading-relaxed font-light">
                Discover the joy of receiving a mystery pick curated just for you.
              </p>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}} />

          {/* Testimonial Section with Centered Side Arrows */}
          <div className="relative group/reel max-w-6xl mx-auto px-0 sm:px-6">
            <div className="relative flex items-center justify-center w-full">
              
              {/* Left Arrow Button - Visible on all devices */}
              <button
                onClick={() => {
                  const scroller = document.getElementById('testimonial-scroll');
                  if (scroller) scroller.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="absolute left-2 sm:-left-4 lg:-left-8 top-1/2 -translate-y-1/2 flex w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#0E462B] hover:bg-[#0B3F1D] items-center justify-center transition-all duration-300 border border-white/20 group/btn shadow-xl backdrop-blur-md flex-shrink-0 z-30"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8 text-white group-hover/btn:-translate-x-1 transition-transform duration-300 ease-out" />
              </button>

              {/* Scrollable Cards Reel - Centered */}
              <div
                id="testimonial-scroll"
                className="flex flex-row overflow-x-auto scrollbar-hide gap-4 sm:gap-8 lg:gap-12 pb-10 pt-6 w-full snap-x snap-mandatory justify-start px-12 sm:px-8"
              >
                {[
                  {
                    name: "Shahma",
                    text: "Opening this box felt magical. The book was a perfect match for my mood, couldn't put it down.",
                    img: CL1
                  },
                  {
                    name: "Tanya",
                    text: "Never knew a mystery book could be exactly what I needed. Everything feels incredibly premium.",
                    img: CL2
                  },
                  {
                    name: "Hiba Nasreen",
                    text: "Thank you, Tellex! Your guided pick completely understood my vibe and helped me find the perfect book. I can't wait to start reading.",
                    img: "/images/3.webp"
                  },
                  {
                    name: "Prerna Shambhavee",
                    text: "Thank you so much, Tellex! You gave me books exactly curated for my vibe not just random picks or things I’ve already read. This is amazing.",
                    img: "/images/4.webp"
                  },
                  {
                    name: "Sal",
                    text: "Tellex truly understands me, I got the exact book matching my vibe.",
                    img: "/images/5.webp"
                  }
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className="flex-none w-[85vw] sm:w-[280px] lg:w-[320px] bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col group transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer relative overflow-hidden snap-center"
                  >
                    {/* Image Area - Further reduced for Mobile & Desktop */}
                    <div className="w-full h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden relative bg-[#0E462B]/5 flex items-center justify-center p-4 sm:p-6 text-center">
                      <div className="absolute inset-0 bg-[#0E462B]/5 z-10 transition-colors duration-500 ease-out group-hover:bg-transparent pointer-events-none"></div>
                      <img loading="lazy"
                        src={t.img}
                        alt={`Customer ${t.name}`}
                        className="w-full h-full lg:w-[80%] lg:h-[80%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>

                    {/* Content Area - Optimized for smaller size */}
                    <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow bg-white">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8963e] fill-current" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-[#0E462B] text-[13px] sm:text-[15px] leading-relaxed font-medium mb-4 sm:mb-6 flex-grow italic">
                        "{t.text}"
                      </p>

                      {/* User Name */}
                      <div className="mt-auto">
                        <span className="text-[10px] sm:text-[12px] font-bold text-[#0E462B]/80 tracking-[0.2em] uppercase">
                          {t.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow Button - Visible on all devices */}
              <button
                onClick={() => {
                  const scroller = document.getElementById('testimonial-scroll');
                  if (scroller) scroller.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="absolute right-2 sm:-right-4 lg:-right-8 top-1/2 -translate-y-1/2 flex w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#0E462B] hover:bg-[#0B3F1D] items-center justify-center transition-all duration-300 border border-white/20 group/btn shadow-xl backdrop-blur-md flex-shrink-0 z-30"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover/btn:translate-x-1 transition-transform duration-300 ease-out" />
              </button>
            </div>
          </div>

          {/* Pagination Indicators - Visible on Mobile */}
          <div className="flex justify-center mt-4 gap-2.5 sm:hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-white scale-125' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </div>
      </section>

      <section id="picks" ref={picksRef} className="py-16 sm:py-24 bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left side: Premium Image */}
            <div className="relative group flex justify-center lg:justify-start order-1 lg:order-none">
              <div 
                className="relative w-full max-w-[500px] lg:max-w-[550px] transition-transform duration-700 ease-out hover:-translate-y-2 z-20 cursor-pointer"
                onClick={() => window.location.href = "/flow?type=mystery"}
              >
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-[30px] bg-black/40 blur-[20px] rounded-[100%] pointer-events-none -z-10"></div>
                <img loading="lazy"
                  src={mysteryBoxImage}
                  alt="Premium mystery book box experience"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Right side: Attractive Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-none w-full">
              <h2
                className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#0E462B] mb-6 leading-[1.15] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Not just a book. <br />
                <span className="text-gray-900">A curated experience.</span>
              </h2>

              <p className="text-[18px] sm:text-[20px] text-gray-700 mb-12 max-w-lg leading-relaxed font-light">
                Every mystery pick is carefully selected, wrapped, and delivered to match your vibe.
              </p>

              {/* Attractive Elements replacing Testimonials */}
              <div className="flex flex-col gap-8 w-full max-w-md">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-full bg-[#0E462B]/5 flex items-center justify-center text-[#2b8011] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0E462B]/10 flex-shrink-0">
                    <Heart size={26} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[#0E462B] font-bold text-xl mb-1">Curated With Care</h4>
                    <p className="text-gray-600 text-[15px]">Handpicked by book experts tailored to your exact mood.</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-full bg-[#0E462B]/5 flex items-center justify-center text-[#2b8011] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0E462B]/10 flex-shrink-0">
                    <Gift size={26} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[#0E462B] font-bold text-xl mb-1">Beautifully Wrapped</h4>
                    <p className="text-gray-600 text-[15px]">Crafted with care and personalized through emotion and personality insights, creating a gift that truly resonates with the recipient.</p>
                  </div>
                </div>
              </div>

              {/* Glowing CTA */}
              <a
                href="/flow?type=mystery"
                className="mt-12 inline-flex items-center justify-center gap-3 bg-[#0E462B] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#135d39] transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(14,70,43,0.2)] hover:shadow-[0_15px_30px_rgba(14,70,43,0.3)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></div>
                Try Mystery Pick
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowTellexWorksSection />

      <div className="w-full bg-[#0E462B] pb-16">
        <ImageMarquee />
      </div>

      <section className="py-14 sm:py-20 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2
            className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#0E462B] text-center mb-12 sm:mb-16 uppercase tracking-[0.14em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Why Choose Tellex
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            {WHY_CHOOSE_TELLEX.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="flex min-h-[300px] sm:min-h-[320px] lg:min-h-[340px] flex-col items-center rounded-[28px] border border-[#0E462B]/[0.07] bg-[#eef5ef] px-7 py-10 sm:px-8 sm:py-12 text-center shadow-[0_8px_32px_rgba(14,70,43,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(14,70,43,0.09)]"
              >
                <div className="flex flex-1 w-full items-center justify-center px-1">
                  <div className="inline-flex max-w-full items-center gap-3 sm:gap-3.5">
                    <Icon
                      className="shrink-0 text-[#0E462B]"
                      size={26}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <h3
                      className="max-w-[9.75rem] sm:max-w-[10.5rem] text-left text-[1.35rem] sm:text-[1.4rem] lg:text-[1.45rem] font-bold leading-[1.22] text-[#0E462B] text-balance"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {title}
                    </h3>
                  </div>
                </div>
                <p
                  className="mt-6 w-full max-w-[17rem] text-[15px] sm:text-base leading-[1.65] text-[#3f5348]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
