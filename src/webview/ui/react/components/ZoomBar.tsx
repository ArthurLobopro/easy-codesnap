import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useContext } from "react";
import { ZOOM_LEVELS, type ZoomLevel } from "../../../constants";
import { TranslationContext } from "../contexts/TranslationContext";
import { useConfig, useSetConfig } from "../hooks/useConfig";
import { TooltipBottom } from "./TooltipBottom";
import { TopButton } from "./TopButton";

export function ZoomBar() {
  const { t } = useContext(TranslationContext);

  const set = useSetConfig();
  const zoom = useConfig("zoom");

  const removeZoom = () => {
    if (zoom !== ZOOM_LEVELS.at(0)) {
      set({ zoom: ZOOM_LEVELS[ZOOM_LEVELS.indexOf(zoom) - 1] });
    }
  };

  const addZoom = () => {
    if (zoom !== ZOOM_LEVELS.at(-1)) {
      set({ zoom: ZOOM_LEVELS[ZOOM_LEVELS.indexOf(zoom) + 1] });
    }
  };

  console.log("ZoomBarRender");

  return (
    <>
      <TooltipBottom>
        <TopButton disabled={zoom === ZOOM_LEVELS[0]} onClick={removeZoom}>
          <span className="codicon codicon-zoom-out" style={{ fontSize: 24 }} />
        </TopButton>
        <TooltipText>{t("Zoom out")}</TooltipText>
      </TooltipBottom>

      <select
        className="bg-transparent hover:bg-toolbar-hover-background text-vscode-foreground border-none rounded h-8 w-16"
        value={zoom}
        onChange={(e) => set({ zoom: Number(e.target.value) as ZoomLevel })}
      >
        {ZOOM_LEVELS.map((z) => (
          <option value={z} key={z}>
            {z}%
          </option>
        ))}
      </select>

      <TooltipBottom>
        <TopButton disabled={zoom === ZOOM_LEVELS.at(-1)} onClick={addZoom}>
          <span className="codicon codicon-zoom-in" style={{ fontSize: 24 }} />
        </TopButton>
        <TooltipText>{t("Zoom in")}</TooltipText>
      </TooltipBottom>
    </>
  );
}
