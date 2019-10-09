/** @module modules/fontLoader */

import FontFaceObserver from 'fontfaceobserver'

/** Default config. */
const defaultConfig = {
  localStorageKey: 'colette-font',
  data: [],
  class: 'webfont',
  optional: true,
}

/**
 * Check if FontFaceSet API is supported, along with some browser quirks
 * Mainly return false if the browser has the Safari 10 bugs. The
 * native font load API in Safari 10 has two bugs that cause
 * the document.fonts.load and FontFace.prototype.load methods
 * to return promises that don't reliably get fired.
 *
 * The bugs are described in more detail here:
 *  - https://bugs.webkit.org/show_bug.cgi?id=165037
 *  - https://bugs.webkit.org/show_bug.cgi?id=164902
 *
 * If the browser is made by Apple, and has native font
 * loading support, it is potentially affected. But the API
 * was fixed around AppleWebKit version 603, so any newer
 * versions that that does not contain the bug.
 *
 * @return {boolean}
 */
function isFontFaceSetCompatible() {
  let compatible = document.fonts && document.fonts.load
  if (compatible && /Apple/.test(window.navigator.vendor)) {
    const match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent)
    compatible = !(match && parseInt(match[1], 10) < 603)
  }

  return compatible
}

/**
 * Create a new FontLoader
 * @class
 * @param {object} cfg config object
 * @param {string} [cfg.localStorageKey='colette-font']  name of local storage key
 * @param {Array} [cfg.data=[]] name of local storage key
 * @param {string} [cfg.class='webfont'] classe name add to `html` element when fonts are loaded
 * @param {boolean} [cfg.optional=true] imitate `font-display: optional` behavior
 */
function FontLoader(cfg) {
  this.config = { ...defaultConfig, ...cfg }
  this.isActive = false

  this.init()
}

/**
 * Check if fonts are loaded by checking le localstorage key
 *
 * @return {boolean}
 */
FontLoader.prototype.isFontLoaded = function isFontLoaded() {
  // TODO: test if it’s possible to be used only if font-display is not supported
  // ('fontDisplay' in document.documentElement.style) ||
  return localStorage && localStorage.getItem(this.config.localStorageKey) === 'loaded'
}
/**
 * Add class to `html` element to use web font
 */
FontLoader.prototype.activeFonts = function activeFonts() {
  document.documentElement.classList.add(this.config.class)
  this.isActive = true
}

/**
 * Initialize font loader only if it is not loaded previously
 */
FontLoader.prototype.init = function init() {
  // Initialize font loader only if it is not loaded previously
  if (this.config.optional && this.isFontLoaded()) {
    this.activeFonts()

    return
  }

  window.addEventListener('load', () => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.load.bind(this))

      return
    }

    this.load()
  })
}

/**
 * Register in local storage fonts has been loaded
 */
FontLoader.prototype.updateLocalStorage = function updateLocalStorage() {
  try {
    localStorage.setItem(this.config.localStorageKey, 'loaded')
  } catch (e) {
    // Either localStorage not present or quota has exceeded
    // Another reason Safari private mode
    // https://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
  }
}

/**
 * Load fonts
 * @return {Promise}
 */
FontLoader.prototype.load = function load() {
  const fontPromises = []

  this.config.data.forEach((font) => {
    const fontFamily = font.family.replace('\'', '')
    const fontWeight = font.weight ? font.weight : 'normal'
    const fontStyle = font.style ? font.style : 'normal'
    let promise

    if (isFontFaceSetCompatible()) {
      document.fonts.load([fontStyle, fontWeight, '1em', fontFamily].join(' '))
      promise = document.fonts.ready
    } else {
      const loader = new FontFaceObserver(fontFamily, {
        weight: fontWeight,
        style: fontStyle,
      })
      promise = loader.load()
    }

    fontPromises.push(promise)

    promise.catch(() => {})
  })

  const allFontsPromise = Promise.all(fontPromises)

  allFontsPromise.then(() => {
    if (this.config.optional) {
      this.updateLocalStorage()
    } else {
      this.activeFonts()
    }
  }).catch(() => {})

  return allFontsPromise
}

// FontLoader constructor.
export default FontLoader
