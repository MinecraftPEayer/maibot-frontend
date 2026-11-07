import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { botFetch, BotUnavailableError, type SessionCreated, type SessionInfo } from '@/lib/bot';

const SESSION_COOKIE = 'session';

export type SessionState =
    | { status: 'authenticated'; discordId: string }
    | { status: 'anonymous' }
    | { status: 'offline' };

export async function createSession(discordId: string): Promise<'ok' | 'not_linked' | 'bot_unavailable'> {
    let res: Response;
    try {
        res = await botFetch('/api/v1/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: discordId }),
        });
    } catch (error) {
        if (error instanceof BotUnavailableError) return 'bot_unavailable';
        throw error;
    }

    if (res.status === 404) return 'not_linked';
    if (!res.ok) return 'bot_unavailable';

    const { token, expiresAt } = (await res.json()) as SessionCreated;
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(expiresAt),
    });
    return 'ok';
}

export const getSession = cache(async (): Promise<SessionState> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return { status: 'anonymous' };

    try {
        const res = await botFetch('/api/v1/sessions', { headers: { 'X-Session-Token': token } });
        if (res.status === 401) return { status: 'anonymous' };
        if (!res.ok) throw new Error(`Unexpected status ${res.status} from bot`);
        const { id } = (await res.json()) as SessionInfo;
        return { status: 'authenticated', discordId: id };
    } catch (error) {
        if (error instanceof BotUnavailableError) return { status: 'offline' };
        throw error;
    }
});

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
        await botFetch('/api/v1/sessions', { method: 'DELETE', headers: { 'X-Session-Token': token } }).catch(() => {});
    }
    cookieStore.delete(SESSION_COOKIE);
}