import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { ActionButtons } from "./react/components/ActionButtons";
import {
    Details,
    DetailsContent,
    DetailsSummary,
} from "./react/components/Details";
import { LeftButtons } from "./react/components/LeftButtons";
import { SaveActionSelect } from "./react/components/settings/selects/SaveActionSelect";
import { SaveFormatSelect } from "./react/components/settings/selects/SaveFormatSelect";
import { SaveScaleSelect } from "./react/components/settings/selects/SaveScaleSelect";
import { ZoomBar } from "./react/components/ZoomBar";
import { TranslationProvider } from "./react/contexts/TranslationContext";
import { useTranslation } from "./react/hooks/useTranslation";

createRoot(document.querySelector("#center-wrapper")!).render(
    <TranslationProvider>
        <ZoomBar />
        {createPortal(
            <LeftButtons />,
            document.querySelector("#left-wrapper")!,
        )}
        {createPortal(
            <>
                <SaveActionsDetails />
                <ActionDetails />
            </>,
            document.querySelector("#action-details")!,
        )}
    </TranslationProvider>,
);

function SaveActionsDetails() {
    const { t } = useTranslation();

    return (
        <Details>
            <DetailsSummary>
                <span>{t("Save Options")}</span>
            </DetailsSummary>
            <DetailsContent>
                <SaveActionSelect />
                <SaveFormatSelect />
                <SaveScaleSelect />
            </DetailsContent>
        </Details>
    );
}

function ActionDetails() {
    const { t } = useTranslation();

    return (
        <Details>
            <DetailsSummary>
                <span>{t("Actions")}</span>
            </DetailsSummary>
            <DetailsContent>
                <ActionButtons />
            </DetailsContent>
        </Details>
    );
}
