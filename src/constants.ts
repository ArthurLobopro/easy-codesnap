import { ConfigKey } from "./types"

export const CodeSnapConfigNames = [
    "backgroundColor",
    "boxShadow",
    "containerPadding",
    "roundedCorners",
    "showWindowControls",
    "showWindowTitle",
    "showLineNumbers",
    "realLineNumbers",
    "transparentBackground",
    "target",
    "shutterAction"
]

export const extensionSettingsNames = [
    ...CodeSnapConfigNames,
    "enableResizing",
    "roundingLevel",
    "lockOnOpen",
    "linkOnOpen",
    "saveFormat",
    "windowStyle"
] as ConfigKey[]