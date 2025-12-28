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
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Event Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {event.title}
            </h1>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Registrations
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {event.registrationCount}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} registered
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

