import { useContext } from "react";
import { ZOOM_LEVELS, type ZoomLevel } from "../../../constants";
import { TranslationContext } from "../contexts/TranslationContext";
import { useConfig, useSetConfig } from "../hooks/useConfig";

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
            <button
                className={`tooltip bottom ${zoom === ZOOM_LEVELS[0] ? "disabled" : ""}`}
                onClick={removeZoom}
                type="button"
            >
                <span className="codicon codicon-zoom-out" />
                <span className="tooltip-text">{t("Zoom out")}</span>
            </button>
            <select
                data-configname="zoom"
                value={zoom}
                onChange={(e) =>
                    set({ zoom: Number(e.target.value) as ZoomLevel })
                }
            >
                {ZOOM_LEVELS.map((z) => (
                    <option value={z} key={z}>
                        {z}%
                    </option>
                ))}
            </select>
            <button
                className={`tooltip bottom ${zoom === ZOOM_LEVELS.at(-1) ? "disabled" : ""}`}
                onClick={addZoom}
                type="button"
            >
                <span className="codicon codicon-zoom-in" />
                <span className="tooltip-text">{t("Zoom in")}</span>
            </button>
        </>
    );
}
