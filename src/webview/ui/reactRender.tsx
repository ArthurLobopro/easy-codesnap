import { createRoot } from "react-dom/client";
import { OneTimeConfig } from "./OneTimeConfig";
import { LeftButtons } from "./react/components/LeftButtons";
import { ZoomBar } from "./react/components/ZoomBar";
import { TranslationProvider } from "./react/contexts/TranslationContext";
import { WindowControls } from "./WindowControls";

createRoot(document.querySelector("#top-header")!).render(
  <TranslationProvider>
    <LeftWrapper />
    <CenterWrapper />
    <OneTimeConfig />
  </TranslationProvider>,
);

createRoot(document.querySelector("#navbar")!).render(<WindowControls />);

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
