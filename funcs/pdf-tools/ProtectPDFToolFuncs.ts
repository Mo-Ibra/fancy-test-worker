// ═══════════════════════════════════════════════════════════════════
// PDF ENCRYPTION — RC4-128, PDF Standard Security Handler r3
// Implements PDF spec §3.5: works in Chrome, Firefox, Edge, Acrobat
// ═══════════════════════════════════════════════════════════════════

// ── MD5 (pure JS, RFC 1321) ────────────────────────────────────────
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
  buf.set(input);
  buf[len] = 0x80;
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

// ── RC4 ────────────────────────────────────────────────────────────
export function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const s = Uint8Array.from({ length: 256 }, (_, i) => i);
  for (let i = 0, j = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255;[s[i], s[j]] = [s[j], s[i]]; }
  const out = new Uint8Array(data.length);
  for (let k = 0, x = 0, y = 0; k < data.length; k++) {
    x = (x + 1) & 255; y = (y + s[x]) & 255;[s[x], s[y]] = [s[y], s[x]]; out[k] = data[k] ^ s[(s[x] + s[y]) & 255];
  }
  return out;
}

// ── PDF standard padding (PDF spec §3.5.2) ─────────────────────────
export const PAD = new Uint8Array([
  0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41, 0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
  0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80, 0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A,
]);

export function padPw(pw: string): Uint8Array {
  const b = new TextEncoder().encode(pw), out = new Uint8Array(32);
  const n = Math.min(b.length, 32);
  out.set(b.slice(0, n)); out.set(PAD.slice(0, 32 - n), n);
  return out;
}

// ── Key derivation (PDF spec §3.5.2, Algorithm 2) ──────────────────
export function deriveKey(userPad: Uint8Array, oEntry: Uint8Array, perms: number, fileId: Uint8Array, keyLen = 16): Uint8Array {
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

// ── /O entry (Algorithm 3) ─────────────────────────────────────────
export function computeO(ownerPad: Uint8Array, userPad: Uint8Array, keyLen = 16): Uint8Array {
  let key = md5(ownerPad).slice(0, keyLen);
  for (let i = 0; i < 50; i++) key = md5(key).slice(0, keyLen);
  let v = rc4(key, userPad);
  for (let i = 1; i <= 19; i++) v = rc4(key.map(b => b ^ i), v);
  return v;
}

// ── /U entry (Algorithm 4) ─────────────────────────────────────────
export function computeU(encKey: Uint8Array, fileId: Uint8Array): Uint8Array {
  const buf = new Uint8Array(PAD.length + fileId.length);
  buf.set(PAD); buf.set(fileId, PAD.length);
  let v = rc4(encKey, md5(buf));
  for (let i = 1; i <= 19; i++) v = rc4(encKey.map(b => b ^ i), v);
  const out = new Uint8Array(32); out.set(v); return out;
}

// ── Permissions flags (PDF spec Table 3.20) ────────────────────────
export function buildPerms(p: { print: boolean, printHQ: boolean, modify: boolean, copy: boolean, annot: boolean, forms: boolean, assemble: boolean }): number {
  let v = 0xFFFFF0C0 | 0;
  if (p.print) v |= 1 << 2;
  if (p.modify) v |= 1 << 3;
  if (p.copy) v |= 1 << 4;
  if (p.annot) v |= 1 << 5;
  if (p.forms) v |= 1 << 8;
  if (p.assemble) v |= 1 << 10;
  if (p.printHQ) v |= 1 << 11;
  return v;
}

// ── Per-object encryption key (Algorithm 1) ────────────────────────
export function objKey(encKey: Uint8Array, obj: number, gen: number): Uint8Array {
  const extra = new Uint8Array([obj & 255, (obj >> 8) & 255, (obj >> 16) & 255, gen & 255, (gen >> 8) & 255]);
  const buf = new Uint8Array(encKey.length + 5);
  buf.set(encKey); buf.set(extra, encKey.length);
  return md5(buf).slice(0, Math.min(encKey.length + 5, 16));
}

// ── Hex helpers ────────────────────────────────────────────────────
export const toHex = (b: Uint8Array) => Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('');

// ═══════════════════════════════════════════════════════════════════
// MAIN ENCRYPTION FUNCTION
// Strategy: write a new valid PDF with an /Encrypt dictionary added.
// We parse the existing xref table, encrypt all string and stream
// objects, rebuild xref, and inject /Encrypt + updated /ID.
// ═══════════════════════════════════════════════════════════════════

export async function protectPDF(
  src: Uint8Array,
  userPw: string, ownerPw: string,
  perms: ReturnType<typeof buildPerms> extends number ? Parameters<typeof buildPerms>[0] : never,
): Promise<Uint8Array> {
  const dec = (b: Uint8Array) => new TextDecoder('latin1').decode(b);
  const enc = (s: string) => new Uint8Array(Array.from(s).map(c => c.charCodeAt(0)));
  const pdfStr = dec(src);

  // 1. Random file ID
  const fileId = crypto.getRandomValues(new Uint8Array(16));
  const fileIdHex = toHex(fileId);

  // 2. Crypto parameters
  const keyLen = 16;
  const userPad = padPw(userPw);
  const ownPad = padPw(ownerPw || userPw);
  const oEntry = computeO(ownPad, userPad, keyLen);
  const permInt = buildPerms(perms);
  const encKey = deriveKey(userPad, oEntry, permInt, fileId, keyLen);
  const uEntry = computeU(encKey, fileId);

  // 3. Find all indirect object positions via xref table
  // Parse cross-reference table for reliable offsets
  const xrefPos = pdfStr.lastIndexOf('\nxref');
  const xrefPos2 = pdfStr.lastIndexOf('\rxref');
  const xrefStart = Math.max(xrefPos, xrefPos2);

  // Collect all "N G obj" positions directly from the source text
  const objRe = /\b(\d+)\s+(\d+)\s+obj\b/g;
  type ObjInfo = { num: number; gen: number; start: number; end: number };
  const objs: ObjInfo[] = [];
  let mo: RegExpExecArray | null;
  while ((mo = objRe.exec(pdfStr)) !== null) {
    objs.push({ num: parseInt(mo[1]), gen: parseInt(mo[2]), start: mo.index, end: 0 });
  }
  // Set end of each object
  for (let i = 0; i < objs.length; i++) {
    const endObj = pdfStr.indexOf('endobj', objs[i].start);
    objs[i].end = endObj >= 0 ? endObj + 6 : (objs[i + 1]?.start ?? src.length);
  }

  // 4. Find the encrypt obj number (= maxObjNum + 1)
  const maxNum = objs.reduce((m, o) => Math.max(m, o.num), 0);
  const encObjNum = maxNum + 1;

  // 5. Build encrypted version of each object
  // We'll collect output segments
  const out: Uint8Array[] = [];
  const newOffsets: Record<number, number> = {};
  let byteLen = 0;

  const push = (d: Uint8Array) => { out.push(d); byteLen += d.length; };
  const pushS = (s: string) => push(enc(s));

  // Copy everything before first object
  const firstObjStart = objs[0]?.start ?? src.length;
  push(src.slice(0, firstObjStart));

  for (const o of objs) {
    newOffsets[o.num] = byteLen;
    const rawBytes = src.slice(o.start, o.end);
    const rawStr = dec(rawBytes);

    // Don't encrypt the /Encrypt object or object 0
    if (o.num === 0) { push(rawBytes); continue; }

    // Detect stream
    const sKw = rawStr.indexOf('stream');
    if (sKw !== -1) {
      const afterKw = sKw + 6;
      const nlLen = rawStr[afterKw] === '\r' ? (rawStr[afterKw + 1] === '\n' ? 2 : 1) : 1;
      const sStart = afterKw + nlLen;
      const sEnd = rawStr.lastIndexOf('endstream');
      if (sStart < sEnd) {
        const pre = rawStr.slice(0, sStart);
        const streamData = rawBytes.slice(sStart, sEnd);
        const post = rawStr.slice(sEnd);
        const key = objKey(encKey, o.num, o.gen);
        const encrypted = rc4(key, streamData);
        // Update /Length
        const updatedPre = pre.replace(/\/Length\s+\d+/, `/Length ${encrypted.length}`);
        pushS(updatedPre);
        push(encrypted);
        pushS(post);
        continue;
      }
    }

    // No stream — encrypt PDF literal strings (...)
    const key = objKey(encKey, o.num, o.gen);
    push(encryptStrings(rawBytes, rawStr, key, enc));
  }

  // 6. Build /Encrypt indirect object
  const encDictBytes = enc(
    `\n${encObjNum} 0 obj\n` +
    `<< /Filter /Standard /V 2 /R 3 /Length ${keyLen * 8}\n` +
    `   /P ${permInt}\n` +
    `   /O <${toHex(oEntry)}>\n` +
    `   /U <${toHex(uEntry)}>\n` +
    `>>\nendobj\n`
  );
  newOffsets[encObjNum] = byteLen;
  push(encDictBytes);

  // 7. Build new xref table
  const xrefOffset = byteLen;
  const allNums = [...Object.keys(newOffsets).map(Number)].sort((a, b) => a - b);
  const maxObjNew = Math.max(...allNums);

  let xrefStr = `xref\n0 ${maxObjNew + 1}\n`;
  xrefStr += `0000000000 65535 f \n`; // obj 0 free entry
  for (let i = 1; i <= maxObjNew; i++) {
    const off = newOffsets[i];
    if (off !== undefined) {
      xrefStr += `${String(off).padStart(10, '0')} 00000 n \n`;
    } else {
      xrefStr += `0000000000 65535 f \n`;
    }
  }

  // 8. Find existing trailer dict to preserve /Root, /Info, /Size etc.
  const trailerMatch = /trailer\s*(<<[\s\S]*?>>)/g;
  let lastTrailer = '';
  let tm: RegExpExecArray | null;
  while ((tm = trailerMatch.exec(pdfStr)) !== null) lastTrailer = tm[1];

  // Patch trailer: update /Size, add /Encrypt, add /ID, remove old /XRefStm
  let trailer = lastTrailer || '<< >>';
  trailer = trailer
    .replace(/\/Size\s+\d+/, `/Size ${maxObjNew + 1}`)
    .replace(/\/Encrypt\s+\d+\s+\d+\s+R/g, '')
    .replace(/\/ID\s*\[[\s\S]*?\]/g, '')
    .replace(/\/XRefStm\s+\d+/g, '')
    .replace(/>>\s*$/, `  /Encrypt ${encObjNum} 0 R\n  /ID [<${fileIdHex}><${fileIdHex}>]\n>>`);

  // If /Size not found, inject it
  if (!/\/Size/.test(trailer)) {
    trailer = trailer.replace(/>>\s*$/, `  /Size ${maxObjNew + 1}\n>>`);
  }

  const trailerStr = `\ntrailer\n${trailer}\nstartxref\n${xrefOffset}\n%%EOF\n`;
  pushS(xrefStr + trailerStr);

  // Concat all parts
  const total = out.reduce((s, a) => s + a.length, 0);
  const final = new Uint8Array(total);
  let off2 = 0;
  for (const a of out) { final.set(a, off2); off2 += a.length; }
  return final;
}

// Encrypt literal strings (...) in an object's bytes
export function encryptStrings(
  rawBytes: Uint8Array,
  rawStr: string,
  key: Uint8Array,
  enc: (s: string) => Uint8Array,
): Uint8Array {
  const parts: Uint8Array[] = [];
  let i = 0;
  while (i < rawStr.length) {
    // Literal string: unescaped '('
    if (rawStr[i] === '(' && (i === 0 || rawStr[i - 1] !== '\\')) {
      let depth = 1, j = i + 1;
      while (j < rawStr.length && depth > 0) {
        if (rawStr[j] === '(' && rawStr[j - 1] !== '\\') depth++;
        if (rawStr[j] === ')' && rawStr[j - 1] !== '\\') depth--;
        j++;
      }
      const inner = rawBytes.slice(i + 1, j - 1);
      const encrypted = rc4(key, inner);
      parts.push(enc('('), encrypted, enc(')'));
      i = j;
    } else {
      parts.push(rawBytes.slice(i, i + 1));
      i++;
    }
  }
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

export function fmtSize(kb: number) {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export function scorePassword(pw: string) {
  if (!pw) return { score: 0 as const, label: '—', color: 'text-muted-foreground', bg: 'bg-border' };
  const types = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
  const s: 0 | 1 | 2 | 3 | 4 = pw.length >= 16 && types >= 4 ? 4 : pw.length >= 12 && types >= 3 ? 3 : pw.length >= 8 && types >= 2 ? 2 : pw.length >= 4 ? 1 : 0;
  const L = { 0: ['Very Weak', 'text-red-500', 'bg-red-500'], 1: ['Weak', 'text-orange-500', 'bg-orange-500'], 2: ['Fair', 'text-yellow-500', 'bg-yellow-500'], 3: ['Strong', 'text-blue-500', 'bg-blue-500'], 4: ['Very Strong', 'text-emerald-500', 'bg-emerald-500'] } as const;
  const [label, color, bg] = L[s];
  return { score: s, label, color, bg };
}