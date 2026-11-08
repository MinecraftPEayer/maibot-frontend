// Shapes the maibot bookmarklet posts back from maimai DX NET (see MinecraftPEayer/maibot-bookmarklet).

export const DIFFICULTIES = ["basic", "advanced", "expert", "master", "remaster"] as const;
export type DifficultyId = (typeof DIFFICULTIES)[number];

export type PlayerData = {
    playerName: string;
    rating: number;
    class: string;
    course: string;
    title: { text: string; type: number };
    avatar: string;
    playCount: { all: number; current?: number };
    overviewData: Record<string, number[]>;
};

export type RecentScore = {
    track: number;
    time: Date | string; // a Date over postMessage, a string once it has been through JSON
    difficulty: number;
    level: string;
    chartType: number;
    songName: string;
    achievement: number;
    achievementNewRecord: boolean;
    dxScore: number[];
    dxScoreNewRecord: boolean;
    dxStar: number;
    fcType: number;
    syncType: number;
    idx: string;
};

export type RecentDetail = RecentScore & {
    noteDetail: Record<"tap" | "hold" | "slide" | "touch" | "break", string[]>;
    fastLate: { fast: number; late: number };
    combo: number[];
    sync: number[];
};

export type ChartScore = {
    name: string;
    chartType: number;
    level: string;
    difficulty: number;
    achievement: number;
    dxScore: number[];
    syncType: number;
    comboType: number;
    playCount: number;
};

/** Everything the page collects, in the shape the bot's data upload stores as latest.json. */
export type UploadData = {
    playerData: PlayerData;
    recentScores: RecentScore[];
    recentCreditDetail: RecentDetail[];
    allScores: Record<DifficultyId, ChartScore[]>;
    date: number;
};

/** What the `uploadData` Server Action in ./actions.ts returns. */
export type UploadResult =
    { status: "ok" } | { status: "error"; error: "not_signed_in" | "bot_unavailable" | "upload_failed" };

export type BookmarkletMessage =
    | { type: "playerData"; data: PlayerData }
    | { type: "recentAll"; data: { records: RecentScore[] } }
    | { type: "recentDetail"; data: RecentDetail }
    | { type: "scoresData"; data: { difficulty: DifficultyId; records: ChartScore[] } };
