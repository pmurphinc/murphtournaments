import * as React from "react";
import { cn } from "@/lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-9 w-full rounded-md border border-zinc-700 bg-black/50 px-3 py-1 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyber-neon", className)} {...props} />
));
Input.displayName = "Input";
export { Input };