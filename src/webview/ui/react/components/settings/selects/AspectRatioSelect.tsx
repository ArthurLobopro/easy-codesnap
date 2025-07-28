import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { AspectRatio } from "@/../types";
import { ASPECT_RATIOS } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";

export function AspectRatioSelect() {
  const { t } = useTranslation();
  const aspectRatio = useConfig("aspectRatio");
  const set = useSetConfig();

  return (
    <li>
      <span>{t("Aspect Ratio")}</span>
      <ConfigSelect
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
      </ConfigSelect>
    </li>
  );
}
