// Keeps what this tab has read from maimai DX NET, so a reload doesn't read it all again
// (maimai DX NET rate-limits). sessionStorage is per tab and is gone when the tab closes.

import type { ChartScore, DifficultyId, PlayerData, RecentDetail, RecentScore } from "./types";

const DATA_KEY = "maibot:update-data";
const META_KEY = "maibot:update-data:meta";
const MAX_AGE_MS = 60 * 60 * 1000; // an hour-old read is likely missing new plays

export type CachedCollection = {
    readAt: number;
    player?: PlayerData;
    recent?: RecentScore[];
    details: RecentDetail[];
    scores: Partial<Record<DifficultyId, ChartScore[]>>;
    uploadedAt?: number;
};

type Meta = { readAt: number; complete: boolean };

/**
 * Only a reload (or Back/Forward) restores. Opening the page again from maimai DX NET is a fresh
 * navigation, which means the player wants new data.
 */
function isRestoringNavigation() {
    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    return entry?.type === "reload" || entry?.type === "back_forward";
}

function readMeta(): Meta | null {
    try {
        const meta = JSON.parse(sessionStorage.getItem(META_KEY) ?? "null") as Meta | null;
        if (!meta || Date.now() - meta.readAt > MAX_AGE_MS) return null;
        return meta;
    } catch {
        return null;
    }
}

/** Cheap check (small meta entry only) for whether a complete read can be restored without maimai DX NET. */
export function hasCompleteCache() {
    return isRestoringNavigation() && readMeta()?.complete === true;
}

/** The saved read for this tab, or null when this load shouldn't restore (and the old read is dropped). */
export function takeCache(): CachedCollection | null {
    if (!isRestoringNavigation() || !readMeta()) {
        clearCache();
        return null;
    }
    try {
        return JSON.parse(sessionStorage.getItem(DATA_KEY) ?? "null") as CachedCollection | null;
    } catch {
        return null;
    }
}

export function saveCache(collection: CachedCollection, complete: boolean) {
    try {
        sessionStorage.setItem(DATA_KEY, JSON.stringify(collection));
        sessionStorage.setItem(META_KEY, JSON.stringify({ readAt: collection.readAt, complete } satisfies Meta));
    } catch {
        // Over quota or storage blocked: the page still works, a reload just reads again.
        clearCache();
    }
}

export function clearCache() {
    try {
        sessionStorage.removeItem(DATA_KEY);
        sessionStorage.removeItem(META_KEY);
    } catch {
        // storage blocked; nothing to clear
    }
}
