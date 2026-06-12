import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import heroImage from './Image/tellexmystery.webp';
import { heroCarouselSlides } from '../data/heroCarouselSlides';
import { useCarouselNavigation } from '../hooks/useCarouselNavigation';
import HeroCarousel from './hero/HeroCarousel';
import HeroImageLightbox from './hero/HeroImageLightbox';

export default function HeroSection() {
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { index, setIndex, next, prev, swipeHandlers } = useCarouselNavigation(
    heroCarouselSlides.length,
    {
      autoPlayInterval: 2500,
      paused: carouselHovered || lightboxOpen,
    }
  );

  // Preload only the NEXT slide (not all) for smooth transitions
  useEffect(() => {
    const nextIndex = (index + 1) % heroCarouselSlides.length;
    const nextSlide = heroCarouselSlides[nextIndex];
    const isMobile = window.innerWidth < 1024;
    const img = new Image();
    img.src = isMobile ? nextSlide.mobile : nextSlide.desktop;
  }, [index]);

  return (
    <section className="relative w-full flex flex-col min-h-screen">
      <HeroCarousel
        index={index}
        onPrev={prev}
        onNext={next}
        onGoTo={setIndex}
        onOpenLightbox={() => setLightboxOpen(true)}
        swipeHandlers={swipeHandlers}
        onHoverChange={setCarouselHovered}
      />

      <HeroImageLightbox
        open={lightboxOpen}
        index={index}
        onClose={() => setLightboxOpen(false)}
        onPrev={prev}
        onNext={next}
        onGoTo={setIndex}
        swipeHandlers={swipeHandlers}
      />

      <div className="relative z-20 -mt-2 sm:-mt-4 lg:-mt-6 w-full bg-[#1a4a2e] flex-1 lg:flex-none flex flex-col justify-start pt-2 sm:pt-3 lg:pt-4 pb-10 sm:pb-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:grid lg:grid-cols-[35%_65%] lg:items-start gap-0 lg:gap-4 -mt-2 sm:-mt-3 lg:-mt-4">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start lg:relative z-30 lg:min-h-[240px] xl:min-h-[260px]">
              <div className="relative lg:absolute z-30 w-[240px] sm:w-[280px] lg:w-[320px] -mb-8 sm:-mb-10 lg:mb-0 lg:top-0 lg:left-0">
                <img
                  src={heroImage}
                  alt="Tellex Mystery Box"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  style={{ clipPath: 'inset(0 0 20% 0)' }}
                />
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center text-center lg:items-start lg:text-left pt-1 sm:pt-2 lg:pt-1 z-20">
              <h1
                className="text-[32px] sm:text-[40px] lg:text-[52px] font-bold text-[#f5f0e8] mb-4 leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Let <span className="text-[#c8963e]">Your Feelings</span>{' '}
                <br className="hidden lg:block" />
                Choose the Perfect Book
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#f5f0e8]/90 mb-5 max-w-lg font-light leading-relaxed">
                World&apos;s First AI Powered + Human Care Personalised Mystery Book Experience
              </p>

              <a
                href="/flow?type=mystery"
                className="group inline-flex items-center justify-center gap-3 bg-[#2b8011] text-white px-[28px] py-[16px] rounded-[14px] font-semibold text-lg transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.03] shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] w-full sm:w-auto"
              >
                Try Mystery Pick
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
