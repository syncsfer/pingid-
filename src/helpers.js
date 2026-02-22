/* ═══════════════════════════════════════════
   PURE HELPER FUNCTIONS
   ═══════════════════════════════════════════ */

/** Generate a short random uid */
export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/** Generate a random Ethereum-style wallet address */
export const genWallet = () => {
  let id = "0x";
  for (let i = 0; i < 40; i++)
    id += "0123456789abcdef"[Math.floor(Math.random() * 16)];
  return id;
};

/** Shorten a long hex address to "0xABCD···1234" */
export const short = (id) =>
  id ? `${id.slice(0, 6)}···${id.slice(-4)}` : "";

/** Generate a deterministic CSS gradient from a seed string */
export const gradFor = (s) => {
  let h = 0;
  for (let i = 0; i < (s || "").length; i++)
    h = s.charCodeAt(i) + ((h << 5) - h);
  const a = Math.abs(h) % 360;
  return `linear-gradient(135deg, hsl(${a},72%,55%), hsl(${(a + 45) % 360},65%,45%))`;
};

/** Generate a public/private key pair (mock) */
export const genKeys = () => ({ pub: `pk_${uid()}`, priv: `sk_${uid()}` });

/** Current time as HH:MM string */
export const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Today's date as "Weekday, Mon DD" */
export const today = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
