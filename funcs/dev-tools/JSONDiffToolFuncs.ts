
// ── Types ──────────────────────────────────────────────────────────

export type DiffType = "added" | "removed" | "changed" | "unchanged" | "type-changed";

export interface DiffNode {
  path: string;
  type: DiffType;
  leftVal: unknown;
  rightVal: unknown;
  children: DiffNode[];
  expanded: boolean;
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

// ── JSON diff engine ───────────────────────────────────────────────

export function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

export function diffValues(left: unknown, right: unknown, path: string): DiffNode {
  const lt = typeOf(left);
  const rt = typeOf(right);

  // Type changed
  if (lt !== rt) {
    return { path, type: "type-changed", leftVal: left, rightVal: right, children: [], expanded: true };
  }

  // Objects
  if (lt === "object") {
    const lo = left as Record<string, unknown>;
    const ro = right as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(lo), ...Object.keys(ro)]);
    const children: DiffNode[] = [];
    let hasChange = false;

    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in lo)) {
        children.push({ path: childPath, type: "added", leftVal: undefined, rightVal: ro[key], children: [], expanded: true });
        hasChange = true;
      } else if (!(key in ro)) {
        children.push({ path: childPath, type: "removed", leftVal: lo[key], rightVal: undefined, children: [], expanded: true });
        hasChange = true;
      } else {
        const child = diffValues(lo[key], ro[key], childPath);
        children.push(child);
        if (child.type !== "unchanged") hasChange = true;
      }
    }
    return { path, type: hasChange ? "changed" : "unchanged", leftVal: left, rightVal: right, children, expanded: true };
  }

  // Arrays
  if (lt === "array") {
    const la = left as unknown[];
    const ra = right as unknown[];
    const len = Math.max(la.length, ra.length);
    const children: DiffNode[] = [];
    let hasChange = false;

    for (let i = 0; i < len; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= la.length) {
        children.push({ path: childPath, type: "added", leftVal: undefined, rightVal: ra[i], children: [], expanded: true });
        hasChange = true;
      } else if (i >= ra.length) {
        children.push({ path: childPath, type: "removed", leftVal: la[i], rightVal: undefined, children: [], expanded: true });
        hasChange = true;
      } else {
        const child = diffValues(la[i], ra[i], childPath);
        children.push(child);
        if (child.type !== "unchanged") hasChange = true;
      }
    }
    return { path, type: hasChange ? "changed" : "unchanged", leftVal: left, rightVal: right, children, expanded: true };
  }

  // Primitives
  if (left === right) {
    return { path, type: "unchanged", leftVal: left, rightVal: right, children: [], expanded: true };
  }
  return { path, type: "changed", leftVal: left, rightVal: right, children: [], expanded: true };
}

export function countStats(node: DiffNode): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, changed: 0, unchanged: 0 };
  function walk(n: DiffNode) {
    if (n.children.length === 0) {
      if (n.type === "added") stats.added++;
      else if (n.type === "removed") stats.removed++;
      else if (n.type === "changed" || n.type === "type-changed") stats.changed++;
      else stats.unchanged++;
    }
    n.children.forEach(walk);
  }
  walk(node);
  return stats;
}

export function flattenDiff(node: DiffNode, onlyChanges: boolean): DiffNode[] {
  const result: DiffNode[] = [];
  function walk(n: DiffNode) {
    if (onlyChanges && n.type === "unchanged" && n.children.length === 0) return;
    result.push(n);
    if (n.expanded) n.children.forEach(walk);
  }
  node.children.forEach(walk);
  return result;
}

export const EXAMPLES = [
  {
    label: "User object",
    left: `{
  "id": 1,
  "name": "John Doe",
  "email": "[EMAIL_ADDRESS]",
  "age": 29,
  "active": true,
  "roles": ["user", "admin"],
  "address": {
    "city": "New York",
    "country": "USA"
  }
}`,
    right: `{
  "id": 1,
  "name": "John Doe",
  "email": "[EMAIL_ADDRESS]",
  "age": 30,
  "active": false,
  "roles": ["user", "moderator"],
  "address": {
    "city": "New York",
    "country": "USA",
    "zip": "10001"
  },
  "phone": "+1 234 567 8901"
}`,
  },
  {
    label: "API response",
    left: `{
  "status": "ok",
  "version": "1.0.0",
  "data": {
    "count": 3,
    "items": ["apple", "banana", "cherry"]
  },
  "meta": {
    "page": 1,
    "total": 10
  }
}`,
    right: `{
  "status": "success",
  "version": "2.0.0",
  "data": {
    "count": 4,
    "items": ["apple", "mango", "cherry", "grape"]
  },
  "meta": {
    "page": 1,
    "total": 15,
    "pages": 4
  },
  "timestamp": "2026-03-14T12:00:00Z"
}`,
  },
  {
    label: "Config diff",
    left: `{
  "debug": false,
  "port": 3000,
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}`,
    right: `{
  "debug": true,
  "port": 8080,
  "database": {
    "host": "db.prod.example.com",
    "port": 5432,
    "name": "mydb_prod",
    "ssl": true
  },
  "cache": {
    "enabled": true,
    "ttl": 7200,
    "strategy": "redis"
  },
  "logging": {
    "level": "warn",
    "file": "/var/log/app.log"
  }
}`,
  },
];