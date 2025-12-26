"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication. Please try again.",
  };

  const errorMessage = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-[#0b1018] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-[#343d55] bg-[#050816] p-8 text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#f8f3e8]">
            Authentication Error
          </h1>
          <p className="text-sm text-[#d3dcec]">{errorMessage}</p>
          {error && (
            <p className="text-xs text-[#9aa2c2] font-mono">
              Error code: {error}
            </p>
          )}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#ffd447] px-6 py-3 text-sm font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15] hover:shadow-md"
            >
              Return to Home
            </Link>
            <Link
              href="/"
              className="text-sm text-[#9aa2c2] hover:text-[#d3dcec] transition"
            >
              Try signing in again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

