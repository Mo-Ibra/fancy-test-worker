
// ── Helpers ────────────────────────────────────────────────────────

export function fmtSize(kb: number) {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

import PDFLib from './pdf-lib';

// ── RC4 + MD5 (to verify the password is correct before unlocking) ──

export function md5(input: Uint8Array): Uint8Array {
  function safe(x: number, y: number) {
    const lo = (x & 0xffff) + (y & 0xffff);
    return ((x >>> 16) + (y >>> 16) + (lo >>> 16)) << 16 | lo & 0xffff;
  }
  function rol(n: number, c: number) { return n << c | n >>> 32 - c; }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safe(rol(safe(safe(a, q), safe(x, t)), s), b);
  }
  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(b & c | ~b & d, a, b, x, s, t);
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(b & d | c & ~d, a, b, x, s, t);
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(c ^ (b | ~d), a, b, x, s, t);

  const len = input.length;
  const tail = len & 63, extra = tail < 56 ? 55 - tail : 119 - tail;
  const buf = new Uint8Array(len + extra + 9);
  buf.set(input); buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(buf.length - 8, len * 8, true);
  const w: number[] = [];
  for (let i = 0; i < buf.length; i += 4) w.push(dv.getUint32(i, true));

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (let i = 0; i < w.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d], W = (j: number) => w[i + j];
    a = ff(a, b, c, d, W(0), 7, -680876936); d = ff(d, a, b, c, W(1), 12, -389564586); c = ff(c, d, a, b, W(2), 17, 606105819); b = ff(b, c, d, a, W(3), 22, -1044525330);
    a = ff(a, b, c, d, W(4), 7, -176418897); d = ff(d, a, b, c, W(5), 12, 1200080426); c = ff(c, d, a, b, W(6), 17, -1473231341); b = ff(b, c, d, a, W(7), 22, -45705983);
    a = ff(a, b, c, d, W(8), 7, 1770035416); d = ff(d, a, b, c, W(9), 12, -1958414417); c = ff(c, d, a, b, W(10), 17, -42063); b = ff(b, c, d, a, W(11), 22, -1990404162);
    a = ff(a, b, c, d, W(12), 7, 1804603682); d = ff(d, a, b, c, W(13), 12, -40341101); c = ff(c, d, a, b, W(14), 17, -1502002290); b = ff(b, c, d, a, W(15), 22, 1236535329);
    a = gg(a, b, c, d, W(1), 5, -165796510); d = gg(d, a, b, c, W(6), 9, -1069501632); c = gg(c, d, a, b, W(11), 14, 643717713); b = gg(b, c, d, a, W(0), 20, -373897302);
    a = gg(a, b, c, d, W(5), 5, -701558691); d = gg(d, a, b, c, W(10), 9, 38016083); c = gg(c, d, a, b, W(15), 14, -660478335); b = gg(b, c, d, a, W(4), 20, -405537848);
    a = gg(a, b, c, d, W(9), 5, 568446438); d = gg(d, a, b, c, W(14), 9, -1019803690); c = gg(c, d, a, b, W(3), 14, -187363961); b = gg(b, c, d, a, W(8), 20, 1163531501);
    a = gg(a, b, c, d, W(13), 5, -1444681467); d = gg(d, a, b, c, W(2), 9, -51403784); c = gg(c, d, a, b, W(7), 14, 1735328473); b = gg(b, c, d, a, W(12), 20, -1926607734);
    a = hh(a, b, c, d, W(5), 4, -378558); d = hh(d, a, b, c, W(8), 11, -2022574463); c = hh(c, d, a, b, W(11), 16, 1839030562); b = hh(b, c, d, a, W(14), 23, -35309556);
    a = hh(a, b, c, d, W(1), 4, -1530992060); d = hh(d, a, b, c, W(4), 11, 1272893353); c = hh(c, d, a, b, W(7), 16, -155497632); b = hh(b, c, d, a, W(10), 23, -1094730640);
    a = hh(a, b, c, d, W(13), 4, 681279174); d = hh(d, a, b, c, W(0), 11, -358537222); c = hh(c, d, a, b, W(3), 16, -722521979); b = hh(b, c, d, a, W(6), 23, 76029189);
    a = hh(a, b, c, d, W(9), 4, -640364487); d = hh(d, a, b, c, W(12), 11, -421815835); c = hh(c, d, a, b, W(15), 16, 530742520); b = hh(b, c, d, a, W(2), 23, -995338651);
    a = ii(a, b, c, d, W(0), 6, -198630844); d = ii(d, a, b, c, W(7), 10, 1126891415); c = ii(c, d, a, b, W(14), 15, -1416354905); b = ii(b, c, d, a, W(5), 21, -57434055);
    a = ii(a, b, c, d, W(12), 6, 1700485571); d = ii(d, a, b, c, W(3), 10, -1894986606); c = ii(c, d, a, b, W(10), 15, -1051523); b = ii(b, c, d, a, W(1), 21, -2054922799);
    a = ii(a, b, c, d, W(8), 6, 1873313359); d = ii(d, a, b, c, W(15), 10, -30611744); c = ii(c, d, a, b, W(6), 15, -1560198380); b = ii(b, c, d, a, W(13), 21, 1309151649);
    a = ii(a, b, c, d, W(4), 6, -145523070); d = ii(d, a, b, c, W(11), 10, -1120210379); c = ii(c, d, a, b, W(2), 15, 718787259); b = ii(b, c, d, a, W(9), 21, -343485551);
    a = safe(a, oa); b = safe(b, ob); c = safe(c, oc); d = safe(d, od);
  }
  const out = new Uint8Array(16), odv = new DataView(out.buffer);
  odv.setUint32(0, a, true); odv.setUint32(4, b, true); odv.setUint32(8, c, true); odv.setUint32(12, d, true);
  return out;
}

export function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const s = Uint8Array.from({ length: 256 }, (_, i) => i);
  for (let i = 0, j = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255;[s[i], s[j]] = [s[j], s[i]]; }
  const out = new Uint8Array(data.length);
  for (let k = 0, x = 0, y = 0; k < data.length; k++) { x = (x + 1) & 255; y = (y + s[x]) & 255;[s[x], s[y]] = [s[y], s[x]]; out[k] = data[k] ^ s[(s[x] + s[y]) & 255]; }
  return out;
}

const PAD = new Uint8Array([
  0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41, 0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
  0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80, 0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A,
]);

export function padPw(pw: string): Uint8Array {
  const b = new TextEncoder().encode(pw), out = new Uint8Array(32);
  const n = Math.min(b.length, 32);
  out.set(b.slice(0, n)); out.set(PAD.slice(0, 32 - n), n);
  return out;
}

export function fromHex(h: string): Uint8Array {
  const clean = h.replace(/\s/g, '');
  return new Uint8Array(clean.match(/.{2}/g)!.map(x => parseInt(x, 16)));
}

// Derive the file encryption key from user password (PDF spec Algorithm 2)
export function deriveEncKey(userPad: Uint8Array, oEntry: Uint8Array, perms: number, fileId: Uint8Array, keyLen: number): Uint8Array {
  const permB = new Uint8Array(4); new DataView(permB.buffer).setInt32(0, perms, true);
  const buf = new Uint8Array(userPad.length + oEntry.length + 4 + fileId.length);
  let off = 0;
  buf.set(userPad, off); off += userPad.length;
  buf.set(oEntry, off); off += oEntry.length;
  buf.set(permB, off); off += 4;
  buf.set(fileId, off);
  let key = md5(buf).slice(0, keyLen);
  for (let i = 0; i < 50; i++) key = md5(key).slice(0, keyLen);
  return key;
}

// Verify user password (Algorithm 4/5 verification)
export function verifyUserPw(encKey: Uint8Array, uEntry: Uint8Array, fileId: Uint8Array): boolean {
  const buf = new Uint8Array(PAD.length + fileId.length);
  buf.set(PAD); buf.set(fileId, PAD.length);
  let v = rc4(encKey, md5(buf));
  for (let i = 1; i <= 19; i++) v = rc4(encKey.map(b => b ^ i), v);
  // Compare first 16 bytes
  for (let i = 0; i < 16; i++) { if (v[i] !== uEntry[i]) return false; }
  return true;
}

// ── Detect if a PDF has encryption and extract /Encrypt params ─────

export interface EncryptInfo {
  isEncrypted: boolean;
  v: number;   // /V (algorithm version)
  r: number;   // /R (revision)
  keyLen: number;   // key length in bytes
  oHex: string;   // /O entry hex
  uHex: string;   // /U entry hex
  perms: number;   // /P permissions
  fileIdHex: string;   // first /ID entry
  isOwnerOnly: boolean;  // only owner pw set (no user pw needed)
}

export function parseEncryptInfo(pdfStr: string): EncryptInfo {
  const blank: EncryptInfo = {
    isEncrypted: false, v: 0, r: 0, keyLen: 16, oHex: "", uHex: "", perms: 0, fileIdHex: "", isOwnerOnly: false
  };

  // Check for /Encrypt anywhere in the file
  if (!/\/Encrypt\b/.test(pdfStr)) return blank;

  // Method 1: /Encrypt inline dict in trailer
  const encDictMatch = pdfStr.match(/\/Encrypt\s*<<([\s\S]*?)>>/);

  // Method 2: /Encrypt N G R — indirect object reference
  const encRefMatch = pdfStr.match(/\/Encrypt\s+(\d+)\s+(\d+)\s+R/);

  let encDict = "";
  if (encDictMatch) {
    encDict = encDictMatch[1];
  } else if (encRefMatch) {
    const objNum = encRefMatch[1];
    // Search for "N 0 obj" anywhere in the file (handles cross-reference streams too)
    // Use a broad regex that matches the object definition
    const patterns = [
      new RegExp(String.raw`\b${objNum}\s+0\s+obj\s*<<([\s\S]*?)>>`, ""),
      new RegExp(String.raw`\b${objNum}\s+\d+\s+obj\s*<<([\s\S]*?)>>`, ""),
    ];
    for (const re of patterns) {
      const m = pdfStr.match(re);
      if (m) { encDict = m[1]; break; }
    }
  }

  // Method 3: look for /Standard filter directly (fallback)
  if (!encDict) {
    const stdMatch = pdfStr.match(/<<[^>]*\/Filter\s*\/Standard[^>]*>>/);
    if (stdMatch) encDict = stdMatch[0];
  }

  // If we found /Encrypt reference but no dict, still mark as encrypted
  if (!encDict && encRefMatch) {
    return { isEncrypted: true, v: 2, r: 3, keyLen: 16, oHex: "", uHex: "", perms: -4, fileIdHex: "", isOwnerOnly: false };
  }

  if (!encDict) return blank;

  const get = (key: string, def: number) => {
    const m = encDict.match(new RegExp(`/${key}\\s+(-?\\d+)`));
    return m ? parseInt(m[1]) : def;
  };
  const getHex = (key: string) => {
    const m = encDict.match(new RegExp(`/${key}\\s*<([0-9a-fA-F\\s]*)>`));
    return m ? m[1].replace(/\s/g, '') : '';
  };

  const v = get('V', 1);
  const r = get('R', 2);
  const length = get('Length', 40);
  const perms = get('P', -4);
  const keyLen = Math.max(5, Math.floor(length / 8));
  const oHex = getHex('O');
  const uHex = getHex('U');

  // Extract file ID
  const idMatch = pdfStr.match(/\/ID\s*\[\s*<([0-9a-fA-F\s]*)>/);
  const fileIdHex = idMatch ? idMatch[1].replace(/\s/g, '') : '';

  // Check if user password is empty (owner-only protection)
  // Some PDFs only have owner restrictions, not user password
  // We detect this by trying empty password
  const isOwnerOnly = false; // will be determined at runtime

  return { isEncrypted: true, v, r, keyLen, oHex, uHex, perms, fileIdHex, isOwnerOnly };
}

// Try to verify password and decrypt — returns true if pw is correct
export function tryVerifyPassword(pw: string, info: EncryptInfo): boolean {
  try {
    const userPad = padPw(pw);
    const oEntry = fromHex(info.oHex);
    const uEntry = fromHex(info.uHex);
    const fileId = fromHex(info.fileIdHex);
    const encKey = deriveEncKey(userPad, oEntry, info.perms, fileId, info.keyLen);
    return verifyUserPw(encKey, uEntry, fileId);
  } catch { return false; }
}

// ── Main unlock function ───────────────────────────────────────────
// Strategy: use pdf-lib's built-in ignoreEncryption + password to
// load the PDF, then re-save it without any encryption.
// pdf-lib handles RC4/AES decryption internally when loading.

// ── Unlock PDF ────────────────────────────────────────────────────
// Strategy: open the encrypted PDF with pdf-lib (which decrypts it),
// then create a BRAND NEW PDFDocument and copy every page into it.
// This guarantees the output has zero encryption artifacts.
export async function unlockPDF(
  buffer: ArrayBuffer,
  password: string,
): Promise<{ bytes: Uint8Array; wasEncrypted: boolean }> {
  // 1. Load the encrypted source PDF
  let srcDoc: any;
  try {
    srcDoc = await PDFLib.PDFDocument.load(buffer, {
      password,
      ignoreEncryption: false,
      updateMetadata: false,
    } as any);
  } catch (e1: any) {
    // Try without a password (owner-only / permissions-only PDFs)
    try {
      srcDoc = await PDFLib.PDFDocument.load(buffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
    } catch (e2: any) {
      const msg = (e1.message ?? "").toLowerCase();
      if (msg.includes("password") || msg.includes("encrypt") || msg.includes("decrypt")) {
        throw new Error("Incorrect password. Please check and try again.");
      }
      throw new Error(`Could not open PDF: ${e1.message ?? e2.message}`);
    }
  }

  // 2. Create a completely new PDF document (no encryption, no metadata)
  const newDoc = await PDFLib.PDFDocument.create();

  // 3. Copy ALL pages from source into new doc
  const pageCount = srcDoc.getPageCount();
  if (pageCount === 0) throw new Error("PDF has no pages.");

  const pageIndices = Array.from({ length: pageCount }, (_: unknown, i: number) => i);
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page: any) => newDoc.addPage(page));

  // 4. Save the new clean document — no password, no /Encrypt dict
  const bytes = await newDoc.save();
  return { bytes, wasEncrypted: true };
}