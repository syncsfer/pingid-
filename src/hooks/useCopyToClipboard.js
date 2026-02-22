import { useState, useCallback } from "react";

/**
 * useCopyToClipboard
 *
 * Copies text to the system clipboard and provides a temporary
 * `copied` flag that resets after `resetDelay` ms – useful for
 * swapping a "Copy" icon to a "Check" icon on success.
 *
 * @param {number} [resetDelay=1500] - Duration (ms) before `copied` resets.
 * @returns {{
 *   copied: boolean,
 *   copy: (text: string) => void
 * }}
 *
 * @example
 * const { copied, copy } = useCopyToClipboard();
 * <button onClick={() => copy(walletAddress)}>
 *   {copied ? <CheckIcon /> : <CopyIcon />}
 * </button>
 */
export function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    },
    [resetDelay]
  );

  return { copied, copy };
}
