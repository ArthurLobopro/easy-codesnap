import { Tooltip, TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { takeSnap } from "@/snap";
import { breadcrumbNode, navbarNode } from "./elements";
import { OneTimeConfig } from "./OneTimeConfig";
import { Breadcrumb } from "./react/components/Breadcrumb";
import { ShutterIcon } from "./react/components/icons";
import { LeftButtons } from "./react/components/LeftButtons";
import { ZoomBar } from "./react/components/ZoomBar";
import { TranslationProvider } from "./react/contexts/TranslationContext";
import { WindowControls } from "./WindowControls";

createRoot(document.querySelector("#top-header")!).render(
  <TranslationProvider>
    <LeftWrapper />
    <CenterWrapper />
    <OneTimeConfig />
    {createPortal(
      <Tooltip vertical="top" horizontal="center">
        <ShutterIcon onClick={() => takeSnap()} id="save" className="size-16 cursor-pointer" />
        <TooltipText>Take Snap</TooltipText>
      </Tooltip>,
      document.querySelector("#save-container")!,
    )}
    {createPortal(<Breadcrumb />, breadcrumbNode)}
  </TranslationProvider>,
);

createRoot(navbarNode).render(<WindowControls />);

function LeftWrapper() {
  return (
    <div className="flex items-start gap-2">
      <LeftButtons />
    </div>
  );
}

function CenterWrapper() {
  return (
    <div className="flex items-center gap-2">
      <ZoomBar />
    </div>
  );
}
