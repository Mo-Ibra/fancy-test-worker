
// ── Types ─────────────────────────────────────────────────────────

export interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  parts: [string, string, string];
}

export interface ClaimInfo {
  key: string;
  value: unknown;
  label: string;
  desc: string;
  type: "timestamp" | "string" | "array" | "other";
}

// ── Base64URL decode ───────────────────────────────────────────────

export function base64UrlDecode(str: string): string {
  // Replace URL-safe chars and pad
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  try {
    return atob(b64);
  } catch {
    throw new Error("Invalid base64url encoding");
  }
}

export function base64UrlToJson(str: string): unknown {
  const decoded = base64UrlDecode(str);
  // Handle UTF-8 properly
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

// ── JWT decoder ───────────────────────────────────────────────────

export function decodeJWT(token: string): { decoded: DecodedJWT | null; error: string } {
  const t = token.trim();
  if (!t) return { decoded: null, error: "" };

  const parts = t.split(".");
  if (parts.length !== 3) {
    return { decoded: null, error: `Expected 3 parts separated by '.', got ${parts.length}` };
  }

  try {
    const header = base64UrlToJson(parts[0]) as JWTHeader;
    const payload = base64UrlToJson(parts[1]) as JWTPayload;
    return {
      decoded: { header, payload, signature: parts[2], parts: parts as [string, string, string] },
      error: "",
    };
  } catch (e: any) {
    return { decoded: null, error: `Failed to decode: ${e.message}` };
  }
}

// ── Claim metadata ────────────────────────────────────────────────

export const CLAIM_META: Record<string, { label: string; desc: string }> = {
  iss: { label: "Issuer", desc: "Identifies who issued the JWT" },
  sub: { label: "Subject", desc: "Identifies the principal that is the subject of the JWT" },
  aud: { label: "Audience", desc: "Identifies the recipients the JWT is intended for" },
  exp: { label: "Expiration", desc: "Time after which the JWT must not be accepted (Unix timestamp)" },
  nbf: { label: "Not Before", desc: "Time before which the JWT must not be accepted" },
  iat: { label: "Issued At", desc: "Time at which the JWT was issued" },
  jti: { label: "JWT ID", desc: "Unique identifier for the JWT to prevent replay attacks" },
  kid: { label: "Key ID", desc: "Hint indicating which key was used to sign the JWT" },
  typ: { label: "Type", desc: "Media type of the JWT" },
  alg: { label: "Algorithm", desc: "Cryptographic algorithm used to secure the JWT" },
  name: { label: "Full Name", desc: "End-user's full name" },
  email: { label: "Email", desc: "End-user's email address" },
  email_verified: { label: "Email Verified", desc: "True if the email address has been verified" },
  picture: { label: "Picture", desc: "URL of the End-User's profile picture" },
  given_name: { label: "Given Name", desc: "End-user's given name" },
  family_name: { label: "Family Name", desc: "End-user's family name" },
  locale: { label: "Locale", desc: "End-User's locale" },
  role: { label: "Role", desc: "User's role or authorization level" },
  roles: { label: "Roles", desc: "List of user roles" },
  scope: { label: "Scope", desc: "OAuth 2.0 scopes granted to the token" },
};

export const TIMESTAMP_CLAIMS = new Set(["exp", "nbf", "iat"]);

export function buildClaimInfo(payload: JWTPayload): ClaimInfo[] {
  return Object.entries(payload).map(([key, value]) => {
    const meta = CLAIM_META[key];
    const type: ClaimInfo["type"] = TIMESTAMP_CLAIMS.has(key)
      ? "timestamp"
      : Array.isArray(value)
        ? "array"
        : typeof value === "string"
          ? "string"
          : "other";
    return {
      key,
      value,
      label: meta?.label ?? key,
      desc: meta?.desc ?? "Custom claim",
      type,
    };
  });
}

// ── Time helpers ──────────────────────────────────────────────────

export function formatTimestamp(unix: number): { utc: string; relative: string; expired: boolean } {
  const ms = unix * 1000;
  const now = Date.now();
  const d = new Date(ms);
  const diff = ms - now;
  const abs = Math.abs(diff);
  const past = diff < 0;

  const rel = (() => {
    if (abs < 60_000) return `${Math.round(abs / 1_000)}s ${past ? "ago" : ""}`.trim();
    if (abs < 3_600_000) return `${Math.round(abs / 60_000)}m ${past ? "ago" : ""}`.trim();
    if (abs < 86_400_000) return `${Math.round(abs / 3_600_000)}h ${past ? "ago" : ""}`.trim();
    return `${Math.round(abs / 86_400_000)}d ${past ? "ago" : ""}`.trim();
  })();

  return {
    utc: d.toUTCString(),
    relative: past ? `${rel} ago` : `in ${rel}`,
    expired: past,
  };
}

export const EXAMPLES = [
  {
    label: "HS256 — User Auth",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBaG1lZCBBbGkiLCJlbWFpbCI6ImFobWVkQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMzYwMDAsImlzcyI6Imh0dHBzOi8vYXV0aC5leGFtcGxlLmNvbSIsImp0aSI6InV1aWQtMTIzLTQ1NiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },
  {
    label: "RS256 — OAuth Token",
    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJzYS1rZXktMSJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwic2NvcGUiOiJyZWFkOmFsbCB3cml0ZTpwcm9maWxlIiwiYXVkIjoiaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20iLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAzNjAwMH0.signature_placeholder",
  },
  {
    label: "Expired Token",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQ1NiIsIm5hbWUiOiJTYXJhaCBKb2huc29uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMzYwMDAsIm5iZiI6MTYwMDAwMDAwMCwiaXNzIjoiaHR0cHM6Ly9hdXRoLm9sZC1hcHAuY29tIn0.hmac_placeholder",
  },
  {
    label: "Google ID Token",
    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJkYzRlIn0.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiY2xpZW50LWlkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiY2xpZW50LWlkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsImVtYWlsIjoiamFuZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkphbmUgRG9lIiwicGljdHVyZSI6Imh0dHBzOi8vcGhvdG8uZ29vZ2xlLmNvbS9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiSmFuZSIsImZhbWlseV9uYW1lIjoiRG9lIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAzNjAwMH0.google_sig",
  },
];