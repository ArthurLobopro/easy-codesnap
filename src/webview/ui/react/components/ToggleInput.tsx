import { memo, type ReactNode } from "react";
import type { BooleanSessionKeys } from "@/SessionConfig";
import { useConfig, useSetConfig } from "../hooks/useConfig";

interface ToggleInputProps {
  config: BooleanSessionKeys;
  label: string;
  tooltip?: ReactNode;
}

export const ToggleInput = memo(function ToggleInput({ config, label, tooltip }: ToggleInputProps) {
  const { toggleCallback } = useSetConfig();

  console.log(`Rendering ${config} input`);

  return (
    <li>
      <label className={tooltip ? "tooltip horizontal-left" : ""}>
        <span>{label}</span>
        <input type="checkbox" tabIndex={-1} checked={useConfig(config)} onChange={toggleCallback(config)} />
        {tooltip && <span className="tooltip-text">{tooltip}</span>}
      </label>
    </li>
  );
});
