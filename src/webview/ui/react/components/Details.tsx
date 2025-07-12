import type { PropsWithChildren } from "react";

export function Details({ children }: PropsWithChildren) {
    return (
        <details
            className="expand-content"
            onClick={(ev) => ev.stopPropagation()}
        >
            {children}
        </details>
    );
}

export function DetailsSummary({ children }: PropsWithChildren) {
    return (
        <summary>
            <div className="codicon codicon-chevron-down" />
            {children}
            <div className="codicon codicon-chevron-down" />
        </summary>
    );
}

export function DetailsContent({ children }: PropsWithChildren) {
    return <div>{children}</div>;
}
