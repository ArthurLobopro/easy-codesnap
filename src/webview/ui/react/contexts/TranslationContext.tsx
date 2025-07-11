import { createContext, PropsWithChildren, useMemo } from "react";
import { create } from "zustand";
import { t } from "../../../util";

interface TranslationStore {
    updates: number
    updateTranslation: () => void
}

export const useTranslationUpdater = create<TranslationStore>((set) => ({
    updates: 0,
    updateTranslation: () => { set((state) => ({ updates: state.updates + 1 })) }
}))

interface ITranslateContext {
    t: typeof t
    updates: number
}

export const TranslationContext = createContext({} as ITranslateContext)

export function TranslationProvider({ children }: PropsWithChildren) {
    const updates = useTranslationUpdater(state => state.updates)

    const translate = useMemo(() => {
        return t
    }, [updates])

    return (
        <TranslationContext.Provider value={{ t: translate, updates }}>
            {children}
        </TranslationContext.Provider>
    )
}