"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import FlagModal from "@/components/FlagModal";

type MatchStatus = "idle" | "searching" | "matched" | "in-call" | "ended";

export default function MatchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>("idle");
  const [callMode, setCallMode] = useState<"VIDEO" | "TEXT">("VIDEO");
  const [matchTimer, setMatchTimer] = useState(0);
  const [callTimer, setCallTimer] = useState(0);
  const [conversationDuration, setConversationDuration] = useState<number>(60);
  const [showName, setShowName] = useState<boolean>(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagId, setFlagId] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const matchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Socket and WebRTC hooks
  const {
    socket,
    isConnected,
    matchData,
    joinQueue,
    leaveQueue,
    startCall,
    endCall,
  } = useSocket();

  const { isVideoEnabled, isAudioEnabled, toggleVideo, toggleAudio } = useWebRTC({
    socket,
    matchId: currentMatchId,
    roomId: currentRoomId,
    localVideoRef,
    remoteVideoRef,
    enabled: matchStatus === "in-call" && callMode === "VIDEO",
  });

  // Check if user is onboarded and fetch conversation config
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchUserConfig = async () => {
      setLoadingConfig(true);
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.user) {
          if (!data.user.onboarded) {
            router.push("/onboarding");
            return;
          }
          setConversationDuration(data.user.initialConversationDuration ?? 60);
          setShowName(data.user.showName ?? true);
        }
      } catch (error) {
        console.error("Error fetching user config:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchUserConfig();
  }, [session, status, router]);

  // Timer for matching
  useEffect(() => {
    if (matchStatus === "searching") {
      matchIntervalRef.current = setInterval(() => {
        setMatchTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (matchIntervalRef.current) {
        clearInterval(matchIntervalRef.current);
        matchIntervalRef.current = null;
      }
      setMatchTimer(0);
    }

    return () => {
      if (matchIntervalRef.current) {
        clearInterval(matchIntervalRef.current);
      }
    };
  }, [matchStatus]);

  // Timer for call
  useEffect(() => {
    if (matchStatus === "in-call") {
      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
      setCallTimer(0);
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [matchStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle match found from socket
  useEffect(() => {
    if (matchData && matchStatus === "searching") {
      setCurrentMatchId(matchData.matchId);
      setCurrentRoomId(matchData.roomId);
      setOtherUserId(matchData.otherUserId);
      setMatchStatus("matched");
      
      // Auto-transition to in-call after 2 seconds
      setTimeout(() => {
        if (currentMatchId) {
          startCall(currentMatchId);
          setMatchStatus("in-call");
        }
      }, 2000);
    }
  }, [matchData, matchStatus, currentMatchId, startCall]);

  const handleStartMatch = async (mode: "VIDEO" | "TEXT") => {
    try {
      setCallMode(mode);
      setMatchStatus("searching");

      // Start session
      const sessionRes = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: mode.toLowerCase() }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to start session");
      }

      const sessionData = await sessionRes.json();
      setCurrentSessionId(sessionData.sessionId);

      // Update activity
      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SEARCHING", mode }),
      });

      // Join queue via socket
      if (isConnected && sessionData.sessionId) {
        joinQueue(sessionData.sessionId, mode);
      }
    } catch (error) {
      console.error("Error starting match:", error);
      setMatchStatus("idle");
    }
  };

  const handleStopSearch = async () => {
    try {
      if (currentSessionId) {
        await fetch("/api/session/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: currentSessionId }),
        });
      }

      leaveQueue();

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      setMatchStatus("idle");
      setCurrentSessionId(null);
      setMatchTimer(0);
    } catch (error) {
      console.error("Error stopping search:", error);
    }
  };

  const handleEndCall = async () => {
    try {
      if (currentMatchId) {
        endCall(currentMatchId, "ended");
      }

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      setMatchStatus("ended");
      setCurrentMatchId(null);
      setCurrentRoomId(null);
      setOtherUserId(null);
      setCallTimer(0);

      setTimeout(() => {
        setMatchStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleSkip = async () => {
    try {
      if (currentMatchId) {
        endCall(currentMatchId, "skipped");
      }

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      setMatchStatus("idle");
      setCurrentMatchId(null);
      setCurrentRoomId(null);
      setOtherUserId(null);
      setCallTimer(0);
    } catch (error) {
      console.error("Error skipping:", error);
    }
  };

  const handleFlag = async () => {
    if (!currentMatchId || !otherUserId) return;

    try {
      // Immediately save flag to database
      const flagRes = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flaggedUserId: otherUserId,
          matchId: currentMatchId,
          reason: "", // Will be updated when user submits
        }),
      });

      if (!flagRes.ok) {
        throw new Error("Failed to create flag");
      }

      const flagData = await flagRes.json();
      setFlagId(flagData.flag.id);
      setShowFlagModal(true);
    } catch (error) {
      console.error("Error creating flag:", error);
      alert("Failed to report user. Please try again.");
    }
  };

  const handleFlagSubmit = async (reason: string, category?: string) => {
    if (!flagId) return;

    try {
      const res = await fetch(`/api/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, category }),
      });

      if (!res.ok) {
        throw new Error("Failed to update flag");
      }

      setShowFlagModal(false);
      setFlagId(null);
      
      // Optionally end the call after flagging
      await handleEndCall();
    } catch (error) {
      console.error("Error submitting flag:", error);
      throw error;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center">
        <p className="text-sm text-[#9aa2c2]">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center px-4">
        <div className="max-w-md space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 text-center">
          <h1 className="text-xl font-semibold">Sign in to start matching</h1>
          <p className="text-sm text-[#9aa2c2]">
            You need to be signed in to start conversations with other tech professionals.
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
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      {matchStatus === "idle" && (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Start a conversation
              </h1>
              <p className="mt-3 text-sm text-[#9aa2c2]">
                Get matched with another tech professional for a 1:1 conversation.
              </p>
              {!loadingConfig && (
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#9aa2c2]">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {conversationDuration}s duration
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Name {showName ? "visible" : "hidden"}
                  </span>
                  <a href="/profile" className="text-[#ffd447] hover:underline">
                    Change
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f8f3e8]">Choose your mode</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleStartMatch("VIDEO")}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#3b435a] bg-[#050816] p-4 transition hover:border-[#ffd447] hover:bg-[#18120b]"
                  >
                    <svg
                      className="h-8 w-8 text-[#ffd447]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Video Call</span>
                    <span className="text-xs text-[#9aa2c2]">Face-to-face conversation</span>
                  </button>

                  <button
                    onClick={() => handleStartMatch("TEXT")}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#3b435a] bg-[#050816] p-4 transition hover:border-[#ffd447] hover:bg-[#18120b]"
                  >
                    <svg
                      className="h-8 w-8 text-[#bef264]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Text Chat</span>
                    <span className="text-xs text-[#9aa2c2]">Text-only conversation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {matchStatus === "searching" && (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-24 w-24 animate-pulse rounded-full border-4 border-[#ffd447] border-t-transparent" />
              <div>
                <h2 className="text-2xl font-semibold">Finding your match…</h2>
                <p className="mt-2 text-sm text-[#9aa2c2]">
                  Looking for someone with similar interests
                </p>
                <p className="mt-4 text-xs text-[#64748b]">
                  {formatTime(matchTimer)}
                </p>
              </div>
              <button
                onClick={handleStopSearch}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-5 text-sm font-medium text-[#f8f3e8] transition hover:border-[#6471a3] hover:bg-[#151f35]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {matchStatus === "matched" && (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-24 w-24 rounded-full border-4 border-[#bef264] bg-[#1a2b16] flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-[#bef264]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#bef264]">Match found!</h2>
                <p className="mt-2 text-sm text-[#9aa2c2]">
                  Connecting you now…
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {matchStatus === "in-call" && (
        <div className="flex min-h-screen flex-col">
          {/* Video/Audio Area */}
          <div className="relative flex-1 bg-[#0b1018]">
            {callMode === "VIDEO" ? (
              <div className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-2">
                {/* Remote Video */}
                <div className="relative flex items-center justify-center rounded-2xl border border-[#343d55] bg-[#050816]">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full rounded-2xl object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#111827] text-2xl font-semibold">
                        {session.user?.name?.charAt(0) || "?"}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-3 py-1 text-xs font-medium backdrop-blur">
                    {session.user?.name || "User"}
                  </div>
                </div>

                {/* Local Video */}
                <div className="relative flex items-center justify-center rounded-2xl border border-[#343d55] bg-[#050816]">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full rounded-2xl object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#111827] text-2xl font-semibold">
                        You
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-3 py-1 text-xs font-medium backdrop-blur">
                    You
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#343d55] bg-[#050816] text-4xl font-semibold">
                    {session.user?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{session.user?.name || "User"}</p>
                    <p className="text-sm text-[#9aa2c2]">Text chat mode</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call Timer */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-4 py-2 text-xs font-medium backdrop-blur">
              {formatTime(callTimer)}
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-[#272f45] bg-[#0b1018] px-4 py-4">
            <div className="mx-auto flex max-w-2xl items-center justify-center gap-3">
              <button
                onClick={toggleAudio}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                  !isAudioEnabled
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] hover:border-[#6471a3] hover:bg-[#151f35]"
                }`}
              >
                {!isAudioEnabled ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>

              {callMode === "VIDEO" && (
                <button
                  onClick={toggleVideo}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                    !isVideoEnabled
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] hover:border-[#6471a3] hover:bg-[#151f35]"
                  }`}
                >
                  {isVideoEnabled ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={handleFlag}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 transition hover:border-orange-500 hover:bg-orange-500/20"
                title="Report user"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              </button>

              <button
                onClick={handleSkip}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] transition hover:border-[#6471a3] hover:bg-[#151f35]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={handleEndCall}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {matchStatus === "ended" && (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-24 w-24 rounded-full border-4 border-[#3b435a] bg-[#050816] flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-[#9aa2c2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Call ended</h2>
                <p className="mt-2 text-sm text-[#9aa2c2]">
                  Thanks for the conversation!
                </p>
              </div>
              <button
                onClick={() => setMatchStatus("idle")}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15]"
              >
                Start new conversation
              </button>
            </div>
          </div>
        </div>
      )}

      <FlagModal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlagId(null);
        }}
        flaggedUserId={otherUserId || ""}
        matchId={currentMatchId || ""}
        onFlagSubmit={handleFlagSubmit}
      />
    </div>
  );
}

