import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import GuidedFlow from "../components/flow/GuidedFlow";
import FreeFlow from "../components/flow/FreeFlow";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";

export default function Flow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Enforce auth
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const typeParam = searchParams.get("type");
  const type = typeParam === "vibe" ? "vibe" : "mystery"; // Default to mystery

  // Flow State
  const [step, setStep] = useState(0); // 0 = Intro, 1 = Language, 2 = Mode Selection, 3 = The Flow
  const [language, setLanguage] = useState("");
  const [mode, setMode] = useState<"guided" | "free" | "">("");

  if (loading || !user) {
    return <div className="min-h-screen bg-[#FAF9F6]" />;
  }

  // Motion variants for smooth transitions
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleNextStep = () => setStep((s) => s + 1);
  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-[100svh] bg-[#FAF9F6] flex flex-col">
      {/* Dynamic Top Label & Back Button */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button onClick={handleBack} className="p-2 -ml-2 text-[#0E462B] hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="text-xs sm:text-sm font-bold tracking-widest text-[#0E462B] bg-[#0E462B]/10 px-3 py-1 rounded-full uppercase">
          {type === "mystery" ? "MYSTERY PICK" : "VIBE PICK"}
        </span>
        <UserAvatar />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col justify-center pb-20">
        <AnimatePresence mode="wait">
          {/* STEP 0: INTRO SCREEN */}
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-center space-y-6"
            >
              {type === "mystery" ? (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Hey Welcome to Tellex Mystery Pick
                  </h1>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
                    A secret book will be selected based on your mood/vibe and delivered to your home.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Welcome to Tellex Vibe Pick✨
                  </h1>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
                    Tell us your vibe and we'll match and reveal the perfect book for you within 24 hours.
                  </p>
                </>
              )}
              
              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-10 py-4 bg-[#0E462B] text-[#e1cfbc] font-medium rounded-xl hover:bg-[#0E462B]/90 transition-all shadow-md text-lg"
                >
                  Let's Begin
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: LANGUAGE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Before we continue, which language you prefer that your book should be?
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {["English", "Hindi", "Malayalam"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      handleNextStep();
                    }}
                    className={`p-5 text-left rounded-2xl border-2 transition-all duration-200 text-lg font-medium ${
                      language === lang 
                        ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" 
                        : "border-[#E5E5E0] bg-white text-gray-700 hover:border-[#0E462B]/30 hover:bg-[#FAF9F6]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: MODE SELECTION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Choose how you want to continue:
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => {
                    setMode("guided");
                    handleNextStep();
                  }}
                  className="p-6 text-left rounded-2xl border-2 border-[#E5E5E0] bg-white hover:border-[#0E462B] hover:shadow-md transition-all duration-200 group"
                >
                  <h3 className="text-xl font-bold text-[#0E462B] mb-2 font-serif group-hover:text-[#0E462B]">Guided Pick</h3>
                  <p className="text-gray-600">Answer a series of questions about your emotions, life situation, and preferences.</p>
                </button>
                
                <button
                  onClick={() => {
                    setMode("free");
                    handleNextStep();
                  }}
                  className="p-6 text-left rounded-2xl border-2 border-[#E5E5E0] bg-white hover:border-[#0E462B] hover:shadow-md transition-all duration-200 group"
                >
                  <h3 className="text-xl font-bold text-[#0E462B] mb-2 font-serif group-hover:text-[#0E462B]">Free Pick</h3>
                  <p className="text-gray-600">Freely describe your vibe or current problem in your own words.</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: THE ACTUAL FLOW DELEGATION */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {mode === "guided" && <GuidedFlow type={type} language={language} onBack={handleBack} />}
              {mode === "free" && <FreeFlow type={type} language={language} onBack={handleBack} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
