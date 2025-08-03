import type { PropsWithChildren } from "react";
import { tw } from "@/util";

interface SettingLineProps extends PropsWithChildren {
  onClick?: () => void;
  className?: string;
}

export function SettingLine({ children, onClick, className }: SettingLineProps) {
  return (
    <li className={tw("cursor-pointer rounded flex items-center list-none text-sm", className)} onClick={onClick}>
      {children}
    </li>
  );
}

export function SettingLineWithSelect({ className, ...props }: SettingLineProps) {
  return <SettingLine {...props} className={tw("cursor-auto p-1 justify-between w-full gap-2", className)} />;
}
