"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type FeedbackCategory = "general" | "technical" | "feature" | "bug" | "other";
type TechnicalPage = "searching" | "video-call" | "profile" | "onboarding" | "home" | "other";

export default function FeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [technicalPage, setTechnicalPage] = useState<TechnicalPage | "">("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-[#ffd447] border-t-transparent" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 text-center space-y-6 shadow-sm">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd447]/10 border border-[#ffd447]">
              <svg className="h-8 w-8 text-[#ffd447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Sign In Required
            </h2>
            <p className="text-sm text-slate-600">
              Please sign in to submit feedback. This helps us identify you and respond to your feedback appropriately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => signIn("github")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#facc15]"
              >
                Sign In with GitHub
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !message.trim()) {
      return;
    }

    if (category === "technical" && !technicalPage) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          technicalPage: category === "technical" ? technicalPage : null,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setCategory("");
        setTechnicalPage("");
        setMessage("");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageOptions: { value: TechnicalPage; label: string }[] = [
    { value: "searching", label: "Searching/Matching Page" },
    { value: "video-call", label: "Video Call Page" },
    { value: "profile", label: "Profile Page" },
    { value: "onboarding", label: "Onboarding Page" },
    { value: "home", label: "Home Page" },
    { value: "other", label: "Other Page" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(190,242,100,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,212,71,0.1),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#3b435a] bg-[#131827] px-4 py-2 text-sm font-medium text-[#d3dcec] shadow-sm backdrop-blur mb-6">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
            Share Your Feedback
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Help Us Improve
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#d3dcec] leading-relaxed">
            We value your input and are constantly working to improve Vinamah. 
            Your feedback helps us grow and serve you better.
          </p>
          <p className="mt-4 text-sm text-[#9aa2c2]">
            For direct inquiries, contact us at{" "}
            <a 
              href="mailto:noreply@mail.vinamah.com" 
              className="text-[#ffd447] hover:underline"
            >
              noreply@mail.vinamah.com
            </a>
          </p>
          
          {/* Contact Section */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/shivamsinghs/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-[#3b435a] bg-[#131827] px-6 py-3 text-sm font-medium text-[#d3dcec] shadow-sm backdrop-blur transition hover:border-[#ffd447] hover:bg-[#1a1f2e] hover:text-[#ffd447]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Shivam's LinkedIn</span>
            </a>
            <a
              href="https://wa.me/918840754203"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-[#3b435a] bg-[#131827] px-6 py-3 text-sm font-medium text-[#d3dcec] shadow-sm backdrop-blur transition hover:border-[#ffd447] hover:bg-[#1a1f2e] hover:text-[#ffd447]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>+91 8840754203</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-16">
        {submitStatus === "success" ? (
          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Thank You!
            </h2>
            <p className="text-base text-slate-600">
              We really appreciate you taking out time to do this for us. We will grow and one day we will be huge, and we will remember you then.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Feedback Category <span className="text-[#ffd447]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "general", label: "General" },
                    { value: "technical", label: "Technical Issue" },
                    { value: "feature", label: "Feature Request" },
                    { value: "bug", label: "Bug Report" },
                    { value: "other", label: "Other" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setCategory(option.value as FeedbackCategory);
                        if (option.value !== "technical") {
                          setTechnicalPage("");
                        }
                      }}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                        category === option.value
                          ? "border-[#ffd447] bg-[#ffd447] text-slate-900 shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:border-[#ffd447] hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {category === "technical" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Which Page? <span className="text-[#ffd447]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pageOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTechnicalPage(option.value)}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium text-left transition ${
                          technicalPage === option.value
                            ? "border-[#ffd447] bg-[#ffd447] text-slate-900 shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-[#ffd447] hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Your Feedback <span className="text-[#ffd447]">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please share your thoughts, suggestions, or describe the issue you're experiencing..."
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ffd447] focus:outline-none focus:ring-2 focus:ring-[#ffd447] focus:ring-offset-0 resize-none"
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  {message.length} characters
                </p>
              </div>
            </div>

            {submitStatus === "error" && (
              <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                Something went wrong. Please try again later.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !category || !message.trim() || (category === "technical" && !technicalPage)}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
