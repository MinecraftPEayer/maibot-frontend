import { cn } from "@/lib/utils";

/** Tinted inline status: says what happened, then what to do next. */
export function StatusBanner({
    tone,
    icon,
    className,
    children,
}: {
    tone: "error" | "warning" | "success";
    icon: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            role={tone === "success" ? "status" : "alert"}
            className={cn(
                "flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed text-pretty",
                tone === "error" && "border-destructive/30 bg-destructive/10 text-red-200",
                tone === "warning" && "border-amber-400/30 bg-amber-400/10 text-amber-100",
                tone === "success" && "border-(--success)/30 bg-(--success)/10 text-green-100",
                className,
            )}
        >
            {icon}
            <p>{children}</p>
        </div>
    );
}
