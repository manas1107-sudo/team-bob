"use client"

import { SectionTitle } from "@/components/ui/section-title"

// Removed techStack array as per user request
const stats = [
  { value: "₹2L Cr", label: "Unclaimed Benefits Yearly" },
  { value: "100+", label: "Government Schemes" },
  { value: "2 min", label: "Time to Match" },
]

export function About() {
  return (
    <section id="about" className="py-20 border-border border-t-0 md:py-10 md:pb-32 md:pt-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
              Bridging citizens to the benefits they deserve
            </SectionTitle>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Every year, the Indian government allocates thousands of crores for welfare schemes — yet an estimated <strong>₹2 Lakh Crore goes unclaimed</strong> because people simply don't know what they qualify for.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              JanSetu AI fixes this. Our machine learning engine ingests your profile — occupation, income, state, category — and runs it against a live Knowledge Graph of 100+ active schemes. No guessing, no bureaucratic jargon. Just fast, accurate, actionable matches.
            </p>
          </div>

          <div>
            {/* Technology section removed for simplicity */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary rounded-2xl">
                  <div className="text-2xl md:text-3xl font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
