const STORAGE_KEY = 'xbvr.locale'

function resolveLocale (language) {
  return /^zh(?:[-_]|$)/i.test(language || '') ? 'zh-CN' : 'en-GB'
}

function getInitialLocale (storage, language) {
  try {
    const saved = storage.getItem(STORAGE_KEY)
    if (saved === 'zh-CN' || saved === 'en-GB') return saved
  } catch (_) { /* Private browsing can disable storage. */ }
  return resolveLocale(language)
}

function setLocale (language, i18n, storage, document) {
  const locale = resolveLocale(language)
  i18n.locale = locale
  if (document && document.documentElement) document.documentElement.lang = locale
  try { storage.setItem(STORAGE_KEY, locale) } catch (_) { /* Switching still works without persistence. */ }
  return locale
}

module.exports = { resolveLocale, getInitialLocale, setLocale }
