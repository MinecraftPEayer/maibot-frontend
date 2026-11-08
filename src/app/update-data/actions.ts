"use server";
import { cookies } from "next/headers";
import { botFetch, BotUnavailableError } from "@/lib/bot";
import type { UploadData, UploadResult } from "./types";

export async function uploadData(data: UploadData): Promise<UploadResult> {
    const token = (await cookies()).get("session")?.value;
    if (!token) return { status: "error", error: "not_signed_in" };
    try {
        const res = await botFetch("/api/v1/user/data", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Session-Token": token },
            body: JSON.stringify(data),
        });
        if (res.status === 401) return { status: "error", error: "not_signed_in" };
        return res.ok ? { status: "ok" } : { status: "error", error: "upload_failed" };
    } catch (e) {
        if (e instanceof BotUnavailableError) return { status: "error", error: "bot_unavailable" };
        return { status: "error", error: "upload_failed" };
    }
}
