import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GradientBar } from "@/components/ui/gradient-bar"

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Terms of Service</h1>
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-500 mb-8">Last updated: June 2026</p>
            
            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing and using JanSetu AI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 mb-4">
              JanSetu AI provides an AI-powered discovery platform to help Indian citizens identify government welfare schemes they may be eligible for. We do not process applications or guarantee eligibility, approval, or disbursement of funds for any scheme.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">3. Accuracy of Information</h2>
            <p className="text-slate-600 mb-4">
              While we strive to keep our database of 1500+ schemes updated and accurate, government policies and eligibility criteria change frequently. The recommendations provided by JanSetu AI are for informational purposes only. You must verify all details on the official government portals before applying.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">4. No Affiliation</h2>
            <p className="text-slate-600 mb-4">
              JanSetu AI is an independent technology platform. We are not affiliated with, endorsed by, or sponsored by the Government of India or any State Government.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">5. Limitation of Liability</h2>
            <p className="text-slate-600 mb-4">
              JanSetu AI shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <GradientBar />
    </>
  )
}
