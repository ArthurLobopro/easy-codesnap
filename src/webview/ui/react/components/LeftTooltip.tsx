import { Tooltip } from "@arthur-lobo/react-custom-tooltip";
import type { PropsWithChildren } from "react";

export function LeftTooltip({ children }: PropsWithChildren) {
  return <Tooltip align="horizontal-left">{children}</Tooltip>;
}
