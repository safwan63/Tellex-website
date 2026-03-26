"use client";
interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  bannerImage?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink, showCta = true, bannerImage }: HeroProps) {
  return (
    <section className="relative bg-tellex-dark-green py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
      {bannerImage && (
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-tellex-dark-green/60" />
        </div>
      )}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-tellex-white mb-4 sm:mb-6 leading-tight px-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h1>
        {subtitle && (
  <p className="text-base sm:text-lg md:text-xl text-tellex-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
    {subtitle}
  </p>
)}

        {showCta && ctaText && (
          <a href={ctaLink || '#'}>
            <button className="bg-tellex-white hover:bg-tellex-white/90 text-tellex-dark-green px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
              {ctaText}
            </button>
          </a>
        )}
      </div>
    </section>
  );
}
