import { Suspense } from "react";
import { redirect } from "next/navigation";

import { BotOffline } from "@/components/bot-offline";
import { SurfaceCard, SurfaceShell } from "@/components/surface-shell";
import { getSession } from "@/lib/session";
import { SignOutForm } from "./sign-out-button";

export default function Home() {
    return (
        <SurfaceShell>
            {/* getSession() reads cookies, so with Cache Components it has to stream inside Suspense. */}
            <Suspense fallback={<HomeSkeleton />}>
                <HomeContent />
            </Suspense>
        </SurfaceShell>
    );
}

async function HomeContent() {
    const session = await getSession();

    if (session.status === "anonymous") redirect("/auth/login");
    if (session.status === "offline") return <BotOffline />;

    return (
        <SurfaceCard motion="swap" aria-labelledby="home-heading">
            <h1 id="home-heading" className="text-2xl font-bold tracking-tight text-balance">
                You&apos;re signed in
            </h1>
            <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                This is where your scores, rating and B50 will appear.
            </p>

            <div className="mt-8">
                <SignOutForm />
            </div>
        </SurfaceCard>
    );
}

/**
 * Same footprint as the signed-in card, so nothing shifts when the session resolves:
 * 32px heading line, 8px, two 26px body lines (the copy wraps at the card's width), 32px, 40px button.
 */
function HomeSkeleton() {
    return (
        <SurfaceCard aria-busy="true" aria-label="Loading">
            <div className="flex h-8 items-center">
                <div className="h-6 w-3/5 rounded-md bg-white/[0.07] motion-safe:animate-pulse" />
            </div>
            <div className="mt-2 flex h-[3.25rem] flex-col justify-center gap-1.5">
                <div className="h-5 w-11/12 rounded-md bg-white/[0.05] motion-safe:animate-pulse" />
                <div className="h-5 w-2/3 rounded-md bg-white/[0.05] motion-safe:animate-pulse" />
            </div>
            <div className="mt-8 h-10 w-28 rounded-lg bg-white/[0.05] motion-safe:animate-pulse" />
        </SurfaceCard>
    );
}
