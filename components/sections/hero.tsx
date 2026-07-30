"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"

// Pre-computed at module level to avoid SSR/client hydration mismatch
const SPOKES = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i * 360) / 24
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return {
    x1: +(100 + 14 * cos).toFixed(4),
    y1: +(100 + 14 * sin).toFixed(4),
    x2: +(100 + 78 * cos).toFixed(4),
    y2: +(100 + 78 * sin).toFixed(4),
    cx: +(100 + 72 * cos).toFixed(4),
    cy: +(100 + 72 * sin).toFixed(4),
  }
})

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden">
      {/* Indian flag — Saffron orb (top-right) */}
      <div className="absolute -right-32 top-16 w-[600px] h-[600px] pointer-events-none -z-10 animate-orb-rotate">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,153,51,0.6) 0%, rgba(255,153,51,0.3) 40%, rgba(255,200,100,0.1) 70%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      {/* Indian flag — Green orb (bottom-left) */}
      <div className="absolute -left-16 bottom-24 w-[400px] h-[400px] pointer-events-none -z-10 animate-orb-rotate" style={{ animationDirection: "reverse", animationDuration: "18s" }}>
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 60% 60%, rgba(19,136,8,0.45) 0%, rgba(19,136,8,0.2) 50%, transparent 80%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <p className="text-muted-foreground mb-6 text-lg font-normal">
              India's First AI Scheme Recommender
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
              Connecting{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Citizens
              </span>{" "}
              to Government Benefits
            </h1>

            <p className="mt-8 max-w-xl leading-relaxed text-lg text-zinc-500">
              Discover your eligibility for over 1500+ government welfare schemes in under 2 minutes. Free and fast.
            </p>

            <div className="flex flex-row items-start gap-4 mt-10">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white rounded-full transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)",
                  boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,107,43,0.5)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,43,0.35)"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Find Schemes Now
              </Link>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium transition-colors"
                style={{ color: "#FF6B2B" }}
              >
                Browse Directory
                <ArrowDown className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — Rotating Ashoka Chakra Visual */}
          <div className="hidden lg:flex items-center justify-center relative" style={{ height: "460px" }}>

            {/* Tricolor concentric rings */}
            <div className="absolute w-[420px] h-[420px] rounded-full border-[3px] border-dashed"
              style={{ borderColor: "rgba(255,153,51,0.4)", animation: "spin 30s linear infinite reverse" }} />
            <div className="absolute w-[380px] h-[380px] rounded-full border-[6px]"
              style={{ borderColor: "rgba(255,153,51,0.6)" }} />
            <div className="absolute w-[348px] h-[348px] rounded-full border-[6px]"
              style={{ borderColor: "rgba(255,255,255,0.85)", boxShadow: "0 0 20px rgba(255,255,255,0.2)" }} />
            <div className="absolute w-[316px] h-[316px] rounded-full border-[6px]"
              style={{ borderColor: "rgba(19,136,8,0.6)" }} />
            <div className="absolute w-[276px] h-[276px] rounded-full border-[3px] border-dashed"
              style={{ borderColor: "rgba(19,136,8,0.3)", animation: "spin 20s linear infinite" }} />

            {/* Rotating Ashoka Chakra */}
            <div
              className="relative w-[230px] h-[230px] flex items-center justify-center"
              style={{ animation: "spin 10s linear infinite" }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 18px rgba(0,0,128,0.35))" }}>
                {/* Chakra main ring */}
                <circle cx="100" cy="100" r="80" fill="rgba(0,0,128,0.06)" stroke="#000080" strokeWidth="4"/>
                {/* Inner hub */}
                <circle cx="100" cy="100" r="14" fill="#000080"/>
                <circle cx="100" cy="100" r="6" fill="white"/>
                {/* 24 spokes with dot tips */}
                {SPOKES.map((s, i) => (
                  <g key={i}>
                    <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                      stroke="#000080" strokeWidth="2.2" strokeLinecap="round" opacity="0.9"/>
                    <circle cx={s.cx} cy={s.cy} r="3" fill="#000080" opacity="0.9"/>
                  </g>
                ))}
              </svg>
            </div>

            {/* Floating stat badges */}
            <div
              className="absolute top-2 left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-orange-100"
              style={{ boxShadow: "0 8px 32px rgba(255,153,51,0.2)" }}
            >
              <div className="text-2xl font-black text-slate-900">1500+</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Schemes Indexed</div>
            </div>

            <div
              className="absolute bottom-2 right-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-green-100"
              style={{ boxShadow: "0 8px 32px rgba(19,136,8,0.18)" }}
            >
              <div className="text-2xl font-black text-slate-900">₹2L Cr</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Unclaimed Yearly</div>
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-2xl px-4 py-3 shadow-lg border border-blue-100"
              style={{ boxShadow: "0 8px 32px rgba(0,0,128,0.12)" }}
            >
              <div className="text-2xl font-black" style={{ color: "#000080" }}>&lt; 2 min</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Time to Match</div>
            </div>

            {/* Made for Bharat pill */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-2 whitespace-nowrap">
              <span className="text-base">🇮🇳</span>
              <span className="text-white text-sm font-bold tracking-wide">Made for Bharat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
