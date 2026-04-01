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
const emotionSchema = z.object({
  emotion: z.string().min(1, "Please select an emotion"),
  emotionOther: z.string().optional(),
  lifeSituation: z.string().min(1, "Please select your life situation"),
  lifeSituationOther: z.string().optional(),
});

const intentSchema = z.object({
  reasons: z.array(z.string()).min(1, "Please select at least one reason").max(3, "You can select up to 3 reasons"),
  reasonsOther: z.string().optional(),
  wants: z.array(z.string()).min(1, "Please select at least one want").max(3, "You can select up to 3 wants"),
  wantsOther: z.string().optional(),
});

const preferenceSchema = z.object({
  bookType: z.string().min(1, "Please select a book type"),
});

const historySchema = z.object({
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

// Full schema to infer types but we validate step by step
const fullSchema = z.object({
  ...emotionSchema.shape,
  ...intentSchema.shape,
  ...preferenceSchema.shape,
  ...historySchema.shape,
  ...budgetSchema.shape,
  ...deliverySchema.shape,
});

type FormData = z.infer<typeof fullSchema>;

interface Props {
  type: "mystery" | "vibe";
  language: string;
  onBack: () => void;
}

export default function GuidedFlow({ type, language, onBack }: Props) {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const { register, handleSubmit, trigger, watch, setValue, setError, clearErrors, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      reasons: [],
      wants: []
    }
  });

  const formValues = watch();

  const handleNext = async () => {
    let isValid = false;
    switch (currentSection) {
      case 1: 
        isValid = await trigger(["emotion", "emotionOther", "lifeSituation", "lifeSituationOther"]); 
        if (formValues.emotion === "✍️ Other" && (!formValues.emotionOther || formValues.emotionOther.trim() === "")) { setError("emotionOther", {type: "manual", message: "Please specify your emotion"}); isValid = false; }
        if (formValues.lifeSituation === "✍️ Other" && (!formValues.lifeSituationOther || formValues.lifeSituationOther.trim() === "")) { setError("lifeSituationOther", {type: "manual", message: "Please specify your situation"}); isValid = false; }
        break;
      case 2: 
        isValid = await trigger(["reasons", "reasonsOther", "wants", "wantsOther"]); 
        if ((formValues.reasons || []).includes("Other") && (!formValues.reasonsOther || formValues.reasonsOther.trim() === "")) { setError("reasonsOther", {type: "manual", message: "Please specify your reason"}); isValid = false; }
        if ((formValues.wants || []).includes("Other") && (!formValues.wantsOther || formValues.wantsOther.trim() === "")) { setError("wantsOther", {type: "manual", message: "Please specify what you want"}); isValid = false; }
        break;
      case 3: isValid = await trigger(["bookType"]); break;
      case 4: isValid = await trigger(["readBooks"]); break;
      case 5: isValid = await trigger(["budget"]); break;
      case 6: isValid = await trigger(["firstName", "lastName", "address", "city", "pincode", "whatsapp"]); break;
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
    // Already validated before summary, but doing final submit
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "tellex_orders"), {
        userId: user?.uid || "anonymous",
        type: type, // "mystery" or "vibe"
        mode: "guided",
        answers: {
          emotion: data.emotion === "✍️ Other" ? data.emotionOther : data.emotion,
          lifeSituation: data.lifeSituation === "✍️ Other" ? data.lifeSituationOther : data.lifeSituation,
          reasons: data.reasons.map(r => r === "Other" ? data.reasonsOther : r),
          wants: data.wants.map(w => w === "Other" ? data.wantsOther : w),
          bookType: data.bookType,
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
      // Implement error handling toast in production
    } finally {
      setIsSubmitting(false);
    }
  };

  // Checkbox helpers
  const toggleArrayItem = (field: "reasons" | "wants", value: string) => {
    const currentArray = watch(field) || [];
    if (currentArray.includes(value)) {
      setValue(field, currentArray.filter(v => v !== value));
      clearErrors(field);
    } else {
      if (currentArray.length >= 3) {
        setError(field, { type: "manual", message: "You can select up to 3 options" });
        return;
      }
      setValue(field, [...currentArray, value]);
      clearErrors(field);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Lists for mapping
  const emotions = ["😊 Happy", "😌 Peaceful", "😟 Anxious", "😔 Low / Sad", "😤 Frustrated", "😍 Hopeful", "⬜ Empty", "✍️ Other"];
  const lifeSituations = ["✨ New beginnings", "💔 Heartbreak or loss", "🌀 Feeling stuck or confused", "📈 Seeking personal growth", "🧘 Need mental calm", "🎯 Working toward a goal", "✍️ Other"];
  const readingReasons = ["To relax", "To find inspiration", "To learn", "To reflect", "To explore", "To experience something unexpected", "Other"];
  const readingWants = ["New mindset", "Peace and calm", "Motivation", "Connection", "Perspective shift", "Creativity", "Comfort and healing", "Something good to read", "Other"];
  const bookTypes = ["Self-help / Mindset", "Fiction / Story", "Romance", "Mystery / Thriller"];
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
          style={{ width: `${(currentSection / 7) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* SECTION 1 - Emotion & Life Situation */}
        {currentSection === 1 && (
          <motion.div key="sec-1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>How are you feeling right now?</h2>
              <div className="flex flex-wrap gap-3">
                {emotions.map(e => (
                  <button key={e} onClick={() => { setValue("emotion", e); clearErrors("emotion"); }} type="button"
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${formValues.emotion === e ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" : "border-[#E5E5E0] hover:border-[#0E462B]/30 bg-white"}`}
                  >{e}</button>
                ))}
              </div>
              {formValues.emotion === "✍️ Other" && (
                <div className="mt-3">
                  <input {...register("emotionOther")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none text-sm" placeholder="Please specify your emotion..." />
                  {errors.emotionOther && <p className="text-red-500 text-xs mt-1">{errors.emotionOther.message}</p>}
                </div>
              )}
              {errors.emotion && <p className="text-red-500 text-sm mt-2">{errors.emotion.message}</p>}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What describes your current life situation?</h2>
              <div className="flex flex-wrap gap-3">
                {lifeSituations.map(ls => (
                  <button key={ls} onClick={() => { setValue("lifeSituation", ls); clearErrors("lifeSituation"); }} type="button"
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${formValues.lifeSituation === ls ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" : "border-[#E5E5E0] hover:border-[#0E462B]/30 bg-white"}`}
                  >{ls}</button>
                ))}
              </div>
              {formValues.lifeSituation === "✍️ Other" && (
                <div className="mt-3">
                  <input {...register("lifeSituationOther")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none text-sm" placeholder="Please specify your situation..." />
                  {errors.lifeSituationOther && <p className="text-red-500 text-xs mt-1">{errors.lifeSituationOther.message}</p>}
                </div>
              )}
              {errors.lifeSituation && <p className="text-red-500 text-sm mt-2">{errors.lifeSituation.message}</p>}
            </div>
            
            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 2 - Reading Intent */}
        {currentSection === 2 && (
          <motion.div key="sec-2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Why do you want to read right now? <span className="text-sm font-normal text-gray-500 block">(Select up to 3)</span></h2>
              <div className="flex flex-wrap gap-3">
                {readingReasons.map(r => (
                  <button key={r} onClick={() => toggleArrayItem("reasons", r)} type="button"
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${(formValues.reasons || []).includes(r) ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" : "border-[#E5E5E0] hover:border-[#0E462B]/30 bg-white"}`}
                  >{r}</button>
                ))}
              </div>
              {(formValues.reasons || []).includes("Other") && (
                <div className="mt-3">
                  <input {...register("reasonsOther")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none text-sm" placeholder="Please specify your reason..." />
                  {errors.reasonsOther && <p className="text-red-500 text-xs mt-1">{errors.reasonsOther.message}</p>}
                </div>
              )}
              {errors.reasons && <p className="text-red-500 text-sm mt-2">{errors.reasons.message}</p>}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What do you want from this book? <span className="text-sm font-normal text-gray-500 block">(Select up to 3)</span></h2>
              <div className="flex flex-wrap gap-3">
                {readingWants.map(w => (
                  <button key={w} onClick={() => toggleArrayItem("wants", w)} type="button"
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${(formValues.wants || []).includes(w) ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" : "border-[#E5E5E0] hover:border-[#0E462B]/30 bg-white"}`}
                  >{w}</button>
                ))}
              </div>
              {(formValues.wants || []).includes("Other") && (
                <div className="mt-3">
                  <input {...register("wantsOther")} className="w-full px-4 py-3 border-2 border-[#E5E5E0] rounded-lg focus:border-[#0E462B] outline-none text-sm" placeholder="Please specify what you want..." />
                  {errors.wantsOther && <p className="text-red-500 text-xs mt-1">{errors.wantsOther.message}</p>}
                </div>
              )}
              {errors.wants && <p className="text-red-500 text-sm mt-2">{errors.wants.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 3 - Preferences */}
        {currentSection === 3 && (
          <motion.div key="sec-3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What type of book are you looking for?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookTypes.map(bt => (
                  <button key={bt} onClick={() => setValue("bookType", bt)} type="button"
                    className={`p-4 text-left rounded-xl border-2 font-medium transition-colors ${formValues.bookType === bt ? "border-[#0E462B] bg-[#0E462B]/5 text-[#0E462B]" : "border-[#E5E5E0] hover:border-[#0E462B]/30 bg-white"}`}
                  >{bt}</button>
                ))}
              </div>
              {errors.bookType && <p className="text-red-500 text-sm mt-2">{errors.bookType.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 4 - Reading History */}
        {currentSection === 4 && (
          <motion.div key="sec-4" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>List some books you've already read and enjoyed.</h2>
              <p className="text-gray-500 mb-4">This helps us avoid sending you something you already have.</p>
              <textarea 
                {...register("readBooks")}
                className="w-full h-32 p-4 border-2 border-[#E5E5E0] rounded-xl focus:border-[#0E462B] focus:ring-0 outline-none resize-none"
                placeholder="e.g. Atomic Habits, The Alchemist, or type 'None'"
              />
              {errors.readBooks && <p className="text-red-500 text-sm mt-2">{errors.readBooks.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleBack} className="px-6 py-3 font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90">Continue</button>
            </div>
          </motion.div>
        )}

        {/* SECTION 5 - Budget */}
        {currentSection === 5 && (
          <motion.div key="sec-5" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-10">
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

        {/* SECTION 6 - Delivery */}
        {currentSection === 6 && (
          <motion.div key="sec-6" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
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
              <button 
                onClick={handleNext} 
                className="flex-1 px-6 py-3 font-medium text-[#e1cfbc] bg-[#0E462B] rounded-lg hover:bg-[#0E462B]/90"
              >
                Review Summary
              </button>
            </div>
          </motion.div>
        )}

        {/* SECTION 7 - Summary */}
        {currentSection === 7 && (
          <motion.div key="sec-7" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-4">
              <h2 className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Summary</h2>
              <button onClick={() => setCurrentSection(1)} className="text-sm font-medium text-[#0E462B] underline">Edit</button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-[#E5E5E0] space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Emotion</span>
                <span className="font-medium text-right">{formValues.emotion === "✍️ Other" ? formValues.emotionOther : formValues.emotion}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Life Situation</span>
                <span className="font-medium text-right">{formValues.lifeSituation === "✍️ Other" ? formValues.lifeSituationOther : formValues.lifeSituation}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="text-gray-500 mb-1">Reason for Reading</span>
                <span className="font-medium text-sm">
                  {(formValues.reasons || []).map(r => r === "Other" ? formValues.reasonsOther : r).join(", ")}
                </span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="text-gray-500 mb-1">What you want</span>
                <span className="font-medium text-sm">
                  {(formValues.wants || []).map(w => w === "Other" ? formValues.wantsOther : w).join(", ")}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Book Type</span><span className="font-medium text-right">{formValues.bookType}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Language</span><span className="font-medium text-right">{language}</span></div>
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
