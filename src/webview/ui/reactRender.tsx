import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ConfigIcon } from "./react/components/icons";
import { LeftButtons } from "./react/components/LeftButtons";
import { ActionDetails } from "./react/components/settings/details/ActionDetails";
import { LineOptionsDetails } from "./react/components/settings/details/LineOptionsDetails";
import { OtherOptionsDetails } from "./react/components/settings/details/OtherOptionsDetails";
import { SaveActionsDetails } from "./react/components/settings/details/SaveActionsDetails";
import { WatermarkDetails } from "./react/components/settings/details/WaterMarkDetails";
import { WindowOptionsDetails } from "./react/components/settings/details/WindowOptionsDetails";
import { ZoomBar } from "./react/components/ZoomBar";
import { TranslationProvider } from "./react/contexts/TranslationContext";

createRoot(document.querySelector("#top-header")!).render(
  <TranslationProvider>
    <LeftWrapper />
    <CenterWrapper />
    <OneTimeConfig />
  </TranslationProvider>,
);

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

function OneTimeConfig() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const callback = () => setOpen(false);

    if (open) {
      window.addEventListener("click", callback);

      return () => window.removeEventListener("click", callback);
    }
  }, [open]);

  return (
    <div id="one-time-config-wrapper" onClick={(ev) => ev.stopPropagation()}>
      <details id="one-time-config" open={open}>
        <summary
          tabIndex={-1}
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            setOpen(!open);
          }}
        >
          <ConfigIcon className="follow-colors" />
        </summary>
        {open && (
          <nav id="action-details">
            <LineOptionsDetails />
            <WindowOptionsDetails />
            <OtherOptionsDetails />
            <WatermarkDetails />
            <SaveActionsDetails />
            <ActionDetails />
          </nav>
        )}
      </details>
    </div>
  );
}
