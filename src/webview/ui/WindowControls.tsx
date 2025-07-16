import { useEffect, useRef } from "react";
import { getDefaultWindowTitle, px, setVar } from "@/util";
import { windowNode } from "./elements";
import {
  RoundClose,
  RoundMaximize,
  RoundMinimize,
  SquareClose,
  SquareMaximize,
  SquareMinimize,
} from "./react/components/icons";
import { useConfig, useConfigList, useSetConfig } from "./react/hooks/useConfig";

export function WindowControls() {
  const { windowStyle, showWindowControls } = useConfigList(["windowStyle", "showWindowControls"]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    windowNode.dataset.style = windowStyle;

    if (!ref.current || !showWindowControls) {
      setVar("macos-margin-right", "0px");
      return;
    }

    setVar("macos-margin-right", windowStyle === "macos" ? px(ref.current.getBoundingClientRect().width) : "0px");

    return () => setVar("macos-margin-right", "0px");
  }, [ref.current, windowStyle, showWindowControls]);

  return (
    <>
      {showWindowControls && (
        <div id="window-controls" ref={ref}>
          {windowStyle === "macos" ? <MacOsButtons /> : <WindowsButtons />}
        </div>
      )}

      <WindowTitle />
    </>
  );
}

function MacOsButtons() {
  return (
    <>
      <div className="red dot" />
      <div className="yellow dot" />
      <div className="green dot" />
    </>
  );
}

const icons = {
  round: {
    close: <RoundClose />,
    maximize: <RoundMaximize />,
    minimize: <RoundMinimize />,
  },
  square: {
    close: <SquareClose />,
    maximize: <SquareMaximize />,
    minimize: <SquareMinimize />,
  },
};

function WindowsButtons() {
  const windowIconType = useConfig("windowIconType");

  return (
    <>
      <div className="button">{icons[windowIconType].minimize}</div>
      <div className="button">{icons[windowIconType].maximize}</div>
      <div className="button">{icons[windowIconType].close}</div>
    </>
  );
}

function WindowTitle() {
  const { shouldUpdateTitle, isReady, showWindowTitle, templates } = useConfigList([
    "shouldUpdateTitle",
    "showWindowTitle",
    "isReady",
    "templates",
  ]);

  const set = useSetConfig();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (isReady && shouldUpdateTitle) {
        ref.current.textContent = getDefaultWindowTitle();
      }
    }
  }, [ref.current, isReady, shouldUpdateTitle, templates]);

  return (
    <div
      style={{
        marginRight: "var(--macos-margin-right)",
        display: showWindowTitle ? "" : "none",
      }}
      ref={ref}
      id="window-title"
      onDoubleClick={(ev) => {
        const windowTitleNode = ev.currentTarget;

        windowTitleNode.contentEditable = "true";

        const range = document.createRange();
        range.selectNodeContents(windowTitleNode);
        range.collapse(false);

        const selection = window.getSelection() as Selection;
        selection.removeAllRanges();
        selection.addRange(range);
      }}
      onBlur={(ev) => {
        const windowTitleNode = ev.currentTarget;

        windowTitleNode.contentEditable = "false";

        const defaultTitle = getDefaultWindowTitle();
        const currentTitle = windowTitleNode.textContent;

        if (!currentTitle?.length || currentTitle === defaultTitle) {
          windowTitleNode.textContent = getDefaultWindowTitle();
          set({
            shouldUpdateTitle: true,
          });
          return;
        }

        if (currentTitle !== defaultTitle) {
          return set({
            shouldUpdateTitle: false,
          });
        }
      }}
      onKeyPress={(ev) => {
        const windowTitleNode = ev.currentTarget;

        if (ev.key === "Enter") {
          windowTitleNode.blur();
          return false;
        }
      }}
    />
  );
}
