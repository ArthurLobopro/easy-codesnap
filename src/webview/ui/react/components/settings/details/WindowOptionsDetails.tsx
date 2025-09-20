import { useTranslation } from "@hooks//useTranslation";
import { openConfig, text } from "@/util";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { ToggleInput } from "../../ToggleInput";
import { IconTypeSelect } from "../selects/IconTypeSelect";
import { RoundingLevelSelect } from "../selects/RoundigLevelSelect";
import { WindowStyleSelect } from "../selects/WindoStyleSelect";

export function WindowOptionsDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Window Options")} />
      <DetailsContent>
        <WindowStyleSelect />
        <IconTypeSelect />
        <ToggleInput
          config="showWindowTitle"
          label={t("Show Window Title")}
          tooltip={
            <>
              <span>
                {text(
                  t("You can edit the Window Title text by double-clicking it."),
                  t("You can edit the default Window Title text clicking"),
                  " ",
                )}
              </span>
              <span className="link" onClick={() => openConfig("windowTitleTemplate")}>
                {t("here")}
              </span>
            </>
          }
        />
        <ToggleInput config="showWindowControls" label={t("Show Window Controls")} />
        <ToggleInput config="roundedCorners" label={t("Rounded Corners")} />
        <RoundingLevelSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
