"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function InaugurationOverlay() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
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
    
    // Step 2: After slide-up completes, navigate to celebration page
    setTimeout(() => {
      router.push("/inauguration/celebration");
    }, 800); // Wait for slide-up animation to complete
  };


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

    </div>
  );
}

