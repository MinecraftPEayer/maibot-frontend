import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The main non-Discord action on a surface (upload). Discord's light filled button:
 * blurple stays reserved for the Discord action.
 */
export function PrimaryButton({ className, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <Button
            className={cn(
                // Colours come from the --action tokens SurfaceShell sets.
                "h-12 w-full gap-3 rounded-lg bg-(--action) text-base font-semibold text-(--action-foreground)",
                "hover:bg-(--action-hover) active:bg-(--action-active)",
                "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:focus-visible:ring-offset-card",
                "aria-disabled:cursor-not-allowed aria-disabled:bg-white/10 aria-disabled:text-muted-foreground aria-disabled:hover:bg-white/10 aria-disabled:active:translate-y-0",
                // Busy keeps the fill (the action is happening); the caller blocks repeat clicks.
                "aria-busy:cursor-progress aria-busy:hover:bg-(--action)",
                "[&_svg:not([class*='size-'])]:size-5",
                className,
            )}
            {...props}
        />
    );
}
