import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-6 py-3 overflow-hidden font-semibold text-white rounded-full transition-all duration-300 ease-out",
        "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
        "hover:scale-[1.02] active:scale-[0.98]",
        "shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)]",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600",
        "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        "after:absolute after:inset-0 after:rounded-full",
        "after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]",
        "after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
