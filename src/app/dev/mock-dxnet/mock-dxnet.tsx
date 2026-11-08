"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { PrimaryButton } from "@/components/primary-button";
import { SurfaceCard } from "@/components/surface-shell";
import { cn } from "@/lib/utils";
import { DIFFICULTIES, type BookmarkletMessage, type DifficultyId, type UploadData } from "@/app/update-data/types";

type Kind = "player" | "recent" | "detail" | DifficultyId;

const KINDS: { kind: Kind; label: string }[] = [
    { kind: "player", label: "Player profile" },
    { kind: "recent", label: "Recent plays" },
    { kind: "detail", label: "Latest credit details" },
    { kind: "basic", label: "BASIC" },
    { kind: "advanced", label: "ADVANCED" },
    { kind: "expert", label: "EXPERT" },
    { kind: "master", label: "MASTER" },
    { kind: "remaster", label: "Re:MASTER" },
];

type LogEntry = { id: number; dir: "in" | "out" | "skip"; text: string };

/** Plays the bookmarklet's side of the postMessage protocol, answering from a saved latest.json. */
export function MockDxNet({ data, file }: { data: UploadData; file: string }) {
    const [delay, setDelay] = useState(600);
    // Kinds whose first request goes unanswered, to exercise the timeout and Retry.
    const [skipOnce, setSkipOnce] = useState<Set<Kind>>(new Set());
    const [log, setLog] = useState<LogEntry[]>([]);
    const [opened, setOpened] = useState(false);

    const win = useRef<Window | null>(null);
    const settings = useRef({ delay, skipOnce });
    const skipped = useRef(new Set<Kind>());
    const nextId = useRef(0);

    useEffect(() => {
        settings.current = { delay, skipOnce };
    }, [delay, skipOnce]);

    useEffect(() => {
        const add = (dir: LogEntry["dir"], text: string) =>
            setLog((entries) => [{ id: nextId.current++, dir, text }, ...entries].slice(0, 60));

        const answer = (message: string): { kind: Kind; reply?: BookmarkletMessage; note: string } | null => {
            if (message === "request_playerData") {
                return { kind: "player", reply: { type: "playerData", data: data.playerData }, note: "playerData" };
            }
            if (message === "request_recentAll") {
                const records = data.recentScores;
                return {
                    kind: "recent",
                    reply: { type: "recentAll", data: { records } },
                    note: `recentAll (${records.length})`,
                };
            }
            if (message.startsWith("request_recentDetail__")) {
                const idx = message.slice("request_recentDetail__".length);
                const detail = data.recentCreditDetail.find((d) => d.idx === idx);
                return detail
                    ? {
                          kind: "detail",
                          reply: { type: "recentDetail", data: detail },
                          note: `recentDetail track ${detail.track}`,
                      }
                    : { kind: "detail", note: `no saved detail for ${idx}` };
            }
            if (message.startsWith("request_allScores__")) {
                const difficulty = message.slice("request_allScores__".length) as DifficultyId;
                if (!DIFFICULTIES.includes(difficulty)) return null;
                const records = data.allScores[difficulty] ?? [];
                return {
                    kind: difficulty,
                    reply: { type: "scoresData", data: { difficulty, records } },
                    note: `scoresData ${difficulty} (${records.length})`,
                };
            }
            return null;
        };

        const onMessage = (event: MessageEvent) => {
            // Unlike the real bookmarklet: only answer the window we opened, on our own origin.
            if (!win.current || event.source !== win.current || event.origin !== window.location.origin) return;
            if (typeof event.data !== "string") return;

            add("in", event.data);
            const result = answer(event.data);
            if (!result) return;

            const { delay, skipOnce } = settings.current;
            if (skipOnce.has(result.kind) && !skipped.current.has(result.kind)) {
                skipped.current.add(result.kind);
                add("skip", `ignored ${event.data}`);
                return;
            }
            if (!result.reply) {
                add("skip", result.note);
                return;
            }

            const reply = result.reply;
            setTimeout(() => {
                win.current?.postMessage(reply, window.location.origin);
                add("out", result.note);
            }, delay);
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [data]);

    const open = () => {
        skipped.current.clear();
        setLog([]);
        win.current = window.open("/update-data", "ratingChart");
        setOpened(win.current != null);
    };

    const toggleSkip = (kind: Kind) =>
        setSkipOnce((current) => {
            const next = new Set(current);
            if (next.has(kind)) next.delete(kind);
            else next.add(kind);
            return next;
        });

    const counts = DIFFICULTIES.map((d) => data.allScores[d]?.length ?? 0).join(" / ");

    return (
        <SurfaceCard aria-labelledby="mock-heading">
            <h1 id="mock-heading" className="text-2xl font-bold tracking-tight text-balance">
                Mock maimai DX NET
            </h1>
            <p className="mt-2 text-base leading-relaxed text-pretty text-muted-foreground">
                Development only. Answers the upload page from a saved file instead of maimai DX NET.
            </p>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">File</dt>
                <dd className="truncate font-mono text-[0.9em]" title={file}>
                    {file}
                </dd>
                <dt className="text-muted-foreground">Player</dt>
                <dd className="truncate">
                    {data.playerData.playerName} · {data.playerData.rating}
                </dd>
                <dt className="text-muted-foreground">Recent</dt>
                <dd className="tabular-nums">
                    {data.recentScores.length} plays, {data.recentCreditDetail.length} details
                </dd>
                <dt className="text-muted-foreground">Charts</dt>
                <dd className="tabular-nums">{counts}</dd>
            </dl>

            <label className="mt-6 flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold">Answer delay</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                    <input
                        type="number"
                        min={0}
                        step={100}
                        value={delay}
                        onChange={(event) => setDelay(Math.max(0, Number(event.target.value) || 0))}
                        className="h-9 w-24 rounded-md border border-border bg-background px-2 text-right text-foreground tabular-nums focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
                    />
                    ms
                </span>
            </label>

            <fieldset className="mt-6">
                <legend className="text-sm font-semibold">Ignore the first request</legend>
                <p className="mt-1 text-sm text-muted-foreground">
                    The upload page times out after 30–60s and offers Retry.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {KINDS.map(({ kind, label }) => (
                        <label key={kind} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={skipOnce.has(kind)}
                                onChange={() => toggleSkip(kind)}
                                className="size-4 accent-(--action)"
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="mt-8">
                <PrimaryButton onClick={open}>
                    <ArrowSquareOutIcon aria-hidden />
                    {opened ? "Open upload page again" : "Open upload page"}
                </PrimaryButton>
            </div>

            {log.length > 0 && (
                <ol
                    aria-label="Messages"
                    className="mt-6 max-h-60 overflow-y-auto border-y border-border py-2 font-mono text-xs leading-relaxed"
                >
                    {log.map((entry) => (
                        <li
                            key={entry.id}
                            className={cn(
                                "truncate",
                                entry.dir === "in" && "text-muted-foreground",
                                entry.dir === "skip" && "text-amber-200",
                            )}
                        >
                            <span className="mr-2 inline-block w-8 opacity-70">{entry.dir}</span>
                            {entry.text}
                        </li>
                    ))}
                </ol>
            )}
        </SurfaceCard>
    );
}
