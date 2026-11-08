// Display names for the numeric codes in maimai DX NET data (same enums as the bookmarklet).

/**
 * Indexed by the numeric difficulty. Colours are maimai's own difficulty colours; `ink` is the
 * label colour that stays readable on a solid fill of that colour.
 */
export const DIFFICULTY = [
    { name: "BASIC", short: "BAS", color: "#45c124", ink: "#0b1f05" },
    { name: "ADVANCED", short: "ADV", color: "#ffba01", ink: "#2a1c00" },
    { name: "EXPERT", short: "EXP", color: "#ff7b7b", ink: "#2b0b0b" },
    { name: "MASTER", short: "MAS", color: "#9f51dc", ink: "#ffffff" },
    { name: "Re:MASTER", short: "Re:M", color: "#dbaaff", ink: "#24103a" },
    { name: "UTAGE", short: "UTA", color: "#ff6ffd", ink: "#2b0a2a" },
] as const;

export function difficultyOf(value: number) {
    return DIFFICULTY[value] ?? { name: "Unknown", short: "?", color: "#80848e", ink: "#ffffff" };
}

/** A difficulty colour mixed into the surface, for row and tile backgrounds. */
export const tint = (color: string, percent: number) => `color-mix(in oklch, ${color} ${percent}%, transparent)`;

export function chartTypeLabel(value: number) {
    return value === 1 ? "DX" : value === 0 ? "STD" : "";
}

const COMBO: Record<number, string> = { 0: "FC", 1: "FC+", 2: "AP", 3: "AP+" };
const SYNC: Record<number, string> = { 0: "FS", 1: "FS+", 2: "FDX", 3: "FDX+", 4: "SYNC" };

export const comboLabel = (value: number) => COMBO[value] ?? "";
export const syncLabel = (value: number) => SYNC[value] ?? "";

export function formatAchievement(value: number) {
    return `${value.toFixed(4)}%`;
}

export function formatPlayTime(value: Date | string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/**
 * The player overview, in the original page's two columns. `icon` is maimai DX NET's own
 * music_icon_<icon>.png; `wide` icons are the short rank badges, the rest are square-ish.
 */
export const OVERVIEW_COLUMNS: { key: string; icon: string; label: string; wide?: boolean }[][] = [
    [
        { key: "SSSp", icon: "sssp", label: "SSS+", wide: true },
        { key: "SSS", icon: "sss", label: "SSS", wide: true },
        { key: "SSp", icon: "ssp", label: "SS+", wide: true },
        { key: "SS", icon: "ss", label: "SS", wide: true },
        { key: "Sp", icon: "sp", label: "S+", wide: true },
        { key: "S", icon: "s", label: "S", wide: true },
        { key: "CLEAR", icon: "clear", label: "Clear", wide: true },
        { key: "dxstar_5", icon: "dxstar_5", label: "5 DX stars" },
        { key: "dxstar_4", icon: "dxstar_4", label: "4 DX stars" },
        { key: "dxstar_3", icon: "dxstar_3", label: "3 DX stars" },
        { key: "dxstar_2", icon: "dxstar_2", label: "2 DX stars" },
        { key: "dxstar_1", icon: "dxstar_1", label: "1 DX star" },
    ],
    [
        { key: "APp", icon: "app", label: "AP+" },
        { key: "AP", icon: "ap", label: "AP" },
        { key: "FCp", icon: "fcp", label: "FC+" },
        { key: "FC", icon: "fc", label: "FC" },
        { key: "FDXp", icon: "fdxp", label: "FDX+" },
        { key: "FDX", icon: "fdx", label: "FDX" },
        { key: "FSp", icon: "fsp", label: "FS+" },
        { key: "FS", icon: "fs", label: "FS" },
        { key: "SYNCPLAY", icon: "sync", label: "Sync play" },
    ],
];

export const DX_NET_IMG = "https://maimaidx-eng.com/maimai-mobile/img/";

/** maimai DX NET's rating plate colour for a rating (rating_base_<colour>.png). */
export function ratingPlate(rating: number) {
    if (rating >= 15000) return "rainbow";
    if (rating >= 14500) return "platinum";
    if (rating >= 14000) return "gold";
    if (rating >= 13000) return "silver";
    if (rating >= 12000) return "bronze";
    if (rating >= 10000) return "purple";
    if (rating >= 7000) return "red";
    if (rating >= 4000) return "orange";
    if (rating >= 2000) return "green";
    if (rating >= 1000) return "blue";
    return "normal";
}

/** Title plate by title type: normal, bronze, silver, gold, rainbow. */
export const TROPHY = ["normal", "bronze", "silver", "gold", "rainbow"] as const;

export const JUDGEMENTS = [
    { label: "Critical", color: "#ffbc09" },
    { label: "Perfect", color: "#ff9d00" },
    { label: "Great", color: "#f75ea3" },
    { label: "Good", color: "#2fca4c" },
    { label: "Miss", color: "#a3a6aa" },
] as const;

export const NOTE_TYPES = ["tap", "hold", "slide", "touch", "break"] as const;
