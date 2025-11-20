import type { ConfigKey } from "../types";

export const CodeSnapConfigNames = [
  "backgroundColor",
  "boxShadow",
  "containerPadding",
  "realLineNumbers",
  "roundedCorners",
  "showLineNumbers",
  "showWindowControls",
  "showWindowTitle",
  "shutterAction",
  "target",
  "transparentBackground",
] as const;

export const extensionSettingsNames: ConfigKey[] = [
  ...CodeSnapConfigNames,
  "defaultWatermarkText",
  "enableResizing",
  "enableSymbolBreadcrumb",
  "fullLinesSelection",
  "highlightLineNumber",
  "linkOnOpen",
  "lockOnOpen",
  "maxCharWidth",
  "optimizeSvg",
  "roundingLevel",
  "saveFormat",
  "saveScale",
  "uiCustomColors",
  "useFallbackPngExporter",
  "watermark",
  "watermarkPosition",
  "windowIconType",
  "windowStyle",
  "windowTitleTemplate",
] as const;
