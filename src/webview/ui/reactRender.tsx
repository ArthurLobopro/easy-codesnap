import { createRoot } from "react-dom/client"
import { ZoomBar } from "./react/components/ZoomBar"
import { TranslationProvider } from "./react/contexts/TranslationContext"

createRoot(document.querySelector("#center-wrapper")!).render(
    <TranslationProvider>
        <ZoomBar />
    </TranslationProvider>
)