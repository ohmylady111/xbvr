const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const file = path.join(__dirname, '../src/locale.js')
function load () {
  assert.ok(fs.existsSync(file), 'locale resolver must exist')
  return require(file)
}
test('Chinese regional variants resolve to simplified Chinese; others fall back to English', () => {
  const { resolveLocale } = load()
  for (const code of ['zh', 'zh-CN', 'zh-SG', 'zh-Hans', 'zh-TW', 'zh_HK']) assert.equal(resolveLocale(code), 'zh-CN')
  for (const code of ['en-US', 'en-GB', 'fr', undefined]) assert.equal(resolveLocale(code), 'en-GB')
})
test('saved explicit language wins; unsupported saved choice falls back to browser', () => {
  const { getInitialLocale } = load()
  assert.equal(getInitialLocale({ getItem: () => 'en-GB' }, 'zh-CN'), 'en-GB')
  assert.equal(getInitialLocale({ getItem: () => 'zh-CN' }, 'en-US'), 'zh-CN')
  assert.equal(getInitialLocale({ getItem: () => 'xx' }, 'zh-SG'), 'zh-CN')
  assert.equal(getInitialLocale({ getItem: () => { throw Error('denied') } }, 'zh'), 'zh-CN')
})
test('language switch changes locale and html lang, persists and tolerates blocked storage', () => {
  const { setLocale } = load()
  const i18n = {}; const document = { documentElement: {} }; const saved = {}
  assert.equal(setLocale('zh-CN', i18n, { setItem: (k, v) => { saved[k] = v } }, document), 'zh-CN')
  assert.equal(i18n.locale, 'zh-CN'); assert.equal(document.documentElement.lang, 'zh-CN')
  assert.equal(saved['xbvr.locale'], 'zh-CN')
  assert.doesNotThrow(() => setLocale('en-GB', i18n, { setItem: () => { throw Error('denied') } }, document))
  assert.equal(i18n.locale, 'en-GB')
})
