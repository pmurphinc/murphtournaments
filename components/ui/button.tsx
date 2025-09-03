import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 border border-zinc-700 hover:border-cyber-gold",
        neon: "bg-black/60 border border-cyber-neon text-cyber-neon shadow-glow hover:bg-black/80",
        ghost: "bg-transparent hover:bg-zinc-900/60 border border-transparent"
      },
      size: { default: "h-9 px-4 py-2", sm: "h-8 px-3", lg: "h-10 px-8" }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
));
Button.displayName = "Button";
export { Button, buttonVariants };