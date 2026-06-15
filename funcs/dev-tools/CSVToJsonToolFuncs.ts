
// ── Types ──────────────────────────────────────────────────────────

export type Delimiter = "," | ";" | "\t" | "|" | " ";
export type OutputFormat = "array" | "object" | "grouped" | "csv";
export type QuoteChar = '"' | "'";
export type ViewMode = "json" | "table" | "csv";
export type NullHandling = "empty" | "null" | "skip";

export interface ParseOptions {
  delimiter: Delimiter;
  quoteChar: QuoteChar;
  hasHeader: boolean;
  trimSpaces: boolean;
  skipEmpty: boolean;
  nullHandling: NullHandling;
  detectTypes: boolean;
}

export interface ParseResult {
  headers: string[];
  rows: string[][];
  errors: string[];
}

// ── CSV parser ────────────────────────────────────────────────────

export function parseCSV(csv: string, opts: ParseOptions): ParseResult {
  const errors: string[] = [];
  if (!csv.trim()) return { headers: [], rows: [], errors: [] };

  const lines = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const parsed: string[][] = [];

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (opts.skipEmpty && !line.trim()) continue;

    const fields: string[] = [];
    let i = 0;
    let field = "";
    let inQuote = false;

    while (i < line.length) {
      const ch = line[i];
      if (inQuote) {
        if (ch === opts.quoteChar) {
          if (line[i + 1] === opts.quoteChar) { field += ch; i += 2; }
          else { inQuote = false; i++; }
        } else {
          field += ch; i++;
        }
      } else {
        if (ch === opts.quoteChar) { inQuote = true; i++; }
        else if (ch === opts.delimiter) {
          fields.push(opts.trimSpaces ? field.trim() : field);
          field = ""; i++;
        } else {
          field += ch; i++;
        }
      }
    }
    fields.push(opts.trimSpaces ? field.trim() : field);
    parsed.push(fields);
  }

  if (parsed.length === 0) return { headers: [], rows: [], errors: [] };

  // Warn on ragged rows
  const colCount = parsed[0].length;
  parsed.forEach((row, i) => {
    if (row.length !== colCount) {
      errors.push(`Row ${i + 1} has ${row.length} fields, expected ${colCount}`);
    }
    // Pad short rows
    while (row.length < colCount) row.push("");
  });

  if (opts.hasHeader) {
    return { headers: parsed[0], rows: parsed.slice(1), errors };
  } else {
    const headers = Array.from({ length: colCount }, (_, i) => `column_${i + 1}`);
    return { headers, rows: parsed, errors };
  }
}

// ── Type detection ────────────────────────────────────────────────

export function detectValue(raw: string, handling: NullHandling): unknown {
  if (raw === "" || raw === null) {
    if (handling === "null") return null;
    if (handling === "skip") return undefined;
    return "";
  }
  if (raw === "true" || raw === "TRUE") return true;
  if (raw === "false" || raw === "FALSE") return false;
  if (raw === "null" || raw === "NULL") return null;
  if (/^-?\d+$/.test(raw)) return parseInt(raw, 10);
  if (/^-?\d+\.\d+$/.test(raw)) return parseFloat(raw);
  return raw;
}

// ── CSV → JSON converters ─────────────────────────────────────────

export function toArrayOfArrays(result: ParseResult, opts: ParseOptions): unknown[] {
  const out: unknown[][] = [];
  if (opts.hasHeader) out.push(result.headers);
  result.rows.forEach(row => {
    out.push(row.map(v =>
      opts.detectTypes ? detectValue(v, opts.nullHandling) : v
    ));
  });
  return out;
}

export function toArrayOfObjects(result: ParseResult, opts: ParseOptions): Record<string, unknown>[] {
  return result.rows.map(row => {
    const obj: Record<string, unknown> = {};
    result.headers.forEach((h, i) => {
      const raw = row[i] ?? "";
      const val = opts.detectTypes ? detectValue(raw, opts.nullHandling) : raw;
      if (val !== undefined) obj[h] = val;
    });
    return obj;
  });
}

export function toGroupedByFirst(result: ParseResult, opts: ParseOptions): Record<string, unknown[]> {
  const grouped: Record<string, unknown[]> = {};
  const keyField = result.headers[0] ?? "key";
  result.rows.forEach(row => {
    const key = row[0] ?? "";
    const obj: Record<string, unknown> = {};
    result.headers.slice(1).forEach((h, i) => {
      const raw = row[i + 1] ?? "";
      const val = opts.detectTypes ? detectValue(raw, opts.nullHandling) : raw;
      if (val !== undefined) obj[h] = val;
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(obj);
  });
  return grouped;
}

export function jsonToCSV(json: string, delimiter: Delimiter): string {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || !data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row: Record<string, unknown>) =>
      headers.map(h => {
        const v = String(row[h] ?? "");
        return v.includes(delimiter) || v.includes('"') || v.includes("\n")
          ? `"${v.replace(/"/g, '""')}"`
          : v;
      }).join(delimiter)
    );
    return [headers.join(delimiter), ...rows].join("\n");
  } catch {
    return "";
  }
}

// ── Auto-detect delimiter ─────────────────────────────────────────

export function detectDelimiter(csv: string): Delimiter {
  const firstLine = csv.split("\n")[0] ?? "";
  const candidates: [Delimiter, number][] = [
    [",", (firstLine.match(/,/g) ?? []).length],
    [";", (firstLine.match(/;/g) ?? []).length],
    ["\t", (firstLine.match(/\t/g) ?? []).length],
    ["|", (firstLine.match(/\|/g) ?? []).length],
  ];
  return candidates.sort((a, b) => b[1] - a[1])[0][0];
}

// ── Format output ─────────────────────────────────────────────────

export function buildOutput(
  result: ParseResult,
  format: OutputFormat,
  opts: ParseOptions,
  jsonInput: string,
  delimiter: Delimiter,
  indent: number
): string {
  if (!result.headers.length) return "";
  if (format === "csv") return jsonToCSV(jsonInput, delimiter);

  let data: unknown;
  if (format === "array") data = toArrayOfArrays(result, opts);
  if (format === "object") data = toArrayOfObjects(result, opts);
  if (format === "grouped") data = toGroupedByFirst(result, opts);

  return JSON.stringify(data, null, indent);
}

// ── Stats ─────────────────────────────────────────────────────────

export function getStats(result: ParseResult, output: string) {
  return {
    rows: result.rows.length,
    columns: result.headers.length,
    cells: result.rows.length * result.headers.length,
    outputKb: Math.round(new Blob([output]).size / 1024 * 10) / 10,
  };
}

// EXAMPLES:

export const EXAMPLES = [
  {
    label: "Users",
    csv: `id,name,email,age,active,score
1,Ahmed Ali,ahmed@example.com,29,true,95.5
2,Sara Johnson,sara@example.com,34,false,87.0
3,Mohamed Hassan,mo@example.com,25,true,100.0
4,Jane Doe,jane@example.com,42,true,72.3
5,Bob Smith,bob@example.com,31,false,60.0`,
  },
  {
    label: "Products",
    csv: `product_id;name;category;price;in_stock
P001;Laptop Pro;Electronics;1299.99;true
P002;Wireless Mouse;Electronics;29.99;true
P003;Standing Desk;Furniture;549.00;false
P004;USB-C Hub;Electronics;49.99;true`,
  },
  {
    label: "Sales (TSV)",
    csv: `date\tregion\tsales\tunits\tgrowth
2024-01\tNorth\t125000\t450\t12.5
2024-02\tNorth\t138000\t510\t10.4
2024-01\tSouth\t98000\t340\t8.2
2024-02\tSouth\t105000\t380\t7.1`,
  },
  {
    label: "No Header",
    csv: `1001,Alice,Engineering,85000
1002,Bob,Marketing,72000
1003,Carol,Design,78000
1004,Dave,Engineering,91000`,
  },
];