import { createContext, type PropsWithChildren, useState } from "react";

interface DetailsProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export const DetailsContext = createContext<DetailsProps>({} as DetailsProps);

export interface DetailsProviderProps extends PropsWithChildren {
  defaultOpen?: boolean;
}

export function DetailsProvider({
  children,
  defaultOpen = false,
}: DetailsProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <DetailsContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DetailsContext.Provider>
  );
}
