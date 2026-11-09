"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@champidevi.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || payload.success === false) {
        setError(payload.message || "Unable to login");
        setLoading(false);
        return;
      }

      router.push(searchParams.get("from") || "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
   
<main className="flex min-h-dvh items-center justify-center bg-[#F6F4F0] px-4 py-6">
  <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/60 md:grid-cols-[0.9fr_1.1fr]">

    {/* School branding */}
    <div className="relative overflow-hidden bg-[#9D1913] px-5 py-5 text-white md:flex md:flex-col md:justify-center md:px-8 md:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-16 h-60 w-60 rounded-full border-[35px] border-white/5"
      />

      <div className="relative flex items-center gap-4 md:block">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 md:mb-5 md:h-24 md:w-24">
          <img
            src="/images/logo.png"
            alt="Smt. Champi Devi Inter College logo"
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-200">
            School Administration
          </p>

          <h2 className="mt-2 text-lg font-bold leading-snug md:text-2xl">
            Smt. Champi Devi
            <br />
            Inter College
          </h2>

          <div className="mt-3 h-1 w-10 rounded-full bg-[#F8F400] md:mt-5" />
        </div>
      </div>

      <p className="relative mt-6 hidden text-sm leading-6 text-red-100 md:block">
        Manage your school.
        <br />
        All in one place.
      </p>
    </div>

    {/* Login form */}
    <div className="px-5 py-6 sm:px-8 md:py-8">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D1913]">
          Admin Portal
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your account details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@champidevi.local"
            required
            className="min-h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF9] px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-[#9D1913] focus:bg-white focus:ring-2 focus:ring-[#9D1913]/10"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="min-h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF9] px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-[#9D1913] focus:bg-white focus:ring-2 focus:ring-[#9D1913]/10"
          />
        </div>

        {error ? (
          <div
            role="alert"
            className="break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#9D1913] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#7D140F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1913] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}

          {!loading ? (
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          ) : null}
        </button>
      </form>
    </div>
  </div>
</main>
  );
}

