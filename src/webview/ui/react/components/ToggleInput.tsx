/** biome-ignore-all lint/a11y/noLabelWithoutControl: The inputs will be where they need */

import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { memo, type PropsWithChildren, type ReactNode } from "react";
import type { BooleanSessionKeys } from "@/SessionConfig";
import { useConfig, useSetConfig } from "../hooks/useConfig";
import { LeftTooltip } from "./LeftTooltip";

interface ToggleInputProps {
  config: BooleanSessionKeys;
  label: string;
  tooltip?: ReactNode;
  disabled?: boolean;
}

const Label = ({ children }: PropsWithChildren) => (
  <label className="flex justify-between items-center w-full cursor-pointer gap-1 p-1">{children}</label>
);

export const ToggleInput = memo(function ToggleInput({ config, label, tooltip, disabled }: ToggleInputProps) {
  const { toggleCallback } = useSetConfig();

  type WrapperProps = PropsWithChildren & { tooltip: ReactNode | null };

  const Wrapper = tooltip
    ? ({ children, tooltip }: WrapperProps) => (
        <LeftTooltip>
          <Label>{children}</Label>
          {tooltip}
        </LeftTooltip>
      )
    : ({ children }: WrapperProps) => <Label>{children}</Label>;

  return (
    <li>
      <Wrapper tooltip={tooltip ? <TooltipText>{tooltip}</TooltipText> : null}>
        <span>{label}</span>
        <input
          type="checkbox"
          tabIndex={-1}
          checked={useConfig(config)}
          onChange={toggleCallback(config)}
          disabled={disabled}
        />
      </Wrapper>
    </li>
  );
});
