
// ── Types ──────────────────────────────────────────────────────────

export type HashAlgo =
  | "MD5"
  | "SHA-1"
  | "SHA-256"
  | "SHA-384"
  | "SHA-512"
  | "SHA3-256"
  | "SHA3-512";

export type InputMode = "text" | "file";
export type OutputCase = "lower" | "upper";

export interface HashResult {
  algo: HashAlgo;
  hex: string;
  bits: number;
  ms: number;
}

// ── MD5 implementation (pure JS, no Web Crypto) ───────────────────
// Reference: RFC 1321

function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let i, olda, oldb, oldc, oldd;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (i = 0; i < x.length; i += 16) {
      olda = a; oldb = b; oldc = c; oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936); a = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      a = md5ff(c, d, a, b, x[i + 2], 17, 606105819); a = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); a = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      a = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); a = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); a = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      a = md5ff(c, d, a, b, x[i + 10], 17, -42063); a = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); a = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      a = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); a = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); a = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      a = md5gg(c, d, a, b, x[i + 11], 14, 643717713); a = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); a = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      a = md5gg(c, d, a, b, x[i + 15], 14, -660478335); a = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); a = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      a = md5gg(c, d, a, b, x[i + 3], 14, -187363961); a = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); a = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      a = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); a = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558); a = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      a = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); a = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); a = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      a = md5hh(c, d, a, b, x[i + 7], 16, -155497632); a = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); a = md5hh(d, a, b, c, x[i], 11, -358537222);
      a = md5hh(c, d, a, b, x[i + 3], 16, -722521979); a = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); a = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      a = md5hh(c, d, a, b, x[i + 15], 16, 530742520); a = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844); a = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      a = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); a = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); a = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      a = md5ii(c, d, a, b, x[i + 10], 15, -1051523); a = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); a = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      a = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); a = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); a = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      a = md5ii(c, d, a, b, x[i + 2], 15, 718787259); a = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function binl2rstr(input: number[]): string {
    let output = "";
    for (let i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }
  function rstr2binl(input: string): number[] {
    const output: number[] = new Array(input.length >> 2).fill(0);
    for (let i = 0; i < input.length; i++) {
      output[i >> 2] |= input.charCodeAt(i) << (i % 4) * 8;
    }
    return output;
  }
  function rstrMD5(s: string): string {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }
  function rstr2hex(input: string): string {
    const hexTab = "0123456789abcdef";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0F) + hexTab.charAt(x & 0x0F);
    }
    return output;
  }
  function str2rstrUTF8(input: string): string {
    return unescape(encodeURIComponent(input));
  }
  return rstr2hex(rstrMD5(str2rstrUTF8(input)));
}

// ── Web Crypto wrappers ────────────────────────────────────────────

const WC_ALGO_MAP: Record<string, string> = {
  "SHA-1": "SHA-1",
  "SHA-256": "SHA-256",
  "SHA-384": "SHA-384",
  "SHA-512": "SHA-512",
};

async function webCryptoHash(data: ArrayBuffer | string, algo: string): Promise<string> {
  const buf = typeof data === "string"
    ? new TextEncoder().encode(data)
    : new Uint8Array(data);
  const digest = await crypto.subtle.digest(WC_ALGO_MAP[algo] ?? "SHA-256", buf);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// SHA-3 (Keccak) — minimal implementation ──────────────────────────

function keccakF1600(state: Uint8Array): void {
  const RC = [
    [0x00000001, 0x00000000], [0x00008082, 0x00000000], [0x0000808a, 0x80000000], [0x80008000, 0x80000000],
    [0x0000808b, 0x00000000], [0x80000001, 0x00000000], [0x80008081, 0x80000000], [0x00008009, 0x80000000],
    [0x0000008a, 0x00000000], [0x00000088, 0x00000000], [0x80008009, 0x00000000], [0x8000000a, 0x00000000],
    [0x8000808b, 0x00000000], [0x0000008b, 0x80000000], [0x00008089, 0x80000000], [0x00008003, 0x80000000],
    [0x00008002, 0x80000000], [0x00000080, 0x80000000], [0x0000800a, 0x00000000], [0x8000000a, 0x80000000],
    [0x80008081, 0x80000000], [0x00008080, 0x80000000], [0x80000001, 0x00000000], [0x80008008, 0x80000000],
  ];
  const view = new DataView(state.buffer);
  const readLane = (x: number, y: number) => [
    view.getUint32((5 * y + x) * 8, true),
    view.getUint32((5 * y + x) * 8 + 4, true),
  ];
  const writeLane = (x: number, y: number, lo: number, hi: number) => {
    view.setUint32((5 * y + x) * 8, lo, true);
    view.setUint32((5 * y + x) * 8 + 4, hi, true);
  };
  const xorLane = (x: number, y: number, lo: number, hi: number) => {
    view.setUint32((5 * y + x) * 8, view.getUint32((5 * y + x) * 8, true) ^ lo, true);
    view.setUint32((5 * y + x) * 8 + 4, view.getUint32((5 * y + x) * 8 + 4, true) ^ hi, true);
  };
  const rot64 = (lo: number, hi: number, n: number): [number, number] => {
    n = n % 64;
    if (n === 0) return [lo, hi];
    if (n === 32) return [hi, lo];
    if (n < 32) return [(lo << n) | (hi >>> (32 - n)), (hi << n) | (lo >>> (32 - n))];
    n -= 32;
    return [(hi << n) | (lo >>> (32 - n)), (lo << n) | (hi >>> (32 - n))];
  };
  const ROTS = [
    [0, 1, 62, 28, 27], [36, 44, 6, 55, 20], [3, 10, 43, 25, 39], [41, 45, 15, 21, 8], [18, 2, 61, 56, 14],
  ];
  for (let round = 0; round < 24; round++) {
    const C: [number, number][] = [];
    for (let x = 0; x < 5; x++) {
      let l = 0, h = 0;
      for (let y = 0; y < 5; y++) { const [a, b] = readLane(x, y); l ^= a; h ^= b; }
      C.push([l, h]);
    }
    const D: [number, number][] = [];
    for (let x = 0; x < 5; x++) {
      const [c1l, c1h] = C[(x + 4) % 5];
      const [c2l, c2h] = rot64(C[(x + 1) % 5][0], C[(x + 1) % 5][1], 1);
      D.push([c1l ^ c2l, c1h ^ c2h]);
    }
    for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) xorLane(x, y, D[x][0], D[x][1]);
    const B: [number, number][][] = Array.from({ length: 5 }, () => new Array(5).fill([0, 0]));
    for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) {
      B[y % 5][(2 * x + 3 * y) % 5] = rot64(...readLane(x, y) as [number, number], ROTS[y][x]);
    }
    for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) {
      const [b1l, b1h] = B[x][y], [b2l, b2h] = B[(x + 1) % 5][y], [b3l, b3h] = B[(x + 2) % 5][y];
      writeLane(x, y, (b1l ^ (~b2l & b3l)), (b1h ^ (~b2h & b3h)));
    }
    const [rcl, rch] = RC[round];
    xorLane(0, 0, rcl, rch);
  }
}

function keccakHash(msg: Uint8Array, rate: number, capacity: number, outputLen: number, delim: number): string {
  const blockSize = rate / 8;
  const state = new Uint8Array(200);
  let absorbLen = msg.length;
  let offset = 0;
  while (absorbLen >= blockSize) {
    for (let i = 0; i < blockSize; i++) state[i] ^= msg[offset + i];
    keccakF1600(state);
    offset += blockSize;
    absorbLen -= blockSize;
  }
  for (let i = 0; i < absorbLen; i++) state[i] ^= msg[offset + i];
  state[absorbLen] ^= delim;
  state[blockSize - 1] ^= 0x80;
  keccakF1600(state);
  const out: string[] = [];
  for (let i = 0; i < outputLen; i++) out.push(state[i].toString(16).padStart(2, "0"));
  return out.join("");
}

function sha3(msg: string, bits: 256 | 512): string {
  const bytes = new TextEncoder().encode(msg);
  const rate = 1600 - bits * 2;
  const outLen = bits / 8;
  return keccakHash(bytes, rate, bits * 2, outLen, 0x06);
}

// ── HMAC wrapper ───────────────────────────────────────────────────

async function hmacHash(data: string, key: string, algo: string): Promise<string> {
  const keyBuf = new TextEncoder().encode(key);
  const dataBuf = new TextEncoder().encode(data);
  const cryptoAlgo = WC_ALGO_MAP[algo] ?? "SHA-256";
  const k = await crypto.subtle.importKey(
    "raw", keyBuf, { name: "HMAC", hash: cryptoAlgo }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", k, dataBuf);
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Master hash function ───────────────────────────────────────────

export async function computeHash(
  data: string | ArrayBuffer,
  algo: HashAlgo,
  hmacKey?: string,
): Promise<{ hex: string; ms: number }> {
  const t0 = performance.now();
  let hex: string;

  const isText = typeof data === "string";

  if (hmacKey && isText) {
    hex = await hmacHash(data, hmacKey, algo === "MD5" ? "SHA-256" : algo);
  } else if (algo === "MD5") {
    hex = md5(isText ? data : new TextDecoder().decode(data));
  } else if (algo === "SHA3-256") {
    hex = sha3(isText ? data : new TextDecoder().decode(data), 256);
  } else if (algo === "SHA3-512") {
    hex = sha3(isText ? data : new TextDecoder().decode(data), 512);
  } else {
    hex = await webCryptoHash(data, algo);
  }

  return { hex, ms: Math.round((performance.now() - t0) * 100) / 100 };
}

// ── Algo metadata ──────────────────────────────────────────────────

export const ALGO_META: Record<HashAlgo, { bits: number; note: string; secure: boolean; color: string }> = {
  "MD5": { bits: 128, note: "Fast but broken — never use for security", secure: false, color: "text-red-500" },
  "SHA-1": { bits: 160, note: "Deprecated — collisions found in 2017", secure: false, color: "text-orange-500" },
  "SHA-256": { bits: 256, note: "Industry standard — recommended", secure: true, color: "text-emerald-500" },
  "SHA-384": { bits: 384, note: "SHA-2 family — high security", secure: true, color: "text-blue-500" },
  "SHA-512": { bits: 512, note: "SHA-2 family — maximum SHA-2 security", secure: true, color: "text-blue-500" },
  "SHA3-256": { bits: 256, note: "SHA-3 (Keccak) — different structure", secure: true, color: "text-purple-500" },
  "SHA3-512": { bits: 512, note: "SHA-3 maximum — post-quantum resistant", secure: true, color: "text-purple-500" },
};