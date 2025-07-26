import { Tooltip, TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { takeSnap } from "@/snap";
import { navbarNode } from "./elements";
import { OneTimeConfig } from "./OneTimeConfig";
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
        <ShutterIcon onClick={() => takeSnap()} id="save" className="shutter" />
        <TooltipText>Take Snap</TooltipText>
      </Tooltip>,
      document.querySelector("#save-container")!,
    )}
  </TranslationProvider>,
);

createRoot(navbarNode).render(<WindowControls />);

function LeftWrapper() {
  return (
    <div id="left-wrapper">
      <LeftButtons />
    </div>
  );
}

function CenterWrapper() {
  return (
    <div id="center-wrapper">
      <ZoomBar />
    </div>
  );
}
