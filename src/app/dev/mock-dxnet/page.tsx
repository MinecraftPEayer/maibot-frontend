import { readFile } from "node:fs/promises";
import path from "node:path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { SurfaceCard, SurfaceShell } from "@/components/surface-shell";
import type { UploadData } from "@/app/update-data/types";
import { MockDxNet } from "./mock-dxnet";

export const metadata: Metadata = {
    title: "Mock maimai DX NET · maibot",
};

/**
 * Development only: stands in for maimai DX NET + the bookmarklet, answering /update-data from a saved file.
 * Set MOCK_DXNET_FILE to a bot upload (maibot/data/user/<discordId>/latest.json) to turn it on.
 */
export default function MockDxNetPage() {
    const mockFile = process.env.MOCK_DXNET_FILE;
    if (process.env.NODE_ENV !== "development" || !mockFile) notFound();

    return (
        <SurfaceShell>
            <Suspense>
                <MockLoader mockFile={mockFile} />
            </Suspense>
        </SurfaceShell>
    );
}

async function MockLoader({ mockFile }: { mockFile: string }) {
    await connection(); // read the file on every request, so edits to it show up on reload
    // Dev-only read; the ignore comment keeps the build from tracing the whole project into the server output.
    const file = path.resolve(/*turbopackIgnore: true*/ process.cwd(), mockFile);

    let data: UploadData;
    try {
        data = JSON.parse(await readFile(file, "utf8")) as UploadData;
    } catch (error) {
        return (
            <SurfaceCard aria-labelledby="mock-heading">
                <h1 id="mock-heading" className="text-2xl font-bold tracking-tight text-balance">
                    Couldn&apos;t read the mock data
                </h1>
                <p className="mt-2 text-base leading-relaxed text-pretty break-all text-muted-foreground">{file}</p>
                <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                    {error instanceof Error ? error.message : String(error)}. Set{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em]">MOCK_DXNET_FILE</code> to
                    a latest.json path.
                </p>
            </SurfaceCard>
        );
    }

    // Show the path relative to the project when it's nearby, otherwise in full.
    const relative = path.relative(process.cwd(), file);
    return <MockDxNet data={data} file={relative.startsWith("../../") ? file : relative} />;
}
