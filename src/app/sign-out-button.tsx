"use client";

import { useFormStatus } from "react-dom";
import { CircleNotchIcon, SignOutIcon } from "@phosphor-icons/react";

import { SecondaryButton } from "@/components/secondary-button";
import { logout } from "@/app/auth/actions";

/** Posts to the `logout` Server Action; a form keeps it working before hydration. */
export function SignOutForm() {
    return (
        <form action={logout}>
            <SignOutButton />
        </form>
    );
}

function SignOutButton() {
    const { pending } = useFormStatus();

    return (
        <SecondaryButton
            type="submit"
            aria-disabled={pending}
            onClick={(event) => {
                // Block a second submit while the first is in flight.
                if (pending) event.preventDefault();
            }}
        >
            {pending ? (
                <CircleNotchIcon aria-hidden className="animate-spin motion-reduce:animate-none" />
            ) : (
                <SignOutIcon aria-hidden />
            )}
            {pending ? "Signing out…" : "Sign out"}
        </SecondaryButton>
    );
}
