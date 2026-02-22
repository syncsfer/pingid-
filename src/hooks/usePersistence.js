import { useEffect, useCallback, useRef } from "react";
import { S } from "../storage";
import { STORAGE_KEYS } from "../constants";

/**
 * usePersistence
 *
 * Handles reading the saved app state on first mount and writing
 * updates back to storage whenever the relevant values change.
 *
 * Intentionally kept simple: storage writes are fire-and-forget and
 * will not throw (errors are swallowed in the storage adapter).
 *
 * @param {{
 *   screen: string,
 *   loading: boolean,
 *   wallet: string | null,
 *   keys: object | null,
 *   alias: string,
 *   addressHistory: Array,
 *   contacts: Array,
 *   msgs: object,
 *   settings: object
 * }} state - Current app state values to persist.
 * @param {{
 *   onLoaded: (saved: object) => void
 * }} callbacks
 * @returns {{ saveProfile: () => Promise<void> }}
 *
 * @example
 * const { saveProfile } = usePersistence(
 *   { screen, loading, wallet, keys, alias, addressHistory, contacts, msgs, settings },
 *   { onLoaded: (saved) => { if (saved?.wallet) restoreSession(saved); } }
 * );
 */
export function usePersistence(
  { screen, loading, wallet, keys, alias, addressHistory, contacts, msgs, settings },
  { onLoaded }
) {
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  // ── Bootstrap: load saved state on mount ──────────────────────────
  useEffect(() => {
    (async () => {
      const profile  = await S.get(STORAGE_KEYS.PROFILE);
      const savedC   = await S.get(STORAGE_KEYS.CONTACTS);
      const savedM   = await S.get(STORAGE_KEYS.MSGS);
      const savedSt  = await S.get(STORAGE_KEYS.SETTINGS);
      onLoadedRef.current({ profile, contacts: savedC, msgs: savedM, settings: savedSt });
    })();
  }, []); // intentionally empty – runs once on mount

  // ── Write contacts + messages whenever they change ─────────────────
  useEffect(() => {
    if (screen === "app" && !loading) {
      S.set(STORAGE_KEYS.CONTACTS, contacts);
      S.set(STORAGE_KEYS.MSGS, msgs);
    }
  }, [contacts, msgs, screen, loading]);

  // ── Write settings ─────────────────────────────────────────────────
  useEffect(() => {
    if (screen === "app" && !loading) {
      S.set(STORAGE_KEYS.SETTINGS, settings);
    }
  }, [settings, screen, loading]);

  // ── Write profile (wallet / keys / alias / history) ────────────────
  useEffect(() => {
    if (wallet && !loading) {
      S.set(STORAGE_KEYS.PROFILE, { wallet, keys, alias, addressHistory });
    }
  }, [wallet, keys, alias, addressHistory, loading]);

  /** Imperatively flush the profile (useful before navigating away). */
  const saveProfile = useCallback(async () => {
    if (wallet) {
      await S.set(STORAGE_KEYS.PROFILE, { wallet, keys, alias, addressHistory });
    }
  }, [wallet, keys, alias, addressHistory]);

  return { saveProfile };
}
