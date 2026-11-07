import { cn } from "@/lib/utils";

/** The Discord-dark page frame every maibot surface sits in: ground, blurple haze, wordmark header. */
export function SurfaceShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="dark flex flex-1 flex-col">
            {/* Discord's cool, blue-tinted darks instead of shadcn's neutral greys (secondary is Discord's button grey).
                Set on an inner element because .dark (unlayered CSS) beats utilities on the same element. */}
            <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-discord/40 selection:text-white [--background:#1e1f22] [--border:#3f4147] [--card:#2b2d31] [--muted-foreground:#b5bac1] [--secondary:#4e5058] [--secondary-foreground:#ffffff] [--secondary-hover:#6d6f78] [--secondary-active:#5d6069]">
                <div
                    aria-hidden
                    className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(88_101_242/0.14),transparent)]"
                />

                <header className="relative px-6 py-5 sm:px-10 sm:py-7">
                    <span className="text-lg font-semibold tracking-tight">maibot</span>
                </header>

                <main className="relative flex flex-1 items-center justify-center px-4 pb-24">{children}</main>
            </div>
        </div>
    );
}

type SurfaceCardProps = React.ComponentProps<"section"> & {
    /**
     * "enter": the surface's one entrance (fade and rise 8px over 500ms).
     * "swap": a short fade for content that replaces a loading placeholder, so the entrance isn't played twice.
     */
    motion?: "enter" | "swap";
};

/** The single raised card; drops its frame below `sm` and sits full-bleed on the ground. */
export function SurfaceCard({ motion = "enter", className, ...props }: SurfaceCardProps) {
    return (
        <section
            className={cn(
                "w-full max-w-[420px] px-2 py-4 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-10 sm:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)]",
                motion === "enter" && "animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none",
                motion === "swap" && "animate-in fade-in duration-200 ease-out motion-reduce:animate-none",
                className,
            )}
            {...props}
        />
    );
}
