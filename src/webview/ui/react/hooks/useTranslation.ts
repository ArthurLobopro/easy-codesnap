import { useContext } from "react";
import { TranslationContext } from "../contexts/TranslationContext";

export const useTranslation = () => useContext(TranslationContext);
