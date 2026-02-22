import { useState, useCallback } from "react";
import { uid } from "../helpers";

/**
 * useToast
 *
 * Manages a list of transient toast notifications.
 * Each toast is automatically removed after `timeout` ms.
 *
 * @param {number} [timeout=3000] - Auto-dismiss delay in milliseconds.
 * @returns {{
 *   toasts: Array<{id: string, text: string}>,
 *   toast: (text: string) => void
 * }}
 *
 * @example
 * const { toasts, toast } = useToast();
 * toast("Address copied!"); // shows notification for 3 s
 */
export function useToast(timeout = 3000) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    (text) => {
      const id = uid();
      setToasts((prev) => [...prev, { id, text }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        timeout
      );
    },
    [timeout]
  );

  return { toasts, toast };
}
