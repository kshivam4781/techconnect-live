"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import Snowfall from "react-snowfall";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";

// Login Dropdown Component
function LoginDropdown({ variant = "hero" }: { variant?: "hero" | "faq" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (variant === "hero") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
        >
          Get started
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-56 rounded-lg border border-[#343d55] bg-[#050816] shadow-xl z-50">
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signIn("github");
                }}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#d3dcec] transition hover:bg-[#101523]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Sign in with GitHub</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signIn("linkedin");
                }}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#d3dcec] transition hover:bg-[#101523]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>Sign in with LinkedIn</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // FAQ variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ffd447] px-6 text-sm font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15] hover:shadow-md"
      >
        Sign in
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg z-50">
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                signIn("github");
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Sign in with GitHub</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                signIn("linkedin");
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Sign in with LinkedIn</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Safety Feature Card Component
function SafetyFeatureCard({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="relative group">
      <div className="relative rounded-xl border border-slate-200 bg-white p-6 min-w-[200px] max-w-[260px] shadow-sm transition-all hover:shadow-md hover:border-slate-300">
        <div className="mb-3">
          <p className="text-base font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [snowEnabled, setSnowEnabled] = useState(true);
  const [stats, setStats] = useState<{
    totalRegisteredUsers: number;
    totalActive: number;
    totalOnline: number;
  } | null>(null);
  
  // Matching scenarios for hero section
  const matchingScenarios = [
    {
      scenario: "your next co-developer",
      you: {
        initial: "Y",
        role: "Full Stack Developer",
        quote: "Looking for a coding partner for my side project."
      },
      match: {
        initial: "D",
        role: "Senior Developer · React",
        quote: "Interested in collaborating on innovative projects.",
        verified: "Verified via GitHub"
      }
    },
    {
      scenario: "your VC",
      you: {
        initial: "Y",
        role: "Founder · Pre-seed",
        quote: "Building the next big thing, need funding."
      },
      match: {
        initial: "V",
        role: "VC Partner · Early Stage",
        quote: "Investing in innovative tech startups.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      scenario: "your co-founder",
      you: {
        initial: "Y",
        role: "Technical Founder",
        quote: "Need a business co-founder for my startup."
      },
      match: {
        initial: "B",
        role: "Business Founder · Sales",
        quote: "Looking for a technical co-founder to build with.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      scenario: "your next employer",
      you: {
        initial: "Y",
        role: "Senior Backend Eng",
        quote: "Looking for my next challenge at a growing startup."
      },
      match: {
        initial: "R",
        role: "Tech Recruiter · SF",
        quote: "We're hiring senior engineers for our AI team.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      scenario: "your next big break",
      you: {
        initial: "Y",
        role: "Indie Developer",
        quote: "Ready to take my project to the next level."
      },
      match: {
        initial: "O",
        role: "Product Manager · Tech",
        quote: "Always looking for talented builders to connect with.",
        verified: "Verified via LinkedIn"
      }
    },
  ];

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  // Rotating use cases with matching profiles
  const useCaseData = [
    {
      useCase: "your next employer",
      you: {
        initial: "Y",
        role: "Senior Backend Eng",
        quote: "Looking for my next challenge at a growing startup."
      },
      match: {
        initial: "R",
        role: "Tech Recruiter · SF",
        quote: "We're hiring senior engineers for our AI team.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your next mentor",
      you: {
        initial: "Y",
        role: "Mid-level Developer",
        quote: "Want to level up my skills and career trajectory."
      },
      match: {
        initial: "M",
        role: "Staff Engineer · 10+ YOE",
        quote: "Happy to share career advice and technical insights.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your venture capital",
      you: {
        initial: "Y",
        role: "Founder · Pre-seed",
        quote: "Building the next big thing, need funding."
      },
      match: {
        initial: "V",
        role: "VC Partner · Early Stage",
        quote: "Investing in innovative tech startups.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your next customer",
      you: {
        initial: "Y",
        role: "SaaS Founder",
        quote: "Looking to connect with potential enterprise clients."
      },
      match: {
        initial: "C",
        role: "CTO · Enterprise",
        quote: "Always exploring new tools for our tech stack.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your co-founder",
      you: {
        initial: "Y",
        role: "Technical Founder",
        quote: "Need a business co-founder for my startup."
      },
      match: {
        initial: "B",
        role: "Business Founder · Sales",
        quote: "Looking for a technical co-founder to build with.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your next investor",
      you: {
        initial: "Y",
        role: "Startup Founder",
        quote: "Seeking seed funding for our platform."
      },
      match: {
        initial: "I",
        role: "Angel Investor · Tech",
        quote: "Investing in early-stage B2B SaaS companies.",
        verified: "Verified via LinkedIn"
      }
    },
    {
      useCase: "your next collaborator",
      you: {
        initial: "Y",
        role: "Open Source Maintainer",
        quote: "Looking for contributors for my project."
      },
      match: {
        initial: "D",
        role: "Developer · Open Source",
        quote: "Interested in contributing to meaningful projects.",
        verified: "Verified via GitHub"
      }
    },
    {
      useCase: "your next advisor",
      you: {
        initial: "Y",
        role: "First-time Founder",
        quote: "Need guidance on product-market fit."
      },
      match: {
        initial: "A",
        role: "Serial Entrepreneur · Advisor",
        quote: "Helping founders navigate early-stage challenges.",
        verified: "Verified via LinkedIn"
      }
    },
  ];
  const [currentUseCaseIndex, setCurrentUseCaseIndex] = useState(0);

  // Rotating hero taglines
  const heroTaglines = [
    {
      main: "tech conversations",
      subtext: "you wish your timeline had.",
      description: "TechConnect Live pairs you with engineers, founders, students, and builders for spontaneous 1:1 conversations. Less small talk, more real stories, ideas, and unfiltered advice."
    },
    {
      main: "strict privacy",
      subtext: "your conversations deserve.",
      description: "Zero data tracking. No ads. No selling your information. Your conversations are private, encrypted, and disappear when you're done. We're serious about privacy."
    },
    {
      main: "study groups",
      subtext: "that actually help you learn.",
      description: "Students: Connect with peers studying the same tech stack, get help with coding challenges, or find study partners for your next exam. Real help from real people."
    },
    {
      main: "career conversations",
      subtext: "that move your career forward.",
      description: "Working professionals: Network with industry experts, get career advice, discuss tech trends, or find your next opportunity. All in real-time, face-to-face."
    },
    {
      main: "strategic connections",
      subtext: "CEOs and founders need.",
      description: "CEOs: Connect with other founders, potential investors, or industry leaders. Discuss strategy, share experiences, and build relationships that matter."
    },
    {
      main: "mentorship",
      subtext: "that actually makes a difference.",
      description: "Find mentors who've been where you are. Get real advice from experienced professionals who want to help you grow. No fluff, just genuine guidance."
    },
    {
      main: "tech insights",
      subtext: "you won't find on social media.",
      description: "Skip the noise. Have deep conversations about AI, blockchain, cloud architecture, or any tech topic. Real discussions with people who actually know what they're talking about."
    },
    {
      main: "job opportunities",
      subtext: "before they hit the job boards.",
      description: "Connect with recruiters, hiring managers, and companies looking for talent. Get referrals, learn about openings, and land your dream job through real conversations."
    },
    {
      main: "co-founder matches",
      subtext: "that turn ideas into startups.",
      description: "Founders: Find your technical or business co-founder. Discuss ideas, validate concepts, and build the team that will take your startup to the next level."
    },
    {
      main: "expert advice",
      subtext: "from people who've built it.",
      description: "Talk to engineers at FAANG, startup founders, VCs, and industry veterans. Get unfiltered advice from people who've actually built successful products and companies."
    },
    {
      main: "coding help",
      subtext: "when you're stuck on a problem.",
      description: "Stuck on a bug? Need code review? Want to discuss architecture? Connect with developers who can help you solve problems in real-time, not through async forums."
    },
    {
      main: "industry trends",
      subtext: "discussed by the people shaping them.",
      description: "Stay ahead of the curve. Discuss the latest in AI, web3, cloud computing, or any emerging tech with the people who are actually building and deploying it."
    }
  ];

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [isTaglineTransitioning, setIsTaglineTransitioning] = useState(false);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/activity/stats");
        if (!res.ok) {
          console.error("Failed to fetch stats:", res.status, res.statusText);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          return;
        }
        const data = await res.json();
        if (data.totalRegisteredUsers !== undefined) {
          setStats({
            totalRegisteredUsers: data.totalRegisteredUsers,
            totalActive: data.totalActive || 0,
            totalOnline: data.totalOnline || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    // Update stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check if user needs onboarding
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      setCheckingOnboarding(false);
      return;
    }

    // Check onboarded status from session first (faster)
    const sessionOnboarded = (session as any)?.onboarded;
    
    // If explicitly true, user is onboarded
    if (sessionOnboarded === true) {
      setCheckingOnboarding(false);
      return;
    }

    // If false or undefined, check from API to be sure
    const checkOnboarding = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          console.error("Failed to fetch user:", res.status, res.statusText);
          setCheckingOnboarding(false);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          setCheckingOnboarding(false);
          return;
        }
        const data = await res.json();
        if (data.user) {
          if (!data.user.onboarded) {
            router.push("/onboarding");
            return;
          }
          // User is onboarded, set checking to false
          setCheckingOnboarding(false);
        } else {
          // No user data, might need to sign in
          setCheckingOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setCheckingOnboarding(false);
      }
    };
    
    checkOnboarding();
  }, [session, status, router]);

  // Rotate through use cases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUseCaseIndex((prev) => (prev + 1) % useCaseData.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [useCaseData.length]);

  // Rotate through matching scenarios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScenarioIndex((prev) => (prev + 1) % matchingScenarios.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [matchingScenarios.length]);

  // Rotate through hero taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTaglineTransitioning(true);
      setTimeout(() => {
        setCurrentTaglineIndex((prev) => (prev + 1) % heroTaglines.length);
        setIsTaglineTransitioning(false);
      }, 300); // Half of transition duration
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [heroTaglines.length]);

  return (
    <div className="min-h-screen bg-white">
      {snowEnabled && (
        <Snowfall
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          snowflakeCount={100}
          speed={[0.5, 3]}
          wind={[-0.5, 0.5]}
          radius={[0.5, 3]}
          color="#ffffff"
        />
      )}
      <button
        onClick={() => setSnowEnabled(!snowEnabled)}
        className="fixed top-4 right-4 z-[1001] flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
        aria-label={snowEnabled ? "Stop snow" : "Start snow"}
      >
        {snowEnabled ? (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Stop Snow
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Start Snow
          </>
        )}
      </button>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-40"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95" />
        </div>

        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:flex-row sm:items-stretch sm:gap-16 sm:text-left">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#3b435a] bg-[#131827] px-3 py-1 text-[11px] font-medium text-[#d3dcec] shadow-sm backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
              Built for people who actually ship things
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl min-h-[180px] sm:min-h-[200px] md:min-h-[220px]">
              <span className="inline-block">
                Find the{" "}
                <span 
                  className={`underline decoration-[#ffd447] decoration-[6px] underline-offset-8 transition-all duration-500 ${
                    isTaglineTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                  }`}
                >
                  {heroTaglines[currentTaglineIndex].main}
                </span>{" "}
                <span 
                  className={`transition-all duration-500 ${
                    isTaglineTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                  }`}
                >
                  {heroTaglines[currentTaglineIndex].subtext}
                </span>
              </span>
            </h1>
            <p 
              className={`max-w-xl text-balance text-sm text-[#d3dcec] sm:text-base min-h-[60px] transition-all duration-500 ${
                isTaglineTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              {heroTaglines[currentTaglineIndex].description}
            </p>

            {checkingOnboarding && session ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#343d55] bg-[#050816] px-4 py-3 text-left text-xs text-[#d3dcec]">
                  <p className="text-[11px] font-semibold text-[#bef264]">
                    Checking your profile…
                  </p>
                </div>
              </div>
            ) : session ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#343d55] bg-[#050816] px-4 py-3 text-left text-xs text-[#d3dcec]">
                  <p className="text-[11px] font-semibold text-[#bef264]">
                    You&apos;re all set.
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#f8f3e8]">
                    Signed in as{" "}
                    <span className="font-semibold">
                      {session.user?.name || session.user?.email}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#9aa2c2]">
                    Ready to start conversations. Click &quot;Start conversation&quot; when you&apos;re ready.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => router.push("/match")}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
                  >
                    Start conversation
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-5 text-sm font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
                  >
                    Sign out
                  </button>
                </div>
                <p className="text-xs text-[#9aa2c2]">
                  OAuth only · No anonymous accounts · You choose what you
                  share.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <LoginDropdown variant="hero" />
                </div>
            <p className="text-xs text-[#9aa2c2]">
                  OAuth only · No anonymous accounts · You choose what you
                  share.
            </p>
              </>
            )}

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-4 py-3">
                <p className="text-2xl sm:text-3xl font-semibold text-[#f8f3e8]">
                  {stats ? (
                    <>
                      {stats.totalRegisteredUsers.toLocaleString()}
                      {stats.totalRegisteredUsers >= 1000 && "+"}
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  registered users
                </p>
              </div>
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-4 py-3">
                <p className="text-2xl sm:text-3xl font-semibold text-[#f8f3e8]">
                  {stats ? (
                    <>
                      {stats.totalActive}
                      <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-[#bef264]" />
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  users active now
                </p>
              </div>
            </div>
          </div>

          {/* Matching Scenario Box */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-[#343d55] bg-[#050816] p-6 shadow-xl">
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold text-[#bef264] uppercase tracking-wide">
                  Matching with {matchingScenarios[currentScenarioIndex].scenario}
                </p>
              </div>

              {/* Your Profile */}
              <div className="mb-4 rounded-xl border border-[#343d55] bg-[#101523] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd447] text-lg font-bold text-[#18120b]">
                    {matchingScenarios[currentScenarioIndex].you.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#f8f3e8]">You</p>
                    <p className="text-xs text-[#9aa2c2] mt-0.5">
                      {matchingScenarios[currentScenarioIndex].you.role}
                    </p>
                    <p className="text-xs text-[#d3dcec] mt-2 leading-relaxed">
                      &quot;{matchingScenarios[currentScenarioIndex].you.quote}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-[#343d55]" />
                <div className="px-2 py-1 rounded-full bg-[#343d55] text-[10px] font-semibold text-[#9aa2c2]">
                  VS
                </div>
                <div className="flex-1 h-px bg-[#343d55]" />
              </div>

              {/* Match Profile */}
              <div className="mb-4 rounded-xl border border-[#343d55] bg-[#101523] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bef264] text-lg font-bold text-[#18120b]">
                    {matchingScenarios[currentScenarioIndex].match.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#f8f3e8]">Match</p>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#bef264]/20 text-[#bef264]">
                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#9aa2c2] mt-0.5">
                      {matchingScenarios[currentScenarioIndex].match.role}
                    </p>
                    <p className="text-xs text-[#d3dcec] mt-2 leading-relaxed">
                      &quot;{matchingScenarios[currentScenarioIndex].match.quote}&quot;
                    </p>
                    <p className="text-[10px] text-[#9aa2c2] mt-2">
                      {matchingScenarios[currentScenarioIndex].match.verified}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section
        id="how-it-works"
        className="relative bg-white px-4 py-24"
      >
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Three simple steps to start meaningful conversations
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group relative space-y-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd447] text-2xl font-bold text-slate-900">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Sign in
                </h3>
                <p className="mt-2 text-base font-medium text-slate-700">
                  Authenticate with LinkedIn or GitHub
                </p>
              </div>
              <p className="text-base leading-relaxed text-slate-600">
                We use OAuth to confirm you're a real professional. No passwords
                stored, no anonymous accounts.
              </p>
            </div>
            <div className="group relative space-y-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd447] text-2xl font-bold text-slate-900">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Choose topics
                </h3>
                <p className="mt-2 text-base font-medium text-slate-700">
                  Pick what you want to discuss
                </p>
              </div>
              <p className="text-base leading-relaxed text-slate-600">
                Select themes like backend, AI/ML, interviews, startups, or
                networking. We&apos;ll use this to find a relevant match.
              </p>
            </div>
            <div className="group relative space-y-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd447] text-2xl font-bold text-slate-900">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Get matched
                </h3>
                <p className="mt-2 text-base font-medium text-slate-700">
                  1:1 live conversation in seconds
                </p>
              </div>
              <p className="text-base leading-relaxed text-slate-600">
                You&apos;re paired with another tech person for a focused
                conversation. Skip, block, or report anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* People You May Know Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(190,242,100,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,212,71,0.1),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3b435a] bg-[#131827] px-4 py-2 text-sm font-medium text-[#d3dcec] shadow-sm backdrop-blur mb-4">
              <svg className="h-4 w-4 text-[#bef264]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Network & Connect</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl mb-4">
              People you may know
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[#d3dcec]">
              Connect with professionals from your network, company, or shared interests
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <PeopleYouMayKnow />
            </div>
          </div>
        </div>
      </section>

      <section
        id="safety"
        className="relative bg-gradient-to-b from-slate-50 to-white px-4 py-24"
      >
        <div className="mx-auto max-w-6xl space-y-16 text-base">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Safety first</h2>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-600">
              We start with identity: every user signs in with LinkedIn or GitHub, 
              and you can block or report anyone in one tap.
            </p>
          </div>
          
          {/* Layered Security Model Visualization */}
          <div className="relative">
            {/* Center Core - Your Safety */}
            <div className="flex justify-center mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffd447]/20 via-[#bef264]/20 to-[#ffd447]/20 rounded-full blur-3xl" />
                <div className="relative rounded-2xl border-2 border-[#ffd447] bg-white p-10 sm:p-14 shadow-xl">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd447] mb-2">
                      <svg className="h-8 w-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Safety</h3>
                    <p className="text-sm text-slate-600 max-w-xs">Protected by multiple layers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 1 - Identity & Authentication */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="relative w-full max-w-4xl">
                  <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6">
                    <SafetyFeatureCard
                      title="Verified Identity"
                      subtitle="LinkedIn & GitHub OAuth"
                      description="Every user authenticated through professional profiles"
                    />
                    <SafetyFeatureCard
                      title="One-Tap Block & Report"
                      subtitle="Instant Protection"
                      description="Quickly block or report anyone with a single tap"
                    />
                    <SafetyFeatureCard
                      title="Account Accountability"
                      subtitle="Tracked Behavior"
                      description="Repeat offenders automatically removed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 2 - Privacy Protection */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="relative w-full max-w-5xl">
                  <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6">
                    <SafetyFeatureCard
                      title="Screenshot Protection"
                      subtitle="Privacy First"
                      description="Advanced detection prevents screenshots"
                    />
                    <SafetyFeatureCard
                      title="Right-Click Protection"
                      subtitle="Content Security"
                      description="Context menus and text selection disabled"
                    />
                    <SafetyFeatureCard
                      title="Shortcut Blocking"
                      subtitle="Print Screen & More"
                      description="Screenshot methods are blocked"
                    />
                    <SafetyFeatureCard
                      title="DevTools Detection"
                      subtitle="Active Monitoring"
                      description="Real-time monitoring detects suspicious activity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative bg-slate-50 px-4 pb-24 pt-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 text-base sm:flex-row sm:items-start">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Ready to meet the tech internet?
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-slate-600">
              We&apos;re starting with web, LinkedIn and GitHub sign-in, and
              1:1 matching. Mobile apps and more advanced filters will follow.
            </p>
          </div>
          <div className="flex-1 space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {session ? "Get Started" : "Early access"}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {session ? "Ready to start a conversation?" : "Want to be one of the first to try it?"}
              </p>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              {session 
                ? "Click below to start matching with other tech professionals and begin meaningful conversations."
                : "Sign in with your LinkedIn or GitHub account to get started."}
            </p>
            <div className="mt-6">
              {session ? (
                <a
                  href="/match"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ffd447] px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#facc15] hover:shadow-md"
                >
                  Start Conversation
                </a>
              ) : (
                <LoginDropdown variant="faq" />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
