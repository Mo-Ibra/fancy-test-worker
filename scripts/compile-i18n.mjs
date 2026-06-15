import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve('i18n');
const COMPILED_DIR = path.join(LOCALES_DIR, 'compiled');

function loadLocaleMessages(locale) {
  const messages = {};
  const dir = path.join(LOCALES_DIR, locale);
  if (!fs.existsSync(dir)) return messages;

  function walk(currentDir, target) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        const child = {};
        target[entry.name] = child;
        walk(fullPath, child);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const key = entry.name.slice(0, -5);
        target[key] = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      }
    }
  }

  walk(dir, messages);
  return messages;
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {};
      deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      target[key] = source[key];
    }
  }
}

if (!fs.existsSync(COMPILED_DIR)) {
  fs.mkdirSync(COMPILED_DIR, { recursive: true });
}

const enMessages = loadLocaleMessages('en');
fs.writeFileSync(path.join(COMPILED_DIR, 'en.json'), JSON.stringify(enMessages, null, 2));
console.log(`✓ i18n/compiled/en.json (${JSON.stringify(enMessages).length} bytes)`);

const arMessages = loadLocaleMessages('ar');
deepMerge(arMessages, enMessages);
fs.writeFileSync(path.join(COMPILED_DIR, 'ar.json'), JSON.stringify(arMessages, null, 2));
console.log(`✓ i18n/compiled/ar.json (${JSON.stringify(arMessages).length} bytes)`);
