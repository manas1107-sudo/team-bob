"use client"

import Link from "next/link"
import { ArrowUpRight, Lock } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"

const schemes = [
  {
    id: 1,
    title: "PM-KISAN",
    category: "Agriculture",
    description: "Pradhan Mantri Kisan Samman Nidhi — ₹6,000/year income support directly to farmers.",
    tags: ["Farmers", "Direct Benefit", "Agriculture"],
    benefit: "₹6,000 / year",
    link: "https://pmkisan.gov.in/",
  },
  {
    id: 2,
    title: "Ayushman Bharat PM-JAY",
    category: "Healthcare",
    description: "Health insurance cover of up to ₹5 lakh per family per year for low-income households.",
    tags: ["Healthcare", "Insurance", "Low Income"],
    benefit: "₹5,00,000 / year",
    link: "https://pmjay.gov.in/",
  },
  {
    id: 3,
    title: "Post Matric Scholarship (SC)",
    category: "Education",
    description: "Financial assistance covering tuition, maintenance allowance for SC students after 10th.",
    tags: ["Education", "Scholarship", "SC"],
    benefit: "₹12,000 / year",
    link: "https://scholarships.gov.in/",
  },
  {
    id: 4,
    title: "CGTMSE — MSME Loan",
    category: "Business",
    description: "Collateral-free credit up to ₹2 Crore for micro and small enterprises & startups.",
    tags: ["Business", "Startup", "Loan"],
    benefit: "Up to ₹2 Crore",
    link: "https://www.cgtmse.in/",
  },
]

export function SelectedWorks() {
  return (
    <section id="works" className="py-20 md:py-10 md:pt-32 pb-4">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Featured schemes
          </SectionTitle>
          <Link
            href="/schemes"
            className="hidden md:inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#FF6B2B" }}
          >
            View all schemes
            <ArrowUpRight className="w-4 h-4" style={{ color: "#FF6B2B" }} />
          </Link>
        </div>

        <div className="relative">
          {schemes.map((scheme, index) => (
            <div
              key={scheme.id}
              className="sticky"
              style={{ top: `${70 + index * 0}px`, zIndex: index + 1 }}
            >
              <Link href="/login" className="group block pt-10">
                <article className="overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Color bar */}
                  <div className="h-2 w-full" style={{ background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)" }} />

                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{scheme.category}</span>
                        <h3 className="text-xl md:text-2xl font-semibold mt-1">{scheme.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{scheme.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Benefit</div>
                        <div className="text-lg font-bold mt-1" style={{ color: "#FF6B2B" }}>{scheme.benefit}</div>
                        <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#FF6B2B" }}>
                          <Lock className="w-4 h-4 mr-1" />
                          <span className="text-xs font-bold">Sign In to View</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {scheme.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full hover:bg-secondary transition-colors"
            style={{ color: "#FF6B2B", borderColor: "#FF6B2B" }}
          >
            View all schemes
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
