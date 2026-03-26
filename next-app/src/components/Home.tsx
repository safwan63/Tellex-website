"use client";
import Navbar from './Navbar';
import Footer from './Footer';
import CarouselBanner from './CarouselBanner';
import ProductCard from './ProductCard';
import ImageMarquee from './ImageMarquee';
import { Users, Heart, Sparkles, SlidersHorizontal, Gift, TrendingUp } from 'lucide-react';
import { useRef } from 'react';

function HowTellexWorksSection() {
  return (
    <section className="tellex-how py-10 sm:py-16 md:py-24 lg:py-32"
 style={{ backgroundColor: '#0E462B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: '#FFFFFF',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          How Tellex Works
        </h2>

        <div className="steps grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 sm:gap-10 md:gap-12">




        <div className="step flex flex-col items-center text-center h-full">

          <span className="step-number text-5xl sm:text-6xl md:text-7xl font-normal mb-4"

              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FFFFFF',
                fontWeight: 400,
                lineHeight: '1',
              }}
            >
              01
            </span>
            <div className="mb-4 flex items-center justify-center">
              <Sparkles
                size={36}
                color="#FFFFFF"
                strokeWidth={1}
              />
            </div>
            <h3
              className="text-sm sm:text-lg md:text-xl font-bold mb-3"

              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              Choose Your Path
            </h3>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-[10rem] sm:max-w-none"
              style={{
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              Your next read, your way.
              Vibe Pick | Mystery Pick | Direct Pick
            </p>
          </div>

          <div className="step flex flex-col items-center text-center h-full">

          <span className="step-number text-5xl sm:text-6xl md:text-7xl font-normal mb-4"

              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FFFFFF',
                fontWeight: 400,
                lineHeight: '1',
              }}
            >
              02
            </span>
            <div className="mb-4 flex items-center justify-center">
              <SlidersHorizontal
                size={36}
                color="#FFFFFF"
                strokeWidth={1}
              />
            </div>
            <h3
              className="text-sm sm:text-lg md:text-xl font-bold mb-3"

              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              We Understand You
            </h3>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-[10rem] sm:max-w-none"
              style={{
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              Your vibe is processed with our intelligent system & human care
            </p>
          </div>

          <div className="step flex flex-col items-center text-center h-full">

          <span className="step-number text-5xl sm:text-6xl md:text-7xl font-normal mb-4"

              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FFFFFF',
                fontWeight: 400,
                lineHeight: '1',
              }}
            >
              03
            </span>
            <div className="mb-4 flex items-center justify-center">
              <Gift
                size={36}
                color="#FFFFFF"
                strokeWidth={1}
              />
            </div>
            <h3
              className="text-sm sm:text-lg md:text-xl font-bold mb-3"

              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              We Match the Book
            </h3>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-[10rem] sm:max-w-none"
              style={{
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              Emotionally aligned. Interest based. Never random.
            </p>
          </div>

          <div className="step flex flex-col items-center text-center h-full">

          <span className="step-number text-5xl sm:text-6xl md:text-7xl font-normal mb-4"

              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FFFFFF',
                fontWeight: 400,
                lineHeight: '1',
              }}
            >
              04
            </span>
            <div className="mb-4 flex items-center justify-center">
              <TrendingUp
                size={36}
                color="#FFFFFF"
                strokeWidth={1}
              />
            </div>
            <h3
              className="text-sm sm:text-lg md:text-xl font-bold mb-3"

              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              Read & Feel
            </h3>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-[10rem] sm:max-w-none"
              style={{
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              A book that feels personal, meaningful, and memorable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const picksRef = useRef<HTMLDivElement>(null);

  const handleCarouselCta = () => {
    picksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-tellex-dark-green">
      <Navbar />

      <CarouselBanner onCtaClick={handleCarouselCta} />

      <section id="picks" ref={picksRef} className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-tellex-black text-center mb-8 sm:mb-12 md:mb-16"
            style={{ fontFamily: "'Phudu', sans-serif", fontWeight: 700 }}
          >
            Three Ways to Discover
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <ProductCard
              icon="sparkles"
              title="Vibe Pick"
              description="Pick your mood. We show books that match how you feel choose what connects."
              delay={0}
              link="/flow?type=vibe"
              cardBgColor="#fff1e8"
            />
            <ProductCard
              icon="gift"
              title="Mystery Pick"
              description="Share your vibe. We hand select a book using our intelligent system + human care a surprise that feels personal."
              delay={100}
              link="/flow?type=mystery"
              cardBgColor="#fff1e8"
            />
            <ProductCard
              icon="search"
              title="Direct Pick"
              description="Know what you want? Browse and choose your book like a regular bookstore."
              delay={200}
              link="https://tellex-4.myshopify.com/collections/all"
              cardBgColor="#fff1e8"
            />
          </div>
        </div>
      </section>

      <HowTellexWorksSection />

      <ImageMarquee />

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
