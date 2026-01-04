"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InaugurationCelebrationPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show content after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle spacebar press to navigate to homepage
  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      // Check if spacebar is pressed (and not typing in an input/textarea)
      if (event.code === "Space" || event.key === " ") {
        const target = event.target as HTMLElement;
        const isInputField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        
        if (!isInputField) {
          event.preventDefault();
          
          try {
            // Mark inauguration as completed
            await fetch("/api/inauguration", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                key: "SURETrust2026",
                action: "complete",
              }),
            });
          } catch (error) {
            console.error("Error completing inauguration:", error);
          }
          
          // Redirect to homepage
          router.push("/");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

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

  // Hide body scroll and hide header/footer for full screen
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Hide header and footer
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (header) {
      (header as HTMLElement).style.display = 'none';
    }
    if (footer) {
      (footer as HTMLElement).style.display = 'none';
    }
    if (main) {
      (main as HTMLElement).style.padding = '0';
      (main as HTMLElement).style.margin = '0';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (header) {
        (header as HTMLElement).style.display = '';
      }
      if (footer) {
        (footer as HTMLElement).style.display = '';
      }
      if (main) {
        (main as HTMLElement).style.padding = '';
        (main as HTMLElement).style.margin = '';
      }
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        width: '100vw', 
        height: '100dvh', // Use dynamic viewport height for mobile
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 99999,
        backgroundColor: '#000' // Fallback background
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/fireworks.mp4"
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/70 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/25 to-red-900/30" />
      </div>

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

      {/* Center Message */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <img 
            src="/ganeshji.png" 
            alt="Ganeshji" 
            className="h-12 sm:h-16 md:h-20 w-auto opacity-95"
          />
        </div>
        <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          <span className="text-yellow-200">Vinamah</span> — Where Connections Begin
        </h3>
        
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex justify-center mb-8">
            <img 
              src="/suretrust.png" 
              alt="SURE Trust" 
              className="h-16 sm:h-20 md:h-24 w-auto opacity-90"
            />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed mb-6">
            With heartfelt gratitude to
            <br />
            the <span className="font-semibold text-yellow-200">Chief Guest</span>, <span className="font-semibold text-yellow-200">SURE Trust</span>, and <span className="font-semibold text-yellow-200">Radha Ma'am</span>
            <br />
            for the trust, support, and opportunity
            <br />
            to launch this platform on such a meaningful occasion.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-yellow-200/90 leading-relaxed italic font-medium mt-8">
            May this platform give you conversations that inspire,
            <br />
            connections that create opportunities,
            <br />
            and relationships that shape your journey ahead.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}

