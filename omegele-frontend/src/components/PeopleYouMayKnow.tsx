"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface Connection {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    topics: string[];
    seniority: string | null;
    hasLinkedIn: boolean;
    hasGitHub: boolean;
    isOnline: boolean;
  };
  score: number;
  reasons: string[];
}

interface PeopleYouMayKnowData {
  connections: Connection[];
  currentUser: {
    hasLinkedIn: boolean;
    hasGitHub: boolean;
    emailDomain: string | null;
  };
}

interface PublicStats {
  stats: {
    totalUsers: number;
    linkedInUsers: number;
    githubUsers: number;
    activeUsers: number;
    uniqueCompanies: number;
    popularTopics: string[];
  };
  messages: {
    linkedIn: string;
    github: string;
    companies: string;
    active: string;
  };
}

export function PeopleYouMayKnow() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<PeopleYouMayKnowData | null>(null);
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [publicLoading, setPublicLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch public stats for non-logged-in users
  useEffect(() => {
    if (status === "loading") return;
    
    if (session) {
      setPublicLoading(false);
      return;
    }

    const fetchPublicStats = async () => {
      try {
        setPublicLoading(true);
        const res = await fetch("/api/people-you-may-know/public");
        if (!res.ok) {
          throw new Error("Failed to fetch public stats");
        }
        const result = await res.json();
        setPublicStats(result);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching public stats:", err);
        setError(err.message);
      } finally {
        setPublicLoading(false);
      }
    };

    fetchPublicStats();
    
    // Refresh every 60 seconds for public stats
    const interval = setInterval(fetchPublicStats, 60000);
    return () => clearInterval(interval);
  }, [session, status]);

  // Fetch personalized connections for logged-in users
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchConnections = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/people-you-may-know");
        if (!res.ok) {
          throw new Error("Failed to fetch connections");
        }
        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching people you may know:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchConnections, 30000);
    return () => clearInterval(interval);
  }, [session, status]);

  // Show loading state
  if (status === "loading" || (session && loading) || (!session && publicLoading)) {
    return null;
  }

  // Show teaser for non-logged-in users
  if (!session && publicStats) {
    return (
      <div className="relative rounded-3xl border border-[#3b435a] bg-gradient-to-br from-[#0a0f1e] via-[#050816] to-[#0a0f1e] p-8 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#bef264]/5 via-transparent to-[#ffd447]/5 opacity-50" />
        <div className="relative">
          <div className="mb-6 text-center">
            <p className="text-sm text-[#9aa2c2] mb-2">
              Join to see who&apos;s already here
            </p>
          </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {/* LinkedIn Users */}
          {publicStats.stats.linkedInUsers > 0 && (
            <div className="group relative flex items-center gap-4 rounded-2xl border border-[#3b435a] bg-gradient-to-br from-[#101523] to-[#0a0f1e] p-5 transition-all hover:border-[#bef264]/50 hover:shadow-lg hover:shadow-[#bef264]/10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#bef264]/20 blur-md" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#bef264]/30 to-[#bef264]/10">
                  <svg
                    className="h-7 w-7 text-[#bef264]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#f8f3e8] mb-1">
                  {publicStats.messages.linkedIn}
                </p>
                <p className="text-xs text-[#9aa2c2]">
                  Verified professionals
                </p>
              </div>
            </div>
          )}

          {/* GitHub Users */}
          {publicStats.stats.githubUsers > 0 && (
            <div className="group relative flex items-center gap-4 rounded-2xl border border-[#3b435a] bg-gradient-to-br from-[#101523] to-[#0a0f1e] p-5 transition-all hover:border-[#6471a3]/50 hover:shadow-lg hover:shadow-[#6471a3]/10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#6471a3]/20 blur-md" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6471a3]/30 to-[#6471a3]/10">
                  <svg
                    className="h-7 w-7 text-[#6471a3]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#f8f3e8] mb-1">
                  {publicStats.messages.github}
                </p>
                <p className="text-xs text-[#9aa2c2]">
                  Developers and engineers
                </p>
              </div>
            </div>
          )}

          {/* Companies */}
          {publicStats.stats.uniqueCompanies > 0 && (
            <div className="group relative flex items-center gap-4 rounded-2xl border border-[#3b435a] bg-gradient-to-br from-[#101523] to-[#0a0f1e] p-5 transition-all hover:border-[#ffd447]/50 hover:shadow-lg hover:shadow-[#ffd447]/10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#ffd447]/20 blur-md" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd447]/30 to-[#ffd447]/10">
                  <svg
                    className="h-7 w-7 text-[#ffd447]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#f8f3e8] mb-1">
                  {publicStats.messages.companies}
                </p>
                <p className="text-xs text-[#9aa2c2]">
                  Network with professionals
                </p>
              </div>
            </div>
          )}

          {/* Active Users */}
          {publicStats.stats.activeUsers > 0 && (
            <div className="group relative flex items-center gap-4 rounded-2xl border border-[#3b435a] bg-gradient-to-br from-[#101523] to-[#0a0f1e] p-5 transition-all hover:border-[#bef264]/50 hover:shadow-lg hover:shadow-[#bef264]/10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#bef264]/20 blur-md animate-pulse" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#bef264]/30 to-[#bef264]/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[#bef264]" />
                  </div>
                  <svg
                    className="h-7 w-7 text-[#bef264] relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#f8f3e8] mb-1">
                  {publicStats.messages.active}
                </p>
                <p className="text-xs text-[#9aa2c2]">
                  Ready to connect
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-8 pt-6 border-t border-[#3b435a]">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => signIn("linkedin")}
              className="flex-1 inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-[#3b435a] bg-gradient-to-r from-[#101523] to-[#0a0f1e] px-6 text-sm font-semibold text-[#f8f3e8] transition-all hover:border-[#bef264]/50 hover:bg-gradient-to-r hover:from-[#151f35] hover:to-[#101523] hover:shadow-lg hover:shadow-[#bef264]/10"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Sign in with LinkedIn
            </button>
            <button
              onClick={() => signIn("github")}
              className="flex-1 inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-[#3b435a] bg-gradient-to-r from-[#101523] to-[#0a0f1e] px-6 text-sm font-semibold text-[#f8f3e8] transition-all hover:border-[#6471a3]/50 hover:bg-gradient-to-r hover:from-[#151f35] hover:to-[#101523] hover:shadow-lg hover:shadow-[#6471a3]/10"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
          <p className="text-center text-xs text-[#9aa2c2] mt-4">
            Connect with professionals from your network
          </p>
        </div>
        </div>
      </div>
    );
  }

  // Show personalized connections for logged-in users
  if (error || !data || data.connections.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-3xl border border-[#3b435a] bg-gradient-to-br from-[#0a0f1e] via-[#050816] to-[#0a0f1e] p-8 shadow-2xl backdrop-blur-sm">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#bef264]/5 via-transparent to-[#ffd447]/5 opacity-50" />
      <div className="relative">
        <div className="mb-6">
          <p className="text-sm text-[#9aa2c2] mb-2">
            {data.currentUser.hasLinkedIn || data.currentUser.hasGitHub
              ? "Verified users you might know"
              : "Users with similar interests"}
          </p>
        </div>

      <div className="space-y-3">
        {data.connections.map((connection) => (
          <div
            key={connection.user.id}
            className="group flex items-center gap-4 rounded-2xl border border-[#3b435a] bg-gradient-to-br from-[#101523] to-[#0a0f1e] p-5 transition-all hover:border-[#6471a3]/50 hover:shadow-lg hover:shadow-[#6471a3]/10"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {connection.user.image ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bef264]/30 to-[#ffd447]/30 blur-md opacity-50" />
                  <img
                    src={connection.user.image}
                    alt={connection.user.name || "User"}
                    className="relative h-14 w-14 rounded-full object-cover border-2 border-[#3b435a]"
                  />
                </>
              ) : (
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd447] to-[#facc15] text-base font-bold text-[#18120b] border-2 border-[#3b435a]">
                  {connection.user.name
                    ? connection.user.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
              )}
              {connection.user.isOnline && (
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#0a0f1e] bg-[#bef264] shadow-lg shadow-[#bef264]/50" />
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#f8f3e8] truncate">
                  {connection.user.name || "Anonymous"}
                </p>
                {connection.user.hasLinkedIn && (
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#bef264]/20 text-[#bef264]">
                    <svg
                      className="h-2.5 w-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    LinkedIn
                  </span>
                )}
                {connection.user.hasGitHub && (
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#6471a3]/20 text-[#6471a3]">
                    <svg
                      className="h-2.5 w-2.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </span>
                )}
              </div>
              
              {/* Topics or Seniority */}
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {connection.user.topics.slice(0, 2).map((topic, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#343d55] text-[#d3dcec]"
                  >
                    {topic}
                  </span>
                ))}
                {connection.user.seniority && (
                  <span className="text-[10px] text-[#9aa2c2]">
                    • {connection.user.seniority.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Connection Reasons */}
              {connection.reasons.length > 0 && (
                <p className="mt-1 text-[10px] text-[#9aa2c2]">
                  {connection.reasons.slice(0, 2).join(" • ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.connections.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#3b435a]">
          <button
            onClick={() => {
              // Navigate to match page to start matching
              window.location.href = "/match";
            }}
            className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd447] to-[#facc15] px-6 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start matching to connect with them
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

