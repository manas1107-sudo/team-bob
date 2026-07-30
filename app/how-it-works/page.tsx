import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradientBar } from "@/components/ui/gradient-bar";
import { Brain, Database, FileText, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 font-sans flex flex-col pt-20">
      
      <div className="flex-1 max-w-[1000px] mx-auto px-6 md:px-12 py-20 w-full">
        <div className="mb-16">
          <div className="text-[#004FE5] text-[11px] font-bold uppercase tracking-widest mb-4">HOW IT WORKS</div>
          <h1 className="text-[48px] font-black text-slate-900 tracking-[-2px] leading-[1.1] mb-6">
            Like a wise friend who knows every government rule.
          </h1>
          <p className="text-[18px] text-slate-600 max-w-3xl leading-relaxed">
            We know that government offices, big forms, and difficult English words can be very confusing. Our goal is to make finding financial help as easy as talking to a friend in your own village. Here is exactly how we do all the hard work for you behind the scenes.
          </p>
        </div>

        <div className="space-y-16">
          
          <div className="mb-12">
            <h2 className="text-[24px] font-bold text-slate-900 tracking-[-0.5px] mb-6 flex items-center gap-4">
              <span className="w-[40px] h-[40px] rounded-full bg-[#004FE5]/10 text-[#004FE5] flex items-center justify-center font-black text-lg shrink-0">1</span>
              You tell us just four simple things about yourself
            </h2>
            <div className="text-[15px] text-slate-600 leading-relaxed ml-[56px] space-y-4">
              <p>
                When you go to a government office, they usually ask you to fill out many pages of forms and bring lots of paperwork before they even tell you if you can get money. We do not do that.
              </p>
              <p>
                We only ask you four very simple questions that you already know the answer to: What work do you do? (Are you a farmer, a student, or a daily wage worker?) What state do you live in? What is your category? And roughly how much does your family earn in a year? 
              </p>
              <p>
                You do not need to upload any documents, you do not need an Aadhar card right away, and you do not need to know any big words. It takes only 30 seconds to click the answers.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-[24px] font-bold text-slate-900 tracking-[-0.5px] mb-6 flex items-center gap-4">
              <span className="w-[40px] h-[40px] rounded-full bg-[#004FE5]/10 text-[#004FE5] flex items-center justify-center font-black text-lg shrink-0">2</span>
              We read thousands of confusing rulebooks instantly
            </h2>
            <div className="text-[15px] text-slate-600 leading-relaxed ml-[56px] space-y-4">
              <p>
                There are more than 1,500 different government schemes in India. Some are for building a house, some are for buying seeds, some are for your children's school, and some are for medical help. Every single one of these schemes has a long, confusing rulebook.
              </p>
              <p>
                Imagine having a team of 1,000 highly educated people who have memorized every single rule from the government. When you give us your four simple answers, our computer acts like that expert team. It takes your answers and instantly checks them against every single rule for all 1,500 schemes. 
              </p>
              <p>
                If a scheme is only for people in Kerala, and you live in Bihar, the computer automatically removes it. It does all this checking in just two seconds, saving you months of running around and asking questions.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-[24px] font-bold text-slate-900 tracking-[-0.5px] mb-6 flex items-center gap-4">
              <span className="w-[40px] h-[40px] rounded-full bg-[#004FE5]/10 text-[#004FE5] flex items-center justify-center font-black text-lg shrink-0">3</span>
              We find the exact schemes meant only for you
            </h2>
            <div className="text-[15px] text-slate-600 leading-relaxed ml-[56px] space-y-4">
              <p>
                We will never waste your time by showing you schemes you cannot get. If our computer finds 10 schemes that fit your exact life situation, we will show you exactly those 10. 
              </p>
              <p>
                Not only that, but we organize them for you. We look at which schemes will give you the most financial help, or which ones are the easiest to apply for, and we put those at the very top of the list so you see them first. We want to make sure you get the maximum amount of money and benefits that the government has kept aside for you.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-[24px] font-bold text-slate-900 tracking-[-0.5px] mb-6 flex items-center gap-4">
              <span className="w-[40px] h-[40px] rounded-full bg-[#004FE5]/10 text-[#004FE5] flex items-center justify-center font-black text-lg shrink-0">4</span>
              We show you why, and tell you where to go next
            </h2>
            <div className="text-[15px] text-slate-600 leading-relaxed ml-[56px] space-y-4">
              <p>
                We do not want you to just trust us blindly. When we tell you that you can get money for a new house or a farming tool, we show you exactly why. You will see clear green checkmarks on your screen saying "Yes, your income is correct" and "Yes, you do the right work for this."
              </p>
              <p>
                Most importantly, we protect you from middlemen who charge you money just to give you forms. Once you find the right scheme, we give you a direct link to the real government website. You or someone who helps you can click that link and apply directly, for free.
              </p>
            </div>
          </div>

        </div>
      </div>

      </main>

      <Footer />
      <GradientBar />
    </>
  );
}
