/* ═══════════════════════════════════════════
   STORAGE ADAPTER
   Wraps window.storage with JSON serialisation
   and silent error handling.
   ═══════════════════════════════════════════ */

export const S = {
  async get(k) {
    try {
      const r = await window.storage.get(k);
      return r ? JSON.parse(r.value) : null;
    } catch {
      return null;
    }
  },
  async set(k, v) {
    try {
      await window.storage.set(k, JSON.stringify(v));
    } catch {}
  },
  async del(k) {
    try {
      await window.storage.delete(k);
    } catch {}
  },
};
