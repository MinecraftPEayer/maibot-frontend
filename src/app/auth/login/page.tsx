import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SurfaceCard, SurfaceShell } from "@/components/surface-shell";
import { LoginError } from "@/components/login-error";
import { getSession } from "@/lib/session";
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
                        <LoginError error={typeof error === "string" ? error : undefined} className="mt-6" />
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

export default LoginPage;
