import { Gift, BookOpen, ArrowRight } from 'lucide-react';
import heroImage from './Image/tellexmystery.webp';
import vibePickImg from './Image/vibepick_experience.png';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-12 lg:py-16 min-h-[85vh] flex items-center"
      style={{ background: 'radial-gradient(circle at top left, #1e6a42, #0E462B)' }}
    >
      {/* Cinematic lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2b8011] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e1cfbc] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* Left Side: Product Image */}
          <div className="order-2 lg:order-1 relative group flex justify-center lg:justify-start lg:mt-16">
            <div className="relative w-full max-w-[500px] lg:max-w-[135%] xl:max-w-[145%] lg:-ml-12 xl:-ml-20 transition-transform duration-700 ease-out hover:-translate-y-[6px] z-20">

              {/* Realistic Ground Shadow */}
              <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[75%] h-[40px] bg-black/50 blur-[25px] rounded-[100%] pointer-events-none -z-10"></div>

              <img
                src={heroImage}
                alt="Mystery Book Box slightly open with a wrapped book inside"
                className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.04] drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-2 backdrop-blur-md shadow-lg transform transition hover:scale-105">
              <Gift className="text-white w-4 h-4 drop-shadow-md" />
              <span className="text-white text-[12px] font-bold tracking-widest uppercase drop-shadow-md">Mystery Pick</span>
            </div>

            {/* Headline */}
            <h1
              className="text-[40px] sm:text-[56px] lg:text-[64px] font-bold text-white mb-4 leading-[1.1] tracking-tight drop-shadow-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let {" "}
              <span className="text-[#ead8c0] drop-shadow-[0_0_4px_rgba(234,216,192,0.2)]">
                Your Feelings
              </span> <br /> Choose the {" "}
              <span className="text-[#ead8c0] drop-shadow-[0_0_4px_rgba(234,216,192,0.2)]">
                Perfect Book
              </span>
            </h1>

            {/* Description */}
            {/* Description */}
            <p className="text-[18px] text-[#e1cfbc] mb-6 max-w-lg leading-relaxed">
              World’s First AI Powered + Human Care Personalised Mystery Book Experience
            </p>

            {/* Primary CTA */}
            <a
              href="/flow?type=mystery"
              className="group inline-flex items-center justify-center gap-3 bg-[#2b8011] text-white px-[28px] py-[16px] rounded-[14px] font-semibold text-lg transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.03] shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] w-full sm:w-auto"
            >
              Try Mystery Pick
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            {/* Try Other Picks Divider */}
            <div className="w-full mt-10 mb-6 flex items-center justify-center gap-4">
              <div className="h-[1px] flex-1 bg-[#e1cfbc]/20"></div>
              <span className="text-[#e1cfbc]/80 text-[11px] uppercase tracking-[0.25em] font-semibold whitespace-nowrap drop-shadow-sm">
                Try Other Picks
              </span>
              <div className="h-[1px] flex-1 bg-[#e1cfbc]/20"></div>
            </div>

            {/* Unique Discovery Paths: Image Based Card */}
            <div className="w-full flex justify-center">

              {/* Path 1: Vibe Pick - Centered & Enlarged */}
              <a
                href="/flow?type=vibe"
                className="group relative h-[160px] sm:h-[180px] w-full max-w-xl rounded-[24px] overflow-hidden block shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >

                {/* Background Image */}
                <img
                  src={vibePickImg}
                  alt="Vibe Pick Experience"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#091a10]/95 via-[#0a2014]/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <BookOpen className="w-[18px] h-[18px] text-[#ead8c0]" />
                    <span className="text-white font-bold text-[14px] sm:text-[15px] tracking-[0.2em] uppercase drop-shadow-md">
                      Vibe Pick
                    </span>
                  </div>
                  <div className="min-h-[40px] flex items-start">
                    <p className="text-[#e1cfbc] text-[15px] sm:text-[16px] leading-snug w-full font-medium transform transition-all duration-500 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 drop-shadow-md max-w-md">
                      Emotional discovery based on your mood.
                    </p>
                  </div>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
