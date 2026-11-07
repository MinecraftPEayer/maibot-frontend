import 'server-only';

export type BotErrorCode =
    | 'not_linked'
    | 'invalid_discord_id'
    | 'missing_session_token'
    | 'invalid_session_token'
    | 'invalid_request_body';

export type SessionCreated = { token: string; expiresAt: number };
export type SessionInfo = { id: string; expiresAt: number };

export class BotUnavailableError extends Error {}

const OFFLINE_STATUS = new Set([502, 503, 504, 530]);

export async function botFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${process.env.BOT_API_KEY}`);

    let res: Response;
    try {
        res = await fetch(`${process.env.BOT_API_URL}${path}`, {
            ...init,
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(5000),
        });
    } catch {
        throw new BotUnavailableError();
    }
    if (OFFLINE_STATUS.has(res.status)) throw new BotUnavailableError();
    return res;
}