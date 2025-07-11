import { useContext, useEffect, useState } from "react";
import { SessionConfig } from "../../../SessionConfig";
import { TranslationContext } from "../contexts/TranslationContext";

const ZOOM_LEVELS = [
    50, 75, 100, 125, 150
] as const

type ZoomLevel = typeof ZOOM_LEVELS[number]

export function ZoomBar() {
    const { t } = useContext(TranslationContext)

    const [zoom, setZoom] = useState<ZoomLevel>(100)

    const removeZoom = () => {
        if (zoom !== ZOOM_LEVELS.at(0)) {
            setZoom(ZOOM_LEVELS[ZOOM_LEVELS.indexOf(zoom) - 1])
        }
    }

    const addZoom = () => {
        if (zoom !== ZOOM_LEVELS.at(-1)) {
            setZoom(ZOOM_LEVELS[ZOOM_LEVELS.indexOf(zoom) + 1])
        }
    }

    useEffect(() => {
        SessionConfig.hasConfig && SessionConfig.set({ zoom })
    }, [zoom])

    console.log("ZoomBarRender");

    return (
        <>
            <button className={`tooltip bottom ${zoom === ZOOM_LEVELS[0] ? "disabled" : ""}`} data-action="zoom-out" onClick={removeZoom}>
                <span className="codicon codicon-zoom-out"></span>
                <span className="tooltip-text">
                    {t("Zoom out")}
                </span>
            </button>
            <select data-configname="zoom" value={zoom} onChange={e => setZoom(Number(e.target.value) as ZoomLevel)}>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100" >100%</option>
                <option value="125">125%</option>
                <option value="150">150%</option>
            </select>
            <button className={`tooltip bottom ${zoom === ZOOM_LEVELS.at(-1) ? "disabled" : ""}`} data-action="zoom-in" onClick={addZoom}>
                <span className="codicon codicon-zoom-in"></span>
                <span className="tooltip-text">{t("Zoom in")}</span>
            </button>
        </>
    )
}