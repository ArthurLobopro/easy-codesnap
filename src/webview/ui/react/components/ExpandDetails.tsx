import { type PropsWithChildren, useContext } from "react";
import { tw } from "@/util";
import { DetailsContext, DetailsProvider } from "../contexts/DetailsContext";

function RawExpandDetails({ children }: PropsWithChildren) {
  const { isOpen } = useContext(DetailsContext);

  return (
    <div className="expand-content" data-state={isOpen ? "open" : "closed"} onClick={(ev) => ev.stopPropagation()}>
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

export function TextDetailsSummary({ text }: { text: string }) {
  return (
    <DetailsSummary>
      <span>{text}</span>
    </DetailsSummary>
  );
}

function ChevronDown({ isOpen }: { isOpen: boolean }) {
  return <div className={tw("codicon codicon-chevron-down transition-[400ms]", isOpen ? "rotate-180" : "")} />;
}

export function DetailsSummary({ children }: PropsWithChildren) {
  const { setIsOpen, isOpen } = useContext(DetailsContext);
  return (
    <summary
      className={tw(
        "flex justify-between gap-8 rounded p-1",
        isOpen ? "hover:bg-transparent" : "hover:bg-toolbar-hover-background",
      )}
      onClick={(ev) => {
        ev.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <ChevronDown isOpen={isOpen} />
      {children}
      <ChevronDown isOpen={isOpen} />
    </summary>
  );
}

export function DetailsContent({ children }: PropsWithChildren) {
  const { isOpen } = useContext(DetailsContext);

  return isOpen ? <div>{children}</div> : null;
}
