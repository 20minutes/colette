colette.iframeResizer = (function() {
    'use strict';

    var pub = {},
        cfg = {
            selector: '#iframeContent',
            el: null,
            delay: 0,
            resizeInternal: false,
            iframeId: 'iframeId'
        };

    pub.init = function(args)
    {
        cfg.delay = args.delay || cfg.delay;
        cfg.iframeId = args.iframeId || cfg.iframeId;
        cfg.el = document.querySelector(args.selector || cfg.selector);

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
        window.top.postMessage({type: 'doResize', height: cfg.el.offsetHeight, iframeId: cfg.iframeId}, '*');
        cfg.resizeInternal = true;
    };

    return pub;
})();
