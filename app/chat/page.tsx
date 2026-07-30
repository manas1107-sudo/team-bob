"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ArrowRight, ArrowLeft, GraduationCap, Tractor, Store, Users, PenLine, CheckCircle2, XCircle, Lock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradientBar } from "@/components/ui/gradient-bar";
import { useAuth } from "@/lib/contexts/AuthContext";

type WizardStep = "role" | "category" | "state" | "income" | "results";

export default function WizardPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<WizardStep>("role");
  const [profile, setProfile] = useState<any>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // States for inputs
  const [tempInput, setTempInput] = useState<string>("");
  const [otherInput, setOtherInput] = useState<string>("");

  const updateProfile = (key: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "results") {
        const saved = localStorage.getItem("jansetu_pending_profile");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            fetchRecommendations(parsed);
          } catch (e) {
            console.error("Failed to parse saved profile");
          }
        }
      }
    }
  }, []);

  const handleRoleSelect = (role: string) => {
    updateProfile("occupation", role);
    setStep("category");
    setTempInput("");
  };

  const handleCategorySelect = (category: string) => {
    updateProfile("category", category);
    setStep("state");
    setTempInput("");
  };

  const handleLandInput = () => {
    if (tempInput) {
      updateProfile("landHolding", parseFloat(tempInput));
      setStep("state");
      setTempInput("");
    }
  };

  const handleStateSelect = (stateName: string) => {
    updateProfile("state", stateName);
    setStep("income");
    setTempInput("");
  };

  const fetchRecommendations = async (finalProfile: any) => {
    setIsLoading(true);
    setStep("results");
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: finalProfile }),
      });
      const data = await response.json();
      if (response.ok && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncomeInput = () => {
    if (tempInput) {
      const finalProfile = { ...profile, income: parseInt(tempInput, 10) };
      setProfile(finalProfile);
      
      // If user is logged in, fetch directly. Else save to local storage and redirect to login
      if (user) {
        fetchRecommendations(finalProfile);
      } else {
        localStorage.setItem("jansetu_pending_profile", JSON.stringify(finalProfile));
        window.location.href = "/login?redirect=chat-results";
      }
    }
  };

  const renderRoleStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-4xl mx-auto text-center mt-12">
      <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-outfit)] font-black text-slate-900 tracking-tight mb-6 drop-shadow-sm">Welcome to JanSetu AI</h2>
      <p className="text-slate-600 text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto">Select your current role to get personalized government scheme recommendations.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'Student', Icon: GraduationCap, title: 'Student', desc: 'Scholarships & Education' },
          { id: 'Farmer', Icon: Tractor, title: 'Farmer', desc: 'Agriculture & Subsidies' },
          { id: 'Business', Icon: Store, title: 'Business / Startup', desc: 'Loans & MSME' },
          { id: 'Senior Citizen', Icon: Users, title: 'Senior Citizen', desc: 'Pension & Social Security' },
        ].map((role) => (
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#004FE5]/30 shadow-sm hover:shadow-xl transition-all text-left group flex flex-col items-start relative overflow-hidden"
          >
            <div className="mb-6 bg-slate-50 border border-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all z-10">
              <role.Icon size={28} className="text-[#004FE5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#004FE5] transition-colors z-10">{role.title}</h3>
            <p className="text-sm text-slate-500 mt-2 z-10 font-medium">{role.desc}</p>
          </motion.button>
        ))}

        {/* Other — with text input */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#004FE5]/30 shadow-sm hover:shadow-xl transition-all text-left flex flex-col items-start relative overflow-hidden"
        >
          <div className="mb-6 bg-slate-50 border border-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center z-10">
            <PenLine size={28} className="text-[#004FE5]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 z-10">Other</h3>
          <p className="text-sm text-slate-500 mt-2 z-10 font-medium mb-4">Type your occupation</p>
          <input
            type="text"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && otherInput.trim()) handleRoleSelect(otherInput.trim()); }}
            placeholder="e.g. Fisherman, Artisan..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004FE5]/30 focus:border-[#004FE5] bg-slate-50 mb-3"
          />
          <button
            onClick={() => { if (otherInput.trim()) handleRoleSelect(otherInput.trim()); }}
            disabled={!otherInput.trim()}
            className="w-full bg-[#004FE5] text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderCategoryStep = () => {
    const isFarmer = profile.occupation === "Farmer";
    
    if (isFarmer) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Land Holding</h2>
          <p className="text-slate-600 text-lg mb-10">How many acres of land do you own?</p>
          <div className="flex flex-col gap-4">
            <input 
              type="number" 
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              placeholder="e.g. 5"
              className="w-full p-4 text-center text-2xl font-bold rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#004FE5]/20 focus:border-[#004FE5] shadow-sm"
            />
            <button 
              onClick={handleLandInput}
              disabled={!tempInput}
              className="w-full bg-[#004FE5] text-white p-4 rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2"
            >
              Continue <ArrowRight size={20} />
            </button>
            <button onClick={() => setStep("role")} className="text-slate-500 font-medium py-2 hover:text-slate-900 flex justify-center items-center gap-2 mt-4"><ArrowLeft size={16}/> Back</button>
          </div>
        </motion.div>
      );
    }
    
    if (profile.occupation === "Business") {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Business Stage</h2>
          <p className="text-slate-600 text-lg mb-10">Select your current business stage to find targeted MSME schemes.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['Ideation', 'Early Traction', 'Scaling', 'Established MSME'].map(stage => (
              <button 
                key={stage} 
                onClick={() => handleCategorySelect(stage)}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#004FE5]/30 hover:shadow-md font-bold text-slate-800 transition-all"
              >
                {stage}
              </button>
            ))}
          </div>
          <button onClick={() => setStep("role")} className="text-slate-500 font-medium py-2 hover:text-slate-900 flex justify-center items-center gap-2 mt-4 w-full"><ArrowLeft size={16}/> Back</button>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Social Category</h2>
        <p className="text-slate-600 text-lg mb-10">Select your category to match specific social welfare benefits.</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {['General', 'OBC', 'SC', 'ST'].map(cat => (
            <button 
              key={cat} 
              onClick={() => handleCategorySelect(cat)}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#004FE5]/30 hover:shadow-md font-bold text-slate-800 transition-all"
            >
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setStep("role")} className="text-slate-500 font-medium py-2 hover:text-slate-900 flex justify-center items-center gap-2 mt-4 w-full"><ArrowLeft size={16}/> Back</button>
      </motion.div>
    );
  };

  const renderStateStep = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">State of Residence</h2>
      <p className="text-slate-600 text-lg mb-10">Where do you currently live?</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-2">
        {["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"].map((s) => (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            key={s}
            onClick={() => handleStateSelect(s)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#004FE5]/40 transition-all font-bold text-slate-700"
          >
            {s}
          </motion.button>
        ))}
      </div>
      <button onClick={() => setStep("category")} className="text-slate-500 font-medium py-2 hover:text-slate-900 flex justify-center items-center gap-2 mt-8 w-full"><ArrowLeft size={16}/> Back</button>
    </motion.div>
  );

  const renderIncomeStep = () => {
    const isBusiness = profile.occupation === "Business";
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          {isBusiness ? "Annual Business Revenue" : "Annual Family Income"}
        </h2>
        <p className="text-slate-600 text-lg mb-10">
          {isBusiness ? "What is your approximate annual turnover or revenue in Rupees?" : "What is your approximate annual family income in Rupees?"}
        </p>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
            <input 
              type="number" 
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              placeholder={isBusiness ? "e.g. 5000000" : "e.g. 250000"}
              className="w-full p-4 pl-12 text-center text-2xl font-bold rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#004FE5]/20 focus:border-[#004FE5] shadow-sm bg-white"
            />
          </div>
          <button 
            onClick={handleIncomeInput}
            disabled={!tempInput}
            className="w-full bg-[#004FE5] text-white p-4 rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            View Recommendations <ArrowRight size={20} />
          </button>
          <button onClick={() => setStep("state")} className="text-slate-500 font-medium py-2 hover:text-slate-900 flex justify-center items-center gap-2 mt-4"><ArrowLeft size={16}/> Back</button>
        </div>
      </motion.div>
    );
  };

  const renderResultsStep = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#004FE5]/20 border-t-[#004FE5] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900">Running Intelligence Engine...</h2>
          <p className="text-slate-600 font-medium mt-2">Scanning thousands of welfare programs for eligibility.</p>
        </div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Recommendations</h2>
          </div>
          <button 
            onClick={() => { setStep("role"); setProfile({}); setRecommendations([]); }}
            className="bg-white border border-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            Start Over
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Extracted Features</h3>
              <div className="space-y-4 text-sm">
                <div><span className="text-slate-500 font-medium block">Occupation</span><span className="font-bold text-lg text-[#004FE5]">{profile.occupation}</span></div>
                {profile.category && <div><span className="text-slate-500 font-medium block">Category</span><span className="font-bold text-slate-800">{profile.category}</span></div>}
                {profile.landHolding && <div><span className="text-slate-500 font-medium block">Land Holding</span><span className="font-bold text-slate-800">{profile.landHolding} Acres</span></div>}
                <div><span className="text-slate-500 font-medium block">State</span><span className="font-bold text-slate-800">{profile.state}</span></div>
                <div><span className="text-slate-500 font-medium block">Income</span><span className="font-bold text-slate-800">₹{profile.income?.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          {/* Scheme Results */}
          <div className="md:col-span-2 space-y-6">
            {recommendations.length > 0 ? recommendations.map((rec, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className={`bg-white rounded-3xl p-8 border shadow-sm relative overflow-hidden group transition-all ${rec.score >= 70 ? 'border-emerald-200 shadow-md' : 'border-slate-200 opacity-70'}`}
              >
                <div className={`absolute top-0 right-0 text-xs font-bold px-4 py-2 rounded-bl-2xl tracking-wide ${rec.score >= 70 ? 'bg-emerald-50 text-emerald-700 border-l border-b border-emerald-100' : 'bg-slate-50 text-slate-600 border-l border-b border-slate-200'}`}>
                  {rec.score}% MATCH
                </div>
                <h3 className="font-bold text-2xl text-slate-900 mb-3 pr-20">{rec.scheme.name}</h3>
                <p className="text-base text-slate-600 mb-6 leading-relaxed">{rec.scheme.description}</p>
                
                <div className="space-y-3 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {rec.reasons.map((r: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start text-sm text-slate-700 font-medium">
                      {r.startsWith("✓") ? (
                        <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle size={18} className="text-rose-500 mt-0.5 shrink-0" />
                      )}
                      <span>{r.substring(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                   <div className="font-black text-2xl text-[#004FE5]">₹{rec.scheme.estimatedBenefits?.toLocaleString() || "Varies"}</div>
                   {user ? (
                     <a 
                       href={rec.scheme.url || "#"} 
                       target="_blank"
                       rel="noopener noreferrer"
                       className={`font-bold uppercase tracking-wider text-white px-8 py-3 rounded-full transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${rec.score >= 70 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-slate-600 hover:bg-slate-700'}`}
                     >
                       Apply Now <ArrowRight size={16} />
                     </a>
                   ) : (
                     <Link 
                       href="/login" 
                       className={`font-bold uppercase tracking-wider text-white px-8 py-3 rounded-full transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${rec.score >= 70 ? 'bg-[#FF6B2B] hover:bg-[#f59e0b] shadow-[#FF6B2B]/20' : 'bg-slate-400 hover:bg-slate-500'}`}
                     >
                       <Lock size={16} /> Sign in to Apply
                     </Link>
                   )}
                </div>
              </motion.div>
            )) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <AlertCircle size={24} className="text-slate-400" />
                </div>
                No schemes match your exact profile criteria.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground flex flex-col font-sans relative pt-20">

      <div className="flex-1 flex items-center justify-center p-6 z-10 w-full">
        <AnimatePresence mode="wait">
          {step === "role" && renderRoleStep()}
          {step === "category" && renderCategoryStep()}
          {step === "state" && renderStateStep()}
          {step === "income" && renderIncomeStep()}
          {step === "results" && renderResultsStep()}
        </AnimatePresence>
      </div>
      </main>
      <Footer />
      <GradientBar />
    </>
  );
}
