"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const TOPIC_OPTIONS = [
  "Backend",
  "Frontend",
  "AI/ML",
  "DevOps",
  "Startups",
  "Interviews",
  "Career advice",
  "Open source",
];

const SENIORITY_OPTIONS = [
  { value: "STUDENT", label: "Student / self-taught" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "STAFF_LEAD", label: "Staff / Lead" },
  { value: "EXEC", label: "Manager / Exec" },
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
  } | null;
};

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserResponse["user"]>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [seniority, setSeniority] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("");
  const [goals, setGoals] = useState<string>("");

  const localTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  }, []);

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
          setTimezone(data.user.timezone || localTimezone || "");
          setGoals(data.user.goals || "");

          if (data.user.onboarded) {
            router.push("/");
          }
        } else {
          setTimezone(localTimezone || "");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status, session, router, localTimezone]);

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const handleSubmit = async () => {
    if (!session) {
      await signIn("github");
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics,
          seniority,
          timezone,
          goals: goals.trim() || null,
        }),
      });
      router.push("/");
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
                </div>
                <p className="text-[11px] text-[#64748b]">
                  {topics.length > 0
                    ? `${topics.length} selected`
                    : "Choose at least 1–2"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {TOPIC_OPTIONS.map((topic) => {
                  const active = topics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition ${
                        active
                          ? "border-[#bef264] bg-[#1a2b16] text-[#e4ffb5]"
                          : "border-[#3b435a] bg-[#050816] text-[#d3dcec] hover:border-[#6471a3]"
                      }`}
                    >
                      {topic}
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
              <p className="text-sm font-medium">Time zone & goals</p>
              <p className="text-xs text-[#9aa2c2]">
                Optional, but it helps us avoid impossible matches.
              </p>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr),minmax(0,1.4fr)]">
                <div className="space-y-2 text-xs">
                  <label className="block text-[11px] text-[#9aa2c2]">
                    Time zone
                  </label>
                  <input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-md border border-[#3b435a] bg-[#050816] px-3 py-2 text-xs text-[#e5e7eb] outline-none focus:border-[#ffd447]"
                    placeholder="e.g. America/Los_Angeles"
                  />
                  {localTimezone && (
                    <button
                      type="button"
                      onClick={() => setTimezone(localTimezone)}
                      className="text-[11px] text-[#a5b4fc] hover:underline"
                    >
                      Use detected: {localTimezone}
                    </button>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <label className="block text-[11px] text-[#9aa2c2]">
                    What do you hope to get out of this? (optional)
                  </label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-[#3b435a] bg-[#050816] px-3 py-2 text-xs text-[#e5e7eb] outline-none focus:border-[#ffd447]"
                    placeholder="e.g. \"Mock interviews for backend roles\", \"Honest feedback on startup ideas\", \"Chat with other self‑taught devs\""
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#64748b]">
                You can change this later from your profile.
              </p>
              <button
                type="button"
                disabled={saving || topics.length === 0 || !seniority}
                onClick={handleSubmit}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save and continue"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


