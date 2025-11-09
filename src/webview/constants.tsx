import type { ISessionConfig } from "./SessionConfig";
import {
  SymbolArray,
  SymbolBoolean,
  SymbolClass,
  SymbolColor,
  SymbolConstant,
  SymbolConstructor,
  SymbolEnum,
  SymbolEnumMember,
  SymbolEvent,
  SymbolField,
  SymbolFile,
  SymbolFolder,
  SymbolFunction,
  SymbolInterface,
  SymbolKey,
  SymbolKeyWord,
  SymbolMethod,
  SymbolMisc,
  SymbolModule,
  SymbolNamespace,
  SymbolProperty,
  SymbolString,
  SymbolVariable,
} from "./ui/react/components/codicons";

export const iconComponent = {
  String: () => <SymbolString className="icon-symbol-string follow-colors" />,
  Array: () => <SymbolArray className="icon-symbol-array follow-colors" />,
  Boolean: () => <SymbolBoolean className="icon-symbol-boolean follow-colors" />,
  Class: () => <SymbolClass className="icon-symbol-class follow-colors" />,
  Color: () => <SymbolColor className="icon-symbol-color" />,
  Constant: () => <SymbolConstant className="icon-symbol-constant follow-colors" />,
  Constructor: () => <SymbolConstructor className="icon-symbol-constructor follow-colors" />,
  Enum: () => <SymbolEnum className="icon-symbol-enum follow-colors" />,
  EnumMember: () => <SymbolEnumMember className="icon-symbol-enum-member follow-colors" />,
  Event: () => <SymbolEvent className="icon-symbol-event follow-colors" />,
  Field: () => <SymbolField className="icon-symbol-field follow-colors" />,
  File: () => <SymbolFile className="icon-symbol-file follow-colors" />,
  Folder: () => <SymbolFolder className="icon-symbol-folder follow-colors" />,
  Function: () => <SymbolFunction className="icon-symbol-function follow-colors" />,
  Interface: () => <SymbolInterface className="icon-symbol-interface follow-colors" />,
  Key: () => <SymbolKey className="icon-symbol-key follow-colors" />,
  Keyword: () => <SymbolKeyWord className="icon-symbol-keyword follow-colors" />,
  Method: () => <SymbolMethod className="icon-symbol-method follow-colors" />,
  Misc: () => <SymbolMisc />,
  Module: () => <SymbolModule className="icon-symbol-module follow-colors" />,
  Namespace: () => <SymbolNamespace className="icon-symbol-namespace follow-colors" />,
  Variable: () => <SymbolVariable className="icon-symbol-variable follow-colors" />,
  Property: () => <SymbolProperty className="icon-symbol-property follow-colors" />,
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
  optimizeSvg: true,
  useFallbackPngExporter: false,
  templates: {
    relativeFolder: "",
    fileName: "",
    workspace: "",
  },
  uiCustomColors: {
    watermarkPositionInputSelectedBackgroud: "",
  },
} as any;
