import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useUpdateSelectsWidth } from "@hooks//useSelectWidthUpdater";
import { useTranslation } from "@hooks//useTranslation";
import type { RoundingLevel } from "@/../types";
import { ROUNDING_LEVELS } from "@/constants";
import { EscapeCodes } from "../../EscapeCodes";

export function RoundingLevelSelect() {
  const { t } = useTranslation();
  const { roundingLevel, roundedCorners } = useConfigList(["roundingLevel", "roundedCorners"]);
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
    <li className="tooltip horizontal-left">
      <span>{t("Rounding Level")}</span>
      <select
        tabIndex={-1}
        disabled={!roundedCorners}
        value={roundingLevel}
        onChange={(ev) => {
          set({
            roundingLevel: Number(ev.currentTarget.value) as RoundingLevel,
          });
        }}
      >
        {ROUNDING_LEVELS.map((r) => (
          <option value={r} key={r}>
            {r}
          </option>
        ))}
      </select>
      <span className="tooltip-text">
        <span>{t("The Window rounding level.")} </span>
        <EscapeCodes text={t("Only valid when `Rounded Corners` is marked")} />
      </span>
    </li>
  );
}
