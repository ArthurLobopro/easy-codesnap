import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorInputProps {
  value: string;
  setValue: (v: string) => void;
}

export function ColorInput({ value, setValue }: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ background: value }} className="size-4 relative" onClick={() => !isOpen && setIsOpen(true)}>
      {isOpen && (
        <>
          <div className="absolute right-full z-40 -translate-x-2" onClick={(ev) => ev.stopPropagation()}>
            <HexColorPicker defaultValue={value} onChange={setValue} className="pointer-events-auto" />
          </div>
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={(ev) => {
              ev.stopPropagation();
              setIsOpen(false);
            }}
          />
          ,
        </>
      )}
    </div>
  );
}
