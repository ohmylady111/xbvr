const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parseExpression } = require('@babel/parser');

const src = path.resolve(__dirname, '../src');

// Match complete JS string literals, not just characters up to the next quote.
// Babel decodes escaped quotes, backslashes, Unicode and line continuations.
// The trailing lookahead excludes nonliteral keys such as $t('prefix' + name).
function literalKeys(source) {
  const calls = /\$t\s*\(\s*((?:'(?:\\[\s\S]|[^'\\])*')|(?:"(?:\\[\s\S]|[^"\\])*"))\s*(?=[,)])/g;
  return Array.from(source.matchAll(calls), match => parseExpression(match[1]).value);
}

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.(vue|[cm]?js|ts)$/.test(file) ? [file] : [];
  });
}

test('literal translation scanner decodes both quote styles and JS escapes', () => {
  assert.deepEqual(literalKeys(String.raw`$t('You\'re ready'); this.$t("Say \"hello\""); $t('C:\\files'); $t('\u4e2d'); $t('prefix' + name); $t(variable)`), [
    "You're ready", 'Say "hello"', 'C:\\files', '中',
  ]);
});

test('every literal $t call in Vue templates and scripts exists in both catalogs', () => {
  const references = new Map();
  for (const file of sourceFiles(src)) {
    for (const key of literalKeys(fs.readFileSync(file, 'utf8'))) {
      if (!references.has(key)) references.set(key, path.relative(src, file));
    }
  }
  assert.ok(references.size > 500, 'scan the full UI including root Vue components');
  const missing = [];
  for (const locale of ['en-GB', 'zh-CN']) {
    const catalog = JSON.parse(fs.readFileSync(path.join(src, 'locales', `${locale}.json`), 'utf8'));
    for (const [key, file] of references) {
      if (!Object.hasOwn(catalog, key)) missing.push(`${locale}: ${JSON.stringify(key)} (${file})`);
    }
  }
  assert.deepEqual(missing, [], `Missing literal translation keys:\n${missing.join('\n')}`);
});

test('dynamic player sorting labels and cuepoint validation have catalog entries', () => {
  const player = fs.readFileSync(path.join(src, 'views/options/sections/InterfaceDeoVR.vue'), 'utf8');
  const keys = new Set(Array.from(player.matchAll(/<b-dropdown-item\b[^>]*\bvalue=['"]([^'"]+)['"]/g), match => match[1]));
  // disableSaveMsg() returns this literal to a dynamic $t call in Details.vue.
  keys.add('End Time is only valid for HSP Cuepoints');
  assert.ok(keys.size >= 10, 'include the video, script and subtitle sorting options');
  for (const locale of ['en-GB', 'zh-CN']) {
    const catalog = JSON.parse(fs.readFileSync(path.join(src, 'locales', `${locale}.json`), 'utf8'));
    for (const key of keys) assert.ok(Object.hasOwn(catalog, key), `${locale}: missing dynamic key ${key}`);
  }
});
