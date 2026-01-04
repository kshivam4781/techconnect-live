"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function EventsPage() {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Email notification form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          fetch("/api/events?filter=upcoming"),
          fetch("/api/events?filter=past"),
        ]);

        if (upcomingRes.ok) {
          const upcomingData = await upcomingRes.json();
          setUpcomingEvents(upcomingData.events || []);
        }

        if (pastRes.ok) {
          const pastData = await pastRes.json();
          setPastEvents(pastData.events || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/events/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: data.message || "Successfully subscribed to event notifications!",
        });
        setName("");
        setEmail("");
        // Clear message after 5 seconds
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to subscribe. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const isPast = new Date(event.eventDate) < new Date();
    const spotsLeft =
      event.maxAttendees
        ? event.maxAttendees - event.registrationCount
        : null;

    return (
      <div
        onClick={() => router.push(`/events/${event.id}`)}
        className="group cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300 overflow-hidden"
      >
        {event.image && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center p-4">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[#ffd447] transition-colors">
                {event.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Guest Speaker: {event.guestSpeaker}
              </p>
            </div>
            {!isPast && spotsLeft !== null && spotsLeft > 0 && (
              <div className="flex-shrink-0 rounded-full bg-[#ffd447]/10 px-3 py-1 text-xs font-semibold text-[#ffd447]">
                {spotsLeft} spots left
              </div>
            )}
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-slate-600">
            {event.description}
          </p>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg
                className="h-4 w-4 text-slate-400"
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
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg
                className="h-4 w-4 text-slate-400"
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
              <span>
                {event.isVirtual ? "Virtual Event" : event.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffd447] border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Events
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Join our upcoming events and connect with industry leaders
          </p>
        </div>

        {/* Email Notification Subscription Form */}
        <div className="mb-12 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={handleSubscribe} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[120px]">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#ffd447] focus:outline-none focus:ring-1 focus:ring-[#ffd447]"
                placeholder="Your name"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#ffd447] focus:outline-none focus:ring-1 focus:ring-[#ffd447]"
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#ffd447] px-6 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-[#ffd447]/90 focus:outline-none focus:ring-2 focus:ring-[#ffd447] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Notify Me About Events"
              )}
            </button>
            {submitMessage && (
              <div className="w-full">
                <div
                  className={`rounded-lg p-2 text-xs ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {submitMessage.type === "success" ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <p className="font-medium">{submitMessage.text}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Upcoming Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Past Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
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
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No events yet
            </h3>
            <p className="mt-2 text-slate-600">
              Check back soon for upcoming events!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

