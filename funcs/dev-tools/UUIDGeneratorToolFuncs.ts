
// ── Types ─────────────────────────────────────────────────────────

export type UUIDVersion = "v4" | "v1" | "v5" | "ulid" | "nanoid" | "objectid";
export type OutputCase = "lower" | "upper";
export type OutputFormat = "plain" | "braces" | "urn";

export interface GeneratedID {
  id: string;
  version: UUIDVersion;
  ts: number;
}

// ── Generators ────────────────────────────────────────────────────

// UUID v4 — random
export function uuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// UUID v1 — time-based (simulated, not spec-perfect)
export function uuidV1(): string {
  const now = Date.now();
  const ns = BigInt(now) * BigInt(10000) + BigInt("122192928000000000");

  const tl = Number(ns & BigInt("0xFFFFFFFF"))
    .toString(16)
    .padStart(8, "0");

  const tm = Number((ns >> BigInt(32)) & BigInt("0xFFFF"))
    .toString(16)
    .padStart(4, "0");

  const th = (
    Number((ns >> BigInt(48)) & BigInt("0x0FFF")) | 0x1000
  )
    .toString(16)
    .padStart(4, "0");
  const rand = crypto.getRandomValues(new Uint8Array(8));
  rand[0] = (rand[0] & 0x3f) | 0x80;
  const clock = [...rand.slice(0, 2)].map((x) => x.toString(16).padStart(2, "0")).join("");
  const node = [...rand.slice(2)].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${tl}-${tm}-${th}-${clock}-${node}`;
}

// UUID v5 — name-based SHA-1
export async function uuidV5(namespace: string, name: string): Promise<string> {
  // Parse namespace UUID bytes
  const nsHex = namespace.replace(/-/g, "");
  if (nsHex.length !== 32) throw new Error("Invalid namespace UUID");
  const nsBytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) nsBytes[i] = parseInt(nsHex.slice(i * 2, i * 2 + 2), 16);

  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array(nsBytes.length + nameBytes.length);
  combined.set(nsBytes); combined.set(nameBytes, nsBytes.length);

  const hashBuffer = await crypto.subtle.digest("SHA-1", combined);
  const b = new Uint8Array(hashBuffer);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b.slice(0, 16)].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ULID — Universally Unique Lexicographically Sortable Identifier
export const ULID_CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export function ulid(): string {
  const now = Date.now();
  let time = "";
  let t = now;
  for (let i = 9; i >= 0; i--) {
    time = ULID_CHARS[t % 32] + time;
    t = Math.floor(t / 32);
  }
  let rand = "";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  for (let i = 0; i < 16; i++) rand += ULID_CHARS[bytes[i % 10] % 32];
  return time + rand;
}

// NanoID — URL-friendly
export const NANO_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export function nanoid(size = 21): string {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return [...bytes].map((b) => NANO_ALPHA[b % 64]).join("");
}

// MongoDB ObjectID simulation
export function objectId(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const mid = [...crypto.getRandomValues(new Uint8Array(5))].map((x) => x.toString(16).padStart(2, "0")).join("");
  const inc = [...crypto.getRandomValues(new Uint8Array(3))].map((x) => x.toString(16).padStart(2, "0")).join("");
  return ts + mid + inc;
}

// ── Format helpers ────────────────────────────────────────────────

export function applyFormat(id: string, fmt: OutputFormat, caseMode: OutputCase): string {
  let out = id;
  // Only apply case/format to UUID-like strings (with hyphens or hex)
  if (caseMode === "upper") out = out.toUpperCase();
  if (fmt === "braces") out = `{${out}}`;
  if (fmt === "urn") out = `urn:uuid:${out}`;
  return out;
}

export function validateUUID(input: string): { ok: boolean; version: string } {
  const clean = input.trim().replace(/^\{|\}$/g, "").replace(/^urn:uuid:/i, "").toLowerCase();
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const match = clean.match(re);
  if (match) return { ok: true, version: `v${match[1]}` };
  // ULID check
  if (/^[0-9A-HJKMNP-TV-Z]{26}$/.test(input.trim())) return { ok: true, version: "ULID" };
  // NanoID — hard to validate definitively, skip
  return { ok: false, version: "" };
}

export const VERSION_INFO: Record<UUIDVersion, { label: string; subtitle: string; badge: string; badgeColor: string }> = {
  v4: { label: "UUID v4", subtitle: "Cryptographically random", badge: "Most Used", badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  v1: { label: "UUID v1", subtitle: "Time-based + node ID", badge: "Time-based", badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  v5: { label: "UUID v5", subtitle: "Name-based (SHA-1 hash)", badge: "Deterministic", badgeColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  ulid: { label: "ULID", subtitle: "Sortable, URL-safe, 128-bit", badge: "Sortable", badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  nanoid: { label: "NanoID", subtitle: "Tiny, URL-safe, customizable", badge: "Compact", badgeColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  objectid: { label: "ObjectID", subtitle: "MongoDB-style 12-byte hex", badge: "MongoDB", badgeColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
};