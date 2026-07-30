"use client"

import { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, ArrowRight, Lock } from "lucide-react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth"

function LoginContent() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMockLogin = () => {
    const redirect = searchParams.get("redirect")
    if (redirect === "chat-results") {
      router.push("/chat?mode=results")
    } else {
      router.push("/")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      // Redirect based on previous flow
      handleMockLogin()
    } catch (error) {
      console.error("Error signing in with Google", error)
      alert("Failed to sign in with Google. Please try again.")
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !passwordInput || (isRegistering && !nameInput)) {
      setMessage("Please fill out all required fields.")
      return
    }
    setIsLoading(true)
    setMessage("")

    try {
      if (isRegistering) {
        // Create new account
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        await updateProfile(userCredential.user, { displayName: nameInput })
        
        // Send Verification Email and immediately sign them out
        await sendEmailVerification(userCredential.user)
        await signOut(auth)
        
        // Reset form and tell them to check email
        setMessage("Account created! We've sent a verification link to your email. Please verify before signing in.")
        setIsRegistering(false)
        setPasswordInput("")
      } else {
        // Sign in to existing account
        const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput)
        
        // Enforce Email Verification
        if (!userCredential.user.emailVerified) {
          await signOut(auth)
          setMessage("Please verify your email before logging in. Check your inbox or spam folder for the link.")
          return
        }
        
        handleMockLogin()
      }
    } catch (error: any) {
      console.error("Auth error", error)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setMessage("Invalid email or password. Please try again.")
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage("This email is already in use. Try signing in instead.")
      } else if (error.code === 'auth/weak-password') {
        setMessage("Password should be at least 6 characters.")
      } else {
        setMessage(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B2B]/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md mx-auto p-6 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900">Welcome to JanSetu AI</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to save your eligible schemes</p>
          </div>

          <div className="space-y-4">
            {/* Social Logins */}
            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-bold text-slate-700">Continue with Google</span>
            </button>

            <button onClick={handleMockLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-black rounded-2xl hover:bg-slate-900 transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.5-.83 1.63-.04 3.02.69 3.86 1.83-3.23 1.93-2.68 5.96.44 7.23-.74 1.76-1.57 3.26-2.88 4.63zm-4.32-13.6c-.23-1.89 1.25-3.66 3.09-4.04.38 2.1-1.47 3.84-3.09 4.04z" />
              </svg>
              <span className="text-sm font-bold text-white">Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Toggle between Sign In and Register */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => {setIsRegistering(false); setMessage("");}}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {setIsRegistering(true); setMessage("");}}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Create Account
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 text-sm font-semibold rounded-xl text-center border ${message.includes("Invalid") || message.includes("least") || message.includes("already") || message.includes("required") ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
              {message}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    required={isRegistering}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password (min 6 chars)"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-white font-bold rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF6B2B 0%, #f59e0b 100%)", boxShadow: "0 4px 14px rgba(255,107,43,0.3)" }}>
              {isLoading ? "Processing..." : (isRegistering ? "Create Account" : "Sign In")} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400 mt-8 font-medium">
            By continuing, you agree to JanSetu's <br />
            <Link href="/terms" className="text-[#FF6B2B] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#FF6B2B] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
