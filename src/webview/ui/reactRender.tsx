import { createRoot } from "react-dom/client"
import { LeftButtons } from "./react/components/LeftButtons"
import { ZoomBar } from "./react/components/ZoomBar"
import { TranslationProvider } from "./react/contexts/TranslationContext"

createRoot(document.querySelector("#center-wrapper")!).render(
    <TranslationProvider>
        <ZoomBar />
    </TranslationProvider>
)

createRoot(document.querySelector("#left-wrapper")!).render(
    <TranslationProvider>
        <LeftButtons />
    </TranslationProvider>
)