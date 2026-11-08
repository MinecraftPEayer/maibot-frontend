"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleNotchIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import DiscordLogo from "@/assets/discord-logo.svg";

/** The blurple Login with Discord button (the one place blurple fills a control). */
export const discordButtonClassName =
    "h-12 w-full gap-3 rounded-lg bg-discord text-base font-semibold text-white hover:bg-discord-hover active:bg-[#3C45A5] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:focus-visible:ring-offset-card aria-disabled:cursor-progress aria-disabled:hover:bg-discord";

export function LoginButton() {
    const [pending, setPending] = useState(false);

    // Coming back with the browser's Back button restores the page from cache; clear the loading state.
    useEffect(() => {
        const reset = (event: PageTransitionEvent) => {
            if (event.persisted) setPending(false);
        };
        window.addEventListener("pageshow", reset);
        return () => window.removeEventListener("pageshow", reset);
    }, []);

    return (
        <Button
            nativeButton={false}
            render={<a href="/auth/discord" />}
            onClick={(event) => {
                // Block a second click while Discord is loading.
                if (pending) event.preventDefault();
                setPending(true);
            }}
            aria-disabled={pending}
            className={discordButtonClassName}
        >
            {pending ? (
                <CircleNotchIcon aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
            ) : (
                <Image src={DiscordLogo} alt="" aria-hidden width={24} height={18} />
            )}
            {pending ? "Opening Discord…" : "Login with Discord"}
        </Button>
    );
}
