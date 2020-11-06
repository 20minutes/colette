/** @module modules/pager */

/** Default config. */
const defaultConfig = {
  itemPerPage: 3,
  blockList: null,
  onPageChanged: () => {},
}

/**
 * Create a new Pager
 * @class
 * @param {Object} cfg config object
 * @param {Number} [cfg.itemPerPage=3] number of item visible by page
 * @param {HTMLElement} [cfg.blockList=null] list of elements to paginate
 */
function Pager(cfg) {
  // Merge default with current cfg
  this.config = { ...defaultConfig, ...cfg }

  this.blockList = this.config.blockList
  this.block = this.blockList.closest('.block')
  if (!this.block) {
    return
  }
  this.pager = this.block.querySelector('.pager')
  if (!this.pager) {
    return
  }
  this.items = this.blockList.querySelectorAll('li')
  if (!this.items) {
    return
  }

  // get config from attribute
  const attributConfigItemPerPage = this.blockList.getAttribute('data-item-per-page')

  // Variables used for pager
  this.itemPerPage = this.config.itemPerPage
  if (attributConfigItemPerPage) {
    this.itemPerPage = parseInt(attributConfigItemPerPage, 10)
  }
  this.totalPage = Math.ceil(this.items.length / this.itemPerPage)
  this.currentPage = 1

  this.btnPrev = this.pager.querySelector('.pager-prev')
  this.btnNext = this.pager.querySelector('.pager-next')
  this.btnPrev.disabled = true

  // event handlers
  this.btnPrev.addEventListener('click', this.paginateEventHandler.bind(this))
  this.btnNext.addEventListener('click', this.paginateEventHandler.bind(this))
}
/**
 * Event handler on click on previous or next button.
 * It toggles elements visibility via `aria-hidden` attribute to paginate the list relatively to
 * `itemPerPage` parameter.
 * @param {Event} e click event on previous or next button
 */
Pager.prototype.paginateEventHandler = function paginateEventHandler(e) {
  const btn = e.target.closest('button')

  this.currentPage = btn.classList.contains('pager-next') ? this.currentPage + 1 : this.currentPage - 1
  this.block.querySelector('.pager-current').innerHTML = this.currentPage

  // disable navigation buttons on min and max page
  this.btnPrev.disabled = this.currentPage === 1
  this.btnNext.disabled = this.totalPage === this.currentPage

  const prev = (this.currentPage - 1) * this.itemPerPage
  const next = (this.currentPage * this.itemPerPage) + 1

  Array.prototype.forEach.call(this.items, (item) => {
    if (item.matches(`:nth-child(-n+${prev}), :nth-child(n+${next})`)) {
      item.setAttribute('aria-hidden', 'true')
    } else {
      item.removeAttribute('aria-hidden')
    }
  })

  this.config.onPageChanged(this.items)
}

// Pager constructor.
export default Pager
