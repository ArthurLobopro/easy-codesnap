import { Tooltip } from "@arthur-lobo/react-custom-tooltip";
import type { PropsWithChildren } from "react";

interface TooltipBottomProps extends PropsWithChildren {
  horizontal?: "right" | "left" | "center";
}

export function TooltipBottom({ children, horizontal = "center" }: TooltipBottomProps) {
  return (
    <Tooltip vertical="bottom" horizontal={horizontal}>
      {children}
    </Tooltip>
  );
}
