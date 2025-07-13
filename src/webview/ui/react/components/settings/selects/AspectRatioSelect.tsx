import type { AspectRatio } from "../../../../../../types";
import { ASPECT_RATIOS } from "../../../../../constants";
import { useConfig, useSetConfig } from "../../../hooks/useConfig";
import { useUpdateSelectsWidth } from "../../../hooks/useSelectWidthUpdater";
import { useTranslation } from "../../../hooks/useTranslation";

export function AspectRatioSelect() {
  const { t } = useTranslation();
  const aspectRatio = useConfig("aspectRatio");
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
    <li>
      <span>{t("Aspect Ratio")}</span>
      <select
        value={aspectRatio}
        onChange={(ev) =>
          set({
            aspectRatio: ev.currentTarget.value as AspectRatio,
          })
        }
      >
        {ASPECT_RATIOS.map((ratio) => (
          <option value={ratio} key={ratio}>
            {ratio}
          </option>
        ))}
      </select>
    </li>
  );
}
