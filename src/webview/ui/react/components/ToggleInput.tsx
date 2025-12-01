/** biome-ignore-all lint/a11y/noLabelWithoutControl: The inputs will be where they need */

import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { memo, type PropsWithChildren, type ReactNode } from "react";
import type { BooleanSessionKeys } from "@/SessionConfig";
import { tw } from "@/util";
import { useConfig, useSetConfig } from "../hooks/useConfig";
import { LeftTooltip } from "./LeftTooltip";
import { SettingLine } from "./SettingLine";

interface ToggleInputProps {
  config: BooleanSessionKeys;
  label: string;
  tooltip?: ReactNode;
  disabled?: boolean;
}

export const Label = ({ children, className }: PropsWithChildren & PropsWithClassName) => (
  <label
    className={tw("flex justify-between items-center w-full cursor-pointer gap-1 box-border", "only:w-full", className)}
  >
    {children}
  </label>
);

export const ToggleInput = memo(function ToggleInput({ config, label, tooltip, disabled }: ToggleInputProps) {
  const { toggleCallback } = useSetConfig();

  type WrapperProps = PropsWithChildren & { tooltip: ReactNode | null };

  const Wrapper = tooltip
    ? ({ children, tooltip }: WrapperProps) => (
        <LeftTooltip className="only:w-full p-1">
          <Label>{children}</Label>
          {tooltip}
        </LeftTooltip>
      )
    : ({ children }: WrapperProps) => <Label className="p-1">{children}</Label>;

  return (
    <SettingLine>
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
    </SettingLine>
  );
});
