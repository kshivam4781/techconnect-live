"use client";

import { useEffect, useState, useRef } from "react";
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
  
  // Track if we've done the initial load and the userId to prevent unnecessary refetches
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      hasLoadedRef.current = false;
      lastUserIdRef.current = null;
      return;
    }

    const userId = (session as any)?.userId;
    
    // Only fetch if:
    // 1. We haven't loaded yet, OR
    // 2. The userId actually changed (user switched accounts)
    if (hasLoadedRef.current && lastUserIdRef.current === userId) {
      return;
    }

    const fetchUser = async () => {
      // Only show loading state on initial load, not on refetches
      if (!hasLoadedRef.current) {
        setLoading(true);
      }
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          console.error("Failed to fetch user:", res.status, res.statusText);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          return;
        }
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
          
          // Mark as loaded and track userId
          hasLoadedRef.current = true;
          lastUserIdRef.current = userId;
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading your profile…</p>
      </div>
    );
  }

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
            <h1 className="text-2xl font-semibold text-slate-900">Sign in to manage your profile</h1>
            <p className="text-sm text-slate-600">
              Vinamah uses GitHub to verify you&apos;re a real person.
              Sign in to view and manage your profile settings.
            </p>
            <button
              onClick={() => signIn("github")}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#facc15]"
            >
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sessionUser = session.user;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(190,242,100,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,212,71,0.1),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur mb-6">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
            Profile & Settings
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
            Manage Your Profile
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-200 leading-relaxed">
            Customize your preferences, topics, and conversation settings to get better matches.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Overview Section */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 mb-8 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your Profile Overview
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Conversation Duration
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {initialConversationDuration}s
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Max: 60 seconds
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Name Visibility
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {showName ? "Visible" : "Hidden"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {showName ? "Others can see your name" : "Name is hidden"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Selected Topics
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {topics.length}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {topics.length > 0 ? "Topics selected" : "No topics selected"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Seniority Level
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {seniority
                  ? SENIORITY_OPTIONS.find((s) => s.value === seniority)?.label.split(" / ")[0] || "Not set"
                  : "Not set"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {seniority ? "Level configured" : "Configure below"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)]">
          {/* Account Info */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                Account Information
              </p>
              <div className="flex items-center gap-4">
                {sessionUser?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sessionUser.image}
                    alt={sessionUser.name ?? "Avatar"}
                    className="h-12 w-12 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700">
                    {(sessionUser?.name || sessionUser?.email || "?")
                      .toString()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {sessionUser?.name || "GitHub user"}
                  </p>
                  {sessionUser?.email && (
                    <p className="text-xs text-slate-600">{sessionUser.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-medium text-slate-900">Sign-in details</p>
              <p>
                Provider: <span className="font-semibold">GitHub</span>
              </p>
              <p>
                Status:{" "}
                <span className="font-semibold text-green-600">Verified</span>
              </p>
            </div>

            {/* Terms and Conditions Section */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-900 mb-3">Legal Agreements</p>
              {user?.termsAcceptedAt ? (
                <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-green-700 mb-1">
                        Terms and Conditions Accepted
                      </p>
                      <p className="text-[11px] text-slate-600 mb-2">
                        Accepted on:{" "}
                        <span className="font-semibold text-slate-900">
                          {new Date(user.termsAcceptedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {" at "}
                        <span className="font-semibold text-slate-900">
                          {new Date(user.termsAcceptedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 mb-2">
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
                        <span className="text-slate-400">•</span>
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Privacy Policy
                        </a>
                        <span className="text-slate-400">•</span>
                        <a
                          href="/acceptable-use"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ffd447] hover:underline"
                        >
                          Acceptable Use
                        </a>
                        <span className="text-slate-400">•</span>
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
                <div className="space-y-3 rounded-xl border border-red-300 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-red-700 mb-1">
                        Terms and Conditions Not Accepted
                      </p>
                      <p className="text-[11px] text-red-600 mb-3">
                        You must accept our Terms and Conditions, Privacy Policy, Acceptable Use Policy, and Cookie Policy to use this service.
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={handleAcceptTerms}
                          disabled={isAcceptingTerms}
                          className="w-full inline-flex items-center justify-center rounded-full bg-[#ffd447] px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAcceptingTerms ? "Accepting..." : "Accept Terms and Conditions"}
                        </button>
                        <p className="text-[10px] text-slate-500 text-center">
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

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => signOut()}
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            {/* Topics */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">Topics you care about</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Select topics to help us match you with relevant conversations.
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {topics.length} selected
                </p>
              </div>
              
              {/* Trending Topics Subsection */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd447]" />
                  <p className="text-xs font-medium text-slate-700">
                    Trending now
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.filter((topic) => topic.trending).map((topic) => {
                    const active = topics.includes(topic.label);
                    return (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() => toggleTopic(topic.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-[#ffd447] bg-[#ffd447]/10 text-slate-700 hover:border-[#facc15] hover:bg-[#ffd447]/20"
                        }`}
                      >
                        {topic.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Topics */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-700">
                  All topics
                </p>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {TOPIC_OPTIONS.filter((topic) => !topic.trending).map((topic) => {
                    const active = topics.includes(topic.label);
                    return (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() => toggleTopic(topic.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {topic.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Seniority */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div>
                <p className="text-base font-semibold text-slate-900">Your current level</p>
                <p className="text-sm text-slate-600 mt-1">
                  This helps us match you with people at a similar stage.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SENIORITY_OPTIONS.map((option) => {
                  const active = seniority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSeniority(option.value)}
                      className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                        active
                          ? "border-[#ffd447] bg-[#ffd447] text-slate-900 shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium text-sm">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Goals */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div>
                <p className="text-base font-semibold text-slate-900">What do you hope to get out of this?</p>
                <p className="text-sm text-slate-600 mt-1">
                  Optional, but it helps us understand your goals and find better matches.
                </p>
              </div>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#ffd447] focus:ring-2 focus:ring-[#ffd447] focus:ring-offset-0"
                placeholder='e.g. "Mock interviews for backend roles", "Honest feedback on startup ideas", "Chat with other self-taught devs"'
              />
            </section>

            {/* Conversation Configuration */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div>
                <p className="text-base font-semibold text-slate-900">Conversation Settings</p>
                <p className="text-sm text-slate-600 mt-1">
                  Configure how your initial conversations work.
                </p>
              </div>

              {/* Initial Conversation Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-900">
                    Initial conversation duration
                  </label>
                  <span className="text-xs text-slate-600">
                    {initialConversationDuration} seconds
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ffd447]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>60s</span>
                    <span>120s</span>
                    <span>180s</span>
                    <span>240s</span>
                    <span>300s</span>
                  </div>
                </div>
              </div>

              {/* Show Name Toggle */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-slate-900">
                      Show your name to matched users
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">
                      When enabled, your name will be visible to people you&apos;re matched with.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowName(!showName)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showName ? "bg-green-500" : "bg-slate-300"
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
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
                  Profile updated successfully!
                </div>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="w-full inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
