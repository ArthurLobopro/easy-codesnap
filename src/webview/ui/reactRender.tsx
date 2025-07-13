import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { LeftButtons } from "./react/components/LeftButtons";
import { ActionDetails } from "./react/components/settings/details/ActionDetails";
import { LineOptionsDetails } from "./react/components/settings/details/LineOptionsDetails";
import { OtherOptionsDetails } from "./react/components/settings/details/OtherOptionsDetails";
import { SaveActionsDetails } from "./react/components/settings/details/SaveActionsDetails";
import { WatermarkDetails } from "./react/components/settings/details/WaterMarkDetails";
import { WindowOptionsDetails } from "./react/components/settings/details/WindowOptionsSelect";
import { ZoomBar } from "./react/components/ZoomBar";
import { TranslationProvider } from "./react/contexts/TranslationContext";

createRoot(document.querySelector("#center-wrapper")!).render(
    <TranslationProvider>
        <ZoomBar />
        {createPortal(
            <LeftButtons />,
            document.querySelector("#left-wrapper")!,
        )}
        {createPortal(
            <>
                <LineOptionsDetails />
                <WindowOptionsDetails />
                <OtherOptionsDetails />
                <WatermarkDetails />
                <SaveActionsDetails />
                <ActionDetails />
            </>,
            document.querySelector("#action-details")!,
        )}
    </TranslationProvider>,
);
