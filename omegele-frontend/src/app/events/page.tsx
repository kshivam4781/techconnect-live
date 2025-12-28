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
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
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
            {!isPast && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  {event.registrationCount} registered
                  {event.maxAttendees
                    ? ` / ${event.maxAttendees} max`
                    : ""}
                </span>
              </div>
            )}
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

