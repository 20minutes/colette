/**
 * @modal
 * Create a dialog
 *
 * @constructor
 * @function open     open the modal
 * @function close    close the modal
 * @function destroy  destroy the instance
 *
 * colette uses a11y-dialog, https://www.npmjs.com/package/a11y-dialog
 */
import A11yDialog from 'a11y-dialog'

/**
 * Default cfg
 * @param id      {string} Desired id of the container
 * @param content {string} The content of the modal. The main container should have a role="dialog"
 */
const defaultConfig = {
  id: '',
  content: null,
}

function Modal(cfg) {
  // Merge default with current cfg
  this.config = Object.assign({}, defaultConfig, cfg)
  this.el = document.createElement('div')
  this.el.id = this.config.id
  this.el.classList.add('modal')
  this.el.setAttribute('aria-hidden', true)
  this.el.innerHTML = this.config.content
  this.placeContent()
  this.dialog = new A11yDialog(this.el, document.querySelectorAll('body > *:not(.modal):not([aria-hidden="true"]):not(script)'))
}

Modal.prototype.open = function open() {
  this.dialog.show()
}

Modal.prototype.close = function close() {
  this.dialog.hide()
}

Modal.prototype.destroy = function destroy() {
  this.dialog.destroy()
}

Modal.prototype.placeContent = function placeContent() {
  return document.body.insertAdjacentElement('beforeend', this.el)
}

export default Modal
