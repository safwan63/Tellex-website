import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import tellexBoxImg from './components/Image/tellexboxorg.webp';
import vibePickImg from './components/Image/vibepick_experience.png';

export default function Explore() {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    vibe: false,
    mystery: false,
    direct: false,
  });

  const [mouseGlow, setMouseGlow] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const vibeRef = useRef<HTMLDivElement | null>(null);
  const mysteryRef = useRef<HTMLDivElement | null>(null);
  const directRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sections = [
      { id: 'vibe', ref: vibeRef },
      { id: 'mystery', ref: mysteryRef },
      { id: 'direct', ref: directRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetId = (entry.target as HTMLElement).dataset.sectionId;
          if (targetId && entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [targetId]: true,
            }));
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.dataset.sectionId = id;
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-tellex-dark-green">
      <Navbar />

      

      {/* Three Ways to Discover – Editorial Journey */}
      <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 md:space-y-20">
          {/* Intro */}
          <div className="text-center space-y-4 sm:space-y-6">
            <p
              className="tracking-[0.15em] text-xs sm:text-sm md:text-base uppercase"
              style={{ color: '#8A8A7A', fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              TWO WAYS TO DISCOVER
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#0E462B',
                letterSpacing: '0.03em',
              }}
            >
              The Best Way to Choose Your Next Book
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto px-4"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#4F4F46',
              }}
            >
              Tellex offers two distinct paths into your next chapter each designed for readers who value intention,
              emotional resonance, and considered curation over noise.
            </p>
          </div>

          {/* SECTION 2 — MYSTERY PICK */}
          <div
            id="mystery-pick"
            ref={mysteryRef}
            className={`relative overflow-hidden transition-all duration-700 ease-out will-change-transform ${
              visibleSections.mystery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ backgroundColor: '#0E462B' }}
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setMouseGlow({ x, y, visible: true });
            }}
            onMouseLeave={() => {
              setMouseGlow((prev) => ({ ...prev, visible: false }));
            }}
          >
            {/* Grainy paper texture overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-soft-light"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 160 160\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\' x=\'-20%25\' y=\'-20%25\' width=\'140%25\' height=\'140%25\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.2\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.35\'/%3E%3C/svg%3E")',
                backgroundSize: '220px 220px',
              }}
            />

            {/* Mouse-follow shimmer */}
            {mouseGlow.visible && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
                style={{
                  left: `${mouseGlow.x}px`,
                  top: `${mouseGlow.y}px`,
                  width: '420px',
                  height: '420px',
                  background: 'radial-gradient(circle at center, rgba(225, 207, 188, 0.12), transparent 60%)',
                  mixBlendMode: 'soft-light',
                }}
              />
            )}

            <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:px-10 lg:px-16">
              <div className="max-w-6xl w-full flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:gap-16">
                {/* Text column */}
                <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
                  <p
                    className="tracking-[0.2em] text-[0.65rem] sm:text-[0.7rem] uppercase"
                    style={{
                      color: '#e1cfbc',
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Curated Surprise
                  </p>
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: '#FFFFFF',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Mystery Pick
                  </h3>
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    Share your vibe.We hand-select a book using our intelligent system + human care a surprise that feels personal.
                  </p>

                  <div className="pt-4">
                    <button
                      className="group inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm md:text-base rounded-full border transition-all duration-300 backdrop-blur-md"
                      style={{
                        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                        borderColor: '#e1cfbc',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(14, 70, 43, 0.25)',
                      }}

                      onClick={() => {
                        window.location.href = '/flow?type=mystery';
                      }}
                      
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e1cfbc';
                        e.currentTarget.style.color = '#0E462B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(14, 70, 43, 0.25)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                    >
                      <span className="mr-2 sm:mr-3">Reveal My Pick</span>
                      <span className="relative inline-flex items-center">
                        <span
                          className="block h-px w-6 bg-white/70 group-hover:bg-[#0E462B] transition-colors duration-300"
                        />
                        <svg
                          className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 10H15.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.5 5L15.5 10L10.5 15"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Product Hero Showcase - TELLEX Mystery Box */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-full h-full">
                    {/* Warm radial glow behind the box */}
                    <div
                      aria-hidden="true"
                      className="absolute w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full blur-3xl"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 50%, rgba(225,207,188,0.45), transparent 65%)',
                        opacity: 0.9,
                      }}
                    />

                    {/* TELLEX Mystery Box image */}
                    <div 
                      className="relative max-w-[80%] cursor-pointer group"
                      onClick={() => window.location.href = "/flow?type=mystery"}
                    >
                      <img
                        src={tellexBoxImg}
                        alt="TELLEX Mystery Box wrapped with cream ribbon"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        style={{
                          filter: 'drop-shadow(0 24px 45px rgba(0,0,0,0.6))',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          
{/* SECTION 1 — VIBE PICK */}
          <div
            ref={vibeRef}
            className={`transition-all duration-700 ease-out will-change-transform ${
              visibleSections.vibe ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                {/* Left Column - Content */}
                <div className="space-y-4 sm:space-y-6">
                  <p
                    className="tracking-widest text-xs uppercase"
                    style={{
                      color: '#0E462B',
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    EMOTION-BASED
                  </p>
                  <h3
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#0E462B' }}
                  >
                    Vibe Pick
                  </h3>
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#3F3F36',
                    }}
                  >
                    Pick your mood.We show books that match how you feel choose what connects.
                  </p>

                  {/* Mood Cloud */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                    {['Overthinking', 'Lonely', 'First Love', 'Self-Doubt', 'Depression', 'Feeling Uninspired'].map(
                      (mood) => (
                        <button
                          key={mood}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base transition-all duration-300"
                          style={{
                            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                            backgroundColor: '#e1cfbc',
                            color: '#0E462B',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0E462B';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#e1cfbc';
                            e.currentTarget.style.color = '#0E462B';
                          }}
                        >
                          {mood}
                        </button>
                      )
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <a
                      href="/flow?type=vibe"
                    >
                      <button
                        className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-md transition-all duration-300 hover:opacity-90"
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                          backgroundColor: '#0E462B',
                          color: '#FFFFFF',
                        }}
                      >
                        <span className="mr-2">Start My Vibe Journey</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1"
                        >
                          <path
                            d="M7.5 15L12.5 10L7.5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </a>
                  </div>
                </div>

                {/* Right Column - Mood Card visual */}
                <div className="relative flex justify-end">
                  <div
                    className="relative rounded-2xl shadow-2xl"
                    style={{
                      backgroundColor: '#f5f1e8',
                      padding: '1.75rem',
                      borderRadius: '1.4rem',
                      boxShadow:
                        '0 26px 60px rgba(15, 24, 15, 0.42), 0 0 0 1px rgba(225, 207, 188, 0.55)',
                    }}
                  >
                    {/* Inner framed image + book */}
                    <div
                      className="relative rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => window.location.href = "/flow?type=vibe"}
                      style={{
                        borderRadius: '1.1rem',
                        border: '1px solid #e1cfbc',
                        backgroundColor: '#fdfaf5',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
                        aspectRatio: '3 / 4',
                      }}
                    >
                      <img
                        src={vibePickImg}
                        alt="A person deeply engrossed in reading, cinematic setting with soft warm lighting"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                      />
                    </div>

                    {/* Floating mood sticky note */}
                    <div
                      className="absolute -top-3 right-6 px-4 py-2"
                      style={{
                        backgroundColor: '#FBF7EF',
                        borderRadius: '0.6rem',
                        border: '1px solid rgba(210, 192, 164, 0.9)',
                        boxShadow:
                          '0 10px 25px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.85)',
                        transform: 'rotate(-3deg)',
                      }}
                    >
                      <p
                        className="text-[0.7rem] tracking-[0.16em] uppercase mb-0.5"
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: '#8A8A7A',
                          letterSpacing: '0.18em',
                        }}
                      >
                        Current Mood
                      </p>
                      <p
                        style={{
                          fontFamily: "'Dancing Script', 'Brush Script MT', cursive, serif",
                          fontSize: '1.05rem',
                          color: '#3C3B35',
                        }}
                      >
                        Depressed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </section>

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Not Sure Which to Choose?
          </h2>
          <p className="text-tellex-black/70 text-base sm:text-lg mb-6 sm:mb-8">
            Tell us how you feel we'll turn your vibe into the perfect book surprise.
          </p>
          <button
            onClick={() => {
               window.location.href = '/flow?type=mystery';
            }}
            className="bg-tellex-dark-green hover:bg-tellex-dark-green/90 text-tellex-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Take the Mystery Pick
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
