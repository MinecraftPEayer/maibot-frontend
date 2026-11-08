import { LinkBreakIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { StatusBanner } from "@/components/status-banner";

// Codes the OAuth callback sends back as ?error=<code>. Unknown codes fall back to the generic message.
const ERROR_MESSAGES: Record<string, string> = {
    access_denied: "Sign-in was cancelled. Authorize maibot on Discord to continue.",
    invalid_state: "This sign-in link expired. Start signing in again.",
    oauth_failed: "Discord didn't finish signing you in. Try again in a moment.",
    bot_unavailable: "maibot is offline, so sign-in couldn't finish. Try again in a few minutes.",
};

/** The banner for a ?error=<code> the OAuth callback sends back to /auth/login. */
export function LoginError({ error, className }: { error?: string | null; className?: string }) {
    if (!error) return null;

    if (error === "not_linked") {
        return (
            <StatusBanner
                tone="warning"
                className={className}
                icon={<LinkBreakIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
            >
                Your Discord account isn&apos;t linked to a maimai account yet. Run{" "}
                <code className="rounded bg-amber-300/15 px-1.5 py-0.5 font-mono text-[0.9em]">/link</code> in Discord,
                then sign in again.
            </StatusBanner>
        );
    }

    const message = ERROR_MESSAGES[error] ?? "Couldn't sign in with Discord. Try again in a moment.";

    return (
        <StatusBanner
            tone="error"
            className={className}
            icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
        >
            {message}
        </StatusBanner>
    );
}

