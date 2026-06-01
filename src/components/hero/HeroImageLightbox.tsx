import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { heroCarouselSlides } from '../../data/heroCarouselSlides';
import CarouselNavButton from './CarouselNavButton';
import HeroCarouselSlideImage from './HeroCarouselSlideImage';

type Props = {
  open: boolean;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
  swipeHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
};

export default function HeroImageLightbox({
  open,
  index,
  onClose,
  onPrev,
  onNext,
  onGoTo,
  swipeHandlers,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col animate-[heroLightboxIn_0.35s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery full screen view"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-[#0a2e1c]/92 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close gallery"
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
        <p
          className="text-[#e1cfbc]/90 text-sm sm:text-base tracking-wide"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[#c8963e] font-semibold">{index + 1}</span>
          <span className="mx-2 opacity-50">/</span>
          {heroCarouselSlides.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full border border-[#e1cfbc]/30 bg-[#0E462B]/90 text-[#e1cfbc] backdrop-blur-md transition-all duration-300 hover:bg-[#0E462B] hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8963e]"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={2.25} />
        </button>
      </div>

      {/* Image stage */}
      <div
        className="group/lightbox relative z-10 flex-1 flex items-center justify-center px-4 sm:px-16 pb-8 min-h-0"
        onMouseDown={(e) => e.stopPropagation()}
        {...swipeHandlers}
      >
        <div className="relative w-full max-w-6xl max-h-[min(78vh,900px)] flex items-center justify-center">
          {heroCarouselSlides.map((slide, idx) => (
            <div
              key={slide.desktop}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
                idx === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <HeroCarouselSlideImage
                slide={slide}
                fit="contain"
                className="flex items-center justify-center rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-[#e1cfbc]/15 overflow-hidden"
              />
            </div>
          ))}
        </div>

        {/* Nav — visible on mobile; hover on desktop */}
        <div
          className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-6 pointer-events-none
            opacity-100 lg:opacity-0 lg:group-hover/lightbox:opacity-100 transition-opacity duration-300"
        >
          <CarouselNavButton direction="prev" label="Previous image" className="pointer-events-auto" onClick={onPrev} />
          <CarouselNavButton direction="next" label="Next image" className="pointer-events-auto" onClick={onNext} />
        </div>
      </div>

      {/* Bottom dots */}
      <div className="relative z-10 flex justify-center gap-2 pb-6 sm:pb-8 pointer-events-auto">
        {heroCarouselSlides.map((slide, idx) => (
          <button
            key={slide.desktop}
            type="button"
            aria-label={`View image ${idx + 1}`}
            onClick={() => onGoTo(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === index ? 'w-8 h-2 bg-[#c8963e]' : 'w-2 h-2 bg-[#e1cfbc]/40 hover:bg-[#e1cfbc]/70'
            }`}
          />
        ))}
      </div>
    </div>,
    document.body
  );
}
