import { useEffect, useRef } from 'react';
import tellexstoreorg from './Image/tellexstoreorg.webp';
import tellexstoreorgMobile from './Image/tellexstoreorgMobile.webp';


interface CarouselBannerProps {
  onCtaClick?: () => void;
}

export default function CarouselBanner({ onCtaClick }: CarouselBannerProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;
  
    const handleScroll = () => {
      if (!bgRef.current) return;
      const scrollY = window.scrollY;
      bgRef.current.style.transform = `translateY(${scrollY * -0.1}px)`;
    };
  
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  return (
    <section
  className="relative w-full overflow-hidden flex items-center justify-center"
  style={{ minHeight: '100svh' }}
>

      {/* Background image with subtle Ken Burns + parallax effect */}
      <div
  ref={bgRef}
  className="absolute inset-0 will-change-transform scale-[1.05]"
>

<picture>
  {/* Mobile image */}
  <source
    media="(max-width: 640px)"
    srcSet={tellexstoreorgMobile}
  />

  {/* Desktop image */}
  <source
    media="(min-width: 641px)"
    srcSet={tellexstoreorg}
  />

  <img
    src={tellexstoreorg}
    alt="Tellex storefront"
    className="w-full h-full object-cover"
    loading="eager"
    fetchPriority="high"
    decoding="async"
    sizes="100vw"
  />
</picture>

      </div>

      {/* Radial gradient overlay to highlight the sign and darken edges */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight px-2"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: '#e1cfbc',
            letterSpacing: '-0.03em',
            textShadow: '0 12px 35px rgba(0,0,0,0.85)',
          }}
        >
          Your next chapter begins here.
        </h1>

        <button
          onClick={onCtaClick}
          className="px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg md:text-xl font-semibold rounded-full bg-white/90 text-[#0E462B] shadow-lg transition-all duration-300 backdrop-blur-md border-[0.5px] border-white/20 hover:bg-white hover:shadow-[0_0_20px_rgba(225,207,188,0.4)]"
        >
          Find Your Pick
        </button>
      </div>
    </section>
  );
}
