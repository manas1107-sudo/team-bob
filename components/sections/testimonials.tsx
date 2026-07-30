"use client"

import { useState } from "react"
import { SectionTitle } from "@/components/ui/section-title"

const testimonials = [
  {
    id: 1,
    quote: "I had no idea I qualified for PM-KISAN. JanSetu found it in under a minute and gave me the direct link to apply. I've already received my first installment.",
    author: "Ramesh Kumar",
    role: "Farmer, Uttar Pradesh",
    blurColor: "bg-blue-500",
  },
  {
    id: 2,
    quote: "My mother was eligible for Ayushman Bharat but we never knew. JanSetu matched her profile instantly and now she has ₹5 lakh health cover.",
    author: "Priya Sharma",
    role: "Teacher, Rajasthan",
    blurColor: "bg-purple-500",
  },
  {
    id: 3,
    quote: "As an SC student, I found three scholarships I was eligible for. The AI explained exactly why I qualified for each one. Brilliant product.",
    author: "Arjun Meena",
    role: "Student, Madhya Pradesh",
    blurColor: "bg-pink-500",
  },
  {
    id: 4,
    quote: "I started a small business last year. JanSetu found a CGTMSE collateral-free loan scheme I had never heard of. It changed everything.",
    author: "Sunita Devi",
    role: "Small Business Owner, Bihar",
    blurColor: "bg-emerald-500",
  },
  {
    id: 5,
    quote: "My whole village uses it now. In our panchayat we helped 40 families discover schemes they never knew existed. Government benefits finally reaching us.",
    author: "Pankaj Thakur",
    role: "Gram Pradhan, Himachal Pradesh",
    blurColor: "bg-orange-500",
  },
  {
    id: 6,
    quote: "The Explainable AI feature is incredible. It doesn't just tell you what you qualify for — it tells you exactly WHY. Transparent and trustworthy.",
    author: "Dr. Anjali Rao",
    role: "Policy Researcher, Delhi",
    blurColor: "bg-cyan-500",
  },
  {
    id: 7,
    quote: "I filled in 5 simple questions and got a list of 8 schemes. The benefit estimate alone was over ₹50,000 a year. Couldn't believe it was free.",
    author: "Mohammad Farhan",
    role: "Daily Wage Worker, Maharashtra",
    blurColor: "bg-rose-500",
  },
]

export function Testimonials() {
  const [isPaused, setIsPaused] = useState(false)

  const duplicatedTestimonials = [...testimonials, ...testimonials]
  const duplicatedTestimonialsReverse = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]
  const mobileTestimonials = testimonials.slice(0, 6)

  return (
    <section id="testimonials" className="py-20 border-border overflow-hidden md:py-32 border-t-[0] pb-0 relative">
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20 hidden lg:block" />

      <div className="hidden lg:block pl-6 md:pl-12">
        <div className="mb-12 md:mb-16 max-w-[1280px]">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            What citizens say
          </SectionTitle>
        </div>

        <div className="relative mb-6">
          <div
            className="flex gap-6 animate-scroll-left"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.id}-${index}`}
                className="relative flex-shrink-0 w-[85vw] md:w-[400px] p-6 md:p-8 border bg-card hover:shadow-lg transition-shadow overflow-hidden border-zinc-100 md:px-6 md:py-6 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)" }}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <blockquote className="text-base leading-relaxed font-semibold text-zinc-950 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                <div
                  className={`absolute -bottom-12 -right-12 w-48 h-48 ${testimonial.blurColor} rounded-full opacity-10`}
                  style={{ filter: "blur(72px)" }}
                />
              </article>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="flex gap-6 animate-scroll-right"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {duplicatedTestimonialsReverse.map((testimonial, index) => (
              <article
                key={`reverse-${testimonial.id}-${index}`}
                className="relative flex-shrink-0 w-[85vw] md:w-[400px] p-6 md:p-8 border bg-card hover:shadow-lg transition-shadow overflow-hidden border-zinc-100 md:px-6 md:py-6 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)" }}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <blockquote className="text-base leading-relaxed font-semibold text-zinc-950 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                <div
                  className={`absolute -bottom-12 -right-12 w-48 h-48 ${testimonial.blurColor} rounded-full opacity-10`}
                  style={{ filter: "blur(72px)" }}
                />
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            What citizens say
          </SectionTitle>
        </div>

        <div className="relative">
          {mobileTestimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="sticky pt-10" style={{ top: `${70 + index * 0}px`, zIndex: index + 1 }}>
              <article className="relative p-6 md:p-8 border bg-card transition-shadow overflow-hidden border-zinc-100 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)" }}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <blockquote className="text-base leading-relaxed font-semibold text-zinc-950 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                <div
                  className={`absolute -bottom-12 -right-12 w-48 h-48 ${testimonial.blurColor} rounded-full opacity-10`}
                  style={{ filter: "blur(72px)" }}
                />
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-10 lg:hidden" />
    </section>
  )
}
