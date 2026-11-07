"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwiseIcon, CircleNotchIcon } from "@phosphor-icons/react";

import { SecondaryButton } from "@/components/secondary-button";
import { SurfaceCard } from "@/components/surface-shell";

/**
 * Shown when the bot API can't be reached. The session is kept:
 * once the bot is back, "Try again" re-renders the page and the player carries on signed in.
 */
export function BotOffline() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    // If the bot comes back, the page re-renders without this component, so any finished attempt here means it failed.
    const [attempts, setAttempts] = useState(0);

    const status = pending
        ? "Checking whether the bot is back…"
        : attempts > 0
          ? "Still can't reach the bot. Check back in a few minutes."
          : "The bot may be restarting. Check back in a few minutes.";

    return (
        <SurfaceCard motion="swap" aria-labelledby="offline-heading">
            <h1 id="offline-heading" className="text-2xl font-bold tracking-tight text-balance">
                maibot is offline
            </h1>
            <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                The site can&apos;t reach the bot right now, so your scores can&apos;t load. Nothing on your
                account has changed.
            </p>

            <div className="mt-8">
                <SecondaryButton
                    aria-disabled={pending}
                    onClick={() => {
                        if (pending) return;
                        setAttempts((n) => n + 1);
                        startTransition(() => router.refresh());
                    }}
                >
                    {pending ? (
                        <CircleNotchIcon aria-hidden className="animate-spin motion-reduce:animate-none" />
                    ) : (
                        <ArrowClockwiseIcon aria-hidden />
                    )}
                    {pending ? "Checking…" : "Try again"}
                </SecondaryButton>
            </div>

            <p aria-live="polite" className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                {status}
            </p>
        </SurfaceCard>
    );
}
