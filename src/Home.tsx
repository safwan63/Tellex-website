import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ImageMarquee from './components/ImageMarquee';
import {
  Users, Heart, Sparkles, Gift, ChevronLeft, ChevronRight, Star,
  Moon, Wand2, MessageCircle, Brain, Target, BookOpen
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import mysteryBoxImage from './components/Image/boxhold.webp';
import vibePickImg from './components/Image/vibepick_experience.png';
import CL1 from './components/Image/CL1.webp';
import CL2 from './components/Image/CL2.webp';

/* ─── Step data ─────────────────────────────────────── */
const MYSTERY_STEPS = [
  { Icon: Sparkles, label: 'Tell us your vibe' },
  { Icon: Moon, label: 'We curate in mystery' },
  { Icon: Gift, label: 'Your book arrives wrapped' },
  { Icon: Wand2, label: 'Unbox the surprise' },
];

const VIBE_STEPS = [
  { Icon: MessageCircle, label: 'Tell us your vibe' },
  { Icon: Brain, label: 'We understand your mood' },
  { Icon: Target, label: 'We curate your perfect match' },
  { Icon: BookOpen, label: 'Your book is revealed & delivered' },
];

/* ─── Single animated step row ──────────────────────── */
function TimelineStep({
  Icon, label, index, visible,
}: { Icon: React.ElementType; label: string; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-start gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.42s ease ${index * 80}ms, transform 0.42s ease ${index * 80}ms`,
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon node + connector */}
      <div className="flex flex-col items-center flex-shrink-0 pt-[2px]">
        <div
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? 'rgba(225,207,188,0.14)' : 'rgba(225,207,188,0.07)',
            border: `1px solid ${hovered ? 'rgba(225,207,188,0.35)' : 'rgba(225,207,188,0.18)'}`,
            transition: 'background 0.25s ease, border-color 0.25s ease',
          }}
        >
          <Icon size={20} strokeWidth={1.4} color={hovered ? '#fff' : '#e1cfbc'} />
        </div>
        {index < 3 && (
          <div
            style={{
              width: 1,
              minHeight: 40,
              flex: 1,
              marginTop: 6,
              background: 'linear-gradient(to bottom, rgba(225,207,188,0.30) 0%, rgba(225,207,188,0.05) 100%)',
            }}
          />
        )}
      </div>

      {/* Label */}
      <div className="pb-10">
        <p
          style={{
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.6,
            color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)',
            transition: 'color 0.25s ease',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────── */
function HowTellexWorksSection() {
  /* Default: mystery pre-selected so section is never empty */
  const [active, setActive] = useState<'mystery' | 'vibe'>('mystery');
  const [stepsVisible, setStepsVisible] = useState(false);
  const [contentKey, setContentKey] = useState(0); // forces re-mount on switch

  const steps = active === 'mystery' ? MYSTERY_STEPS : VIBE_STEPS;

  /* Step-reveal on mount + after tab switch */
  useEffect(() => {
    setStepsVisible(false);
    const t = setTimeout(() => setStepsVisible(true), 150);
    return () => clearTimeout(t);
  }, [contentKey]);

  /* Fade out → swap → fade in */
  const handleSwitch = (pick: 'mystery' | 'vibe') => {
    if (pick === active) return;
    setStepsVisible(false);
    setTimeout(() => {
      setActive(pick);
      setContentKey(k => k + 1);
    }, 220);
  };

  const vibeBookImg = vibePickImg;

  return (
    <section
      className="py-20 lg:py-28 bg-[#0E462B] relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* CSS helpers */}
      <style>{`
        .tellex-how-img {
          transition: transform 0.6s ease;
        }
        .tellex-how-img:hover {
          transform: scale(1.03);
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

      {/* Radial ambient glow — prevents flat green-screen feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(43,128,17,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">

        {/* ── Heading block ── */}
        <div className="text-center mb-10 lg:mb-14">
          <h2
            className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How Tellex Works
          </h2>
          <p
            className="text-[16px] sm:text-[17px] font-light mb-10 max-w-xs mx-auto"
            style={{ color: 'rgba(225,207,188,0.65)' }}
          >
            Choose how you want to explore your next read.
          </p>

          {/* Subtle divider */}
          <div
            className="mx-auto mb-8"
            style={{
              width: 48,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(225,207,188,0.35), transparent)',
            }}
          />

          {/* Toggle pills */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {(['mystery', 'vibe'] as const).map((pick) => {
              const isActive = active === pick;
              return (
                <button
                  key={pick}
                  onClick={() => handleSwitch(pick)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    border: `1px solid ${isActive ? '#e1cfbc' : 'rgba(255,255,255,0.2)'}`,
                    background: isActive ? '#e1cfbc' : 'transparent',
                    color: isActive ? '#0E462B' : 'rgba(255,255,255,0.7)',
                    opacity: !isActive && active ? 0.45 : 1,
                    transform: isActive ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: isActive ? '0 0 24px rgba(225,207,188,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: 130,
                  }}
                >
                  {pick === 'mystery' ? 'Mystery Pick' : 'Vibe Pick'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2-col body (always visible — no hide/show) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — Image */}
          <div className="flex justify-center order-1 lg:order-none relative">
            {/* Ambient glow behind image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(225,207,188,0.08) 0%, transparent 70%)',
              }}
            />
            <div 
              className="relative w-full cursor-pointer group" 
              style={{ maxWidth: 380 }}
              onClick={() => window.location.href = `/flow?type=mystery`}
            >
              {/* Ground shadow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '72%',
                  height: 22,
                  borderRadius: '100%',
                  background: 'rgba(0,0,0,0.38)',
                  filter: 'blur(16px)',
                }}
              />
              <img
                key={active}
                src={active === 'mystery' ? mysteryBoxImage : vibeBookImg}
                alt={active === 'mystery' ? 'Premium mystery book box' : 'Open book reading scene'}
                className="tellex-how-img w-full rounded-2xl"
                style={{
                  height: active === 'mystery' ? 'auto' : 320,
                  objectFit: active === 'mystery' ? 'contain' : 'cover',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.50)',
                  opacity: stepsVisible ? 1 : 0.6,
                  transition: 'opacity 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* RIGHT — Timeline panel */}
          <div className="order-2 lg:order-none">
            <div
              style={{
                borderRadius: 24,
                padding: '36px 32px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* Micro-label */}
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'rgba(225,207,188,0.65)',
                  marginBottom: 28,
                }}
              >
                {active === 'mystery' ? 'Mystery Pick' : 'Vibe Pick'}
              </p>

              {/* Steps */}
              <div key={contentKey}>
                {steps.map(({ Icon, label }, idx) => (
                  <TimelineStep
                    key={idx}
                    Icon={Icon}
                    label={label}
                    index={idx}
                    visible={stepsVisible}
                  />
                ))}

                {/* Launch Button at bottom of timeline */}
                <div
                  className="mt-4 pt-4 border-t border-white/10"
                  style={{
                    opacity: stepsVisible ? 1 : 0,
                    transform: stepsVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.5s ease 0.4s',
                  }}
                >
                  <a
                    href={active === 'mystery' ? "/flow?type=mystery" : "/flow?type=vibe"}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all duration-300 group"
                    style={{
                      background: active === 'mystery' ? '#e1cfbc' : '#2b8011',
                      color: active === 'mystery' ? '#0E462B' : '#FFFFFF',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    {active === 'mystery' ? 'Launch Mystery Pick' : 'Start Vibe Journey'}
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                  </a>
                  <p className="text-center text-[11px] text-white/40 mt-3 tracking-wider uppercase font-medium">
                    {active === 'mystery' ? 'Requires Secured Login' : 'Secure Experience'}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'radial-gradient(circle at top left, #1e6a42, #0E462B)' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end mb-12 sm:mb-16">
            <div className="text-center sm:text-left max-w-2xl">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stories of <span className="text-[#e1cfbc] italic">Surprise</span>
              </h2>
              <p className="text-[17px] sm:text-[19px] text-white/80 leading-relaxed font-light">
                Discover the joy of receiving a mystery pick curated just for you.
              </p>
            </div>

            {/* Custom Navigation */}
            <div className="hidden sm:flex gap-4 mt-6 sm:mt-0">
              <button
                onClick={() => {
                  const scroller = document.getElementById('testimonial-scroll');
                  if (scroller) scroller.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 border border-white/10 group shadow-lg backdrop-blur-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform duration-300 ease-out" />
              </button>
              <button
                onClick={() => {
                  const scroller = document.getElementById('testimonial-scroll');
                  if (scroller) scroller.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 border border-white/10 group shadow-lg backdrop-blur-md"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300 ease-out" />
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}} />

          {/* Testimonial Cards */}
          <div
            id="testimonial-scroll"
            className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-12 pb-12 pt-4 w-full"
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
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="flex-none w-[340px] sm:w-[400px] lg:w-[460px] bg-white rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col group transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] cursor-pointer relative overflow-hidden"
              >
                {/* Image at top (fully covering top area but contained to avoid cropping) */}
                <div className="w-full h-[400px] sm:h-[480px] lg:h-[550px] overflow-hidden relative bg-[#0E462B]/5 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[#0E462B]/5 z-10 transition-colors duration-500 ease-out group-hover:bg-transparent pointer-events-none"></div>
                  <img
                    src={t.img}
                    alt={`Customer ${t.name}`}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Content inside the card */}
                <div className="p-6 sm:p-7 flex flex-col items-center text-center flex-grow bg-white">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-[18px] h-[18px] text-[#2b8011] fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-[#0E462B] text-[15px] sm:text-[16px] leading-relaxed font-medium mb-6 flex-grow">
                    "{t.text}"
                  </p>

                  {/* User Name */}
                  <div className="mt-auto">
                    <span className="text-[13px] font-bold text-[#0E462B]/70 tracking-widest uppercase">
                      {t.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Guidelines */}
          <div className="flex justify-center mt-2 sm:hidden gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>
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
                <img
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
                    <p className="text-gray-600 text-[15px]">Every box feels like a special gift to yourself.</p>
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

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black text-center mb-8 sm:mb-12"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Why Choose Tellex
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div
              className="p-5 sm:p-8 rounded-2xl shadow-lg scale-[0.95] sm:scale-100"
              style={{ backgroundColor: '#fff1e8' }}
            >

              <Users className="text-tellex-dark-green mb-4" size={36} />
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-dark-green mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Personalised, Not Random
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base">
                Books are thoughtfully chosen using smart systems and human insight matched to your vibe, never picked blindly.
              </p>
            </div>

            <div
              className="p-5 sm:p-8 rounded-2xl shadow-lg scale-[0.95] sm:scale-100"
              style={{ backgroundColor: '#fff1e8' }}
            >
              <Heart className="text-tellex-dark-green mb-4" size={36} />
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-dark-green mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Mystery With Meaning
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base">
                The surprise goes beyond hiding the title. Every mystery book fits your mood and feels emotionally right.
              </p>
            </div>

            <div
              className="p-5 sm:p-8 rounded-2xl shadow-lg scale-[0.95] sm:scale-100"
              style={{ backgroundColor: '#fff1e8' }}
            >
              <Sparkles className="text-tellex-dark-green mb-4" size={36} />
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-dark-green mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                More Than a Bookstore
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base">
                Tellex feels like a friend listening, understanding, and recommending the right book at the right time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
