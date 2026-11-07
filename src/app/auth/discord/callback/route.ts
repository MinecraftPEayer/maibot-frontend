import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");

    if (!code || !state) {
        return new Response("Missing code or state", { status: 400 });
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("discord_oauth2_state")?.value;
    
    if (!storedState || storedState !== state) {
        return new Response("Invalid state", { status: 400 });
    }

    const tokenData = new URLSearchParams({
        client_id: process.env.DISCORD_OAUTH2_CLIENT_ID!,
        client_secret: process.env.DISCORD_OAUTH2_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_OAUTH2_REDIRECT_URI!,
    });

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenData.toString(),
    });

    if (!tokenResponse.ok) {
        return new Response("Failed to get access token", { status: 500 });
    }

    const tokenJson = await tokenResponse.json();
    const accessToken = tokenJson.access_token;

    const userData = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!userData.ok) {
        return new Response("Failed to fetch user data", { status: 500 });
    }

    const userJson = await userData.json();
    
    return new Response(JSON.stringify(userJson), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}