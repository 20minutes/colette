colette.iframeResizer = (function() {
    'use strict';

    var pub = {},
        cfg = {
            selector: '#iframeContent',
            el: null,
            delay: 0,
            resizeInternal: false
        };

    pub.init = function(args)
    {
        cfg.delay = args.delay || cfg.delay;
        cfg.selector = args.selector || cfg.selector;
        cfg.el = document.querySelector(cfg.selector);

        window.addEventListener('message', function(e) {
            // resizeComplete
            if ('resizeComplete' === e.data) {
                iframeResizeComplete();
            }
        });

        window.addEventListener('load', function(e) {
            height();
        });

        window.addEventListener('resize', function(e) {
            height();
        });

    };

    var iframeResizeComplete = function()
    {
        setTimeout(function() {
            cfg.resizeInternal = false;
        }, 500);
    };

    var height = function()
    {
        if (!cfg.resizeInternal) {
            setTimeout(function() {
                sendHeight();
            }, cfg.delay);
        }
    };

    var sendHeight = function()
    {
        window.top.postMessage({type: 'doResize', height: cfg.el.offsetHeight}, '*');
        cfg.resizeInternal = true;
    };

    return pub;
})();
