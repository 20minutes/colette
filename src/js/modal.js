/** @module modules/modal */

import A11yDialog from 'a11y-dialog'

/** Default config. */
const defaultConfig = {
  containerId: null,
  containerClasses: [],
  modalWindowClasses: [],
  modalContentClasses: [],
  content: '',
  targetToggleHidden: document.querySelectorAll('body > *:not(.modal):not([aria-hidden="true"]):not(script)'),
}

/**
 * Create a new Modal, accessible dialog
 * @class
 * @param {object} cfg config object
 * @param {string} [cfg.containerId=null] container’s ID
 * @param {Array} [cfg.containerClasses=[]] (optional) Classes of the container
 * @param {Array} [cfg.modalWindowClasses=[]] (optional) Classes of the actual modal
 * @param {Array} [cfg.modalContentClasses=[]] (optional) Classes of the modal content div
 * @param {string | Element | DocumentFragment} [cfg.content=''] Content of the modal
 * @param {(NodeList | Element | string)} [cfg.targetToggleHidden] Elements to hide when
 * open the modal
 */
function Modal(cfg) {
  // Merge default with current cfg
  this.config = { ...defaultConfig, ...cfg }
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
  this.overlay = document.createElement('div')
  this.overlay.classList.add('modal-overlay')
  this.overlay.setAttribute('data-a11y-dialog-hide', true)
  this.container.appendChild(this.overlay)

  // Creates the close button
  this.btnClose = document.createElement('button', { type: 'button' })
  this.btnClose.classList.add('modal-close', 'btnIcon')
  this.btnClose.setAttribute('data-a11y-dialog-hide', true)
  this.btnClose.innerHTML = '<svg height="12" width="12"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#symbol-cross"></use></svg>'

  // Creates the modal & fill it w/ the @param: content
  this.window = document.createElement('div')
  this.window.classList.add('modal-window', ...this.config.modalWindowClasses)
  this.window.setAttribute('role', 'dialog')

  this.content = document.createElement('div')
  this.content.classList.add('modal-content', ...this.config.modalContentClasses)
  this.fill(this.config.content)

  this.window.appendChild(this.btnClose)
  this.window.appendChild(this.content)
  this.container.appendChild(this.window)

  return this.container
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

/**
 * Replace content of modal
 * @param {string | Element | DocumentFragment} newContent
 */
Modal.prototype.fill = function fill(newContent) {
  if (typeof newContent === 'string') {
    this.content.innerHTML = newContent

    return
  }

  this.content.innerHTML = ''
  this.content.appendChild(newContent)
}

export default Modal
