const defaultConfig = {
    itemPerPage: 3,
    blockList: null
};

function Pager(cfg) {
    // Merge default with current cfg
    this.config = Object.assign({}, defaultConfig, cfg);

    this.blockList = this.config.blockList;
    this.block = this.blockList.closest('.block');
    this.items = this.blockList.querySelectorAll('li');

    // get config from attribute
    const attributConfigItemPerPage = this.blockList.getAttribute('data-item-per-page');

    // Variables used for pager
    this.itemPerPage = attributConfigItemPerPage ? parseInt(attributConfigItemPerPage) : this.config.itemPerPage;
    this.totalPage = Math.ceil(this.items.length / this.itemPerPage);
    this.currentPage = 1;

    this.btnPrev = this.block.querySelector('.pager-prev');
    this.btnNext = this.block.querySelector('.pager-next');

    // event handlers
    this.btnPrev.addEventListener('click', this.paginateEventHandler.bind(this));
    this.btnNext.addEventListener('click', this.paginateEventHandler.bind(this));
}

Pager.prototype.paginateEventHandler = function paginateEventHandler(e) {
    const btn = e.target.closest('button');

    this.currentPage = btn.classList.contains('pager-next') ? this.currentPage + 1 : this.currentPage - 1;
    this.block.querySelector('.pager-current').innerHTML = this.currentPage;

    // disable navigation buttons on min and max page
    this.btnPrev.disabled = 1 === this.currentPage;
    this.btnNext.disabled = this.totalPage === this.currentPage;

    const prev = (this.currentPage - 1) * this.itemPerPage;
    const next = this.currentPage * this.itemPerPage + 1;

    Array.prototype.forEach.call(this.items, (item) => {
        if (item.matches(':nth-child(-n+' + prev + '), :nth-child(n+' + next + ')')) {
            item.setAttribute('aria-hidden', 'true');
        } else {
            item.removeAttribute('aria-hidden');
        }
    });
};

export default Pager;
