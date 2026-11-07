import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const state = crypto.randomUUID();

    const cookieStore = await cookies();
    cookieStore.set('discord_oauth2_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/discord/",
        maxAge: 60 * 10
    });

    const url = new URL("https://discord.com/api/oauth2/authorize");
    url.search = new URLSearchParams({
        client_id: process.env.DISCORD_OAUTH2_CLIENT_ID!,
        redirect_uri: process.env.DISCORD_OAUTH2_REDIRECT_URI!,
        response_type: "code",
        scope: "identify",
        state,
    }).toString();

    return NextResponse.redirect(url.toString(), 302);
}