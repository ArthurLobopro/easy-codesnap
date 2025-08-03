import { Tooltip } from "@arthur-lobo/react-custom-tooltip";
import type { PropsWithChildren } from "react";

export function LeftTooltip({ children, className }: PropsWithChildren & PropsWithClassName) {
  return (
    <Tooltip align="horizontal-left" className={className}>
      {children}
    </Tooltip>
  );
}
