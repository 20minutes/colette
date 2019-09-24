const defaultConfig = {
  wrapperSelector: '.dropDown',
  btnSelector: '.dropDown-btn',
  contentSelector: '.dropDown-content',
}

/** Class representing some dropDown components */
class DropDown {
  /**
   * Create a new DropDown
   * @class
   * @param {Object} cfg config object
   * @param {String} [cfg.wrapperSelector='.dropDown'] wrapper css selector
   * @param {String} [cfg.btnSelector='.dropDown-btn'] btn css selector
   * @param {String} [cfg.contentSelector='.dropDown-content'] content css selector
   */
  constructor(cfg) {
    this.config = { ...defaultConfig, ...cfg }

    this.bindEvents()
  }

  /** Bind events */
  bindEvents() {
    document.addEventListener('click', (e) => {
      const wrapper = e.target.closest(this.config.wrapperSelector)
      if (!wrapper) {
        this.closeAll()
      }

      const btn = e.target.closest(this.config.btnSelector)

      if (!btn) {
        return
      }

      btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'false')
    })

    document.addEventListener('focus', (e) => {
      const wrapper = e.target === document || e.target.closest(this.config.wrapperSelector)

      if (!wrapper) {
        this.closeAll()
      }
    })
  }

  /** Close every open dropDown */
  closeAll() {
    Array.from(document.querySelectorAll(this.config.btnSelector)).forEach((el) => {
      if (el.getAttribute('aria-expanded') === 'true') {
        el.setAttribute('aria-expanded', false)
      }
    })
  }
}

export default DropDown
