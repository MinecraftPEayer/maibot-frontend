import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LinkBreakIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { SurfaceCard, SurfaceShell } from "@/components/surface-shell";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { LoginButton } from "./login-button";

export const metadata: Metadata = {
    title: "Sign in · maibot",
};

const LoginPage = ({ searchParams }: PageProps<"/auth/login">) => {
    return (
        <SurfaceShell>
            {/* getSession() reads cookies, so with Cache Components it has to stream inside Suspense. */}
            <Suspense>
                <RedirectIfSignedIn />
            </Suspense>

            <SurfaceCard aria-labelledby="login-heading">
                <h1 id="login-heading" className="text-2xl font-bold tracking-tight text-balance">
                    Sign in to maibot
                </h1>
                <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                    View your maimai DX scores, rating and B50.
                </p>

                <Suspense>
                    {searchParams.then(({ error }) => (
                        <StatusBanner error={typeof error === "string" ? error : undefined} />
                    ))}
                </Suspense>

                <div className="mt-8">
                    <LoginButton />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                    Use the Discord account you already use with the bot.
                </p>
            </SurfaceCard>
        </SurfaceShell>
    );
};

// Already signed in: go home. Offline or anonymous: stay and show the sign-in card.
async function RedirectIfSignedIn() {
    const session = await getSession();
    if (session.status === "authenticated") redirect("/");
    return null;
}

// Codes the OAuth callback sends back as ?error=<code>. Unknown codes fall back to the generic message.
const ERROR_MESSAGES: Record<string, string> = {
    access_denied: "Sign-in was cancelled. Authorize maibot on Discord to continue.",
    invalid_state: "This sign-in link expired. Start again from this page.",
    oauth_failed: "Discord didn't finish signing you in. Try again in a moment.",
    bot_unavailable: "maibot is offline, so sign-in couldn't finish. Try again in a few minutes.",
};

// The OAuth callback redirects back here with ?error=<code>.
function StatusBanner({ error }: { error?: string }) {
    if (!error) return null;

    if (error === "not_linked") {
        return (
            <Banner tone="warning" icon={<LinkBreakIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}>
                Your Discord account isn&apos;t linked to a maimai account yet. Run{" "}
                <code className="rounded bg-amber-300/15 px-1.5 py-0.5 font-mono text-[0.9em]">/link</code> in
                Discord, then sign in again.
            </Banner>
        );
    }

    const message = ERROR_MESSAGES[error] ?? "Couldn't sign in with Discord. Try again in a moment.";

    return (
        <Banner tone="error" icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}>
            {message}
        </Banner>
    );
}

function Banner({
    tone,
    icon,
    children,
}: {
    tone: "error" | "warning";
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            role="alert"
            className={cn(
                "mt-6 flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed text-pretty",
                tone === "error" && "border-destructive/30 bg-destructive/10 text-red-200",
                tone === "warning" && "border-amber-400/30 bg-amber-400/10 text-amber-100",
            )}
        >
            {icon}
            <p>{children}</p>
        </div>
    );
}

export default LoginPage;
