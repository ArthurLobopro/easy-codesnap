import { type PropsWithChildren, useContext } from "react";
import { DetailsContext, DetailsProvider } from "../contexts/DetailsContext";

function RawExpandDetails({ children }: PropsWithChildren) {
  const { isOpen } = useContext(DetailsContext);

  return (
    <div
      className="expand-content"
      data-state={isOpen ? "open" : "closed"}
      onClick={(ev) => ev.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function ExpandDetails({ children }: PropsWithChildren) {
  return (
    <DetailsProvider defaultOpen>
      <RawExpandDetails>{children}</RawExpandDetails>
    </DetailsProvider>
  );
}

export function DetailsSummary({ children }: PropsWithChildren) {
  const { setIsOpen, isOpen } = useContext(DetailsContext);
  return (
    <summary
      onClick={(ev) => {
        ev.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <div className="codicon codicon-chevron-down" />
      {children}
      <div className="codicon codicon-chevron-down" />
    </summary>
  );
}

export function DetailsContent({ children }: PropsWithChildren) {
  const { isOpen } = useContext(DetailsContext);

  return isOpen ? <div>{children}</div> : null;
}
