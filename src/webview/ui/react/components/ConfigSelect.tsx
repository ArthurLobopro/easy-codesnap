import { tw } from "@/util";
import { useUpdateSelectsWidth } from "../hooks/useSelectWidthUpdater";

interface ConfigSelectProps
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {}

export function ConfigSelect({ className = "", children, ...props }: ConfigSelectProps) {
  useUpdateSelectsWidth();

  return (
    <select
      className={tw(
        "text-vscode-foreground bg-sidebar-background outline-0 min-w-min w-[var(--bigger-select-width)] py-0.5 rounded",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
