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
      <div className="min-h-screen bg-[#0b1018] text-[#f8f3e8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-[#ffd447] border-t-transparent" />
          <p className="text-sm text-[#d3dcec]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0b1018] text-[#f8f3e8]">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-[#343d55] bg-[#050816] p-8 text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd447]/10 border border-[#ffd447]">
              <svg className="h-8 w-8 text-[#ffd447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#f8f3e8]">
              Sign In Required
            </h2>
            <p className="text-sm text-[#d3dcec]">
              Please sign in to submit feedback. This helps us identify you and respond to your feedback appropriately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => signIn("github")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
              >
                Sign In with GitHub
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-6 text-sm font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
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
    <div className="min-h-screen bg-[#0b1018] text-[#f8f3e8]">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Share Your Feedback
            </h1>
            <p className="text-sm text-[#d3dcec] max-w-md mx-auto">
              We value your input and are constantly working to improve TechConnect Live. 
              Your feedback helps us grow and serve you better.
            </p>
            <p className="text-xs text-[#9aa2c2] mt-2">
              For direct inquiries, contact us at{" "}
              <a 
                href="mailto:noreply@mail.vinamah.com" 
                className="text-[#ffd447] hover:underline"
              >
                noreply@mail.vinamah.com
              </a>
            </p>
          </div>

          {submitStatus === "success" ? (
            <div className="rounded-2xl border border-[#bef264] bg-[#050816] p-6 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#bef264] text-[#0b1018]">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#f8f3e8]">
                Thank You!
              </h2>
              <p className="text-sm text-[#d3dcec]">
                We really appreciate you taking out time to do this for us. We will grow and one day we will be huge, and we will remember you then.
              </p>
              <p className="text-xs text-[#9aa2c2]">
                Redirecting to home page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-[#343d55] bg-[#050816] p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#f8f3e8] mb-2">
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
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                          category === option.value
                            ? "border-[#ffd447] bg-[#ffd447]/10 text-[#ffd447]"
                            : "border-[#343d55] bg-[#0b1018] text-[#d3dcec] hover:border-[#6471a3] hover:bg-[#151f35]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {category === "technical" && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-[#f8f3e8] mb-2">
                      Which Page? <span className="text-[#ffd447]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pageOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTechnicalPage(option.value)}
                          className={`rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition ${
                            technicalPage === option.value
                              ? "border-[#ffd447] bg-[#ffd447]/10 text-[#ffd447]"
                              : "border-[#343d55] bg-[#0b1018] text-[#d3dcec] hover:border-[#6471a3] hover:bg-[#151f35]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#f8f3e8] mb-2">
                    Your Feedback <span className="text-[#ffd447]">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share your thoughts, suggestions, or describe the issue you're experiencing..."
                    rows={6}
                    className="w-full rounded-lg border border-[#343d55] bg-[#0b1018] px-4 py-3 text-sm text-[#f8f3e8] placeholder:text-[#9aa2c2] focus:border-[#ffd447] focus:outline-none focus:ring-1 focus:ring-[#ffd447] resize-none"
                    required
                  />
                  <p className="mt-2 text-xs text-[#9aa2c2]">
                    {message.length} characters
                  </p>
                </div>
              </div>

              {submitStatus === "error" && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  Something went wrong. Please try again later.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !category || !message.trim() || (category === "technical" && !technicalPage)}
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-6 text-sm font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

