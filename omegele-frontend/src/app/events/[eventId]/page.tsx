"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import EventSignupModal from "@/components/EventSignupModal";

interface Event {
  id: string;
  title: string;
  description: string;
  guestSpeaker: string;
  speakerBio: string | null;
  image: string | null;
  eventDate: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number | null;
  registrationCount: number;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const eventId = params?.eventId as string;

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        } else if (res.status === 404) {
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  useEffect(() => {
    if (!eventId || status === "loading") return;

    const checkRegistration = async () => {
      try {
        const url = session?.user?.email
          ? `/api/events/${eventId}/check-registration?email=${encodeURIComponent(session.user.email)}`
          : `/api/events/${eventId}/check-registration`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setIsRegistered(data.isRegistered);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [eventId, session, status]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  const handleSignupClick = () => {
    if (!session) {
      // Show signup modal which will prompt for login if needed
      setShowSignupModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const handleSignupSuccess = () => {
    setIsRegistered(true);
    setShowSignupModal(false);
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/events/${eventId}`;
    }
    return "";
  };

  const copyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const text = `Check out this event: ${event?.title}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareToLinkedIn = () => {
    const url = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = getShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl();
    const text = `Check out this event: ${event?.title} - ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareViaNative = async () => {
    const url = getShareUrl();
    const shareData = {
      title: event?.title || "Event",
      text: event?.description || "",
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShowShareMenu(false);
      } else {
        copyLink();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffd447] border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const { date, time } = formatDate(event.eventDate);
  const isPast = new Date(event.eventDate) < new Date();
  const spotsLeft =
    event.maxAttendees ? event.maxAttendees - event.registrationCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/events")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>

        {/* Event Image */}
        {event.image && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96 flex items-center justify-center p-8">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Event Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex-1">
                {event.title}
              </h1>
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>

                {/* Share Menu Dropdown */}
                {showShareMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowShareMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg z-20">
                      <div className="p-2">
                        {/* Copy Link */}
                        <button
                          onClick={copyLink}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {linkCopied ? (
                            <>
                              <svg
                                className="h-5 w-5 text-green-600"
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
                              <span className="text-green-600">Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-5 w-5 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        {/* Native Share (Mobile) */}
                        {typeof navigator !== "undefined" && "share" in navigator && (
                          <button
                            onClick={shareViaNative}
                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <svg
                              className="h-5 w-5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                            <span>Share via...</span>
                          </button>
                        )}

                        <div className="my-1 border-t border-slate-100" />

                        {/* Social Media Options */}
                        <button
                          onClick={shareToTwitter}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          <span>Twitter</span>
                        </button>

                        <button
                          onClick={shareToLinkedIn}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span>LinkedIn</span>
                        </button>

                        <button
                          onClick={shareToFacebook}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span>Facebook</span>
                        </button>

                        <button
                          onClick={shareToWhatsApp}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!isPast && spotsLeft !== null && spotsLeft > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ffd447]/10 px-4 py-1.5 text-sm font-semibold text-[#ffd447]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {spotsLeft} spots remaining
              </div>
            )}
            {isFull && !isPast && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600">
                Event Full
              </div>
            )}
          </div>

          {/* Event Details Grid */}
          <div className="mb-8 grid gap-6 border-b border-slate-100 pb-8 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-lg bg-[#ffd447]/10 p-2">
                <svg
                  className="h-5 w-5 text-[#ffd447]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Date & Time</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {date}
                </p>
                <p className="text-sm text-slate-600">{time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-lg bg-[#ffd447]/10 p-2">
                <svg
                  className="h-5 w-5 text-[#ffd447]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Location</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {event.isVirtual ? "Virtual Event" : event.location}
                </p>
                {event.isVirtual && (
                  <p className="text-sm text-slate-600">
                    Join from anywhere
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-lg bg-[#ffd447]/10 p-2">
                <svg
                  className="h-5 w-5 text-[#ffd447]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Guest Speaker
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {event.guestSpeaker}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              About This Event
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
              {event.description}
            </p>
          </div>

          {/* Guest Speaker Bio */}
          {event.speakerBio && (
            <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                About {event.guestSpeaker}
              </h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
                {event.speakerBio}
              </p>
            </div>
          )}

          {/* Signup Button */}
          {!isPast && (
            <div className="border-t border-slate-100 pt-8">
              {checkingRegistration ? (
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#ffd447] border-r-transparent"></div>
                  <span>Checking registration...</span>
                </div>
              ) : isRegistered ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
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
                  <h3 className="text-lg font-semibold text-green-900">
                    You&apos;re Registered!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    We&apos;ll send you event details and reminders via email.
                  </p>
                </div>
              ) : isFull ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-base font-medium text-slate-600">
                    This event is full. Check back for future events!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSignupClick}
                  className="w-full rounded-xl bg-[#ffd447] px-6 py-4 text-base font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15] hover:shadow-md sm:w-auto sm:px-8"
                >
                  {session ? "Register for Event" : "Sign Up for Event"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <EventSignupModal
          event={event}
          session={session}
          onClose={() => setShowSignupModal(false)}
          onSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}

