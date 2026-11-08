import { Suspense } from "react";
import type { Metadata } from "next";

import { SurfaceShell } from "@/components/surface-shell";
import { getSession } from "@/lib/session";
import { CollectorSkeleton, DataCollector } from "./data-collector";

export const metadata: Metadata = {
    title: "Upload data · maibot",
};

// Opened by the maibot bookmarklet from maimai DX NET (window.open, so window.opener is the DX NET tab).
export default function UpdateDataPage() {
    return (
        <SurfaceShell>
            {/* getSession() reads cookies, so with Cache Components it has to stream inside Suspense. */}
            <Suspense fallback={<CollectorSkeleton />}>
                <UpdateDataContent />
            </Suspense>
        </SurfaceShell>
    );
}

async function UpdateDataContent() {
    const session = await getSession();
    // Every state renders the same component, so router.refresh() after signing in keeps what's been read.
    return <DataCollector session={session.status} />;
}
