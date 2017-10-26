const defaultConfig = {
    el: null,
    delay: 0,
    iframeId: 'iframeId'
};

function IframeResizer(cfg) {
    if (!cfg.el) {
        return;
    }

    this.delay = cfg.delay || defaultConfig.delay;
    this.iframeId = cfg.iframeId || defaultConfig.iframeId;
    this.el = cfg.el;

    this.resizeInternal = false;

    window.addEventListener('message', (e) => {
        // resizeComplete
        if ('resizeComplete' === e.data) {
            this.iframeResizeComplete();
        }
    });

    window.addEventListener('load', this.height.bind(this));
    window.addEventListener('resize', this.height.bind(this));

};

IframeResizer.prototype.iframeResizeComplete = function iframeResizeComplete() {
    setTimeout(() => {
        this.resizeInternal = false;
    }, 500);
};

IframeResizer.prototype.height = function height() {
    if (!defaultConfig.resizeInternal) {
        setTimeout(() => {
            this.sendHeight();
        }, this.delay);
    }
};

IframeResizer.prototype.sendHeight = function sendHeight() {
    window.top.postMessage({
        type: 'doResize',
        height: this.el.offsetHeight,
        iframeId: this.iframeId
    }, '*');
    this.resizeInternal = true;
};

module.exports = function(cfg) {
    return new IframeResizer(cfg);
}
