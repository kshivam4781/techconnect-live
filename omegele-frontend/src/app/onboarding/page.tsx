"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const TOPIC_OPTIONS = [
  // Technical & Engineering
  { label: "Backend Development", trending: false },
  { label: "Frontend Development", trending: false },
  { label: "Full-Stack Development", trending: false },
  { label: "AI/ML", trending: true },
  { label: "AI Research", trending: true },
  { label: "AI Implementation", trending: true },
  { label: "Machine Learning", trending: true },
  { label: "Deep Learning", trending: false },
  { label: "Data Science", trending: false },
  { label: "Data Engineering", trending: true },
  { label: "DevOps", trending: false },
  { label: "Cloud Computing", trending: false },
  { label: "Infrastructure", trending: false },
  { label: "Security", trending: false },
  { label: "Cybersecurity", trending: false },
  { label: "Mobile Development", trending: false },
  { label: "iOS Development", trending: false },
  { label: "Android Development", trending: false },
  { label: "Blockchain", trending: false },
  { label: "Web3", trending: false },
  { label: "Game Development", trending: false },
  { label: "Open Source", trending: false },
  { label: "System Design", trending: false },
  { label: "Software Architecture", trending: false },
  { label: "Distributed Systems", trending: false },
  { label: "Database Design", trending: false },
  { label: "API Design", trending: false },
  
  // Startup & Entrepreneurship
  { label: "Startups", trending: false },
  { label: "Entrepreneurship", trending: false },
  { label: "Venture Capital", trending: false },
  { label: "Fundraising", trending: false },
  { label: "Product Development", trending: false },
  { label: "Product Management", trending: false },
  { label: "Go-to-Market Strategy", trending: false },
  { label: "Business Strategy", trending: false },
  { label: "Marketing", trending: false },
  { label: "Indie Hacking", trending: false },
  
  // Career & Professional
  { label: "Career Growth", trending: false },
  { label: "Mentorship", trending: false },
  { label: "Networking", trending: false },
  { label: "Getting into Tech", trending: true },
  
  // Learning & Education
  { label: "Learning to Code", trending: false },
  { label: "Bootcamps", trending: false },
  { label: "Self-Teaching", trending: false },
  { label: "Online Learning", trending: false },
  
  // Hiring & Talent
  { label: "Hiring", trending: false },
  { label: "Recruiting", trending: false },
  { label: "Team Building", trending: false },
  { label: "Company Culture", trending: false },
  { label: "People Management", trending: false },
  
  // Content & Community
  { label: "Tech Writing", trending: false },
  { label: "Content Creation", trending: false },
  { label: "Speaking", trending: false },
  { label: "Conferences", trending: false },
  { label: "Community Building", trending: false },
  
  // Industry & Trends
  { label: "Industry Trends", trending: true },
  { label: "Tech News", trending: false },
  { label: "Future of Technology", trending: false },
  
  // Casual & Social
  { label: "Just Chatting", trending: false },
  { label: "Tech Enthusiasts", trending: false },
  { label: "Side Projects", trending: false },
  { label: "Life in Tech", trending: false },
];

const SENIORITY_OPTIONS = [
  { value: "STUDENT", label: "Student / Learning" },
  { value: "JUNIOR", label: "Junior / Entry-level" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "STAFF", label: "Staff / Principal" },
  { value: "MANAGER", label: "Manager / Lead" },
  { value: "FOUNDER", label: "Founder / Executive" },
  { value: "OTHER", label: "Other (HR, VC, Product, etc.)" },
];

type UserResponse = {
  user: {
    id: string;
    topics: string[];
    seniority: string | null;
    timezone: string | null;
    goals: string | null;
    onboarded: boolean;
    name: string | null;
    termsAcceptedAt: string | null;
  } | null;
};

export default function OnboardingPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse["user"]>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [seniority, setSeniority] = useState<string | null>(null);
  const [goals, setGoals] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/me");
        const data: UserResponse = await res.json();
        if (data.user) {
          setUser(data.user);
          setTopics(data.user.topics ?? []);
          setSeniority(data.user.seniority);
          setGoals(data.user.goals || "");
          // If user already accepted terms, set checkbox to checked
          if (data.user.termsAcceptedAt) {
            setTermsAccepted(true);
          }

          if (data.user.onboarded) {
            router.push("/");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status, session, router]);

  const toggleTopic = (topicLabel: string) => {
    setTopics((prev) =>
      prev.includes(topicLabel)
        ? prev.filter((t) => t !== topicLabel)
        : [...prev, topicLabel],
    );
  };

  const handleSubmit = async () => {
    if (!session) {
      await signIn("github");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics,
          seniority,
          goals: goals.trim() || null,
          acceptTerms: termsAccepted,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Verify the update was successful
      if (data.user && data.user.onboarded) {
        // Refresh the session to update the onboarded status
        await updateSession();
        // Force a page reload to refresh the session
        window.location.href = "/";
      } else {
        throw new Error("Update completed but onboarded status not set correctly");
      }
    } catch (err: any) {
      console.error("Error saving onboarding data:", err);
      setError(err.message || "Failed to save your data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Not signed in
  if (status !== "loading" && !session) {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center px-4">
        <div className="max-w-md space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 text-center">
          <h1 className="text-xl font-semibold">Let&apos;s get you set up</h1>
          <p className="text-sm text-[#9aa2c2]">
            Sign in with GitHub so we can tailor matches to what you want to
            talk about.
          </p>
          <button
            onClick={() => signIn("github")}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_30px_rgba(250,204,21,0.7)]"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8] px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa2c2]">
            Onboarding
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Tell us what kind of conversations you want.
          </h1>
          <p className="mt-2 text-sm text-[#9aa2c2]">
            We&apos;ll use this once you hit &quot;Start conversation&quot; to
            find people who actually match what you&apos;re here for.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 text-sm text-[#9aa2c2]">
            Loading your profile…
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Topics you care about</p>
                  <p className="text-xs text-[#9aa2c2]">
                    Pick a few. You can always change this later.
                  </p>
                  <p className="mt-1 text-[10px] text-[#64748b]">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd447]" />
                      Trending topics
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  {topics.length > 0
                    ? `${topics.length} selected`
                    : "Choose at least 1–2"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {TOPIC_OPTIONS.map((topic) => {
                  const active = topics.includes(topic.label);
                  return (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => toggleTopic(topic.label)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                        active
                          ? "border-[#bef264] bg-[#1a2b16] text-[#e4ffb5]"
                          : topic.trending
                          ? "border-[#ffd447] bg-[#18120b] text-[#fef9c3] hover:border-[#facc15]"
                          : "border-[#3b435a] bg-[#050816] text-[#d3dcec] hover:border-[#6471a3]"
                      }`}
                    >
                      {topic.trending && (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd447]" />
                      )}
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <p className="text-sm font-medium">Your current level</p>
              <p className="text-xs text-[#9aa2c2]">
                This just helps us roughly match you with people at a similar
                stage.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {SENIORITY_OPTIONS.map((option) => {
                  const active = seniority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSeniority(option.value)}
                      className={`flex flex-col items-start rounded-2xl border px-3 py-2 text-left text-xs transition ${
                        active
                          ? "border-[#ffd447] bg-[#18120b] text-[#fef9c3]"
                          : "border-[#3b435a] bg-[#050816] text-[#d3dcec] hover:border-[#6471a3]"
                      }`}
                    >
                      <span className="font-medium text-[12px]">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <p className="text-sm font-medium">What do you hope to get out of this?</p>
              <p className="text-xs text-[#9aa2c2]">
                Optional, but it helps us understand your goals and find better matches.
              </p>
              <div className="space-y-2 text-xs">
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-md border border-[#3b435a] bg-[#050816] px-3 py-2 text-xs text-[#e5e7eb] outline-none focus:border-[#ffd447]"
                  placeholder={
                    'e.g. "Mock interviews for backend roles", "Honest feedback on startup ideas", "Chat with other self-taught devs", "Network with founders and VCs", "Get advice on switching careers"'
                  }
                />
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <div className="space-y-3">
                <p className="text-sm font-medium">Terms and Conditions</p>
                <p className="text-xs text-[#9aa2c2]">
                  Please read and accept our terms and conditions to continue.
                </p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#3b435a] bg-[#050816] text-[#ffd447] focus:ring-2 focus:ring-[#ffd447] focus:ring-offset-0 focus:ring-offset-[#0b1018] cursor-pointer"
                  />
                  <span className="text-xs text-[#d3dcec] group-hover:text-[#f8f3e8]">
                    I have read and agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffd447] hover:underline"
                    >
                      Terms and Conditions
                    </a>
                    ,{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffd447] hover:underline"
                    >
                      Privacy Policy
                    </a>
                    ,{" "}
                    <a
                      href="/acceptable-use"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffd447] hover:underline"
                    >
                      Acceptable Use Policy
                    </a>
                    , and{" "}
                    <a
                      href="/cookies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffd447] hover:underline"
                    >
                      Cookie Policy
                    </a>
                    . I understand that I am using this service at my own risk.
                  </span>
                </label>
                {!termsAccepted && (
                  <p className="text-xs text-red-400">
                    You must accept the terms and conditions to create an account.
                  </p>
                )}
              </div>
            </section>

            <div className="space-y-3">
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#64748b]">
                  You can change this later from your profile.
                </p>
                <button
                  type="button"
                  disabled={saving || topics.length === 0 || !seniority || !termsAccepted}
                  onClick={handleSubmit}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save and continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


