"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  type AuthActionState,
} from "@/lib/community/auth-actions";

const initialState: AuthActionState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="card space-y-4 rounded-xl p-6">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-danger">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full rounded-md px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/community/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
