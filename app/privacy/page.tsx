import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GradientBar } from "@/components/ui/gradient-bar"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Privacy Policy</h1>
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-500 mb-8">Last updated: June 2026</p>
            
            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 mb-4">
              At JanSetu AI, we only collect the information necessary to match you with appropriate government schemes. This includes non-personally identifiable demographic data such as your state, occupation category, income bracket, and social category.
            </p>
            <p className="text-slate-600 mb-4">
              We do not ask for or store sensitive personal identifiers like Aadhaar numbers, PAN cards, or bank account details.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">2. How We Use Your Data</h2>
            <p className="text-slate-600 mb-4">
              The demographic information you provide is processed in real-time by our recommendation engine (GraphSAGE + PyTorch) to query our database of government schemes. Your inputs are used strictly for matching purposes and are discarded after your session ends.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">3. Data Sharing</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, rent, or share your data with any third parties. JanSetu AI is an independent discovery tool, and we do not transmit your profile data to government portals. You will apply for schemes directly on the respective official government websites.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">4. Security</h2>
            <p className="text-slate-600 mb-4">
              We implement industry-standard security measures to protect the integrity of our platform. However, since we do not store personal profiles or require accounts, there is no risk of personal data breaches.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">5. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@jansetu.ai.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <GradientBar />
    </>
  )
}
