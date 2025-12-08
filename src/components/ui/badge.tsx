import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                // Original variants
                default:
                    "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                    "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

                // Slate variants
                slate:
                    "border-transparent bg-slate-600/10 text-slate-600 [a&]:hover:bg-slate-600/20",
                "slate-outline":
                    "border-slate-600 text-slate-600 bg-slate-600/10 [a&]:hover:bg-slate-600/20",

                // Gray variants
                gray: "border-transparent bg-gray-600/10 text-gray-600 [a&]:hover:bg-gray-600/20",
                "gray-outline":
                    "border-gray-600 text-gray-600 bg-gray-600/10 [a&]:hover:bg-gray-600/20",

                // Zinc variants
                zinc: "border-transparent bg-zinc-600/10 text-zinc-600 [a&]:hover:bg-zinc-600/20",
                "zinc-outline":
                    "border-zinc-600 text-zinc-600 bg-zinc-600/10 [a&]:hover:bg-zinc-600/20",

                // Neutral variants
                neutral:
                    "border-transparent bg-neutral-600/10 text-neutral-600 [a&]:hover:bg-neutral-600/20",
                "neutral-outline":
                    "border-neutral-600 text-neutral-600 bg-neutral-600/10 [a&]:hover:bg-neutral-600/20",

                // Stone variants
                stone:
                    "border-transparent bg-stone-600/10 text-stone-600 [a&]:hover:bg-stone-600/20",
                "stone-outline":
                    "border-stone-600 text-stone-600 bg-stone-600/10 [a&]:hover:bg-stone-600/20",

                // Red variants
                red: "border-transparent bg-red-600/10 text-red-600 [a&]:hover:bg-red-600/20",
                "red-outline":
                    "border-red-600 text-red-600 bg-red-600/10 [a&]:hover:bg-red-600/20",

                // Orange variants
                orange:
                    "border-transparent bg-orange-600/10 text-orange-600 [a&]:hover:bg-orange-600/20",
                "orange-outline":
                    "border-orange-600 text-orange-600 bg-orange-600/10 [a&]:hover:bg-orange-600/20",

                // Amber variants
                amber:
                    "border-transparent bg-amber-600/10 text-amber-600 [a&]:hover:bg-amber-600/20",
                "amber-outline":
                    "border-amber-600 text-amber-600 bg-amber-600/10 [a&]:hover:bg-amber-600/20",

                // Yellow variants
                yellow:
                    "border-transparent bg-yellow-600/10 text-yellow-600 [a&]:hover:bg-yellow-600/20",
                "yellow-outline":
                    "border-yellow-600 text-yellow-600 bg-yellow-600/10 [a&]:hover:bg-yellow-600/20",

                // Lime variants
                lime: "border-transparent bg-lime-600/10 text-lime-600 [a&]:hover:bg-lime-600/20",
                "lime-outline":
                    "border-lime-600 text-lime-600 bg-lime-600/10 [a&]:hover:bg-lime-600/20",

                // Green variants
                green:
                    "border-transparent bg-green-600/10 text-green-600 [a&]:hover:bg-green-600/20",
                "green-outline":
                    "border-green-600 text-green-600 bg-green-600/10 [a&]:hover:bg-green-600/20",

                // Emerald variants
                emerald:
                    "border-transparent bg-emerald-600/10 text-emerald-600 [a&]:hover:bg-emerald-600/20",
                "emerald-outline":
                    "border-emerald-600 text-emerald-600 bg-emerald-600/10 [a&]:hover:bg-emerald-600/20",

                // Teal variants
                teal: "border-transparent bg-teal-600/10 text-teal-600 [a&]:hover:bg-teal-600/20",
                "teal-outline":
                    "border-teal-600 text-teal-600 bg-teal-600/10 [a&]:hover:bg-teal-600/20",

                // Cyan variants
                cyan: "border-transparent bg-cyan-600/10 text-cyan-600 [a&]:hover:bg-cyan-600/20",
                "cyan-outline":
                    "border-cyan-600 text-cyan-600 bg-cyan-600/10 [a&]:hover:bg-cyan-600/20",

                // Sky variants
                sky: "border-transparent bg-sky-600/10 text-sky-600 [a&]:hover:bg-sky-600/20",
                "sky-outline":
                    "border-sky-600 text-sky-600 bg-sky-600/10 [a&]:hover:bg-sky-600/20",

                // Blue variants
                blue: "border-transparent bg-blue-600/10 text-blue-600 [a&]:hover:bg-blue-600/20",
                "blue-outline":
                    "border-blue-600 text-blue-600 bg-blue-600/10 [a&]:hover:bg-blue-600/20",

                // Indigo variants
                indigo:
                    "border-transparent bg-indigo-600/10 text-indigo-600 [a&]:hover:bg-indigo-600/20",
                "indigo-outline":
                    "border-indigo-600 text-indigo-600 bg-indigo-600/10 [a&]:hover:bg-indigo-600/20",

                // Violet variants
                violet:
                    "border-transparent bg-violet-600/10 text-violet-600 [a&]:hover:bg-violet-600/20",
                "violet-outline":
                    "border-violet-600 text-violet-600 bg-violet-600/10 [a&]:hover:bg-violet-600/20",

                // Purple variants
                purple:
                    "border-transparent bg-purple-600/10 text-purple-600 [a&]:hover:bg-purple-600/20",
                "purple-outline":
                    "border-purple-600 text-purple-600 bg-purple-600/10 [a&]:hover:bg-purple-600/20",

                // Fuchsia variants
                fuchsia:
                    "border-transparent bg-fuchsia-600/10 text-fuchsia-600 [a&]:hover:bg-fuchsia-600/20",
                "fuchsia-outline":
                    "border-fuchsia-600 text-fuchsia-600 bg-fuchsia-600/10 [a&]:hover:bg-fuchsia-600/20",

                // Pink variants
                pink: "border-transparent bg-pink-600/10 text-pink-600 [a&]:hover:bg-pink-600/20",
                "pink-outline":
                    "border-pink-600 text-pink-600 bg-pink-600/10 [a&]:hover:bg-pink-600/20",

                // Rose variants
                rose: "border-transparent bg-rose-600/10 text-rose-600 [a&]:hover:bg-rose-600/20",
                "rose-outline":
                    "border-rose-600 text-rose-600 bg-rose-600/10 [a&]:hover:bg-rose-600/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";
    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };