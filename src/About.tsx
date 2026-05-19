import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import { BookHeart, Target, Shield } from 'lucide-react';
import qrCodeImage from './components/Image/Screenshot 2025-12-28 201713.png';
import MujahirImg from './components/Image/Mujahir.webp';
import SafwanImg from './components/Image/Safwan.webp';
import FazanImg from './components/Image/fazan.webp';

export default function About() {
  return (
    <main className="min-h-screen bg-[#0E462B]">
      <Navbar />

      <Hero
        title="Our Story"
        showCta={false}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Where It All Began
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Tellex began with a simple feeling that choosing the right book is hard, but receiving the right one can change everything. We noticed that people don't always want popular books they want books that understand them. That's how Mystery Pick was born. A way to turn emotions, moods, and interests into a book that feels personal like someone truly listened. At Tellex, every mystery pick is more than a surprise. It's a personalised gift, wrapped in trust and emotion.
            </p>
          </div>
        </div>
      </section>


      <section className="py-12 sm:py-16 md:py-20 bg-[#0E462B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-white text-center mb-8 sm:mb-12 md:mb-16"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Drives Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-4 sm:p-6 bg-tellex-white/10 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <BookHeart className="text-tellex-white" size={32} />
              </div>
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-white mb-3 sm:mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Mission
              </h3>
              <p className="text-tellex-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                To make book gifting deeply personal, emotional, and unforgettable by matching the right book to the right feeling through the magic of mystery
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-4 sm:p-6 bg-tellex-white/10 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <Target className="text-tellex-white" size={32} />
              </div>
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-white mb-3 sm:mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Vision
              </h3>
              <p className="text-tellex-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                To become the most trusted brand for emotion-driven and personalized book gifting, where every book feels chosen just for you
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-4 sm:p-6 bg-tellex-white/10 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <Shield className="text-tellex-white" size={32} />
              </div>
              <h3
                className="text-xl sm:text-2xl font-semibold text-tellex-white mb-3 sm:mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Promise
              </h3>
              <p className="text-tellex-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                Every book we send is thoughtfully chosen to match your vibe, story, or curiosity never random, always intentional
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black text-center mb-8 sm:mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Values
          </h2>

          <p className="text-tellex-black/80 text-base sm:text-lg text-center mb-8 sm:mb-12">
            We believe books are more than products, they are companions.
          </p>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Personalization First
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                Every reader is different, so every recommendation matters.
              </p>
            </div>

            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Emotion Over Algorithms
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                Feelings come before trends or popularity.
              </p>
            </div>

            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Meaningful Mystery
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                Surprise should feel warm, not random.
              </p>
            </div>

            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Honesty & Care
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                We recommend only what we would gift ourselves.
              </p>
            </div>

            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Connection Through Stories
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                Books that comfort, challenge, and change lives.
              </p>
            </div>

            <div className="bg-tellex-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-lg sm:text-xl font-semibold text-tellex-dark-green mb-2 sm:mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Respect for Readers
              </h3>
              <p className="text-tellex-black/70 text-sm sm:text-base md:text-lg">
                Every order is treated as a personal gift, not a transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-dark-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-white mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our Reading Community
          </h2>
          <p className="text-tellex-white/80 text-base sm:text-lg mb-6 sm:mb-8">
            Become part of a community that values meaningful reading experiences and emotional connections with stories.
          </p>
          <div className="flex justify-center">
            <img
              src={qrCodeImage}
              alt="QR Code to join our reading community"
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-lg bg-white p-3 sm:p-4"
            />
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-[#0E462B] relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-64 bg-white/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Meet the Minds Behind Tellex
            </h2>
            <div className="w-16 h-1 bg-[#E1CFBC]/40 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {[
              {
                name: "Mujahir",
                role: "Founder",
                img: MujahirImg,
                imgClass: "object-[center_12%] scale-100"
              },
              {
                name: "Safwan Hashim",
                role: "Co-founder",
                img: SafwanImg,
                imgClass: "object-[center_25%] scale-[1.65] translate-y-4"
              },
              {
                name: "Fazan",
                role: "Co-founder",
                img: FazanImg,
                imgClass: "object-[center_25%] scale-[1.75] translate-y-5"
              }
            ].map((founder, idx) => (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-3 sm:p-4 flex flex-col transition-all duration-500 ease-out hover:-translate-y-3 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-white/20"
              >
                <div className="w-full aspect-[4/3] mb-5 overflow-hidden rounded-2xl relative">
                  <div className="absolute inset-0 bg-[#0E462B]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500 z-20"></div>
                  <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                    <img
                      src={founder.img}
                      alt={founder.name}
                      className={`w-full h-full object-cover ${founder.imgClass}`}
                    />
                  </div>
                </div>
                <div className="text-center pb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {founder.name}
                  </h3>
                  <p className="text-[#E1CFBC] text-xs sm:text-sm tracking-[0.1em] uppercase font-semibold opacity-90">
                    {founder.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
