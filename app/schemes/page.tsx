"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradientBar } from "@/components/ui/gradient-bar";
import { SEED_SCHEMES } from "@/lib/db/schemes";
import Link from "next/link";
import { FileText, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function SchemesPage() {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground font-sans flex flex-col pt-20">
      
      <div className="flex-1 max-w-[1200px] mx-auto px-6 md:px-12 py-20 w-full">
        <div className="mb-16">
          <div className="text-[#FF6B2B] text-[11px] font-bold uppercase tracking-widest mb-4">SCHEME DIRECTORY</div>
          <h1 className="text-[48px] font-black text-black tracking-[-2px] leading-[1.1] mb-6">
            All Government Schemes
          </h1>
          <p className="text-[18px] text-[#666] max-w-2xl leading-relaxed">
            Browse the comprehensive database of government benefits. Or, save time by letting our AI find exactly what you qualify for in 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_SCHEMES.map((scheme: any) => (
            <div key={scheme.id} className="bg-white border border-[#eeeeee] rounded-[14px] p-8 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mb-6 shrink-0">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-[20px] font-bold text-black mb-3 line-clamp-2 leading-snug">{scheme.name}</h2>
              <p className="text-[14px] text-[#666] leading-relaxed mb-6 line-clamp-3 flex-1">
                {scheme.description}
              </p>
              
              <div className="mt-auto">
                <div className="pt-6 border-t border-[#eeeeee] mb-6">
                  <div className="text-[12px] font-bold text-[#666] uppercase tracking-wider mb-1">Estimated Benefit</div>
                  <div className="text-[18px] font-black text-[#FF6B2B]">₹{scheme.estimatedBenefits?.toLocaleString() || "Varies"}</div>
                </div>
                
                {user ? (
                  <a 
                    href={scheme.url || "#"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-emerald-600 hover:opacity-80 transition-opacity bg-emerald-50 px-4 py-2.5 rounded-lg"
                  >
                    View Details <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#FF6B2B] hover:opacity-80 transition-opacity bg-[#FF6B2B]/10 px-4 py-2.5 rounded-lg"
                  >
                    <Lock size={14} /> Sign in to View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      </main>
      <Footer />
      <GradientBar />
    </>
  );
}
