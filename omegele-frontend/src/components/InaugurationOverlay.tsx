"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface InaugurationOverlayProps {
  onLaunch: () => void;
}

export function InaugurationOverlay({ onLaunch }: InaugurationOverlayProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [showIntermediatePage, setShowIntermediatePage] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays and loops continuously
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  // Hide body scroll and ensure full screen coverage
  useEffect(() => {
    // Hide body overflow
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Hide header and footer if they exist (from layout)
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) {
      (header as HTMLElement).style.display = 'none';
    }
    if (footer) {
      (footer as HTMLElement).style.display = 'none';
    }

    return () => {
      // Restore on unmount
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (header) {
        (header as HTMLElement).style.display = '';
      }
      if (footer) {
        (footer as HTMLElement).style.display = '';
      }
    };
  }, []);

  const handleLaunch = async () => {
    setIsLaunching(true);
    
    // Step 1: Trigger slide-up animation
    setIsSlidingUp(true);
    
    // Step 2: After slide-up completes, show intermediate page with flowers and fireworks
    setTimeout(() => {
      setShowIntermediatePage(true);
      setShowConfetti(true);
    }, 800); // Wait for slide-up animation to complete
    
    // Step 3: After intermediate page animation, launch the platform
    setTimeout(() => {
      onLaunch();
    }, 4000); // Show intermediate page for 3-4 seconds
  };

  // Confetti animation effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3000;
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div 
      data-inauguration-overlay
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-transform duration-700 ease-in-out ${
        isSlidingUp ? 'transform -translate-y-full' : ''
      }`}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 99999
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/matte.mp4"
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80" />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd447]/30 bg-[#ffd447]/10 px-4 py-2 text-sm font-medium text-[#ffd447] mb-6 backdrop-blur-sm">
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span>Official Inauguration Ceremony</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
          Welcome to
          <br />
          <span className="text-[#ffd447]">Vinamah</span>
        </h1>

        <p className="text-xl sm:text-2xl text-[#d3dcec] mb-12 max-w-2xl mx-auto">
          Official Inauguration Ceremony
          <br />
          <span className="text-lg text-[#9aa2c2] mt-2 block">
            Platform Launch Event
          </span>
        </p>


        {/* Launch Button */}
        <div className="mb-8 relative inline-block">
          {/* Gift Ribbon Background - Above video, behind button */}
          <img
            src="https://freepngimg.com/thumb/ribbon/22842-4-gift-ribbon-image.png"
            alt="Gift Ribbon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-auto opacity-90"
            style={{ pointerEvents: 'none', zIndex: 5 }}
          />
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-[#ffd447] rounded-full shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all duration-300 hover:bg-[#facc15] hover:shadow-[0_0_60px_rgba(250,204,21,0.8)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isLaunching ? "animate-pulse" : ""
            }`}
            style={{ zIndex: 10 }}
          >
            {isLaunching ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                Launching Platform...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-6 w-6"
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
                Launch Platform
              </>
            )}
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-[#9aa2c2] max-w-md mx-auto">
          Click the button above to officially launch the Vinamah platform
        </p>
      </div>

      {/* Intermediate Page with Flowers and Fireworks */}
      {showIntermediatePage && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
          {/* Fireworks */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`firework-${i}`}
                className="absolute firework"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.5 + Math.random() * 1}s`,
                }}
              >
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
                <div className="firework-particle" />
              </div>
            ))}
          </div>

          {/* Flowers */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={`flower-${i}`}
                className="absolute flower"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${20 + Math.random() * 30}px`,
                }}
              >
                {['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐', '🌿'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>

          {/* Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${2 + Math.random() * 1.5}s`,
                  fontSize: `${15 + Math.random() * 20}px`,
                }}
              >
                ✨
              </div>
            ))}
          </div>

          {/* Center Message */}
          <div className="relative z-10 text-center px-4">
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 animate-pulse">
              🎊
            </h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Welcome to Vinamah!
            </h3>
            <p className="text-2xl sm:text-3xl text-yellow-200 font-semibold">
              Platform Launching...
            </p>
          </div>
        </div>
      )}

      {/* Confetti CSS Animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          animation: confetti-fall linear forwards;
          font-size: 1.5rem;
        }

        @keyframes firework-explode-1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(60px, 0) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(42px, 42px) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-3 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, 60px) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-4 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-42px, 42px) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-5 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-60px, 0) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-6 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-42px, -42px) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-7 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, -60px) scale(0);
            opacity: 0;
          }
        }
        @keyframes firework-explode-8 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(42px, -42px) scale(0);
            opacity: 0;
          }
        }

        .firework {
          position: absolute;
          width: 0;
          height: 0;
        }

        .firework-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .firework-particle:nth-child(1) {
          background: #ffd447;
          animation: firework-explode-1 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(2) {
          background: #ff6b6b;
          animation: firework-explode-2 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(3) {
          background: #4ecdc4;
          animation: firework-explode-3 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(4) {
          background: #ffe66d;
          animation: firework-explode-4 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(5) {
          background: #ff6b9d;
          animation: firework-explode-5 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(6) {
          background: #c44569;
          animation: firework-explode-6 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(7) {
          background: #f8b500;
          animation: firework-explode-7 1.5s ease-out forwards;
        }
        .firework-particle:nth-child(8) {
          background: #6c5ce7;
          animation: firework-explode-8 1.5s ease-out forwards;
        }

        @keyframes flower-float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .flower {
          animation: flower-float linear forwards;
          pointer-events: none;
        }

        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .sparkle {
          animation: sparkle-twinkle ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

