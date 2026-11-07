import { createSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "discord_oauth2_state";

type LoginErrorCode = 'access_denied' | 'invalid_state' | 'oauth_failed' | 'not_linked' | 'bot_unavailable';

async function fetchDiscordUserId(code: string): Promise<string | null> {
    try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_OAUTH2_CLIENT_ID!,
                client_secret: process.env.DISCORD_OAUTH2_CLIENT_SECRET!,
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.DISCORD_OAUTH2_REDIRECT_URI!,
            }),
            signal: AbortSignal.timeout(10_000),
        });
        if (!tokenRes.ok) return null;
        const { access_token } = (await tokenRes.json()) as { access_token?: string };
        if (!access_token) return null;

        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${access_token}` },
            signal: AbortSignal.timeout(10_000),
        });
        if (!userRes.ok) return null;
        const { id } = (await userRes.json()) as { id?: unknown };
        return typeof id === "string" ? id : null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const fail = (code: LoginErrorCode) => NextResponse.redirect(new URL(`/auth/login?error=${code}`, request.url));    


    

    const cookieStore = await cookies();
    const storedState = cookieStore.get(STATE_COOKIE)?.value;
    cookieStore.delete(STATE_COOKIE);

    if (params.get("error") === "access_denied") return fail("access_denied");

    const code = params.get("code");
    const state = params.get("state");
    
    if (!code || !state || !storedState || state !== storedState) return fail('invalid_state');

    const discordId = await fetchDiscordUserId(code);
    if (!discordId) return fail('oauth_failed');

    const sessionResult =await createSession(discordId)

    if (sessionResult !== 'ok') return fail(sessionResult);

    return NextResponse.redirect(new URL("/", request.url))
}