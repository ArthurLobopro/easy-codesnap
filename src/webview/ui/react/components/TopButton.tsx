import type { PropsWithChildren } from "react";
import { tw } from "@/util";

interface TopButtonProps extends PropsWithChildren {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

export function TopButton({ children, className = "", ...props }: TopButtonProps) {
  return (
    <button
      type="button"
      className={tw(
        className,
        "flex items-center justify-center p-1 border-none rounded cursor-pointer size-8",
        "hover:bg-toolbar-hover-background bg-vscode-background text-vscode-foreground",
        "disabled:text-vscode-disabled-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
