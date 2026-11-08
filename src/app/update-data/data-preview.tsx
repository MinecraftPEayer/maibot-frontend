"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { CaretDownIcon, StarIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import {
    JUDGEMENTS,
    NOTE_TYPES,
    DX_NET_IMG,
    OVERVIEW_COLUMNS,
    TROPHY,
    chartTypeLabel,
    comboLabel,
    difficultyOf,
    formatAchievement,
    formatPlayTime,
    ratingPlate,
    syncLabel,
    tint,
} from "./labels";
import {
    DIFFICULTIES,
    type ChartScore,
    type PlayerData,
    type RecentDetail,
    type RecentScore,
    type UploadData,
} from "./types";

const DIFFICULTY_TITLES: Record<(typeof DIFFICULTIES)[number], string> = {
    basic: "BASIC scores",
    advanced: "ADVANCED scores",
    expert: "EXPERT scores",
    master: "MASTER scores",
    remaster: "Re:MASTER scores",
};

const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

/** Everything that will be uploaded, one drawer per item, shown once every item is read. */
export function DataPreview({ data }: { data: Omit<UploadData, "date"> }) {
    return (
        <section
            aria-labelledby="preview-heading"
            className="w-full max-w-[760px] min-w-0 animate-in px-2 py-4 delay-150 duration-500 ease-out fill-mode-backwards fade-in motion-reduce:animate-none lg:flex-1 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:px-10 sm:py-8 sm:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)]"
        >
            <h2 id="preview-heading" className="text-lg font-semibold tracking-tight">
                What will be uploaded
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
                Open a section to check it before uploading.
            </p>

            <div className="mt-4 border-t border-border">
                <Drawer title="Player profile" meta={`Rating ${data.playerData.rating.toLocaleString("en-US")}`}>
                    <PlayerProfile player={data.playerData} />
                </Drawer>
                <Drawer title="Recent plays" meta={plural(data.recentScores.length, "play")}>
                    <RecentPlays scores={data.recentScores} />
                </Drawer>
                <Drawer title="Latest credit details" meta={plural(data.recentCreditDetail.length, "track")}>
                    <CreditDetails details={data.recentCreditDetail} />
                </Drawer>
                {DIFFICULTIES.map((difficulty) => {
                    const scores = data.allScores[difficulty] ?? [];
                    return (
                        <Drawer
                            key={difficulty}
                            title={DIFFICULTY_TITLES[difficulty]}
                            meta={plural(scores.length, "chart")}
                        >
                            <ScoreTable scores={scores} />
                        </Drawer>
                    );
                })}
            </div>
        </section>
    );
}

function Drawer({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
    return (
        <details className="group border-b border-border">
            <summary className="-mx-2 flex h-14 cursor-pointer list-none items-center gap-3 rounded-lg px-2 select-none hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground tabular-nums">{meta}</span>
                <CaretDownIcon
                    aria-hidden
                    className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                />
            </summary>
            <div className="pt-1 pb-6">{children}</div>
        </details>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return <p className="py-2 text-sm text-muted-foreground">{children}</p>;
}

/* Player profile: the original page's plate layout, from maimai DX NET's own images */

// maimai DX NET images, loaded straight from DX NET (the browser sends no referrer, so hotlinking works).
function DxNetImage({ className, ...props }: React.ComponentProps<"img">) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img referrerPolicy="no-referrer" draggable={false} className={cn("select-none", className)} {...props} />;
}

function PlayerProfile({ player }: { player: PlayerData }) {
    const total = Object.values(player.overviewData ?? {})[0]?.[1];

    return (
        <div>
            <div className="flex items-start gap-3 sm:gap-4">
                <DxNetImage
                    src={player.avatar}
                    alt=""
                    width={128}
                    height={128}
                    className="size-20 shrink-0 rounded-lg bg-white/[0.05] object-cover sm:size-32"
                />
                <div className="w-[340px] min-w-0 shrink space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <RatingPlate rating={player.rating} />
                        {player.class && (
                            <DxNetImage src={player.class} alt="" className="h-auto w-[23%] object-contain" />
                        )}
                    </div>
                    <NamePlate name={player.playerName} course={player.course} />
                    <TitlePlate text={player.title?.text} type={player.title?.type ?? 0} />
                </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground tabular-nums">
                {player.playCount.all.toLocaleString("en-US")} plays
                {player.playCount.current != null &&
                    ` · ${player.playCount.current.toLocaleString("en-US")} this version`}
            </p>

            <div className="mt-6 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">Clear overview</h3>
                {total != null && (
                    <span className="text-sm text-muted-foreground tabular-nums">
                        of {total.toLocaleString("en-US")} charts
                    </span>
                )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 sm:gap-x-4">
                {OVERVIEW_COLUMNS.map((column, index) => (
                    <dl key={index} className="space-y-1.5">
                        {column.map((entry) => (
                            <OverviewRow key={entry.key} entry={entry} value={player.overviewData?.[entry.key]} />
                        ))}
                    </dl>
                ))}
            </div>
        </div>
    );
}

/** rating_base_<colour>.png with the rating set into its five dark slots (x 122–282, y 17–67 of 296×86). */
function RatingPlate({ rating }: { rating: number }) {
    const digits = String(rating).padStart(5, " ").slice(-5).split("");
    return (
        <div className="@container relative w-[44%] shrink-0" role="img" aria-label={`Rating ${rating}`}>
            <DxNetImage
                src={`${DX_NET_IMG}rating_base_${ratingPlate(rating)}.png`}
                alt=""
                width={296}
                height={86}
                className="block h-auto w-full"
            />
            <div
                aria-hidden
                className="absolute top-[19.8%] left-[41.2%] grid h-[58.1%] w-[54.1%] grid-cols-5 text-[14cqw] leading-none font-bold text-[#ffe25a] tabular-nums [text-shadow:0_1px_0_rgb(0_0_0/0.6)]"
            >
                {digits.map((digit, index) => (
                    <span key={index} className="flex items-center justify-center">
                        {digit.trim()}
                    </span>
                ))}
            </div>
        </div>
    );
}

// The plate keeps the original 48px height; only its width follows the column.
const NAME_MAX_PX = 30;
const NAME_MIN_PX = 14;

/** The light name plate with the course badge on its right, as on the original page. */
function NamePlate({ name, course }: { name: string; course?: string }) {
    const box = useRef<HTMLDivElement>(null);
    const text = useRef<HTMLSpanElement>(null);

    // Fit the name to the room it actually has: lay it out at the largest size, then scale down by the
    // measured overflow. Re-fits when the plate's width changes (window resize, layout switch).
    useLayoutEffect(() => {
        const room = box.current;
        const span = text.current;
        if (!room || !span) return;
        const fit = () => {
            span.style.fontSize = `${NAME_MAX_PX}px`;
            const available = room.clientWidth;
            const needed = span.scrollWidth;
            const size = needed > available ? (NAME_MAX_PX * available) / needed : NAME_MAX_PX;
            span.style.fontSize = `${Math.max(NAME_MIN_PX, Math.floor(size * 10) / 10)}px`;
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(room);
        document.fonts?.ready.then(fit).catch(() => {});
        return () => observer.disconnect();
    }, [name]);

    return (
        <div className="relative flex h-12 w-full items-center rounded-lg bg-(--action) pr-[96px] pl-3 text-(--action-foreground)">
            <div ref={box} className="min-w-0 flex-1 overflow-hidden">
                <span
                    ref={text}
                    className="block w-max leading-none font-bold tracking-[-0.03em] whitespace-nowrap"
                    style={{ fontSize: NAME_MAX_PX }}
                >
                    {name}
                </span>
            </div>
            {course && (
                <DxNetImage
                    src={course}
                    alt=""
                    className="absolute top-1/2 right-2 h-[34px] w-auto -translate-y-1/2 object-contain"
                />
            )}
        </div>
    );
}

/** trophy_<type>.png with the title centred on it, outlined like DX NET (268×25). */
function TitlePlate({ text, type }: { text?: string; type: number }) {
    return (
        <div className="@container relative aspect-[268/25] w-full">
            <DxNetImage
                src={`${DX_NET_IMG}trophy_${TROPHY[type] ?? "normal"}.png`}
                alt=""
                width={268}
                height={25}
                className="absolute inset-0 h-full w-full"
            />
            <p
                className="relative flex h-full items-center justify-center overflow-hidden px-[4%] text-[4.6cqw] leading-none font-semibold whitespace-nowrap text-white [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]"
                title={text}
            >
                <span className="truncate">{text || "No title"}</span>
            </p>
        </div>
    );
}

function OverviewRow({ entry, value }: { entry: (typeof OVERVIEW_COLUMNS)[number][number]; value?: number[] }) {
    return (
        <div className="flex h-10 items-center overflow-hidden rounded-lg bg-white/[0.04]">
            <dt className="flex h-full w-[68px] shrink-0 items-center justify-center bg-white/[0.06] sm:w-[76px]">
                <DxNetImage
                    src={`${DX_NET_IMG}music_icon_${entry.icon}.png`}
                    alt={entry.label}
                    className={cn("w-auto object-contain", entry.wide ? "h-6" : "h-8")}
                />
            </dt>
            <dd className="flex-1 truncate pr-3 text-right text-sm tabular-nums">
                {value ? (
                    <>
                        {value[0]?.toLocaleString("en-US")}
                        <span className="text-muted-foreground">/{value[1]?.toLocaleString("en-US")}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground">–</span>
                )}
            </dd>
        </div>
    );
}

/* Shared cells */

/** A solid difficulty label ("MAS 13+ DX"): the colour carries the difficulty, the text names it. */
function DifficultyChip({ difficulty, level, chartType }: { difficulty: number; level: string; chartType: number }) {
    const { name, short, color, ink } = difficultyOf(difficulty);
    return (
        <span
            className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-bold whitespace-nowrap tabular-nums"
            style={{ backgroundColor: color, color: ink }}
        >
            <span aria-hidden>{short}</span>
            <span className="sr-only">{name}</span>
            <span>{level}</span>
            <span className="font-semibold opacity-75">{chartTypeLabel(chartType)}</span>
        </span>
    );
}

function NewBadge({ label = "New" }: { label?: string }) {
    return (
        <span className="ml-1.5 shrink-0 rounded bg-(--success)/15 px-1 py-px text-[0.7rem] font-semibold whitespace-nowrap text-green-200">
            {label}
        </span>
    );
}

const th = "pb-2 text-left text-xs font-semibold text-muted-foreground";

/* Recent plays */

function RecentPlays({ scores }: { scores: RecentScore[] }) {
    if (scores.length === 0) return <Empty>No recent plays.</Empty>;

    return (
        // Separate rows so each can carry its difficulty's tint, like the original page's coloured rows.
        <table className="w-full table-fixed border-separate border-spacing-y-1 text-sm tabular-nums">
            <colgroup>
                <col className="hidden w-[10.5rem] sm:table-column" />
                <col />
                <col className="w-[6.5rem]" />
                <col className="w-24" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col" className={cn(th, "hidden pl-3 sm:table-cell")}>
                        Played
                    </th>
                    <th scope="col" className={cn(th, "pl-3 sm:pl-0")}>
                        Song
                    </th>
                    <th scope="col" className={th}>
                        Chart
                    </th>
                    <th scope="col" className={cn(th, "pr-3 text-right")}>
                        Achievement
                    </th>
                </tr>
            </thead>
            <tbody>
                {scores.map((score, index) => {
                    const { color } = difficultyOf(score.difficulty);
                    // Track 1 is a credit's first song; the list runs newest first, so a gap follows it.
                    const endsCredit = score.track === 1 && index < scores.length - 1;
                    return (
                        <Fragment key={`${score.idx}-${index}`}>
                            <tr style={{ backgroundColor: tint(color, 18) }}>
                                <td className="hidden truncate rounded-l-md py-2 pr-4 pl-3 text-muted-foreground sm:table-cell">
                                    {formatPlayTime(score.time)}
                                </td>
                                <td className="rounded-l-md py-2 pr-3 pl-3 sm:rounded-none sm:pl-0">
                                    {/* The song name gives way (…); the New badge always shows in full. */}
                                    <div className="flex min-w-0 items-center">
                                        <span className="truncate" title={score.songName}>
                                            {score.songName}
                                        </span>
                                        {score.achievementNewRecord && <NewBadge />}
                                    </div>
                                </td>
                                <td className="py-2 pr-2">
                                    <DifficultyChip
                                        difficulty={score.difficulty}
                                        level={score.level}
                                        chartType={score.chartType}
                                    />
                                </td>
                                <td className="rounded-r-md py-2 pr-3 text-right whitespace-nowrap">
                                    {formatAchievement(score.achievement)}
                                </td>
                            </tr>
                            {endsCredit && (
                                <tr aria-hidden>
                                    <td colSpan={4} className="h-2 p-0" />
                                </tr>
                            )}
                        </Fragment>
                    );
                })}
            </tbody>
        </table>
    );
}

/* Latest credit details */

function CreditDetails({ details }: { details: RecentDetail[] }) {
    if (details.length === 0) return <Empty>No details for the latest credit.</Empty>;

    return (
        <ol className="space-y-3">
            {details.map((detail) => (
                <li key={detail.track}>
                    <CreditTrack detail={detail} />
                </li>
            ))}
        </ol>
    );
}

function CreditTrack({ detail }: { detail: RecentDetail }) {
    const combo = comboLabel(detail.fcType);
    const sync = syncLabel(detail.syncType);
    const [comboNow, comboMax] = detail.combo ?? [];
    const [syncNow, syncMax] = detail.sync ?? [];
    const { color } = difficultyOf(detail.difficulty);

    return (
        // Each track is a tile in its difficulty's colour, as the original page's coloured cards were.
        <article
            className="rounded-lg border p-4"
            style={{ backgroundColor: tint(color, 14), borderColor: tint(color, 45) }}
        >
            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span>
                    Track {detail.track} · {formatPlayTime(detail.time)}
                </span>
                <DifficultyChip difficulty={detail.difficulty} level={detail.level} chartType={detail.chartType} />
            </div>
            <h3 className="mt-1 truncate font-semibold" title={detail.songName}>
                {detail.songName}
            </h3>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 tabular-nums">
                <span className="text-xl font-semibold tracking-tight">
                    {formatAchievement(detail.achievement)}
                    {detail.achievementNewRecord && <NewBadge />}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    DX {detail.dxScore.map((n) => n.toLocaleString("en-US")).join(" / ")}
                    {detail.dxStar > 0 && (
                        <span
                            className="ml-1 inline-flex items-center gap-0.5"
                            aria-label={`${detail.dxStar} DX stars`}
                        >
                            <StarIcon aria-hidden weight="fill" className="size-3.5 text-amber-200" />
                            {detail.dxStar}
                        </span>
                    )}
                    {detail.dxScoreNewRecord && <NewBadge />}
                </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm tabular-nums sm:grid-cols-4">
                <Stat label="Combo" value={comboNow != null ? `${comboNow} / ${comboMax}` : "–"} extra={combo} />
                <Stat
                    label="Sync"
                    value={syncNow != null && syncNow >= 0 ? `${syncNow} / ${syncMax}` : "–"}
                    extra={sync}
                />
                <Stat label="Fast" value={String(detail.fastLate?.fast ?? "–")} />
                <Stat label="Late" value={String(detail.fastLate?.late ?? "–")} />
            </dl>

            <JudgementTable notes={detail.noteDetail} />
        </article>
    );
}

function Stat({ label, value, extra }: { label: string; value: string; extra?: string }) {
    return (
        <div className="flex justify-between gap-3 sm:block">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>
                {value}
                {extra && <span className="ml-1.5 text-xs font-semibold">{extra}</span>}
            </dd>
        </div>
    );
}

function JudgementTable({ notes }: { notes: RecentDetail["noteDetail"] }) {
    if (!notes) return null;

    return (
        <table className="mt-4 w-full text-sm tabular-nums">
            <thead>
                <tr>
                    <th scope="col" className={cn(th, "w-16")}>
                        <span className="sr-only">Note</span>
                    </th>
                    {JUDGEMENTS.map(({ label, color }) => (
                        <th key={label} scope="col" className={cn(th, "text-right")} style={{ color }}>
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {NOTE_TYPES.map((type) => (
                    <tr key={type} className="border-t border-border/60">
                        <th
                            scope="row"
                            className="py-1 text-left text-xs font-semibold text-muted-foreground uppercase"
                        >
                            {type}
                        </th>
                        {JUDGEMENTS.map(({ label }, index) => {
                            const value = notes[type]?.[index];
                            return (
                                <td
                                    key={label}
                                    className={cn(
                                        "py-1 text-right",
                                        (value === "0" || !value) && "text-muted-foreground/60",
                                    )}
                                >
                                    {value ?? "–"}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/* Scores per difficulty */

function ScoreTable({ scores }: { scores: ChartScore[] }) {
    if (scores.length === 0) return <Empty>No played charts on this difficulty.</Empty>;

    return (
        <table className="w-full table-fixed text-sm tabular-nums">
            <colgroup>
                <col />
                <col className="w-16" />
                <col className="w-24" />
                <col className="hidden w-28 sm:table-column" />
                <col className="w-20" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col" className={th}>
                        Song
                    </th>
                    <th scope="col" className={th}>
                        Level
                    </th>
                    <th scope="col" className={cn(th, "text-right")}>
                        Achievement
                    </th>
                    <th scope="col" className={cn(th, "hidden text-right sm:table-cell")}>
                        DX score
                    </th>
                    <th scope="col" className={cn(th, "text-right")}>
                        Combo/Sync
                    </th>
                </tr>
            </thead>
            <tbody>
                {scores.map((score, index) => {
                    const badges = [comboLabel(score.comboType), syncLabel(score.syncType)].filter(Boolean).join(" ");
                    return (
                        <tr key={`${score.name}-${score.chartType}-${index}`} className="border-t border-border/60">
                            <td className="truncate py-1.5 pr-3" title={score.name}>
                                {score.name}
                            </td>
                            <td className="py-1.5 pr-3 whitespace-nowrap">
                                {score.level}
                                <span className="ml-1 text-xs text-muted-foreground">
                                    {chartTypeLabel(score.chartType)}
                                </span>
                            </td>
                            <td className="py-1.5 text-right whitespace-nowrap">
                                {formatAchievement(score.achievement)}
                            </td>
                            <td className="hidden py-1.5 text-right whitespace-nowrap text-muted-foreground sm:table-cell">
                                {score.dxScore?.[0]?.toLocaleString("en-US")}
                            </td>
                            <td className="truncate py-1.5 text-right text-xs font-semibold">{badges || "–"}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
