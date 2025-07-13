import { useEffect } from "react";
import { $$, getWidth, setVar } from "../../../util";

function updateSelectsWidth() {
  const selects = $$<HTMLSelectElement>("li select");
  console.log(selects);

  setVar("bigger-select-width", "min-content");

  const biggerSelectWidth = selects.reduce((prev, curr) => {
    const currWidth = getWidth(curr);

    return currWidth >= prev ? currWidth : prev;
  }, 0);

  setVar("bigger-select-width", `${biggerSelectWidth}px`);
}

export function useUpdateSelectsWidth() {
  useEffect(() => {
    updateSelectsWidth();

    return () => updateSelectsWidth();
  });
}
