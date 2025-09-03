import * as React from "react";
import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("min-h-[80px] w-full rounded-md border border-zinc-700 bg-black/50 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyber-neon", className)} {...props} />
));
Textarea.displayName = "Textarea";
export { Textarea };