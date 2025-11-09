/** biome-ignore-all lint/suspicious/noArrayIndexKey: There is not a unique ID */
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: Just ignore it */
import { iconComponent } from "@/constants";
import { getSymbolBreadcrumbs } from "@/util";
import { useConfig } from "../hooks/useConfig";
import { ChevronRight } from "./codicons";

export function Breadcrumb() {
  const enableSymbolBreadcrumb = useConfig("enableSymbolBreadcrumb");

  if (!enableSymbolBreadcrumb) return null;

  try {
    const symbolBreadcrumbs = getSymbolBreadcrumbs();

    const breadcrumb = symbolBreadcrumbs.flatMap((symbol, index) => {
      const symbolType = symbol.kind as keyof typeof iconComponent;

      if (symbolType in iconComponent) {
        return [
          <div className="breadcrumb-item">
            {iconComponent[symbolType]()}
            <div className="breadcrumb-label">{symbol.name}</div>
          </div>,
          <ChevronRight />,
        ];
      }

      return [<div key={index}>{symbol.name}</div>, <ChevronRight />];
    });

    breadcrumb.pop();

    return breadcrumb;
  } catch (error) {
    console.error(error);
    return null;
  }
}
