/** biome-ignore-all lint/suspicious/noArrayIndexKey: There is not a unique ID */
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: Just ignore it */
import { iconClassConfig } from "@/constants";
import { getSymbolBreadcrumbs } from "@/util";
import { useConfig } from "../hooks/useConfig";

export function Breadcrumb() {
  const enableSymbolBreadcrumb = useConfig("enableSymbolBreadcrumb");

  if (!enableSymbolBreadcrumb) return null;

  try {
    const symbolBreadcrumbs = getSymbolBreadcrumbs();

    const breadcrumb = symbolBreadcrumbs.flatMap((symbol, index) => {
      const symbolType = symbol.kind as keyof typeof iconClassConfig;

      if (symbolType in iconClassConfig) {
        const iconClass = iconClassConfig[symbolType] || "";
        return [
          <div className="breadcrumb-item">
            <div className={iconClass} />
            <div className="breadcrumb-label">{symbol.name}</div>
          </div>,
          <div className="codicon codicon-chevron-right" />,
        ];
      }

      return [<div key={index}>{symbol.name}</div>, <div className="codicon codicon-chevron-right" />];
    });

    breadcrumb.pop();

    return breadcrumb;
  } catch (error) {
    console.error(error);
    return null;
  }
}
