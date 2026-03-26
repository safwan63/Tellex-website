"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

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
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
  });

  const formValues = watch();

  const handleNext = async () => {
    let isValid = false;
    switch (currentSection) {
      case 1: isValid = await trigger(["vibe"]); break;
      case 2: isValid = await trigger(["bookType", "avoidTrigger", "readBooks"]); break;
      case 3: isValid = await trigger(["budget"]); break;
      case 4: isValid = await trigger(["firstName", "lastName", "address", "city", "pincode", "whatsapp"]); break;
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
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "tellex_orders"), {
        userId: user?.uid || "anonymous",
        type: type, // "mystery" or "vibe"
        mode: "free",
        answers: {
          vibe: data.vibe,
          bookType: data.bookType || "Any",
          avoidTrigger: data.avoidTrigger || "None",
          readBooks: data.readBooks,
          language: language
        },
        delivery: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          whatsapp: data.whatsapp
        },
        budget: parseInt(data.budget),
        createdAt: serverTimestamp()
      });
      
      setOrderComplete(true);
    } catch (err) {
      console.error("Error saving order: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const budgets = ["289", "349", "449", "689", "1299"];

  if (orderComplete) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 mt-10">
        <h2 className="text-3xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Order confirmed ✅
        </h2>
        <p className="text-lg text-gray-700">
          {type === "mystery" 
            ? "Packing will start soon after we find a match for you"
            : "We will send the product link soon once we match a book with your vibe"
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* ProgressBar */}
      <div className="w-full h-1.5 bg-[#E5E5E0] rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[#0E462B] transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentSection / 5) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* SECTION 1 - Vibe/Problem input */}
        {currentSection === 1 && (
          <motion.div key="sec-1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
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

        {/* SECTION 2 - Follow Up */}
        {currentSection === 2 && (
          <motion.div key="sec-2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
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

        {/* SECTION 3 - Budget */}
        {currentSection === 3 && (
          <motion.div key="sec-3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Select your budget (₹)</h2>
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

        {/* SECTION 4 - Delivery */}
        {currentSection === 4 && (
          <motion.div key="sec-4" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Where should we send your book?</h2>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input {...register("whatsapp")} maxLength={10} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none" placeholder="9876543210" />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Review Summary</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 5 - Summary */}
        {currentSection === 5 && (
          <motion.div key="sec-5" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-4">
              <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Summary</h2>
              <button onClick={() => setCurrentSection(1)} className="text-sm font-medium text-[#0E462B] underline">Edit</button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-[#E5E5E0] space-y-4">
              <div className="flex flex-col border-b pb-2"><span className="text-gray-500 mb-1">Your Vibe</span><span className="font-medium italic text-gray-800">"{formValues.vibe}"</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Language</span><span className="font-medium text-right">{language}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Book Type</span><span className="font-medium text-right">{formValues.bookType || "Any"}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Budget</span><span className="font-bold text-[#0E462B] text-right">₹{formValues.budget}</span></div>
              <div className="flex flex-col border-b pb-2">
                <span className="text-gray-500 mb-1">Delivery</span>
                <span className="font-medium">
                  {formValues.firstName} {formValues.lastName}<br/>
                  {formValues.address}<br/>
                  {formValues.city} - {formValues.pincode}<br/>
                  WA: {formValues.whatsapp}
                </span>
              </div>
            </div>

            {type === "mystery" && (
              <div className="bg-[#e1cfbc]/30 p-4 rounded-xl text-center border border-[#e1cfbc]">
                <p className="font-medium text-[#0E462B]">Book name will stay a mystery until it reaches you🎁</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-center font-bold text-gray-700 mb-4">Payment: COD (Cash on Delivery) Only</p>
              <div className="flex gap-4">
                <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-4 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Back</button>
                <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 px-6 py-4 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90 shadow-lg disabled:opacity-50 transition-all uppercase tracking-wide">
                  {isSubmitting ? "Processing..." : "Confirm Final Order"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
