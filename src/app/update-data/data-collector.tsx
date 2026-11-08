"use client";

import { useEffect, useLayoutEffect, useReducer, useRef, useState, useSyncExternalStore, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowClockwiseIcon,
    CheckCircleIcon,
    CircleDashedIcon,
    CircleNotchIcon,
    CloudArrowUpIcon,
    WarningCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react";

import { discordButtonClassName } from "@/app/auth/login/login-button";
import DiscordLogo from "@/assets/discord-logo.svg";
import { LoginError } from "@/components/login-error";
import { PrimaryButton } from "@/components/primary-button";
import { StatusBanner } from "@/components/status-banner";
import { SurfaceCard } from "@/components/surface-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadData } from "./actions";
import { clearCache, hasCompleteCache, saveCache, takeCache, type CachedCollection } from "./collection-cache";
import { DataPreview } from "./data-preview";
import {
    DIFFICULTIES,
    type BookmarkletMessage,
    type ChartScore,
    type DifficultyId,
    type PlayerData,
    type RecentDetail,
    type RecentScore,
    type UploadData,
    type UploadResult,
} from "./types";

const DX_NET_ORIGIN = "https://maimaidx-eng.com";

/**
 * Where the opener's messages must come from. In development, /dev/mock-dxnet stands in for
 * maimai DX NET on this site's own origin; production builds only ever trust DX NET.
 */
function openerOrigin(opener: Window): string {
    if (process.env.NODE_ENV !== "development") return DX_NET_ORIGIN;
    try {
        if (opener.location.origin === window.location.origin) return window.location.origin;
    } catch {
        // Cross-origin opener: reading its location throws, so it's the real DX NET.
    }
    return DX_NET_ORIGIN;
}

// The bookmarklet never reports a failure, so a request with no answer in this time counts as failed.
const TIMEOUT_MS = { player: 30_000, recent: 30_000, detail: 45_000, scores: 60_000 };

type ItemKey = "player" | "recent" | "detail" | DifficultyId;
type ItemStatus = "waiting" | "loading" | "done" | "failed";
type Item = { status: ItemStatus; note?: string };

const ITEMS: { key: ItemKey; label: string }[] = [
    { key: "player", label: "Player profile" },
    { key: "recent", label: "Recent plays" },
    { key: "detail", label: "Latest credit details" },
    { key: "basic", label: "BASIC scores" },
    { key: "advanced", label: "ADVANCED scores" },
    { key: "expert", label: "EXPERT scores" },
    { key: "master", label: "MASTER scores" },
    { key: "remaster", label: "Re:MASTER scores" },
];

type Items = Record<ItemKey, Item>;
type Action =
    | { type: "loading"; key: ItemKey }
    | { type: "done"; key: ItemKey; note?: string }
    | { type: "timeout"; key: ItemKey }
    | { type: "reset" };

function reducer(items: Items, action: Action): Items {
    switch (action.type) {
        case "loading":
            return { ...items, [action.key]: { status: "loading" } };
        case "done":
            return { ...items, [action.key]: { status: "done", note: action.note } };
        case "reset":
            return initialItems;
        case "timeout":
            // A late answer may already have arrived; only a request still in flight can time out.
            if (items[action.key].status !== "loading") return items;
            return { ...items, [action.key]: { status: "failed" } };
    }
}

const initialItems = Object.fromEntries(ITEMS.map(({ key }) => [key, { status: "waiting" }])) as Items;

type Collected = {
    readAt: number;
    player?: PlayerData;
    recent?: RecentScore[];
    detailWanted: RecentScore[];
    details: Map<number, RecentDetail>;
    scores: Partial<Record<DifficultyId, ChartScore[]>>;
};

// Every key is listed, so Object.assign(data, emptyCollection()) really clears an earlier read.
const emptyCollection = (): Collected => ({
    readAt: Date.now(),
    player: undefined,
    recent: undefined,
    detailWanted: [],
    details: new Map(),
    scores: {},
});

function fromCache(cached: CachedCollection): Collected {
    return {
        readAt: cached.readAt,
        player: cached.player,
        recent: cached.recent,
        detailWanted: latestCredit(cached.recent ?? []),
        details: new Map(cached.details.map((detail) => [detail.track, detail])),
        scores: cached.scores ?? {},
    };
}

// records[0] is the newest play; its track number is how many tracks that credit had.
const latestCredit = (records: RecentScore[]) => records.slice(0, records[0]?.track ?? 0);

const detailsComplete = (data: Collected) =>
    data.recent != null && data.detailWanted.every((score) => data.details.has(score.track));

const isComplete = (data: Collected) =>
    data.player != null && detailsComplete(data) && DIFFICULTIES.every((d) => data.scores[d] != null);

function toUploadData(data: Collected): Omit<UploadData, "date"> {
    return {
        playerData: data.player!,
        recentScores: data.recent!,
        recentCreditDetail: [...data.details.values()].sort((a, b) => a.track - b.track),
        allScores: data.scores as Record<DifficultyId, ChartScore[]>,
    };
}

const count = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

type Source = "opener" | "cache" | "none";
const subscribeNoop = () => () => {};

type SessionStatus = "authenticated" | "anonymous" | "offline";

/**
 * Talks to the maibot bookmarklet in the maimai DX NET window that opened this page, then uploads.
 * Reading starts whether or not the player is signed in; signing in happens in a popup so this tab
 * (and what it has read) stays put. A reload restores what this tab already read instead of asking again.
 */
export function DataCollector({ session }: { session: SessionStatus }) {
    // null on the server; known once hydrated.
    const source = useSyncExternalStore<Source | null>(
        subscribeNoop,
        () => (window.opener != null ? "opener" : hasCompleteCache() ? "cache" : "none"),
        () => null,
    );

    if (source === null) return <CollectorSkeleton />;
    if (source === "none") return <NoOpener />;
    return <Collector session={session} canRequest={source === "opener"} />;
}

/**
 * When the preview appears on a wide screen the card moves from the centre to the left. This plays that
 * move (FLIP): remember where the card was, let the layout change, then animate from the old spot.
 * Nothing moves when the layout stacks (narrow screens) or reduced motion is requested.
 */
function useSlideIntoPlace(trigger: boolean) {
    const ref = useRef<HTMLElement>(null);
    const last = useRef<DOMRect | null>(null);
    const lastTrigger = useRef(trigger);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;
        const before = last.current;
        const now = element.getBoundingClientRect();
        const turnedOn = trigger && !lastTrigger.current;
        lastTrigger.current = trigger;

        if (turnedOn && before && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const dx = before.left - now.left;
            const dy = before.top - now.top;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], {
                    duration: 500,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                });
            }
        }
        last.current = element.getBoundingClientRect();
    });

    return ref;
}

function Collector({ session, canRequest }: { session: SessionStatus; canRequest: boolean }) {
    const router = useRouter();
    const [items, dispatch] = useReducer(reducer, initialItems);
    const collected = useRef<Collected>(emptyCollection());
    const timers = useRef(new Map<ItemKey, ReturnType<typeof setTimeout>>());
    const started = useRef(false);
    const controls = useRef<{ retry: (key: ItemKey) => void; readAgain: () => void; markUploaded: () => void }>({
        retry: () => {},
        readAgain: () => {},
        markUploaded: () => {},
    });
    // Collector only renders in the browser (the server sends the skeleton), so storage can be read here.
    const [cached] = useState(takeCache);
    const uploadedAt = useRef(cached?.uploadedAt);
    const [player, setPlayer] = useState<PlayerData | undefined>(cached?.player);
    const [preview, setPreview] = useState<Omit<UploadData, "date"> | null>(null);
    const card = useSlideIntoPlace(preview != null);
    const [restoredAt, setRestoredAt] = useState<number | null>(cached?.readAt ?? null);

    const [uploading, startUpload] = useTransition();
    const [upload, setUpload] = useReducer(
        (_: UploadResult | null, next: UploadResult | null) => next,
        (cached?.uploadedAt ? { status: "ok" } : null) as UploadResult | null,
    );

    useEffect(() => {
        const opener = window.opener as Window | null;
        const origin = opener ? openerOrigin(opener) : DX_NET_ORIGIN;
        const allTimers = timers.current;
        const data = collected.current;

        const send = (message: string) => {
            if (canRequest) opener?.postMessage(message, origin);
        };

        const persist = () => {
            const complete = isComplete(data);
            saveCache(
                {
                    readAt: data.readAt,
                    player: data.player,
                    recent: data.recent,
                    details: [...data.details.values()],
                    scores: data.scores,
                    uploadedAt: uploadedAt.current,
                },
                complete,
            );
            if (complete) setPreview(toUploadData(data));
        };

        const arm = (key: ItemKey, ms: number) => {
            clearTimeout(allTimers.get(key));
            allTimers.set(
                key,
                setTimeout(() => {
                    allTimers.delete(key);
                    dispatch({ type: "timeout", key });
                }, ms),
            );
        };

        const finish = (key: ItemKey, note?: string) => {
            clearTimeout(allTimers.get(key));
            allTimers.delete(key);
            dispatch({ type: "done", key, note });
            persist();
        };

        const finishDetails = () => {
            const n = data.detailWanted.length;
            finish("detail", n === 0 ? "No plays yet" : count(n, "track"));
        };

        const requestDetails = () => {
            const missing = data.detailWanted.filter((score) => !data.details.has(score.track));
            if (missing.length === 0) return finishDetails();
            dispatch({ type: "loading", key: "detail" });
            arm("detail", TIMEOUT_MS.detail);
            for (const score of missing) send(`request_recentDetail__${score.idx}`);
        };

        const requestScores = (difficulty: DifficultyId) => {
            if (allTimers.has(difficulty)) return; // already in flight
            dispatch({ type: "loading", key: difficulty });
            arm(difficulty, TIMEOUT_MS.scores);
            send(`request_allScores__${difficulty}`);
        };

        const request: Record<ItemKey, () => void> = {
            player: () => {
                dispatch({ type: "loading", key: "player" });
                arm("player", TIMEOUT_MS.player);
                send("request_playerData");
            },
            recent: () => {
                dispatch({ type: "loading", key: "recent" });
                arm("recent", TIMEOUT_MS.recent);
                send("request_recentAll");
            },
            detail: () => (data.recent ? requestDetails() : request.recent()),
            ...(Object.fromEntries(DIFFICULTIES.map((d) => [d, () => requestScores(d)])) as Record<
                DifficultyId,
                () => void
            >),
        };

        /** Shows what `data` already holds and asks maimai DX NET only for the rest. */
        const begin = (from: Collected) => {
            for (const timer of allTimers.values()) clearTimeout(timer);
            allTimers.clear();
            Object.assign(data, from);
            dispatch({ type: "reset" });
            setPlayer(data.player);
            setPreview(null);

            if (data.player) finish("player");
            else request.player();

            if (data.recent) {
                finish("recent", count(data.recent.length, "play"));
                requestDetails();
            } else request.recent();

            for (const d of DIFFICULTIES) {
                const scores = data.scores[d];
                if (scores) finish(d, count(scores.length, "chart"));
            }
            // One difficulty at a time, as the old page did, to go easy on maimai DX NET.
            const next = DIFFICULTIES.find((d) => !data.scores[d]);
            if (next) requestScores(next);
        };

        controls.current = {
            retry: (key) => request[key](),
            readAgain: () => {
                clearCache();
                uploadedAt.current = undefined;
                begin(emptyCollection());
            },
            markUploaded: () => {
                uploadedAt.current = Date.now();
                persist();
            },
        };

        const onMessage = (event: MessageEvent) => {
            if (!opener || event.source !== opener || event.origin !== origin) return;
            const message = event.data as BookmarkletMessage;
            if (!message || typeof message !== "object") return;

            switch (message.type) {
                case "playerData":
                    data.player = message.data;
                    setPlayer(message.data);
                    finish("player");
                    break;

                case "recentAll": {
                    const records = message.data.records ?? [];
                    data.recent = records;
                    data.detailWanted = latestCredit(records);
                    finish("recent", count(records.length, "play"));
                    requestDetails();
                    break;
                }

                case "recentDetail":
                    data.details.set(message.data.track, message.data);
                    if (detailsComplete(data)) finishDetails();
                    break;

                case "scoresData": {
                    const { difficulty, records = [] } = message.data;
                    if (!DIFFICULTIES.includes(difficulty)) break;
                    data.scores[difficulty] = records;
                    finish(difficulty, count(records.length, "chart"));
                    const next = DIFFICULTIES.find((d) => !data.scores[d]);
                    if (next) requestScores(next);
                    break;
                }
            }
        };

        window.addEventListener("message", onMessage);

        // Refs survive Strict Mode's remount, so this runs once per page load.
        if (!started.current) {
            started.current = true;
            begin(cached ? fromCache(cached) : emptyCollection());
        }

        // Pending timers are left running: a timeout after unmount only dispatches into nothing.
        return () => window.removeEventListener("message", onMessage);
    }, [canRequest, cached]);

    const doneCount = ITEMS.filter(({ key }) => items[key].status === "done").length;
    const ready = doneCount === ITEMS.length;
    const failed = ITEMS.some(({ key }) => items[key].status === "failed");
    const uploaded = upload?.status === "ok";
    // An upload can find the session gone (expired, or revoked by /unlink); treat that as signed out.
    const sessionLost = upload?.status === "error" && upload.error === "not_signed_in";
    const signedIn = session !== "anonymous" && !sessionLost;
    // Known offline: either the page loaded without the bot, or an upload just failed to reach it.
    // A reload re-checks for free, since the read is restored from this tab's cache.
    const offline = session === "offline" || (upload?.status === "error" && upload.error === "bot_unavailable");

    // Signing in may finish without the popup telling us (it was closed by hand, or Discord cut it off),
    // so re-check the session whenever the player comes back to this tab.
    useEffect(() => {
        if (signedIn) return;
        const recheck = () => router.refresh();
        window.addEventListener("focus", recheck);
        return () => window.removeEventListener("focus", recheck);
    }, [signedIn, router]);

    const onSignedIn = () => {
        setUpload(null);
        router.refresh();
    };

    const onUpload = () => {
        if (!ready || uploading || uploaded || offline) return;
        startUpload(async () => {
            const result = await uploadData({ ...toUploadData(collected.current), date: Date.now() }).catch(
                (): UploadResult => ({ status: "error", error: "upload_failed" }),
            );
            setUpload(result);
            if (result.status === "ok") controls.current.markUploaded();
        });
    };

    const onReadAgain = () => {
        setRestoredAt(null);
        setUpload(null);
        controls.current.readAgain();
    };

    return (
        // Wide screens put the preview to the right, with the card staying in view; narrower ones stack it below.
        <div className="flex w-full max-w-[1240px] flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-center">
            <SurfaceCard
                ref={card}
                motion="swap"
                aria-labelledby="update-heading"
                className="lg:sticky lg:top-8 lg:shrink-0"
            >
                <h1 id="update-heading" className="text-2xl font-bold tracking-tight text-balance">
                    Upload data to maibot
                </h1>
                <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                    Keep the maimai DX NET tab open while your scores are read.
                </p>

                <PlayerRow player={player} />

                <div className="mt-6 flex items-baseline justify-between text-sm">
                    <h2 className="font-semibold">Data from maimai DX NET</h2>
                    <span className="text-muted-foreground tabular-nums" aria-live="polite">
                        {doneCount} of {ITEMS.length}
                    </span>
                </div>

                <ul className="mt-2 divide-y divide-border border-y border-border">
                    {ITEMS.map(({ key, label }) => (
                        <StatusRow
                            key={key}
                            label={label}
                            item={items[key]}
                            onRetry={() => controls.current.retry(key)}
                        />
                    ))}
                </ul>

                {restoredAt != null && (
                    <RestoredNote readAt={restoredAt} canReadAgain={canRequest} onReadAgain={onReadAgain} />
                )}

                {failed && (
                    <StatusBanner
                        tone="error"
                        className="mt-6"
                        icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
                    >
                        maimai DX NET didn&apos;t answer. Check that you&apos;re still signed in there, then retry the
                        failed items.
                    </StatusBanner>
                )}

                {offline && (
                    <StatusBanner
                        tone="warning"
                        className="mt-6"
                        icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
                    >
                        maibot is offline right now. Reading carries on; reload this page once the bot is back.
                        What&apos;s been read is kept.
                    </StatusBanner>
                )}

                {!sessionLost && !offline && <UploadOutcome result={upload} />}

                {signedIn ? (
                    <UploadAction
                        ready={ready}
                        uploading={uploading}
                        uploaded={uploaded}
                        offline={offline}
                        onUpload={onUpload}
                    />
                ) : (
                    <SignInAction sessionLost={sessionLost} onSignedIn={onSignedIn} />
                )}
            </SurfaceCard>

            {preview && <DataPreview data={preview} />}
        </div>
    );
}

/** Says the list came from this tab's earlier read, and offers a fresh one. */
function RestoredNote({
    readAt,
    canReadAgain,
    onReadAgain,
}: {
    readAt: number;
    canReadAgain: boolean;
    onReadAgain: () => void;
}) {
    const time = new Date(readAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return (
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <p className="text-pretty">
                {canReadAgain
                    ? `Kept from this tab's read at ${time}.`
                    : `Kept from this tab's read at ${time}. Open this page from maimai DX NET to read again.`}
            </p>
            {canReadAgain && (
                <button
                    type="button"
                    onClick={onReadAgain}
                    className="-mr-2 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 font-semibold text-foreground hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                    <ArrowClockwiseIcon aria-hidden className="size-4" />
                    Read again
                </button>
            )}
        </div>
    );
}

function UploadAction({
    ready,
    uploading,
    uploaded,
    offline,
    onUpload,
}: {
    ready: boolean;
    uploading: boolean;
    uploaded: boolean;
    offline: boolean;
    onUpload: () => void;
}) {
    return (
        <>
            <div className="mt-8">
                <PrimaryButton aria-disabled={!ready || uploaded || offline} aria-busy={uploading} onClick={onUpload}>
                    {uploading ? (
                        <CircleNotchIcon aria-hidden className="animate-spin motion-reduce:animate-none" />
                    ) : uploaded ? (
                        <CheckCircleIcon aria-hidden weight="fill" />
                    ) : (
                        <CloudArrowUpIcon aria-hidden />
                    )}
                    {uploading ? "Uploading…" : uploaded ? "Uploaded" : "Upload to maibot"}
                </PrimaryButton>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                {uploaded
                    ? "You can close this window."
                    : offline
                      ? "Upload unlocks once maibot is back."
                      : ready
                        ? "Everything is read. Upload to update your scores on maibot."
                        : "Upload unlocks once every item is read."}
            </p>
        </>
    );
}

const POPUP = { name: "maibot-signin", width: 500, height: 760 };

/** Login with Discord in a popup, then tell the page so it can re-check the session. */
function SignInAction({ sessionLost, onSignedIn }: { sessionLost: boolean; onSignedIn: () => void }) {
    const [waiting, setWaiting] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const popup = useRef<Window | null>(null);

    useEffect(() => {
        if (!waiting) return;
        const id = setInterval(() => {
            const win = popup.current;
            if (!win || win.closed) {
                setWaiting(false);
                onSignedIn(); // re-check: it may have finished just before closing
                return;
            }
            let url: URL;
            try {
                url = new URL(win.location.href); // throws while the popup is on discord.com
            } catch {
                return;
            }
            if (url.origin !== window.location.origin || url.pathname.startsWith("/auth/discord")) return;

            if (url.pathname === "/auth/login") {
                // The callback sends failures to /auth/login?error=<code>; show them here instead.
                const code = url.searchParams.get("error");
                if (!code) return;
                win.close();
                setWaiting(false);
                setError(code);
                return;
            }

            // Anywhere else (normally "/"): the callback finished and set the session cookie.
            win.close();
            setWaiting(false);
            onSignedIn();
        }, 400);
        return () => clearInterval(id);
    }, [waiting, onSignedIn]);

    const openPopup = () => {
        if (waiting && popup.current && !popup.current.closed) {
            popup.current.focus();
            return;
        }
        setError(null);
        const left = Math.round(window.screenX + (window.outerWidth - POPUP.width) / 2);
        const top = Math.round(window.screenY + (window.outerHeight - POPUP.height) / 2);
        const win = window.open(
            "/auth/discord",
            POPUP.name,
            `popup,width=${POPUP.width},height=${POPUP.height},left=${left},top=${top}`,
        );
        setBlocked(!win);
        if (!win) return;
        popup.current = win;
        setWaiting(true);
    };

    return (
        <>
            <LoginError error={error} className="mt-6" />
            {blocked && (
                <StatusBanner
                    tone="warning"
                    className="mt-6"
                    icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
                >
                    Your browser blocked the sign-in window. Allow pop-ups for this site, then try again.
                </StatusBanner>
            )}

            <div className="mt-8">
                <Button
                    aria-busy={waiting}
                    onClick={openPopup}
                    className={cn(discordButtonClassName, "aria-busy:cursor-progress")}
                >
                    {waiting ? (
                        <CircleNotchIcon aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
                    ) : (
                        <Image src={DiscordLogo} alt="" aria-hidden width={24} height={18} />
                    )}
                    {waiting ? "Finish signing in on Discord…" : "Login with Discord"}
                </Button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                {sessionLost
                    ? "Your session ended. Sign in again to upload; what's been read is kept."
                    : "Sign in to upload. Reading carries on in the meantime."}
            </p>
        </>
    );
}

function PlayerRow({ player }: { player?: PlayerData }) {
    // Same 48px footprint while loading, so the list below doesn't move when the profile arrives.
    if (!player) {
        return (
            <div className="mt-6 flex h-12 items-center gap-3" aria-hidden>
                <div className="size-12 rounded-lg bg-white/[0.05] motion-safe:animate-pulse" />
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 rounded bg-white/[0.07] motion-safe:animate-pulse" />
                    <div className="h-3.5 w-44 rounded bg-white/[0.05] motion-safe:animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 flex h-12 animate-in items-center gap-3 fade-in duration-200 motion-reduce:animate-none">
            {/* The player's own icon, served by maimai DX NET. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={player.avatar}
                alt=""
                width={48}
                height={48}
                referrerPolicy="no-referrer"
                className="size-12 rounded-lg bg-white/[0.05] object-cover"
            />
            <div className="min-w-0">
                <p className="truncate font-semibold">{player.playerName}</p>
                <p className="text-sm text-muted-foreground tabular-nums">
                    Rating {player.rating.toLocaleString("en-US")} · {player.playCount.all.toLocaleString("en-US")}{" "}
                    plays
                </p>
            </div>
        </div>
    );
}

function StatusRow({ label, item, onRetry }: { label: string; item: Item; onRetry: () => void }) {
    return (
        <li className="flex h-11 items-center gap-3 text-sm">
            <StatusIcon status={item.status} />
            <span className={cn("flex-1 truncate", item.status === "waiting" && "text-muted-foreground")}>{label}</span>
            {item.status === "failed" ? (
                <button
                    type="button"
                    onClick={onRetry}
                    className="-mr-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-semibold text-red-200 hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                    <ArrowClockwiseIcon aria-hidden className="size-4" />
                    Retry
                </button>
            ) : (
                <span className="text-muted-foreground tabular-nums">{rowNote(item)}</span>
            )}
        </li>
    );
}

function rowNote(item: Item) {
    switch (item.status) {
        case "waiting":
            return "Waiting";
        case "loading":
            return "Reading…";
        case "done":
            return item.note ?? "Done";
        case "failed":
            return "No answer";
    }
}

function StatusIcon({ status }: { status: ItemStatus }) {
    const className = "size-5 shrink-0";
    switch (status) {
        case "waiting":
            return <CircleDashedIcon aria-label="Waiting" className={cn(className, "text-muted-foreground/60")} />;
        case "loading":
            return (
                <CircleNotchIcon
                    aria-label="Reading"
                    className={cn(className, "animate-spin text-muted-foreground motion-reduce:animate-none")}
                />
            );
        case "done":
            return <CheckCircleIcon aria-label="Done" weight="fill" className={cn(className, "text-(--success)")} />;
        case "failed":
            return <XCircleIcon aria-label="Failed" weight="fill" className={cn(className, "text-destructive")} />;
    }
}

const UPLOAD_ERRORS: Record<Extract<UploadResult, { status: "error" }>["error"], string> = {
    not_signed_in: "Your session ended. Sign in again, then start over from maimai DX NET.",
    bot_unavailable: "maibot is offline, so the upload didn't finish. Try again in a few minutes.",
    upload_failed: "The upload didn't finish. Try again in a moment.",
};

function UploadOutcome({ result }: { result: UploadResult | null }) {
    if (!result) return null;
    if (result.status === "ok") {
        return (
            <StatusBanner
                tone="success"
                className="mt-6"
                icon={<CheckCircleIcon aria-hidden weight="fill" className="mt-0.5 size-5 shrink-0" />}
            >
                Uploaded. maibot now has your latest scores.
            </StatusBanner>
        );
    }
    return (
        <StatusBanner
            tone="error"
            className="mt-6"
            icon={<WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />}
        >
            {UPLOAD_ERRORS[result.error]}
        </StatusBanner>
    );
}

function NoOpener() {
    return (
        <SurfaceCard motion="swap" aria-labelledby="update-heading">
            <h1 id="update-heading" className="text-2xl font-bold tracking-tight text-balance">
                Open this from maimai DX NET
            </h1>
            <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                This page reads your scores from the maimai DX NET tab that opens it. Sign in to maimai DX NET, run the
                maibot bookmarklet on any page there, then choose Upload Data to maibot.
            </p>
        </SurfaceCard>
    );
}

/** Same footprint as the collector card's top, shown until the browser says whether an opener exists. */
export function CollectorSkeleton() {
    return (
        <SurfaceCard aria-busy="true" aria-label="Loading">
            <div className="flex h-8 items-center">
                <div className="h-6 w-3/5 rounded-md bg-white/[0.07] motion-safe:animate-pulse" />
            </div>
            <div className="mt-2 flex h-[3.25rem] flex-col justify-center gap-1.5">
                <div className="h-5 w-11/12 rounded-md bg-white/[0.05] motion-safe:animate-pulse" />
                <div className="h-5 w-1/2 rounded-md bg-white/[0.05] motion-safe:animate-pulse" />
            </div>
            <div className="mt-6 h-12 rounded-lg bg-white/[0.04] motion-safe:animate-pulse" />
            <div className="mt-6 h-[23rem] rounded-lg bg-white/[0.03] motion-safe:animate-pulse" />
        </SurfaceCard>
    );
}
