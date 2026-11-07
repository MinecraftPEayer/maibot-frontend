import { Suspense } from "react";
import type { Metadata } from "next";
import { LinkBreakIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { LoginButton } from "./login-button";

export const metadata: Metadata = {
    title: "Sign in · maibot",
};

const LoginPage = ({ searchParams }: PageProps<"/auth/login">) => {
    return (
        <div className="dark flex flex-1 flex-col">
        {/* Discord's cool, blue-tinted darks instead of shadcn's neutral greys.
            Set on an inner element because .dark (unlayered CSS) beats utilities on the same element. */}
        <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-discord/40 selection:text-white [--background:#1e1f22] [--border:#3f4147] [--card:#2b2d31] [--muted-foreground:#b5bac1]">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(88_101_242/0.14),transparent)]"
            />

            <header className="relative px-6 py-5 sm:px-10 sm:py-7">
                <span className="text-lg font-semibold tracking-tight">maibot</span>
            </header>

            <main className="relative flex flex-1 items-center justify-center px-4 pb-24">
                <section
                    aria-labelledby="login-heading"
                    className="w-full max-w-[420px] px-2 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-10 sm:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)]"
                >
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
                </section>
            </main>
        </div>
        </div>
    );
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

    const message =
        error === "access_denied"
            ? "Sign-in was cancelled. Authorize maibot on Discord to continue."
            : "Couldn't sign in with Discord. Try again in a moment.";

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
