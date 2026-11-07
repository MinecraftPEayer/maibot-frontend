import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The quiet action on a maibot surface (sign out, try again).
 * Discord's own filled secondary grey, never blurple: blurple is reserved for the Discord action.
 */
export function SecondaryButton({ className, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <Button
            variant="secondary"
            className={cn(
                // Colours come from the --secondary tokens SurfaceShell sets (Discord's secondary button grey).
                "h-10 gap-2 rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground",
                "hover:bg-(--secondary-hover) active:bg-(--secondary-active) aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
                "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:focus-visible:ring-offset-card",
                "disabled:opacity-100 aria-disabled:cursor-progress aria-disabled:text-secondary-foreground/70 aria-disabled:hover:bg-secondary",
                "[&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}
