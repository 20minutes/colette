import A11yDialog from 'a11y-dialog'

const defaultConfig = {
  id: '',
  content: null,
}

function Modal(cfg) {
  // Merge default with current cfg
  this.config = Object.assign({}, defaultConfig, cfg)

  const el = document.createElement('div')
  el.id = this.config.id
  el.innerHTML = this.config.content
  document.body.insertAdjacentElement('beforeend', el)
  this.dialog = new A11yDialog(el)
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

export default Modal
