/* ═══════════════════════════════════════════
   APPLICATION CONSTANTS
   ═══════════════════════════════════════════ */

import { today, uid } from "./helpers";

export const EMOJIS = [
  "😀","😂","🥲","😍","🤩","😎","🥳","🤔","😤","🔥",
  "💯","✅","👍","👎","❤️","💀","🚀","⚡","🎯","💎",
  "🪙","🔒","🔗","📎","📊","💰","🏦","📈","📉","🤝",
  "👀","🙏","💪","🎉","⭐","🌐","🛡️","⚙️","🔑","📝",
];

export const REACTIONS = ["❤️","👍","😂","🔥","💎","🚀"];

export const SMART_REPLIES = [
  "On-chain and verified ✓",
  "Checking the block explorer...",
  "Gas optimized 🔥",
  "Consensus reached!",
  "LGTM, deploying...",
  "Transaction signed",
  "Smart contract looks solid",
  "Already bridged to L2",
  "Hash confirmed",
  "The DAO vote passed!",
  "Staking rewards in",
  "ZK proof verified",
  "Multisig approved",
  "Liquidity pool live",
  "Merkle tree updated",
  "Oracle feed good",
  "Cross-chain swap done",
];

export const FILE_TYPES = [
  { name: "smart_contract.sol", size: "12.4 KB", icon: "📄" },
  { name: "audit_report.pdf",   size: "2.1 MB",  icon: "📑" },
  { name: "tokenomics.xlsx",    size: "856 KB",  icon: "📊" },
  { name: "whitepaper_v2.pdf",  size: "4.7 MB",  icon: "📝" },
  { name: "wallet_backup.json", size: "1.2 KB",  icon: "🔑" },
];

/* ─── Seed data ─── */

export const SEED_CONTACTS = [
  { id: "0x7a3b9c4e1f2d8a6b5c0e3f7d9a1b4c6e8f0a2d4e", alias: "alice.eth", on: true,  blocked: false, isGroup: false },
  { id: "0x1d4e7a0b3c6f9e2d5a8b1c4e7f0a3d6b9c2e5f8a", alias: "bob.sol",   on: true,  blocked: false, isGroup: false },
  { id: "0x9f2e5a8b1c4d7e0a3b6c9f2e5a8d1b4c7e0a3f6d", alias: null,        on: false, blocked: false, isGroup: false },
  { id: "0x3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8e1d4b7c0a", alias: "vitalik.eth",on: false,blocked: false, isGroup: false },
  { id: "0x5a8b1c4e7d0a3f6c9e2b5a8d1c4f7e0a3b6d9c2e", alias: "satoshi.btc",on: false,blocked: false, isGroup: false },
];

export const SEED_MSGS = {
  "0x7a3b9c4e1f2d8a6b5c0e3f7d9a1b4c6e8f0a2d4e": [
    { id: "m1", from: "them", text: "Hey! Did you see the new governance proposal?",    time: "10:42 AM", date: today(), type: "text", reactions: [],          read: true  },
    { id: "m2", from: "me",   text: "Yes! The tokenomics look solid. Let's vote in favor.", time: "10:44 AM", date: today(), type: "text", reactions: ["🔥"], read: true  },
    { id: "m3", from: "them", text: "Agreed. Already staked my tokens for the vote.",  time: "10:45 AM", date: today(), type: "text", reactions: [],          read: true  },
    { id: "m4", from: "me",   text: "Perfect. Deploying the multisig now.",             time: "10:47 AM", date: today(), type: "text", reactions: ["👍"],      read: true  },
    { id: "m5", from: "them", text: "The smart contract is deployed!",                  time: "10:50 AM", date: today(), type: "text", reactions: ["🚀","💎"], read: true  },
  ],
  "0x1d4e7a0b3c6f9e2d5a8b1c4e7f0a3d6b9c2e5f8a": [
    { id: "m6", from: "them", text: "Tx confirmed on block #18,294,571", time: "9:30 AM", date: today(), type: "text", reactions: [], read: true  },
    { id: "m7", from: "me",   text: "Gas fees were reasonable today",    time: "9:32 AM", date: today(), type: "text", reactions: [], read: true  },
    { id: "m8", from: "them", text: "Check the transaction hash",        time: "9:35 AM", date: today(), type: "text", reactions: [], read: false },
  ],
};

/** Storage keys used throughout the app */
export const STORAGE_KEYS = {
  PROFILE:  "dchat-profile",
  CONTACTS: "dchat-contacts",
  MSGS:     "dchat-msgs",
  SETTINGS: "dchat-settings",
};
