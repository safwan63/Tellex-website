import { useRef } from 'react';
import { heroCarouselSlides } from '../../data/heroCarouselSlides';
import CarouselNavButton from './CarouselNavButton';
import HeroCarouselSlideImage from './HeroCarouselSlideImage';

type Props = {
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
  onOpenLightbox: () => void;
  swipeHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  onHoverChange?: (hovered: boolean) => void;
};

export default function HeroCarousel({
  index,
  onPrev,
  onNext,
  onGoTo,
  onOpenLightbox,
  swipeHandlers,
  onHoverChange,
}: Props) {
  const touchStartX = useRef(0);
  const didSwipe = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    didSwipe.current = false;
    touchStartX.current = e.touches[0].clientX;
    swipeHandlers.onTouchStart(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 48) didSwipe.current = true;
    swipeHandlers.onTouchEnd(e);
  };

  return (
    <div
      className="group/carousel relative w-full overflow-hidden bg-[#1a4a2e] aspect-[390/338] lg:aspect-[1336/409]"
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {heroCarouselSlides.map((slide, idx) => (
        <div
          key={slide.desktop}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          aria-hidden={idx !== index}
        >
          <HeroCarouselSlideImage
            slide={slide}
            className="block w-full h-full"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Click to expand */}
      <button
        type="button"
        onClick={() => {
          if (didSwipe.current) {
            didSwipe.current = false;
            return;
          }
          onOpenLightbox();
        }}
        className="absolute inset-0 z-20 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c8963e]"
        aria-label={`View slide ${index + 1} in full screen`}
      />

      {/* Arrows — always on mobile; fade in on hover for desktop */}
      <div
        className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 sm:px-4 pointer-events-none
          opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100 transition-opacity duration-300"
      >
        <CarouselNavButton
          direction="prev"
          label="Previous slide"
          className="pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        />
        <CarouselNavButton
          direction="next"
          label="Next slide"
          className="pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        />
      </div>

      {/* Dots */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E462B]/50 backdrop-blur-sm border border-[#e1cfbc]/20 pointer-events-auto"
        role="tablist"
        aria-label="Carousel pagination"
      >
        {heroCarouselSlides.map((slide, idx) => (
          <button
            key={slide.desktop}
            type="button"
            role="tab"
            aria-selected={idx === index}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              onGoTo(idx);
            }}
            className={`rounded-full transition-all duration-300 ${
              idx === index
                ? 'w-6 h-2 bg-[#c8963e]'
                : 'w-2 h-2 bg-[#e1cfbc]/50 hover:bg-[#e1cfbc]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
