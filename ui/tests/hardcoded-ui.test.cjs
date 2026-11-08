const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.vue') ? [path.join(dir, e.name)] : [])
const files = ['views', 'components'].flatMap(dir => walk(path.join(root, 'src', dir)))
const literalAllowlist = /^(?:[,\s]*(?:x|\(\/s\)|,&nbsp;)[,\s]*|[A-Z]|XS|Q\/R|U\/V|W\/X\/Y\/Z|4K|5K|6K|DeoVR|Heresphere|javdatabase\.com|r18\.dev|javlibrary\.com|jav\.land|R18\.dev:|VRKM-139|84vrkm00139|http:\/\/|https:\/\/|px|x|\/s\)?|,&nbsp;|&nbsp;)$/
test('Owned Vue templates have no untranslated static English UI text or labels', () => {
  const remaining = []
  for (const file of files) {
    const template = fs.readFileSync(file, 'utf8').split('<script>')[0].replace(/<!--[\s\S]*?-->/g, '')
    const tags = /<[^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>|([^<]+)/g
    for (const m of template.matchAll(tags)) {
      if (m[1]) {
        const text = m[1].replace(/{{[\s\S]*?}}/g, '').replace(/\s+/g, ' ').trim()
        if (/[A-Za-z]/.test(text) && !literalAllowlist.test(text)) remaining.push(`${path.relative(root, file)}: ${text}`)
      } else {
        for (const a of m[0].matchAll(/(?<![:\w-])(label|placeholder|title|alt|message|confirm-text|cancel-text|aria-label)="([^"]+)"/g)) {
          if (/[A-Za-z]/.test(a[2]) && !literalAllowlist.test(a[2])) remaining.push(`${path.relative(root, file)}: ${a[1]}=${a[2]}`)
        }
      }
    }
  }
  assert.deepEqual(remaining, [])
})
test('Dialogs, toasts and form prompts translate their static messages', () => {
  const remaining = []
  for (const file of files) {
    const script = fs.readFileSync(file, 'utf8').split('<script>')[1] || ''
    for (const m of script.matchAll(/(?:\b(?:message|title|confirmText|cancelText|fieldPrompt|placeholder)\s*:|\bfieldCheckMsg\s*=)\s*(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g)) {
      if (/[A-Za-z]/.test(m[2].replace(/\$\{[^}]+\}/g, ''))) remaining.push(`${path.relative(root, file)}: ${m[2]}`)
    }
  }
  assert.deepEqual(remaining, [])
})
test('Dynamic tooltips and schedule intervals translate labels without changing data values', () => {
  const all = files.map(f => fs.readFileSync(f, 'utf8')).join('\n')
  for (const literal of ['Run every ${', "? 'Remove from watchlist'", "? 'Exclude '", '? "Import Scene Data"', "? 'Unlock'", "? 'Disable Auto Load More'"]) assert.ok(!all.includes(literal), literal)
})
test('Secondary accessible labels, validation and status helpers are translated', () => {
  const all = files.map(f => fs.readFileSync(f, 'utf8')).join('\n')
  for (const text of ['data-content="Saved searches"', 'aria-next-label="Next page"', "return 'Start on the hour'", "this.modalTitle = 'Create new saved search'", 'this.scraperwarning = "Take care', 'validation-message="Up to the current year"']) assert.ok(!all.includes(text), text)
})
const readCatalog = locale => {
  const base = path.join(root, `src/locales/${locale === 'en' ? 'en-GB' : 'zh-CN'}.json`)
  const extra = path.join(root, `src/locales/extra-${locale}.json`)
  return { ...(fs.existsSync(base) ? JSON.parse(fs.readFileSync(base)) : {}), ...(fs.existsSync(extra) ? JSON.parse(fs.readFileSync(extra)) : {}) }
}
test('Owned Vue components compile and parse', () => {
  const compiler = require('vue-template-compiler')
  const babel = require('@babel/core')
  for (const file of files) {
    const component = compiler.parseComponent(fs.readFileSync(file, 'utf8'))
    assert.deepEqual(compiler.compile(component.template.content).errors, [], file)
    assert.doesNotThrow(() => babel.parseSync(component.script.content, { configFile: false, sourceType: 'module' }), file)
  }
})
test('Web interface labels and options use translations with bilingual entries', () => {
  const source = fs.readFileSync(path.join(root, 'src/views/options/sections/InterfaceWeb.vue'), 'utf8')
  for (const label of ['Tag Sort', 'Buttons in Scene List', 'By Tag Count', 'Opacity of unavailable scenes', 'Select aspect ratio']) {
    assert.ok(source.includes(`$t('${label}')`), `${label} must use $t`)
  }
  const en = readCatalog('en')
  const zh = readCatalog('zh')
  const extraPath = path.join(root, 'src/locales/extra-en.json')
  const keys = fs.existsSync(extraPath) ? Object.keys(JSON.parse(fs.readFileSync(extraPath))) : ['Tag Sort', 'Buttons in Scene List', 'Run every {hours} hours']
  for (const key of keys) {
    assert.equal(en[key], key)
    assert.ok(zh[key], `Missing Chinese: ${key}`)
    assert.notEqual(en[key], zh[key], `Untranslated: ${key}`)
  }
})
