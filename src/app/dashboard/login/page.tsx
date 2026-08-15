"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Label, HelperText } from "@/components/ui/Field";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't sign in.");
      }
      router.push("/dashboard/league");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 bg-grain px-5 py-16">
      <Container size="narrow" className="max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-lg font-black tracking-tight text-paper-100">
            SUNDAY<span className="text-gold-400">STORIES</span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-black uppercase tracking-tight text-paper-100">
            Commissioner Sign In
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            Paste the access key you were given when you set up your league.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="token" className="text-paper-100">
              Commissioner access key
            </Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your key"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-crimson-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !token.trim()}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <HelperText>
          <span className="text-mist-500">
            No key? Access keys are shown once, right after onboarding — check with whoever
            set up your league, or{" "}
            <Link href="/onboarding" className="text-gold-400 hover:underline">
              start a new one
            </Link>
            .
          </span>
        </HelperText>
      </Container>
    </div>
  );
}
