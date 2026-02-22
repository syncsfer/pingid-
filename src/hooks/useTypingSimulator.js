import { useState, useCallback } from "react";
import { SMART_REPLIES } from "../constants";
import { uid, now, today } from "../helpers";

/**
 * useTypingSimulator
 *
 * Simulates a remote peer typing and replying in a 1-to-1 chat.
 * When `triggerReply` is called for a contact that is not a group and
 * not blocked, it:
 *   1. Shows a typing indicator after a short delay.
 *   2. Appends a random smart reply and hides the indicator.
 *   3. Optionally calls an `onNotify` callback (e.g. to show a toast).
 *
 * @param {(contactId: string, message: object) => void} appendMessage
 *   Function that adds a new message to a conversation. Signature matches
 *   the setter produced by `useMessages`.
 * @param {(contactId: string, isTyping: boolean) => void} [onNotify]
 *   Optional callback fired when the simulated reply is delivered.
 *   Receives the contact object and reply text.
 * @returns {{
 *   typingMap: Record<string, boolean>,
 *   triggerReply: (contact: object) => void
 * }}
 *
 * @example
 * const { typingMap, triggerReply } = useTypingSimulator(
 *   (cid, msg) => setMsgs(prev => ({ ...prev, [cid]: [...(prev[cid] || []), msg] })),
 *   (contact, text) => toast(`${contact.alias}: ${text.slice(0, 30)}…`)
 * );
 *
 * // After sending a message to `contact`:
 * if (!contact.isGroup && !contact.blocked) triggerReply(contact);
 */
export function useTypingSimulator(appendMessage, onNotify) {
  const [typingMap, setTypingMap] = useState({});

  const triggerReply = useCallback(
    (contact) => {
      if (!contact || contact.isGroup || contact.blocked) return;

      const cid = contact.id;
      const typingDelay = 400;
      const replyDelay = 1200 + Math.random() * 2000;

      // Show typing indicator after a brief pause.
      setTimeout(() => {
        setTypingMap((prev) => ({ ...prev, [cid]: true }));

        // Deliver the reply and hide the indicator.
        setTimeout(() => {
          const text = SMART_REPLIES[Math.floor(Math.random() * SMART_REPLIES.length)];
          const replyMsg = {
            id: uid(),
            from: "them",
            text,
            time: now(),
            date: today(),
            type: "text",
            reactions: [],
            read: false,
          };
          appendMessage(cid, replyMsg);
          setTypingMap((prev) => ({ ...prev, [cid]: false }));
          if (onNotify) onNotify(contact, text);
        }, replyDelay);
      }, typingDelay);
    },
    [appendMessage, onNotify]
  );

  return { typingMap, triggerReply };
}
