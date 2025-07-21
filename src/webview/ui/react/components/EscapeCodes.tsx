/** biome-ignore-all lint/suspicious/noArrayIndexKey: key need to be index */
import { memo } from "react";

const codeRegex = /(`\S[^`]*\S`)/;
const codeContentRegex = /`(\S[^`]*\S)`/;

export const EscapeCodes = memo(function EscapeCodes({ text }: { text: string }) {
  return text.split(codeRegex).map((part, i) => {
    return codeContentRegex.test(part) ? (
      <code key={i}>{part.replace(codeContentRegex, (str) => str.substring(1, str.length - 1))}</code>
    ) : (
      <span key={i}>{part}</span>
    );
  });
});
