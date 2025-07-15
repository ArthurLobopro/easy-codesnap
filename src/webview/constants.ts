import type { ISessionConfig } from "./SessionConfig";

export const iconClassConfig = {
  String: "codicon codicon-symbol-string",
  Array: "codicon codicon-symbol-array",
  Boolean: "codicon codicon-symbol-boolean",
  Class: "codicon codicon-symbol-class",
  Color: "codicon codicon-symbol-color",
  Constant: "codicon codicon-symbol-constant",
  Constructor: "codicon codicon-symbol-constructor",
  Enum: "codicon codicon-symbol-enum",
  EnumMember: "codicon codicon-symbol-enum-member",
  Event: "codicon codicon-symbol-event",
  Field: "codicon codicon-symbol-field",
  File: "codicon codicon-symbol-file",
  Folder: "codicon codicon-symbol-folder",
  Function: "codicon codicon-symbol-function",
  Interface: "codicon codicon-symbol-interface",
  Key: "codicon codicon-symbol-key",
  Keyword: "codicon codicon-symbol-keyword",
  Method: "codicon codicon-symbol-method",
  Misc: "codicon codicon-symbol-misc",
  Module: "codicon codicon-symbol-module",
  Namespace: "codicon codicon-symbol-namespace",
} as const;

export const ZOOM_LEVELS = [50, 75, 100, 125, 150] as const;
export type ZoomLevel = (typeof ZOOM_LEVELS)[number];

export const SAVE_FORMATS = ["png", "svg"] as const;
export const SAVE_SCALES = [0.5, 0.75, 1, 1.5, 2, 3, 4] as const;
export const SAVE_ACTIONS = ["save", "copy"];
export const ASPECT_RATIOS = ["none", "1:1", "1.91:1", "4:5", "9:16", "16:9"];
export const ROUNDING_LEVELS = [1, 2, 3, 4];

export const DEFAULT_SETTINGS: Omit<ISessionConfig, "set"> = {
  isLocked: false,
  isLinked: false,
  zoom: 100,
  saveFormat: "png",
  saveScale: 1,
  shutterAction: "copy",
  watermark: false,
  watermarkPosition: "bottom-right",
  target: "container",
  transparentBackground: false,
  enableResizing: true,
  enableSymbolBreadcrumb: false,
  maxCharWidth: 0,
  aspectRatio: "none",
  showWindowTitle: false,
  showWindowControls: true,
  windowStyle: "macos",
  windowIconType: "round",
  roundedCorners: true,
  roundingLevel: 1,
  showLineNumbers: true,
  realLineNumbers: false,
  highlightLineNumber: false,
  shouldUpdateTitle: true,
  isReady: false,
} as const;
