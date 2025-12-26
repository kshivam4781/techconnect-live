"use client";

import { useSession, signIn } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session) {
    return null; // User is logged in, UserMenu will handle it
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn("linkedin")}
        className="inline-flex items-center justify-center rounded-full bg-[#0077b5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#006399] hover:shadow-md"
      >
        Sign in with LinkedIn
      </button>
      <button
        onClick={() => signIn("github")}
        className="inline-flex items-center justify-center rounded-full bg-[#ffd447] px-4 py-2 text-sm font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15] hover:shadow-md"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}

