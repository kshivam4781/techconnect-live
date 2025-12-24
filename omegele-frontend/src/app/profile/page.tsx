"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const TOPIC_OPTIONS = [
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
  { label: "Career Growth", trending: false },
  { label: "Mentorship", trending: false },
  { label: "Networking", trending: false },
  { label: "Getting into Tech", trending: true },
  { label: "Learning to Code", trending: false },
  { label: "Bootcamps", trending: false },
  { label: "Self-Teaching", trending: false },
  { label: "Online Learning", trending: false },
  { label: "Hiring", trending: false },
  { label: "Recruiting", trending: false },
  { label: "Team Building", trending: false },
  { label: "Company Culture", trending: false },
  { label: "People Management", trending: false },
  { label: "Tech Writing", trending: false },
  { label: "Content Creation", trending: false },
  { label: "Speaking", trending: false },
  { label: "Conferences", trending: false },
  { label: "Community Building", trending: false },
  { label: "Industry Trends", trending: true },
  { label: "Tech News", trending: false },
  { label: "Future of Technology", trending: false },
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
    email: string | null;
    image: string | null;
    initialConversationDuration: number | null;
    showName: boolean | null;
    termsAcceptedAt: string | null;
  } | null;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<UserResponse["user"]>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [seniority, setSeniority] = useState<string | null>(null);
  const [goals, setGoals] = useState<string>("");
  const [initialConversationDuration, setInitialConversationDuration] = useState<number>(60);
  const [showName, setShowName] = useState<boolean>(true);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState<boolean>(false);

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
          // Clamp conversation duration between 60-300 seconds
          const duration = data.user.initialConversationDuration ?? 60;
          setInitialConversationDuration(Math.max(60, Math.min(300, duration)));
          setShowName(data.user.showName ?? true);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status, session]);

  const toggleTopic = (topicLabel: string) => {
    setTopics((prev) =>
      prev.includes(topicLabel)
        ? prev.filter((t) => t !== topicLabel)
        : [...prev, topicLabel],
    );
  };

  const handleAcceptTerms = async () => {
    if (isAcceptingTerms || !session) return;

    try {
      setIsAcceptingTerms(true);
      setError(null);

      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acceptTerms: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to accept terms");
      }

      const data = await response.json();
      setUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error accepting terms:", err);
      setError(err.message || "Failed to accept terms. Please try again.");
    } finally {
      setIsAcceptingTerms(false);
    }
  };

  const handleSave = async () => {
    if (!session) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
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
          initialConversationDuration,
          showName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center">
        <p className="text-sm text-[#9aa2c2]">Loading your profile…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center px-4">
        <div className="max-w-md space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 text-center">
          <h1 className="text-xl font-semibold">Sign in to manage your profile</h1>
          <p className="text-sm text-[#9aa2c2]">
            TechConnect Live uses GitHub to verify you&apos;re a real person.
            Sign in to view and manage your profile settings.
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

  const sessionUser = session.user;

  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8] px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Profile & Settings
          </h1>
          <p className="mt-2 text-sm text-[#9aa2c2]">
            Manage your profile information, preferences, and account settings.
          </p>
        </div>

        {/* Overview Section */}
        <div className="rounded-2xl border border-[#272f45] bg-gradient-to-br from-[#0b1018] to-[#050816] p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
              Your Profile Overview
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#343d55] bg-[#050816]/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-[#9aa2c2]">
                Conversation Duration
              </p>
              <p className="mt-1 text-lg font-semibold text-[#f8f3e8]">
                {initialConversationDuration}s
              </p>
              <p className="mt-0.5 text-[10px] text-[#64748b]">
                Max: 60 seconds
              </p>
            </div>
            <div className="rounded-xl border border-[#343d55] bg-[#050816]/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-[#9aa2c2]">
                Name Visibility
              </p>
              <p className="mt-1 text-lg font-semibold text-[#f8f3e8]">
                {showName ? "Visible" : "Hidden"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#64748b]">
                {showName ? "Others can see your name" : "Name is hidden"}
              </p>
            </div>
            <div className="rounded-xl border border-[#343d55] bg-[#050816]/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-[#9aa2c2]">
                Selected Topics
              </p>
              <p className="mt-1 text-lg font-semibold text-[#f8f3e8]">
                {topics.length}
              </p>
              <p className="mt-0.5 text-[10px] text-[#64748b]">
                {topics.length > 0 ? "Topics selected" : "No topics selected"}
              </p>
            </div>
            <div className="rounded-xl border border-[#343d55] bg-[#050816]/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-[#9aa2c2]">
                Seniority Level
              </p>
              <p className="mt-1 text-lg font-semibold text-[#f8f3e8]">
                {seniority
                  ? SENIORITY_OPTIONS.find((s) => s.value === seniority)?.label.split(" / ")[0] || "Not set"
                  : "Not set"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#64748b]">
                {seniority ? "Level configured" : "Configure below"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)]">
          {/* Account Info */}
          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2] mb-3">
                Account Information
              </p>
              <div className="flex items-center gap-4">
                {sessionUser?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sessionUser.image}
                    alt={sessionUser.name ?? "Avatar"}
                    className="h-12 w-12 rounded-full border border-[#343d55] object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#343d55] bg-[#111827] text-sm font-semibold">
                    {(sessionUser?.name || sessionUser?.email || "?")
                      .toString()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">
                    {sessionUser?.name || "GitHub user"}
                  </p>
                  {sessionUser?.email && (
                    <p className="text-xs text-[#9aa2c2]">{sessionUser.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#c5cbe6]">
              <p className="font-medium text-[#f8f3e8]">Sign-in details</p>
              <p>
                Provider: <span className="font-semibold">GitHub</span>
              </p>
              <p>
                Status:{" "}
                <span className="font-semibold text-[#bef264]">Verified</span>
              </p>
            </div>

            {/* Terms and Conditions Section */}
            <div className="mt-4 pt-4 border-t border-[#272f45]">
              <p className="text-xs font-medium text-[#f8f3e8] mb-3">Legal Agreements</p>
              {user?.termsAcceptedAt ? (
                <div className="space-y-2 rounded-xl border border-[#bef264]/30 bg-[#1a2b16]/30 p-3">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-[#bef264] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#bef264] mb-1">
                        Terms and Conditions Accepted
                      </p>
                      <p className="text-[11px] text-[#c5cbe6] mb-2">
                        Accepted on:{" "}
                        <span className="font-semibold text-[#f8f3e8]">
                          {new Date(user.termsAcceptedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {" at "}
                        <span className="font-semibold text-[#f8f3e8]">
                          {new Date(user.termsAcceptedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </p>
                      <p className="text-[10px] text-[#9aa2c2] mb-2">
                        You have accepted our Terms & Conditions, Privacy Policy, Acceptable Use Policy, and Cookie Policy.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Terms & Conditions
                        </a>
                        <span className="text-[#64748b]">•</span>
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Privacy Policy
                        </a>
                        <span className="text-[#64748b]">•</span>
                        <a
                          href="/acceptable-use"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Acceptable Use
                        </a>
                        <span className="text-[#64748b]">•</span>
                        <a
                          href="/cookies"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Cookie Policy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-red-400 mb-1">
                        Terms and Conditions Not Accepted
                      </p>
                      <p className="text-[11px] text-red-300/90 mb-3">
                        You must accept our Terms and Conditions, Privacy Policy, Acceptable Use Policy, and Cookie Policy to use this service.
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={handleAcceptTerms}
                          disabled={isAcceptingTerms}
                          className="w-full inline-flex items-center justify-center rounded-full bg-[#ffd447] px-4 py-2 text-xs font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15] active:shadow-[0_0_30px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAcceptingTerms ? "Accepting..." : "Accept Terms and Conditions"}
                        </button>
                        <p className="text-[10px] text-[#9aa2c2] text-center">
                          By accepting, you agree to our{" "}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Terms and Conditions
                          </a>
                          ,{" "}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Privacy Policy
                          </a>
                          ,{" "}
                          <a href="/acceptable-use" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Acceptable Use Policy
                          </a>
                          , and{" "}
                          <a href="/cookies" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Cookie Policy
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#343d55]">
              <button
                onClick={() => signOut()}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-4 text-xs font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            {/* Topics */}
            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Topics you care about</p>
                  <p className="text-xs text-[#9aa2c2]">
                    Select topics to help us match you with relevant conversations.
                  </p>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  {topics.length} selected
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 max-h-64 overflow-y-auto">
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

            {/* Seniority */}
            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <p className="text-sm font-medium">Your current level</p>
              <p className="text-xs text-[#9aa2c2]">
                This helps us match you with people at a similar stage.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
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

            {/* Goals */}
            <section className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <p className="text-sm font-medium">What do you hope to get out of this?</p>
              <p className="text-xs text-[#9aa2c2]">
                Optional, but it helps us understand your goals and find better matches.
              </p>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-[#3b435a] bg-[#050816] px-3 py-2 text-xs text-[#e5e7eb] outline-none focus:border-[#ffd447]"
                placeholder='e.g. "Mock interviews for backend roles", "Honest feedback on startup ideas", "Chat with other self-taught devs"'
              />
            </section>

            {/* Conversation Configuration */}
            <section className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
              <div>
                <p className="text-sm font-medium">Conversation Settings</p>
                <p className="text-xs text-[#9aa2c2]">
                  Configure how your initial conversations work.
                </p>
              </div>

              {/* Initial Conversation Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#f8f3e8]">
                    Initial conversation duration
                  </label>
                  <span className="text-xs text-[#9aa2c2]">
                    {initialConversationDuration} seconds
                  </span>
                </div>
                <p className="text-[11px] text-[#9aa2c2]">
                  How long should your initial conversation be? (60 seconds - 5 minutes)
                </p>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="60"
                    max="300"
                    step="15"
                    value={initialConversationDuration}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setInitialConversationDuration(Math.max(60, Math.min(300, value)));
                    }}
                    className="w-full h-2 bg-[#050816] rounded-lg appearance-none cursor-pointer accent-[#ffd447]"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748b]">
                    <span>60s</span>
                    <span>120s</span>
                    <span>180s</span>
                    <span>240s</span>
                    <span>300s</span>
                  </div>
                </div>
              </div>

              {/* Show Name Toggle */}
              <div className="space-y-2 pt-2 border-t border-[#343d55]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-[#f8f3e8]">
                      Show your name to matched users
                    </label>
                    <p className="text-[11px] text-[#9aa2c2] mt-1">
                      When enabled, your name will be visible to people you&apos;re matched with.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowName(!showName)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showName ? "bg-[#bef264]" : "bg-[#3b435a]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showName ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="space-y-3">
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-[#bef264]/50 bg-[#bef264]/10 p-3 text-sm text-[#bef264]">
                  Profile updated successfully!
                </div>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="w-full inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


