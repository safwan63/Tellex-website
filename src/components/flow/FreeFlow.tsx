import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Sparkles } from "lucide-react";

// --- Validations ---
const vibeSchema = z.object({
  vibe: z.string().min(10, "Please describe your vibe in a bit more detail (min 10 chars)"),
});

const followUpSchema = z.object({
  bookType: z.string().optional(),
  avoidTrigger: z.string().optional(),
  readBooks: z.string().min(1, "Please list some books, or type 'None'"),
});

const budgetSchema = z.object({
  budget: z.string().min(1, "Please select a budget"),
});

const deliverySchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(10, "Full address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Must be a 6 digit pincode"),
  whatsapp: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10 digit number"),
});

const fullSchema = z.object({
  ...vibeSchema.shape,
  ...followUpSchema.shape,
  ...budgetSchema.shape,
  bookQuantity: z.string().min(1, "Please select the quantity of books"),
  ...deliverySchema.shape,
});

type FormData = z.infer<typeof fullSchema>;

interface Props {
  type: "mystery" | "vibe";
  language: string;
  onBack: () => void;
}

export default function FreeFlow({ type, language, onBack }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [insight, setInsight] = useState<{ response: string, preview: string } | null>(null);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      bookQuantity: ""
    }
  });

  const formValues = watch();

  useEffect(() => {
    const savedState = sessionStorage.getItem("tellex_flow_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.mode === "free") {
          // Restore form values
          Object.keys(parsed.formValues || {}).forEach((key) => {
             setValue(key as any, parsed.formValues[key]);
          });
          if (parsed.section) setCurrentSection(parsed.section);
          if (parsed.insight) setInsight(parsed.insight);
          sessionStorage.removeItem("tellex_flow_state");
        }
      } catch (e) {}
    }
  }, [setValue]);

  const handleNext = async () => {
    let isValid = false;
    switch (currentSection) {
      case 1: isValid = await trigger(["budget"]); break;
      case 2: isValid = await trigger(["vibe"]); break;
      case 3: isValid = await trigger(["bookType", "avoidTrigger", "readBooks"]); break;
      case 4: 
        isValid = await trigger(["bookQuantity"]); 
        if (isValid) {
          const preview = "Thank you for sharing your thoughts so openly. From what you've shared, we can feel the specific energy and situation you're navigating right now...";
          const response = `${preview.replace('...', '.')}\n\nWe are carefully curating a book that understands your vibe and meets you exactly where you are.\n\nSomething truly meaningful is on its way.`;
          setInsight({ preview, response });
        }
        break;
      case 5:
        isValid = true;
        break;
      default: isValid = true;
    }
    
    if (isValid) {
      setCurrentSection(curr => curr + 1);
    }
  };

  const handleBack = () => {
    if (currentSection === 1) onBack();
    else setCurrentSection(curr => curr - 1);
  };

  const onSubmit = async (data: FormData) => {
    if (isSubmitting || !insight) return;
    setIsSubmitting(true);
    
    try {

      await addDoc(collection(db, "orders"), {
        userId: user?.uid || "anonymous",
        type: type, 
        status: "confirmed",
        mood: data.vibe,
        mode: "free",
        budget: parseInt(data.budget),
        answers: {
          vibe: data.vibe,
          bookType: data.bookType || "Any",
          avoidTrigger: data.avoidTrigger || "None",
          readBooks: data.readBooks,
          bookQuantity: data.bookQuantity,
          budget: parseInt(data.budget),
          language: language
        },
        riasecScores: { I:0, A:0, S:0, E:0, C:0, R:0 }, // Unscored for free flow
        topTypes: [], 
        response: insight.response,
        delivery: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          whatsapp: data.whatsapp
        },
        address: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city} - ${data.pincode}`,
        price: parseInt(data.budget) * parseInt(data.bookQuantity || "1"),
        createdAt: serverTimestamp()
      });
      
      setOrderComplete(true);
    } catch (err) {
      console.error("Error saving order: ", err);
      // Surface error properly rather than failing silently on UI
      alert("Failed to confirm order. Please ensure you have permission to write to the database and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const budgets = ["349", "449", "689", "1299"];

  if (orderComplete) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 mt-4 max-w-lg mx-auto">
        <div className="text-left space-y-4 bg-[#0E462B] text-[#e1cfbc] p-8 rounded-3xl shadow-xl">
          <SparklesIcon />
          {insight?.response.split('\n\n').map((para, idx) => (
             <p key={idx} className="text-lg leading-relaxed">{para}</p>
          ))}
        </div>

        <div className="text-left space-y-4 bg-white p-6 rounded-2xl border border-[#0E462B]/5 shadow-sm">
          {type === "mystery" ? (
             <>
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-[#0E462B] mt-1">•</span>
                <span>Your mystery book is being carefully selected… get ready for a surprise 📦✨</span>
              </p>
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-[#0E462B] mt-1">•</span>
                <span>Book remains a mystery until delivery.</span>
              </p>
            </>
          ) : (
            <>
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-[#0E462B] mt-1">•</span>
                <span>✨ Book will be revealed to you via WhatsApp within 24 hours.</span>
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <button 
            onClick={() => navigate('/my-orders')}
            className="w-full sm:w-auto px-8 py-3 bg-[#0E462B] text-[#e1cfbc] font-bold rounded-xl hover:bg-[#0E462B]/90 transition-all shadow-sm"
          >
            Track My Order
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold text-[#0E462B] underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* ProgressBar */}
      <div className="w-full h-1.5 bg-[#E5E5E0] rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[#0E462B] transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentSection / 6) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* SECTION 1 - Budget */}
        {currentSection === 1 && (
          <motion.div key="sec-1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Select your budget per book (₹)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {budgets.map(b => (
                  <button key={b} onClick={() => setValue("budget", b)} type="button"
                    className={`p-4 text-center rounded-xl border-2 font-bold text-lg transition-colors ${formValues.budget === b ? "border-[#0E462B] bg-[#0E462B] text-[#e1cfbc]" : "border-[#E5E5E0] text-gray-700 hover:border-[#0E462B]/30 bg-white"}`}
                  >₹{b}</button>
                ))}
              </div>
              {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 2 - Vibe/Problem input */}
        {currentSection === 2 && (
          <motion.div key="sec-2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Tell us about your vibe or current problem</h2>
              <p className="text-gray-500 mb-4">Freely write whatever is on your mind. A feeling, a scenario, a genre, a specific lesson you want to learn.</p>
              <textarea 
                {...register("vibe")}
                className="w-full h-40 p-5 text-lg border-2 border-[#E5E5E0] rounded-xl focus:border-[#0E462B] focus:ring-0 outline-none resize-none"
                placeholder="I'm feeling a bit lost in my career right now and I want a book that..."
              />
              {errors.vibe && <p className="text-red-500 text-sm mt-2">{errors.vibe.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 3 - Follow Up */}
        {currentSection === 3 && (
          <motion.div key="sec-3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>A few quick follow-ups</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Any specific Book Type? (Optional)</label>
              <input {...register("bookType")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="e.g. Fiction, Self-help, Thriller" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anything we should AVOID? (Triggers, genres, etc.)</label>
              <input {...register("avoidTrigger")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="e.g. No romance, no gore" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Books you've already read (Required)</label>
              <textarea 
                {...register("readBooks")}
                className="w-full h-24 p-4 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none resize-none"
                placeholder="e.g. Atomic Habits, or type 'None'"
              />
              {errors.readBooks && <p className="text-red-500 text-sm mt-1">{errors.readBooks.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 4 - Book Quantity */}
        {currentSection === 4 && (
          <motion.div key="sec-4" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Quantity of books?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["1", "2", "3"].map(q => (
                  <button key={q} onClick={() => setValue("bookQuantity", q)} type="button"
                    className={`p-6 text-center rounded-xl border-2 font-bold text-xl transition-all duration-200 ${formValues.bookQuantity === q ? "border-[#0E462B] bg-[#0E462B] text-[#e1cfbc] shadow-md scale-105" : "border-[#E5E5E0] text-gray-700 hover:border-[#0E462B]/30 bg-white"}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              {errors.bookQuantity && <p className="text-red-500 text-sm mt-3">{errors.bookQuantity.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 5 - Summary */}
        {currentSection === 5 && (
          <motion.div key="sec-5" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-4">
              <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Summary</h2>
              <button onClick={() => setCurrentSection(1)} className="text-sm font-medium text-[#0E462B] hover:underline">Edit Selection</button>
            </div>

            {insight && (
              <div className="bg-[#0E462B]/5 border-l-4 border-[#0E462B] p-6 rounded-r-2xl mb-2 space-y-4">
                <h3 className="text-sm font-bold text-[#0E462B] tracking-widest uppercase flex items-center gap-2">
                  <Sparkles size={16} /> Here's what we understood about you...
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed italic">
                  {insight.preview}
                </p>
                <div className="text-sm font-bold text-[#0E462B]/60 flex items-center gap-2 border-t border-[#0E462B]/10 pt-3">
                  ✨ Enter your delivery details next to reveal our full curation intent 
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-2xl border border-[#E5E5E0] space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Pick Type</span><span className="font-medium text-right capitalize">{type} Pick</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Language</span><span className="font-medium text-right">{language}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Book Type</span><span className="font-medium text-right">{formValues.bookType || "Any"}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Quantity</span><span className="font-medium text-right">{formValues.bookQuantity} {parseInt(formValues.bookQuantity) === 1 ? 'Book' : 'Books'}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Budget per book</span><span className="font-medium text-right">₹{formValues.budget}</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500">Total Price</span><span className="font-bold text-[#0E462B] text-right text-lg">₹{(parseInt(formValues.budget || "0") * parseInt(formValues.bookQuantity || "1")).toString()}</span></div>
            </div>

            {type === "mystery" && (
              <div className="bg-[#e1cfbc]/30 p-6 rounded-xl text-center border border-[#e1cfbc]">
                <p className="font-medium text-[#0E462B]/80 text-sm">Book name will stay a mystery until it reaches you 🎁</p>
              </div>
            )}

            <div className="pt-2">
              <div className="flex gap-4">
                <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-4 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Back</button>
                {user ? (
                  <button onClick={handleNext} disabled={isSubmitting} className="flex-1 px-6 py-4 font-bold text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90 shadow-lg disabled:opacity-50 transition-all uppercase tracking-wide">
                    Proceed to Delivery Details
                  </button>
                ) : (
                  <button onClick={() => {
                    sessionStorage.setItem("tellex_flow_state", JSON.stringify({
                      mode: "free",
                      type,
                      language,
                      section: 6,
                      insight,
                      formValues: watch()
                    }));
                    navigate("/login?redirect=/flow");
                  }} disabled={isSubmitting} className="flex-1 px-6 py-4 font-bold text-[#0E462B] bg-[#e1cfbc] border-2 border-[#0E462B] rounded-lg hover:bg-[#e1cfbc]/80 shadow-lg disabled:opacity-50 transition-all uppercase tracking-wide">
                    Login to Continue
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 6 - Delivery Details */}
        {currentSection === 6 && (
          <motion.div key="sec-6" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Confirm your Delivery details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input {...register("firstName")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="John" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input {...register("lastName")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="Doe" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea {...register("address")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none text-sm resize-none h-20" placeholder="House No, Street, Landmark..." />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input {...register("city")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="Mumbai" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input {...register("pincode")} maxLength={6} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="400001" />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input {...register("whatsapp")} maxLength={10} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="9876543210" />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>

            <div className="pt-2">
              <p className="text-center font-bold text-gray-700 mb-4 text-lg">Payment: COD Only</p>
              <div className="flex gap-4">
                <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-4 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Back</button>
                <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 px-6 py-4 font-bold text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90 shadow-lg disabled:opacity-50 transition-all uppercase tracking-wide">
                  {isSubmitting ? "Processing Insights..." : "Confirm & Proceed"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-10 h-10 mb-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
