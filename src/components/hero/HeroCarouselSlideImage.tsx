import type { HeroCarouselSlide } from '../../data/heroCarouselSlides';

type Props = {
  slide: HeroCarouselSlide;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
};

export default function HeroCarouselSlideImage({
  slide,
  className = '',
  priority = false,
  fit = 'cover',
}: Props) {
  const imgClass =
    fit === 'contain'
      ? 'max-w-full max-h-[min(78vh,900px)] w-auto h-auto object-contain object-center select-none'
      : 'w-full h-full object-contain lg:object-cover object-center select-none';

  return (
    <picture className={className}>
      <source
        media="(max-width: 1023px)"
        srcSet={slide.mobile}
        type="image/png"
        width={slide.mobileWidth}
        height={slide.mobileHeight}
      />
      <source
        media="(min-width: 1024px)"
        srcSet={slide.desktop}
        type="image/png"
        width={slide.desktopWidth}
        height={slide.desktopHeight}
      />
      <img
        src={slide.desktop}
        alt={slide.alt}
        width={slide.desktopWidth}
        height={slide.desktopHeight}
        sizes={fit === 'contain' ? '90vw' : '100vw'}
        className={imgClass}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </picture>
  );
}
