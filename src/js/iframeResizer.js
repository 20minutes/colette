/** @module modules/iframeResizer */

/** Default config. */
const defaultConfig = {
  el: null,
  delay: 0,
  iframeId: 'iframeId',
}

/**
 * Create a new IframeResizer
 * @class
 * @param {Object} cfg config object
 * @param {HTMLIFrameElement} [cfg.el=null] iframe element
 * @param {Int} [cfg.delay=0] delay between two check of size
 * @param {String} [cfg.iframeId='iframeId'] id of iframe returned by postMessage
 */
function IframeResizer(cfg) {
  if (!cfg.el) {
    return
  }

  this.delay = cfg.delay || defaultConfig.delay
  this.iframeId = cfg.iframeId || defaultConfig.iframeId
  this.el = cfg.el

  this.resizeInternal = false

  window.addEventListener('message', (e) => {
    // resizeComplete
    if (e.data === 'resizeComplete') {
      this.iframeResizeComplete()
    }
  })

  window.addEventListener('load', this.height.bind(this))
  window.addEventListener('resize', this.height.bind(this))
}

/**
 */
IframeResizer.prototype.iframeResizeComplete = function iframeResizeComplete() {
  setTimeout(() => {
    this.resizeInternal = false
  }, 500)
}

/**
 */
IframeResizer.prototype.height = function height() {
  if (!defaultConfig.resizeInternal) {
    setTimeout(() => {
      this.sendHeight()
    }, this.delay)
  }
}

/**
 * Send new height information to parent iframe
 */
IframeResizer.prototype.sendHeight = function sendHeight() {
  window.parent.postMessage(
    {
      type: 'doResize',
      height: this.el.offsetHeight,
      iframeId: this.iframeId,
    },
    '*'
  )

  // This postMessage is dedicated to AMP
  // https://amp.dev/documentation/components/amp-iframe#iframe-resizing
  window.parent.postMessage(
    {
      sentinel: 'amp',
      type: 'embed-size',
      height: document.body.scrollHeight,
    },
    '*'
  )

  this.resizeInternal = true
}
// IframeResizer Constructor.
export default IframeResizer
