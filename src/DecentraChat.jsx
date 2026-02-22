import { useState, useCallback, useRef, useEffect } from "react";

import {
  useToast,
  useCopyToClipboard,
  useVoiceRecording,
  useQRScanner,
  useTypingSimulator,
  usePersistence,
} from "./hooks";

import {
  EMOJIS,
  REACTIONS,
  FILE_TYPES,
  SEED_CONTACTS,
  SEED_MSGS,
} from "./constants";

import { uid, genWallet, genKeys, short, gradFor, now, today } from "./helpers";

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:       "#0d1117",
  surface:  "#161b22",
  surface2: "#21262d",
  surface3: "#30363d",
  accent:   "#238636",
  blue:     "#1f6feb",
  red:      "#da3633",
  text:     "#c9d1d9",
  textSub:  "#8b949e",
  border:   "#30363d",
  bubbleMe: "#1f6feb",
  bubbleThem: "#21262d",
};

const styles = {
  /* ── Layout ─────────────────────────────────────────────── */
  splash: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", height: "100vh", background: C.bg, color: C.text,
    fontFamily: "system-ui, sans-serif",
  },
  splashLogo:  { fontSize: 64, marginBottom: 16 },
  splashTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text },
  splashSub:   { color: C.textSub, fontSize: 14 },

  landing: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: C.bg, fontFamily: "system-ui, sans-serif",
  },
  landingCard: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
    padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center",
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
  },
  landingLogo:     { fontSize: 56, marginBottom: 16 },
  landingTitle:    { margin: "0 0 8px", fontSize: 32, fontWeight: 800, color: C.text },
  landingSub:      { margin: "0 0 32px", color: C.textSub, fontSize: 14 },
  landingFeatures: { marginBottom: 32, textAlign: "left" },
  landingFeature:  { padding: "8px 0", color: C.textSub, fontSize: 14 },

  onboard: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: C.bg, fontFamily: "system-ui, sans-serif",
  },
  onboardCard: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
    padding: "40px 36px", maxWidth: 420, width: "90%",
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    display: "flex", flexDirection: "column", gap: 16,
  },
  onboardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  onboardLogo:   { fontSize: 28 },
  onboardBrand:  { fontSize: 20, fontWeight: 700, color: C.text },
  onboardTitle:  { margin: 0, fontSize: 22, fontWeight: 700, color: C.text },
  onboardSub:    { margin: 0, color: C.textSub, fontSize: 13, lineHeight: 1.6 },

  app: {
    display: "flex", height: "100vh", background: C.bg,
    fontFamily: "system-ui, sans-serif", color: C.text, overflow: "hidden",
  },

  /* ── Sidebar ────────────────────────────────────────────── */
  sidebar: {
    width: 300, minWidth: 260, borderRight: `1px solid ${C.border}`,
    display: "flex", flexDirection: "column", background: C.surface, flexShrink: 0,
  },
  sidebarHeader: {
    padding: "16px 12px", display: "flex", alignItems: "center", gap: 10,
    borderBottom: `1px solid ${C.border}`,
  },
  sidebarHeaderInfo: { flex: 1, minWidth: 0 },
  sidebarName:   { fontWeight: 600, fontSize: 14, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sidebarStatus: { fontSize: 11, color: C.accent, marginTop: 2 },
  sidebarActions:{ display: "flex", alignItems: "center", gap: 4 },

  contactList: { flex: 1, overflowY: "auto" },
  contactItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
    cursor: "pointer", borderBottom: `1px solid ${C.border}`,
    transition: "background .15s",
  },
  contactItemActive: { background: C.surface2 },
  contactAvatar: {
    width: 40, height: 40, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontSize: 14, color: "#fff", flexShrink: 0, position: "relative",
  },
  contactInfo: { flex: 1, minWidth: 0 },
  contactName: {
    fontWeight: 600, fontSize: 13, color: C.text,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  contactLast: {
    fontSize: 12, color: C.textSub, marginTop: 2,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  onlineDot: {
    position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
    borderRadius: "50%", background: C.accent, border: `2px solid ${C.surface}`,
  },
  blockedTag: { fontSize: 10, color: C.red,    marginLeft: 4 },
  typingTag:  { fontSize: 10, color: C.accent, marginLeft: 4, fontStyle: "italic" },
  unreadBadge: {
    background: C.blue, color: "#fff", fontSize: 11, fontWeight: 700,
    borderRadius: 10, padding: "1px 6px", flexShrink: 0,
  },
  badge: {
    background: C.red, color: "#fff", fontSize: 11, fontWeight: 700,
    borderRadius: 10, padding: "1px 6px",
  },

  /* ── Main chat ──────────────────────────────────────────── */
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },

  chatHeader: {
    padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
    display: "flex", alignItems: "center", gap: 12, background: C.surface, flexShrink: 0,
  },
  chatHeaderName: { fontWeight: 700, fontSize: 15, color: C.text },
  chatHeaderSub:  { fontSize: 12, color: C.textSub, marginTop: 2 },
  chatHeaderActions: { marginLeft: "auto", display: "flex", gap: 4 },

  messages: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 },
  noMessages: { color: C.textSub, textAlign: "center", marginTop: 40, fontSize: 14 },

  msgRow: { display: "flex", alignItems: "flex-end", gap: 8 },
  msgAvatar: {
    width: 28, height: 28, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontSize: 11, color: "#fff", flexShrink: 0,
  },
  bubble: {
    maxWidth: "68%", borderRadius: 14, padding: "8px 12px",
    position: "relative", wordBreak: "break-word",
  },
  bubbleMine:  { background: C.bubbleMe,   borderBottomRightRadius: 4, color: "#fff" },
  bubbleThem:  { background: C.bubbleThem, borderBottomLeftRadius:  4, color: C.text },
  typingBubble:{ display: "flex", gap: 4, alignItems: "center", padding: "12px 16px" },
  msgText: { fontSize: 14, lineHeight: 1.5 },
  msgMeta: { display: "flex", gap: 6, alignItems: "center", marginTop: 4, justifyContent: "flex-end" },
  msgTime: { fontSize: 10, color: "rgba(255,255,255,0.5)" },
  msgRead: { fontSize: 10, color: "#58a6ff" },
  msgReactions: { display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 },
  reaction: { fontSize: 14 },

  reactionPicker: {
    position: "absolute", bottom: "110%", left: 0, background: C.surface2,
    border: `1px solid ${C.border}`, borderRadius: 10, padding: 6,
    display: "flex", gap: 4, zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },
  reactionBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 2 },

  typingDot: {
    width: 7, height: 7, borderRadius: "50%", background: C.textSub,
    display: "inline-block", animation: "pulse 1.2s infinite",
  },

  /* ── Input bar ──────────────────────────────────────────── */
  inputBar: {
    padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.surface,
    display: "flex", alignItems: "center", gap: 8, position: "relative", flexShrink: 0,
  },
  textInput: {
    flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "8px 12px", color: C.text, fontSize: 14, outline: "none",
  },
  sendBtn: {
    background: C.blue, color: "#fff", border: "none", borderRadius: 8,
    padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 14,
    transition: "opacity .15s",
  },
  emojiPicker: {
    position: "absolute", bottom: "110%", left: 14, background: C.surface2,
    border: `1px solid ${C.border}`, borderRadius: 12, padding: 10,
    display: "flex", flexWrap: "wrap", gap: 4, width: 280, zIndex: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },
  emojiBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 2 },

  recordingBar: {
    padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.surface,
    display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
  },
  recDot:  { width: 10, height: 10, borderRadius: "50%", background: C.red, flexShrink: 0 },
  recTime: { flex: 1, color: C.red, fontWeight: 600, fontSize: 14 },

  blockedBar: {
    padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: C.surface,
    color: C.textSub, fontSize: 13, textAlign: "center", flexShrink: 0,
  },

  /* ── Empty state ────────────────────────────────────────── */
  emptyState: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 12, color: C.textSub,
  },
  emptyIcon:  { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: C.text },
  emptySub:   { fontSize: 14, marginBottom: 8 },

  /* ── Panels ─────────────────────────────────────────────── */
  panelOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  panel: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
    padding: "32px 28px", width: 400, maxWidth: "90vw", maxHeight: "90vh",
    overflowY: "auto", position: "relative",
    display: "flex", flexDirection: "column", gap: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  },
  panelClose: {
    position: "absolute", top: 12, right: 14, background: "none",
    border: "none", color: C.textSub, cursor: "pointer", fontSize: 18,
  },
  panelTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: C.text },

  /* ── Profile panel ──────────────────────────────────────── */
  profileAvatar: {
    width: 72, height: 72, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 800,
    fontSize: 28, color: "#fff", alignSelf: "center",
  },
  profileField: { display: "flex", flexDirection: "column", gap: 6 },
  addrRow:   { display: "flex", alignItems: "center", gap: 8 },
  addrCode:  { flex: 1, background: C.surface2, borderRadius: 6, padding: "6px 10px", fontSize: 13, color: C.text, fontFamily: "monospace" },
  encTag:    { fontSize: 12, color: C.accent, fontWeight: 600 },

  /* ── Settings panel ─────────────────────────────────────── */
  settingRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0", borderBottom: `1px solid ${C.border}`,
  },
  settingLabel: { fontWeight: 600, fontSize: 14, color: C.text },
  settingDesc:  { fontSize: 12, color: C.textSub, marginTop: 2 },
  toggle: {
    background: C.surface3, color: C.textSub, border: "none", borderRadius: 20,
    padding: "4px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12, minWidth: 48,
  },
  toggleOn: { background: C.accent, color: "#fff" },

  /* ── QR scanner panel ───────────────────────────────────── */
  qrViewport: {
    width: "100%", aspectRatio: "1", background: "#000", borderRadius: 12,
    position: "relative", overflow: "hidden", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  qrCorner: {
    position: "absolute", inset: 16,
    border: `2px solid ${C.accent}`, borderRadius: 8,
  },
  qrScanLine: {
    position: "absolute", left: 16, right: 16, height: 2,
    background: C.accent, boxShadow: `0 0 8px ${C.accent}`, transition: "top .05s linear",
  },
  qrPlaceholder: { fontSize: 64, opacity: 0.15 },

  /* ── Shared components ──────────────────────────────────── */
  avatar: {
    width: 38, height: 38, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontSize: 14, color: "#fff", border: "none", cursor: "pointer",
    flexShrink: 0,
  },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: 18,
    padding: "4px 6px", borderRadius: 6, color: C.textSub,
  },
  input: {
    background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", width: "100%",
    boxSizing: "border-box",
  },
  label: { fontSize: 12, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5 },
  divider: {
    display: "flex", alignItems: "center", gap: 12, color: C.textSub, fontSize: 12,
    margin: "4px 0",
  },
  btnPrimary: {
    background: C.blue, color: "#fff", border: "none", borderRadius: 8,
    padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14,
    width: "100%",
  },
  btnSecondary: {
    background: C.surface2, color: C.text, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600,
    fontSize: 14, width: "100%",
  },
  btnDanger: {
    background: C.red, color: "#fff", border: "none", borderRadius: 8,
    padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14,
    width: "100%",
  },

  /* ── Toasts ─────────────────────────────────────────────── */
  toastContainer: {
    position: "fixed", bottom: 20, right: 20, display: "flex",
    flexDirection: "column", gap: 8, zIndex: 200,
  },
  toast: {
    background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "10px 16px", color: C.text, fontSize: 13, fontWeight: 500,
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    maxWidth: 320,
  },

  /* ── Wallet display (onboard) ───────────────────────────── */
  walletDisplay: {
    background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4,
  },
  walletLabel: { fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5 },
  walletAddr:  { fontFamily: "monospace", fontSize: 13, color: C.text },
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function DecentraChat() {
  /* ── Core app state ──────────────────────────────────────────────────────── */
  const [screen, setScreen]                   = useState("landing");
  const [loading, setLoading]                 = useState(true);
  const [wallet, setWallet]                   = useState(null);
  const [keys, setKeys]                       = useState(null);
  const [alias, setAlias]                     = useState("");
  const [addressHistory, setAddressHistory]   = useState([]);
  const [contacts, setContacts]               = useState(SEED_CONTACTS);
  const [msgs, setMsgs]                       = useState(SEED_MSGS);
  const [settings, setSettings]               = useState({
    notifications: true,
    sound: true,
    encryptionLevel: "AES-256",
  });

  /* ── UI state ────────────────────────────────────────────────────────────── */
  const [activeId, setActiveId]               = useState(null);
  const [draft, setDraft]                     = useState("");
  const [panel, setPanel]                     = useState(null);
  const [showEmoji, setShowEmoji]             = useState(false);
  const [reactionTarget, setReactionTarget]   = useState(null);
  const [onboardStep, setOnboardStep]         = useState("connect");
  const [importAddr, setImportAddr]           = useState("");
  const [newContactAddr, setNewContactAddr]   = useState("");
  const [newContactAlias, setNewContactAlias] = useState("");
  const messagesEndRef                        = useRef(null);

  /* ── Hooks ───────────────────────────────────────────────────────────────── */
  const { toasts, toast } = useToast();
  const { copied, copy }  = useCopyToClipboard();

  const {
    recording, recordTime,
    startRecording, stopRecording, cancelRecording,
  } = useVoiceRecording();

  const {
    scannerActive, scanAnimFrame,
    scanInput, scanResult,
    setScanInput, startScanner, stopScanner,
    simulateScan, resetScan,
  } = useQRScanner();

  /* appendMessage is stable – safe to pass to useTypingSimulator */
  const appendMessage = useCallback((cid, msg) => {
    setMsgs(prev => ({ ...prev, [cid]: [...(prev[cid] || []), msg] }));
  }, []);

  const onReplyNotify = useCallback((contact, text) => {
    toast(`${contact.alias || short(contact.id)}: ${text.slice(0, 40)}…`);
  }, [toast]);

  const { typingMap, triggerReply } = useTypingSimulator(appendMessage, onReplyNotify);

  /* Persistence – restore on mount, auto-save on changes */
  const { saveProfile } = usePersistence(
    { screen, loading, wallet, keys, alias, addressHistory, contacts, msgs, settings },
    {
      onLoaded: useCallback(({ profile, contacts: savedC, msgs: savedM, settings: savedSt }) => {
        if (profile?.wallet) {
          setWallet(profile.wallet);
          setKeys(profile.keys);
          setAlias(profile.alias || "");
          setAddressHistory(profile.addressHistory || []);
          setContacts(savedC || SEED_CONTACTS);
          setMsgs(savedM    || SEED_MSGS);
          if (savedSt) setSettings(s => ({ ...s, ...savedSt }));
          setScreen("app");
        }
        setLoading(false);
      }, []),
    }
  );

  /* ── Side effects ────────────────────────────────────────────────────────── */

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, activeId, typingMap]);

  // When a QR scan resolves, pre-fill the add-contact form
  useEffect(() => {
    if (scanResult) {
      setNewContactAddr(scanResult);
      setPanel("addContact");
      resetScan();
      toast("Address scanned – review and confirm below");
    }
  }, [scanResult, resetScan, toast]);

  /* ── Handlers ────────────────────────────────────────────────────────────── */

  const handleGenerateWallet = () => {
    const w = genWallet();
    const k = genKeys();
    setWallet(w);
    setKeys(k);
    setAddressHistory([w]);
    setOnboardStep("alias");
  };

  const handleImportWallet = () => {
    const w = importAddr.trim();
    if (w.length < 10) { toast("Enter a valid wallet address"); return; }
    const k = genKeys();
    setWallet(w);
    setKeys(k);
    setAddressHistory([w]);
    setImportAddr("");
    setOnboardStep("alias");
  };

  const handleFinishOnboard = () => {
    setContacts(SEED_CONTACTS);
    setMsgs(SEED_MSGS);
    setScreen("app");
    toast("Welcome to DecentraChat!");
  };

  const handleSend = () => {
    if (!draft.trim() || !activeId) return;
    const contact = contacts.find(c => c.id === activeId);
    const msg = {
      id: uid(), from: "me",
      text: draft.trim(),
      time: now(), date: today(),
      type: "text", reactions: [], read: true,
    };
    appendMessage(activeId, msg);
    setDraft("");
    setShowEmoji(false);
    if (contact && !contact.isGroup && !contact.blocked) triggerReply(contact);
  };

  const handleVoiceSend = () => {
    const dur = stopRecording();
    if (!activeId) return;
    const contact = contacts.find(c => c.id === activeId);
    appendMessage(activeId, {
      id: uid(), from: "me",
      text: `🎤 Voice message (${dur}s)`,
      time: now(), date: today(),
      type: "voice", duration: dur,
      reactions: [], read: true,
    });
    if (contact && !contact.isGroup && !contact.blocked) triggerReply(contact);
    toast("Voice message sent");
  };

  const handleFileSend = () => {
    if (!activeId) return;
    const contact = contacts.find(c => c.id === activeId);
    const file = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)];
    appendMessage(activeId, {
      id: uid(), from: "me",
      text: `${file.icon} ${file.name}  (${file.size})`,
      time: now(), date: today(),
      type: "file", reactions: [], read: true,
    });
    toast(`Shared ${file.name}`);
    if (contact && !contact.isGroup && !contact.blocked) triggerReply(contact);
  };

  const handleReaction = (msgId, emoji) => {
    if (!activeId) return;
    setMsgs(prev => ({
      ...prev,
      [activeId]: (prev[activeId] || []).map(m =>
        m.id !== msgId ? m : {
          ...m,
          reactions: m.reactions.includes(emoji)
            ? m.reactions.filter(r => r !== emoji)
            : [...m.reactions, emoji],
        }
      ),
    }));
    setReactionTarget(null);
  };

  const handleAddContact = () => {
    const id = newContactAddr.trim();
    if (!id) { toast("Enter a wallet address"); return; }
    if (contacts.some(c => c.id === id)) { toast("Contact already exists"); return; }
    setContacts(prev => [...prev, {
      id,
      alias: newContactAlias.trim() || null,
      on: true, blocked: false, isGroup: false,
    }]);
    setNewContactAddr("");
    setNewContactAlias("");
    setPanel(null);
    toast("Contact added!");
  };

  const handleSelectContact = (cid) => {
    setActiveId(cid);
    setPanel(null);
    setShowEmoji(false);
    setReactionTarget(null);
    // Mark all incoming messages as read
    setMsgs(prev => ({
      ...prev,
      [cid]: (prev[cid] || []).map(m => ({ ...m, read: true })),
    }));
  };

  const handleBlockToggle = (cid) => {
    setContacts(prev => prev.map(c => c.id === cid ? { ...c, blocked: !c.blocked } : c));
    const c = contacts.find(x => x.id === cid);
    toast(c?.blocked ? "Contact unblocked" : "Contact blocked");
  };

  const handleDeleteContact = (cid) => {
    setContacts(prev => prev.filter(c => c.id !== cid));
    if (activeId === cid) setActiveId(null);
    toast("Contact removed");
  };

  const handleDisconnect = async () => {
    await saveProfile();
    setWallet(null); setKeys(null); setAlias(""); setAddressHistory([]);
    setContacts(SEED_CONTACTS); setMsgs(SEED_MSGS);
    setActiveId(null); setScreen("landing");
    toast("Disconnected");
  };

  /* ── Derived values ──────────────────────────────────────────────────────── */
  const activeContact  = contacts.find(c => c.id === activeId);
  const activeMessages = msgs[activeId] || [];
  const unreadTotal    = contacts.reduce(
    (n, c) => n + (msgs[c.id] || []).filter(m => m.from === "them" && !m.read).length, 0
  );

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════ */

  /* ── Loading splash ────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={styles.splash}>
        <div style={styles.splashLogo}>🔗</div>
        <div style={styles.splashTitle}>DecentraChat</div>
        <div style={styles.splashSub}>Loading encrypted session…</div>
      </div>
    );
  }

  /* ── Landing ───────────────────────────────────────────────────────────── */
  if (screen === "landing") {
    return (
      <div style={styles.landing}>
        <div style={styles.landingCard}>
          <div style={styles.landingLogo}>🔗</div>
          <h1 style={styles.landingTitle}>DecentraChat</h1>
          <p style={styles.landingSub}>Encrypted · Decentralized · Wallet-Native</p>
          <div style={styles.landingFeatures}>
            {[
              "🔒 End-to-end encrypted",
              "🌐 No central servers",
              "🪙 Wallet-native identity",
              "📵 Zero metadata leakage",
            ].map(f => <div key={f} style={styles.landingFeature}>{f}</div>)}
          </div>
          <button style={styles.btnPrimary} onClick={() => setScreen("onboard")}>
            Launch App →
          </button>
        </div>

        <div style={styles.toastContainer}>
          {toasts.map(t => <div key={t.id} style={styles.toast}>{t.text}</div>)}
        </div>
      </div>
    );
  }

  /* ── Onboarding ────────────────────────────────────────────────────────── */
  if (screen === "onboard") {
    return (
      <div style={styles.onboard}>
        <div style={styles.onboardCard}>
          <div style={styles.onboardHeader}>
            <span style={styles.onboardLogo}>🔗</span>
            <span style={styles.onboardBrand}>DecentraChat</span>
          </div>

          {onboardStep === "connect" && <>
            <h2 style={styles.onboardTitle}>Connect your wallet</h2>
            <p style={styles.onboardSub}>
              Your wallet address is your identity — no username or password required.
            </p>
            <button style={styles.btnPrimary} onClick={handleGenerateWallet}>
              ✨ Generate New Wallet
            </button>
            <div style={styles.divider}><span>or import existing</span></div>
            <input
              style={styles.input}
              placeholder="Paste wallet address (0x…)"
              value={importAddr}
              onChange={e => setImportAddr(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleImportWallet()}
            />
            <button style={styles.btnSecondary} onClick={handleImportWallet}>
              Import Address
            </button>
          </>}

          {onboardStep === "alias" && <>
            <h2 style={styles.onboardTitle}>Choose a display name</h2>
            <p style={styles.onboardSub}>Optional — you can skip this and use your wallet address.</p>
            <div style={styles.walletDisplay}>
              <span style={styles.walletLabel}>Your wallet</span>
              <span style={styles.walletAddr}>{short(wallet)}</span>
            </div>
            <input
              style={styles.input}
              placeholder="alice.eth, satoshi, …"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleFinishOnboard()}
              autoFocus
            />
            <button style={styles.btnPrimary} onClick={handleFinishOnboard}>
              Start Chatting →
            </button>
          </>}
        </div>

        <div style={styles.toastContainer}>
          {toasts.map(t => <div key={t.id} style={styles.toast}>{t.text}</div>)}
        </div>
      </div>
    );
  }

  /* ── Main App ──────────────────────────────────────────────────────────── */
  return (
    <div style={styles.app}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={styles.sidebar}>

        {/* Profile header */}
        <div style={styles.sidebarHeader}>
          <button
            style={{ ...styles.avatar, background: gradFor(wallet || "") }}
            onClick={() => setPanel("profile")}
          >
            {(alias || short(wallet || "")).slice(0, 2).toUpperCase()}
          </button>
          <div style={styles.sidebarHeaderInfo}>
            <div style={styles.sidebarName}>{alias || short(wallet || "")}</div>
            <div style={styles.sidebarStatus}>🟢 Online · Encrypted</div>
          </div>
          <div style={styles.sidebarActions}>
            {unreadTotal > 0 && <span style={styles.badge}>{unreadTotal}</span>}
            <button style={styles.iconBtn} onClick={() => setPanel("addContact")} title="Add contact">➕</button>
            <button style={styles.iconBtn} onClick={() => setPanel("settings")}   title="Settings">⚙️</button>
          </div>
        </div>

        {/* Contact list */}
        <div style={styles.contactList}>
          {contacts.map(c => {
            const cMsgs  = msgs[c.id] || [];
            const last   = cMsgs[cMsgs.length - 1];
            const unread = cMsgs.filter(m => m.from === "them" && !m.read).length;
            const active = c.id === activeId;
            return (
              <div
                key={c.id}
                style={{ ...styles.contactItem, ...(active ? styles.contactItemActive : {}) }}
                onClick={() => handleSelectContact(c.id)}
              >
                <div style={{ ...styles.contactAvatar, background: gradFor(c.id) }}>
                  {(c.alias || short(c.id)).slice(0, 2).toUpperCase()}
                  {c.on && !c.blocked && <span style={styles.onlineDot} />}
                </div>
                <div style={styles.contactInfo}>
                  <div style={styles.contactName}>
                    {c.alias || short(c.id)}
                    {c.blocked          && <span style={styles.blockedTag}> blocked</span>}
                    {typingMap[c.id]    && <span style={styles.typingTag}> typing…</span>}
                  </div>
                  {last && (
                    <div style={styles.contactLast}>
                      {last.text.length > 38 ? last.text.slice(0, 38) + "…" : last.text}
                    </div>
                  )}
                </div>
                {unread > 0 && <span style={styles.unreadBadge}>{unread}</span>}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Chat area ───────────────────────────────────────────────────── */}
      <main style={styles.main}>
        {!activeId ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyTitle}>Select a conversation</div>
            <div style={styles.emptySub}>Pick a contact or add someone new to get started</div>
            <button style={{ ...styles.btnPrimary, width: "auto" }} onClick={() => setPanel("addContact")}>
              Add Contact
            </button>
          </div>
        ) : (<>

          {/* Chat header */}
          <div style={styles.chatHeader}>
            <div style={{ ...styles.contactAvatar, background: gradFor(activeContact?.id || "") }}>
              {(activeContact?.alias || short(activeContact?.id || "")).slice(0, 2).toUpperCase()}
              {activeContact?.on && !activeContact?.blocked && <span style={styles.onlineDot} />}
            </div>
            <div>
              <div style={styles.chatHeaderName}>
                {activeContact?.alias || short(activeContact?.id || "")}
              </div>
              <div style={styles.chatHeaderSub}>
                {typingMap[activeId]
                  ? "typing…"
                  : activeContact?.on
                    ? "Online · End-to-end encrypted 🔒"
                    : "Offline · End-to-end encrypted 🔒"}
              </div>
            </div>
            <div style={styles.chatHeaderActions}>
              <button
                style={styles.iconBtn}
                title="Copy address"
                onClick={() => { copy(activeContact?.id || ""); toast("Address copied!"); }}
              >
                {copied ? "✓" : "📋"}
              </button>
              <button
                style={styles.iconBtn}
                title={activeContact?.blocked ? "Unblock" : "Block"}
                onClick={() => handleBlockToggle(activeId)}
              >
                {activeContact?.blocked ? "🔓" : "🚫"}
              </button>
              <button
                style={styles.iconBtn}
                title="Remove contact"
                onClick={() => handleDeleteContact(activeId)}
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {activeMessages.length === 0 && (
              <div style={styles.noMessages}>No messages yet — say hello!</div>
            )}

            {activeMessages.map(m => {
              const isMine = m.from === "me";
              return (
                <div
                  key={m.id}
                  style={{ ...styles.msgRow, justifyContent: isMine ? "flex-end" : "flex-start" }}
                >
                  {!isMine && (
                    <div style={{ ...styles.msgAvatar, background: gradFor(activeContact?.id || "") }}>
                      {(activeContact?.alias || short(activeContact?.id || "")).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div
                    style={{ ...styles.bubble, ...(isMine ? styles.bubbleMine : styles.bubbleThem) }}
                    onDoubleClick={() => setReactionTarget(r => r === m.id ? null : m.id)}
                  >
                    <div style={styles.msgText}>{m.text}</div>
                    <div style={styles.msgMeta}>
                      <span style={styles.msgTime}>{m.time}</span>
                      {isMine && <span style={styles.msgRead}>{m.read ? "✓✓" : "✓"}</span>}
                    </div>
                    {m.reactions.length > 0 && (
                      <div style={styles.msgReactions}>
                        {m.reactions.map((r, i) => <span key={i} style={styles.reaction}>{r}</span>)}
                      </div>
                    )}
                    {reactionTarget === m.id && (
                      <div style={styles.reactionPicker}>
                        {REACTIONS.map(r => (
                          <button key={r} style={styles.reactionBtn} onClick={() => handleReaction(m.id, r)}>
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typingMap[activeId] && (
              <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                <div style={{ ...styles.msgAvatar, background: gradFor(activeContact?.id || "") }}>
                  {(activeContact?.alias || "?").slice(0, 1).toUpperCase()}
                </div>
                <div style={{ ...styles.bubble, ...styles.bubbleThem }}>
                  <span style={{ ...styles.typingDot, animationDelay: "0s"   }} />
                  <span style={{ ...styles.typingDot, animationDelay: "0.2s" }} />
                  <span style={{ ...styles.typingDot, animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          {activeContact?.blocked ? (
            <div style={styles.blockedBar}>
              🚫 You have blocked this contact. Unblock to send messages.
            </div>
          ) : recording ? (
            <div style={styles.recordingBar}>
              <span style={styles.recDot} />
              <span style={styles.recTime}>Recording… {recordTime}s</span>
              <button style={{ ...styles.btnDanger,   width: "auto" }} onClick={cancelRecording}>Cancel</button>
              <button style={{ ...styles.btnPrimary,  width: "auto" }} onClick={handleVoiceSend}>Send 🎤</button>
            </div>
          ) : (
            <div style={styles.inputBar}>
              <button style={styles.iconBtn} title="Emoji"         onClick={() => setShowEmoji(s => !s)}>😊</button>
              <button style={styles.iconBtn} title="Attach file"   onClick={handleFileSend}>📎</button>
              <button style={styles.iconBtn} title="Voice message" onClick={startRecording}>🎤</button>

              {showEmoji && (
                <div style={styles.emojiPicker}>
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      style={styles.emojiBtn}
                      onClick={() => { setDraft(d => d + e); setShowEmoji(false); }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              <input
                style={styles.textInput}
                placeholder="Type an encrypted message…"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button
                style={{ ...styles.sendBtn, opacity: draft.trim() ? 1 : 0.5 }}
                onClick={handleSend}
                disabled={!draft.trim()}
              >
                Send ↑
              </button>
            </div>
          )}
        </>)}
      </main>

      {/* ── Panels (modal) ──────────────────────────────────────────────── */}
      {panel && (
        <div style={styles.panelOverlay} onClick={() => setPanel(null)}>
          <div style={styles.panel} onClick={e => e.stopPropagation()}>
            <button style={styles.panelClose} onClick={() => setPanel(null)}>✕</button>

            {/* Profile */}
            {panel === "profile" && <>
              <h2 style={styles.panelTitle}>Your Profile</h2>
              <div style={{ ...styles.profileAvatar, background: gradFor(wallet || "") }}>
                {(alias || short(wallet || "")).slice(0, 2).toUpperCase()}
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Display Name</label>
                <input
                  style={styles.input}
                  value={alias}
                  onChange={e => setAlias(e.target.value)}
                  placeholder="Optional alias"
                />
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Wallet Address</label>
                <div style={styles.addrRow}>
                  <code style={styles.addrCode}>{short(wallet || "")}</code>
                  <button style={styles.iconBtn} onClick={() => { copy(wallet || ""); toast("Copied!"); }}>
                    {copied ? "✓" : "📋"}
                  </button>
                </div>
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Public Key</label>
                <code style={styles.addrCode}>{keys?.pub ? short(keys.pub) : "—"}</code>
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Encryption</label>
                <span style={styles.encTag}>🔒 AES-256 · {keys?.pub ? "Keys ready" : "No keys"}</span>
              </div>
              <button style={styles.btnDanger} onClick={handleDisconnect}>Disconnect Wallet</button>
            </>}

            {/* Settings */}
            {panel === "settings" && <>
              <h2 style={styles.panelTitle}>Settings</h2>
              {[
                { key: "notifications", label: "🔔 Notifications", desc: "Show alerts for new messages" },
                { key: "sound",         label: "🔊 Sound",          desc: "Play sounds for new messages" },
              ].map(({ key, label, desc }) => (
                <div key={key} style={styles.settingRow}>
                  <div>
                    <div style={styles.settingLabel}>{label}</div>
                    <div style={styles.settingDesc}>{desc}</div>
                  </div>
                  <button
                    style={{ ...styles.toggle, ...(settings[key] ? styles.toggleOn : {}) }}
                    onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
                  >
                    {settings[key] ? "ON" : "OFF"}
                  </button>
                </div>
              ))}
              <div style={styles.settingRow}>
                <div>
                  <div style={styles.settingLabel}>🔒 Encryption</div>
                  <div style={styles.settingDesc}>Active cipher suite</div>
                </div>
                <span style={styles.encTag}>{settings.encryptionLevel}</span>
              </div>
            </>}

            {/* Add Contact */}
            {panel === "addContact" && <>
              <h2 style={styles.panelTitle}>Add Contact</h2>
              <div style={styles.profileField}>
                <label style={styles.label}>Wallet Address *</label>
                <div style={styles.addrRow}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="0x… or ENS name"
                    value={newContactAddr}
                    onChange={e => setNewContactAddr(e.target.value)}
                  />
                  <button
                    style={styles.iconBtn}
                    title="Scan QR"
                    onClick={() => { setPanel("qr"); startScanner(); }}
                  >
                    📷
                  </button>
                </div>
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Alias (optional)</label>
                <input
                  style={styles.input}
                  placeholder="bob.eth, Alice, …"
                  value={newContactAlias}
                  onChange={e => setNewContactAlias(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddContact()}
                />
              </div>
              <button style={styles.btnPrimary} onClick={handleAddContact}>Add Contact</button>
            </>}

            {/* QR Scanner */}
            {panel === "qr" && <>
              <h2 style={styles.panelTitle}>Scan QR Code</h2>
              <div style={styles.qrViewport}>
                <div style={styles.qrCorner} />
                <div style={{
                  ...styles.qrScanLine,
                  top: `${(scanAnimFrame * 1.5) % 100}%`,
                  opacity: scannerActive ? 1 : 0,
                }} />
                <div style={styles.qrPlaceholder}>📷</div>
              </div>
              <div style={styles.profileField}>
                <label style={styles.label}>Or paste an address</label>
                <input
                  style={styles.input}
                  placeholder="0x…"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                />
              </div>
              <button
                style={{ ...styles.btnPrimary, opacity: scanInput.trim() ? 1 : 0.5 }}
                disabled={!scanInput.trim()}
                onClick={simulateScan}
              >
                {scannerActive ? "Scanning…" : "Simulate Scan"}
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => { stopScanner(); setPanel("addContact"); }}
              >
                ← Back
              </button>
            </>}

          </div>
        </div>
      )}

      {/* ── Toast notifications ─────────────────────────────────────────── */}
      <div style={styles.toastContainer}>
        {toasts.map(t => <div key={t.id} style={styles.toast}>{t.text}</div>)}
      </div>

    </div>
  );
}
