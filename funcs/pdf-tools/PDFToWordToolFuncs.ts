// ── Types ──────────────────────────────────────────────────────────

export interface ExtractedPage {
  pageNum: number;
  text: string;
  charCount: number;
}

export interface ConversionOptions {
  preserveLineBreaks: boolean;
  addPageBreaks: boolean;
  addPageNumbers: boolean;
  cleanWhitespace: boolean;
  fontSize: number;
  fontFamily: string;
}

// ── Helpers ────────────────────────────────────────────────────────

export function fmtSize(kb: number): string {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

// Lazy-load PDF.js for text extraction
export async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    s.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(s);
  });
}

// ── Text extraction via PDF.js ─────────────────────────────────────

export async function extractText(
  buffer: ArrayBuffer,
  onProgress: (pct: number, page: number, total: number) => void,
): Promise<ExtractedPage[]> {
  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const total = pdf.numPages;
  const pages: ExtractedPage[] = [];

  for (let i = 1; i <= total; i++) {
    onProgress(Math.round((i / total) * 80), i, total);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Reconstruct text with position-aware line breaks
    const items = content.items as any[];
    let text = "";
    let lastY: number | null = null;
    let lastX: number | null = null;

    for (const item of items) {
      const str = item.str ?? "";
      if (!str.trim() && !item.hasEOL) continue;

      const { transform } = item;
      const x = transform?.[4] ?? 0;
      const y = transform?.[5] ?? 0;

      if (lastY !== null && Math.abs(y - lastY) > 5) {
        // New line detected
        text += "\n";
      } else if (lastX !== null && x > lastX + 10) {
        // Large gap — might be column break or tab
        text += "  ";
      }

      text += str;
      lastY = y;
      lastX = x + (item.width ?? 0);

      if (item.hasEOL) {
        text += "\n";
        lastY = null;
        lastX = null;
      }
    }

    pages.push({
      pageNum: i,
      text: text.trim(),
      charCount: text.length,
    });
  }

  return pages;
}

// ── Build DOCX using raw XML ───────────────────────────────────────
// We build a valid minimal DOCX (Office Open XML) without any external library.
// A DOCX is a ZIP containing XML files.

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    // Remove control characters except newline/tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

export function textToParagraphs(text: string, opts: ConversionOptions): string {
  const lines = opts.cleanWhitespace
    ? text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0)
    : text.split("\n");

  return lines.map(line => {
    const safe = escapeXml(line || " ");
    return `<w:p><w:r><w:t xml:space="preserve">${safe}</w:t></w:r></w:p>`;
  }).join("\n");
}

export function buildDocx(pages: ExtractedPage[], opts: ConversionOptions, pdfName: string): Blob {
  const fontSizeTwips = opts.fontSize * 2; // half-points in OOXML
  const fontName = opts.fontFamily === "mono" ? "Courier New" : opts.fontFamily === "serif" ? "Times New Roman" : "Calibri";

  // Build body content
  const bodyParts: string[] = [];

  // Title paragraph
  bodyParts.push(`<w:p>
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:t>${escapeXml(pdfName.replace(/\.pdf$/i, ""))}</w:t></w:r>
  </w:p>`);

  for (let pi = 0; pi < pages.length; pi++) {
    const page = pages[pi];

    // Page label
    if (opts.addPageNumbers && pages.length > 1) {
      bodyParts.push(`<w:p>
        <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
        <w:r><w:t>Page ${page.pageNum}</w:t></w:r>
      </w:p>`);
    }

    // Page content
    const paras = textToParagraphs(page.text, opts);
    bodyParts.push(paras);

    // Page break between pages
    if (opts.addPageBreaks && pi < pages.length - 1) {
      bodyParts.push(`<w:p><w:r><w:br w:type="page"/></w:r></w:p>`);
    }
  }

  const bodyXml = bodyParts.join("\n");

  // document.xml
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"
  xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:oel="http://schemas.microsoft.com/office/2019/extlst"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
  xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"
  xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"
  xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"
  xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"
  xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"
               w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  // styles.xml — define Normal, Heading1, Heading2
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
          xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}"/>
        <w:sz w:val="${fontSizeTwips}"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
    <w:rPr>
      <w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}"/>
      <w:sz w:val="${fontSizeTwips}"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:outlineLvl w:val="0"/></w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="${fontSizeTwips + 16}"/>
      <w:color w:val="2E74B5"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:outlineLvl w:val="1"/></w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="${fontSizeTwips + 8}"/>
      <w:color w:val="2E74B5"/>
    </w:rPr>
  </w:style>
</w:styles>`;

  // [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  // _rels/.rels
  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"/>
</Relationships>`;

  // word/_rels/document.xml.rels
  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
</Relationships>`;

  // Build ZIP manually using JSZip-style structure → use a simple ZIP builder
  return buildZip({
    "[Content_Types].xml": contentTypesXml,
    "_rels/.rels": relsXml,
    "word/document.xml": documentXml,
    "word/styles.xml": stylesXml,
    "word/_rels/document.xml.rels": docRelsXml,
  });
}

// ── Minimal ZIP builder (no external library needed) ──────────────

export function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n, true);
  return b;
}

export function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  new DataView(b.buffer).setUint16(0, n, true);
  return b;
}

export function crc32(data: Uint8Array): number {
  const table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  let crc = 0xffffffff;
  for (const byte of data) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}

export function buildZip(files: Record<string, string>): Blob {
  const entries: { name: Uint8Array; data: Uint8Array; crc: number; offset: number }[] = [];
  const localParts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = strToBytes(name);
    const data = strToBytes(content);
    const crc = crc32(data);
    const dosDate = 0x5421; // 2022-01-01
    const dosTime = 0x0000;

    const localHeader = concat(
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]), // signature
      u16(20),          // version needed
      u16(0),           // flags
      u16(0),           // compression: stored
      u16(dosTime),
      u16(dosDate),
      u32(crc),
      u32(data.length), // compressed size
      u32(data.length), // uncompressed size
      u16(nameBytes.length),
      u16(0),           // extra length
      nameBytes,
    );

    entries.push({ name: nameBytes, data, crc, offset });
    offset += localHeader.length + data.length;
    localParts.push(localHeader, data);
  }

  // Central directory
  const cdParts: Uint8Array[] = [];
  for (const { name, data, crc, offset } of entries) {
    const dosDate = 0x5421, dosTime = 0x0000;
    cdParts.push(concat(
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]), // signature
      u16(20),          // version made by
      u16(20),          // version needed
      u16(0),           // flags
      u16(0),           // stored
      u16(dosTime),
      u16(dosDate),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),           // extra
      u16(0),           // comment
      u16(0),           // disk start
      u16(0),           // internal attr
      u32(0),           // external attr
      u32(offset),
      name,
    ));
  }

  const cdData = concat(...cdParts);
  const cdSize = cdData.length;
  const cdOffset = offset;
  const numEntries = entries.length;

  const eocd = concat(
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]), // end of central dir
    u16(0),                // disk number
    u16(0),                // disk with CD
    u16(numEntries),
    u16(numEntries),
    u32(cdSize),
    u32(cdOffset),
    u16(0),                // comment length
  );

  const all = concat(...localParts, cdData, eocd);
  return new Blob([all as any], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}