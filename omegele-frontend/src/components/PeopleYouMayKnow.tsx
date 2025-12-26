"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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

export function PeopleYouMayKnow() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<PeopleYouMayKnowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Don't show if not logged in or no connections
  if (status === "loading" || !session || loading) {
    return null;
  }

  if (error || !data || data.connections.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#343d55] bg-[#050816] p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#f8f3e8]">
          People you may know
        </h3>
        <p className="mt-1 text-xs text-[#9aa2c2]">
          {data.currentUser.hasLinkedIn || data.currentUser.hasGitHub
            ? "Verified users you might know"
            : "Users with similar interests"}
        </p>
      </div>

      <div className="space-y-3">
        {data.connections.map((connection) => (
          <div
            key={connection.user.id}
            className="flex items-center gap-3 rounded-xl border border-[#343d55] bg-[#101523] p-3 transition hover:border-[#6471a3]"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {connection.user.image ? (
                <img
                  src={connection.user.image}
                  alt={connection.user.name || "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd447] text-sm font-bold text-[#18120b]">
                  {connection.user.name
                    ? connection.user.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
              )}
              {connection.user.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#101523] bg-[#bef264]" />
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
        <p className="mt-4 text-center text-xs text-[#9aa2c2]">
          <button
            onClick={() => {
              // Navigate to match page to start matching
              window.location.href = "/match";
            }}
            className="text-[#ffd447] hover:text-[#facc15] transition-colors underline"
          >
            Start matching to connect with them
          </button>
        </p>
      )}
    </div>
  );
}

