import FontFaceObserver from 'fontfaceobserver'

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

const defaultConfig = {
  localStorageKey: 'colette-font',
  data: [],
  class: 'webfont',
  optional: true,
}

function FontLoader(cfg) {
  this.config = Object.assign({}, defaultConfig, cfg)
  this.isActive = false

  this.init()
}

FontLoader.prototype.isFontLoaded = function isFontLoaded() {
  // TODO: test if it's possible to be used only if font-display is not supported
  // ('fontDisplay' in document.documentElement.style) ||
  return localStorage && localStorage.getItem(this.config.localStorageKey) === 'loaded'
}

FontLoader.prototype.activeFonts = function activeFonts() {
  document.documentElement.classList.add(this.config.class)
  this.isActive = true
}

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

FontLoader.prototype.updateLocalStorage = function updateLocalStorage() {
  try {
    localStorage.setItem(this.config.localStorageKey, 'loaded')
  } catch (e) {
    // Either localStorage not present or quota has exceeded
    // Another reason Safari private mode
    // https://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
  }
}

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

export default FontLoader
