const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const localeDir = path.resolve(__dirname, '../src/locales');
const en = JSON.parse(fs.readFileSync(path.join(localeDir, 'en-GB.json'), 'utf8'));
const zhPath = path.join(localeDir, 'zh-CN.json');

// Cover Vue-style interpolation, printf substitutions, and HTML entities.
function placeholders(value) {
  return (value.match(/\$?\{[^{}]+\}|%(?:\d+\$)?[-+\d.]*[sdif]|&(?:#\d+|#x[\da-f]+|[a-z]+);/gi) || []).sort();
}

test('Simplified Chinese catalog covers every English entry without losing placeholders', () => {
  assert.ok(fs.existsSync(zhPath), 'zh-CN.json must exist');
  const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
  assert.ok(Object.keys(en).length >= 244, 'retain the English baseline as UI coverage grows');
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort());
  for (const [key, source] of Object.entries(en)) {
    assert.equal(typeof zh[key], 'string', `${key}: translation must be a string`);
    assert.ok(zh[key].trim(), `${key}: translation must not be empty`);
    assert.deepEqual(placeholders(zh[key]), placeholders(source), `${key}: placeholders must be preserved`);
    if (!['ID', 'FPS', 'Cookies'].includes(key)) {
      assert.match(zh[key], /\p{Script=Han}/u, `${key}: expected Chinese translation`);
    }
  }
  for (const [key, expected] of Object.entries({
    Scenes: '影片', Scrapers: '刮削器', Cast: '演员', Actors: '演员',
    Search: '搜索', Play: '播放', Storage: '存储',
  })) {
    assert.equal(zh[key], expected, `${key}: use consistent core terminology`);
  }
  assert.match(zh['Include Cuepoint data you have entered for a scene'], /标记点/);
});
