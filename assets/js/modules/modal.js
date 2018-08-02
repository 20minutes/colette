/** @module modules/modal */

import A11yDialog from 'a11y-dialog'

/** Default config. */
const defaultConfig = {
  containerId: null,
  containerClasses: [],
  contentClasses: [],
  content: '',
  targetToggleHidden: document.querySelectorAll('body > *:not(.modal):not([aria-hidden="true"]):not(script)'),
}

/**
 * Create a new Modal, accessible dialog
 * @class
 * @param {object} cfg config object
 * @param {string} [cfg.containerId=null] container’s ID
 * @param {Array} [cfg.containerClasses=[]] (optional) Desired classes of the container
 * @param {Array} [cfg.contentClasses=[]] (optional) Desired classes of the actual modal
 * @param {string} [cfg.content=''] Content of the modal
 * @param {(NodeList | Element | string)} [cfg.targetToggleHidden] Elements to hide when
 * open the modal
 */
function Modal(cfg) {
  // Merge default with current cfg
  this.config = Object.assign({}, defaultConfig, cfg)
  this.build()
  this.isInserted = false
}

/**
 * Opens the modal if init
 */
Modal.prototype.open = function open() {
  if (!this.dialog) {
    // Cannot open Modal, it does not exist
    return
  }

  this.dialog.show()
}

/**
 * Close the modal if init
 */
Modal.prototype.close = function close() {
  if (!this.dialog) {
    // Cannot close Modal, it does not exist
    return
  }

  this.dialog.hide()
}

/**
 * Destroy modal and remove container from DOM
 */
Modal.prototype.destroy = function destroy() {
  if (this.dialog) {
    this.dialog.destroy()
  }

  if (this.container) {
    this.container.remove()
  }
}

Modal.prototype.init = function init() {
  if (this.dialog) {
    // The modal is already init
    return
  }

  this.dialog = new A11yDialog(this.container, this.config.targetToggleHidden)

  this.dialog.on('show', () => {
    this.lastScroll = {
      x: window.scrollX,
      y: window.scrollY,
    }
    document.body.style.top = `-${this.lastScroll.y}px`
    document.body.classList.add('noscroll')
  })

  this.dialog.on('hide', () => {
    document.body.classList.remove('noscroll')
    document.body.style.top = null
    window.scroll(this.lastScroll.x, this.lastScroll.y)
  })
}

/**
 * Build modal DOM
 * @return {Element} modal’s container
 */
Modal.prototype.build = function build() {
  // Creates the container
  this.container = document.createElement('div')

  if (this.config.containerId) {
    this.container.id = this.config.containerId
  }

  this.container.classList.add('modal', ...this.config.containerClasses)
  this.container.setAttribute('aria-hidden', true)

  // Creates the overlay
  const overlay = document.createElement('div')
  overlay.classList.add('modal-overlay')
  overlay.setAttribute('data-a11y-dialog-hide', true)
  this.container.appendChild(overlay)

  // Creates the close button
  const btnClose = document.createElement('button', { type: 'button' })
  btnClose.classList.add('modal-closebtn', 'btnIcon')
  btnClose.setAttribute('data-a11y-dialog-hide', true)
  btnClose.innerHTML = '<svg height="12" width="12"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#symbol-cross"></use></svg>'

  // Creates the modal & fill it w/ the @param: content
  const content = document.createElement('div')
  content.classList.add('modal-window', ...this.config.contentClasses)
  content.setAttribute('role', 'dialog')
  content.innerHTML = this.config.content
  content.appendChild(btnClose)

  return this.container.appendChild(content)
}

/**
 * Insert modal container at end of the `body`
 */
Modal.prototype.insert = function insert() {
  if (this.isInserted) {
    // Modal already exists in DOM
    return
  }

  document.body.appendChild(this.container)
  this.isInserted = true
}

export default Modal
