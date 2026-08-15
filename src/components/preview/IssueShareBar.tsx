"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export function IssueShareBar({ leagueName, headline }: { leagueName: string; headline: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — link is still visible/selectable in the address bar
    }
  }

  const smsHref = `sms:?&body=${encodeURIComponent(`${leagueName}'s Sunday Stories issue is out: ${headline} — ${url}`)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    `${leagueName}: ${headline}`,
  )}&body=${encodeURIComponent(`Read it here: ${url}`)}`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</Button>
      <ButtonLink href={smsHref} variant="outline">
        Text it
      </ButtonLink>
      <ButtonLink href={mailHref} variant="outline">
        Email it
      </ButtonLink>
    </div>
  );
}
