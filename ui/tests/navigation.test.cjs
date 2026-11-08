const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const src = name => fs.readFileSync(path.join(__dirname, '../src', name), 'utf8')
test('quick find placeholder uses translations', () => {
  assert.ok(src('QuickFind.vue').includes(':placeholder="$t(\'Find scene...\')"'))
})
test('update notification interpolates a translated version message', () => {
  assert.ok(src('Navbar.vue').includes("this.$t('Version {version} available!', { version: this.latestVersion })"))
})
