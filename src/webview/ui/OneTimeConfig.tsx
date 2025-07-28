import { useEffect, useState } from "react";
import { ConfigIcon } from "./react/components/icons";
import { ActionDetails } from "./react/components/settings/details/ActionDetails";
import { LineOptionsDetails } from "./react/components/settings/details/LineOptionsDetails";
import { OtherOptionsDetails } from "./react/components/settings/details/OtherOptionsDetails";
import { SaveActionsDetails } from "./react/components/settings/details/SaveActionsDetails";
import { WatermarkDetails } from "./react/components/settings/details/WaterMarkDetails";
import { WindowOptionsDetails } from "./react/components/settings/details/WindowOptionsDetails";

export function OneTimeConfig() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const callback = () => setOpen(false);

    if (open) {
      window.addEventListener("click", callback);

      return () => window.removeEventListener("click", callback);
    }
  }, [open]);

  return (
    <div className="rounded flex justify-end" onClick={(ev) => ev.stopPropagation()}>
      <details id="one-time-config" className="rounded relative z-[1]" open={open}>
        <summary
          className="marker:content-[''] hover:bg-toolbar-hover-background cursor-pointer absolute right-0 top-0 p-1 rounded size-6 outline-0"
          tabIndex={-1}
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            setOpen(!open);
          }}
        >
          <ConfigIcon className="follow-colors" />
        </summary>
        {open && (
          <nav className="p-1 rounded mt-9 min-w-max bg-sidebar-background">
            <LineOptionsDetails />
            <WindowOptionsDetails />
            <OtherOptionsDetails />
            <WatermarkDetails />
            <SaveActionsDetails />
            <ActionDetails />
          </nav>
        )}
      </details>
    </div>
  );
}
