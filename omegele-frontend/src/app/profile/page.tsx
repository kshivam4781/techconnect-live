"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center">
        <p className="text-sm text-[#9aa2c2]">Checking your session…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center px-4">
        <div className="max-w-md space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 text-center">
          <h1 className="text-xl font-semibold">Sign in to see your profile</h1>
          <p className="text-sm text-[#9aa2c2]">
            TechConnect Live uses GitHub to verify you&apos;re a real person.
            Sign in to view your basic profile and manage your account.
          </p>
          <button
            onClick={() => signIn("github")}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_30px_rgba(250,204,21,0.7)]"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8] px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your TechConnect profile
          </h1>
          <p className="mt-2 text-sm text-[#9aa2c2]">
            This is the identity we&apos;ll use when matching you with other
            people. We start simple: your GitHub profile and email.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0b1018] p-5">
            <div className="flex items-center gap-4">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  className="h-12 w-12 rounded-full border border-[#343d55] object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#343d55] bg-[#111827] text-sm font-semibold">
                  {(user?.name || user?.email || "?")
                    .toString()
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {user?.name || "GitHub user"}
                </p>
                {user?.email && (
                  <p className="text-xs text-[#9aa2c2]">{user.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#c5cbe6]">
              <p className="font-medium text-[#f8f3e8]">Sign-in details</p>
              <p>
                Provider: <span className="font-semibold">GitHub</span>
              </p>
              <p>
                Status:{" "}
                <span className="font-semibold text-[#bef264]">Verified</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#050816] p-5 text-sm text-[#d3dcec]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
              Account controls
            </p>
            <p className="text-xs text-[#9aa2c2]">
              In future, you&apos;ll be able to set topics, seniority, and
              preferences here. For now, you can simply sign out.
            </p>
            <button
              onClick={() => signOut()}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-4 text-xs font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


