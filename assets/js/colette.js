// Polyfills

// es polyfill
import 'babel-polyfill';

// dom4 polyfill
import 'dom4';

// focus-ring polyfill
// TODO: replace by focus-visible polyfill as soon as it exist
// https://github.com/WICG/focus-ring/pull/90
import 'wicg-focus-ring';

//modules
import iframeResizer from './modules/iframeResizer';
import FontFaceLoader from './modules/fontFaceLoader';
import fontsData from '../../fontfaces.json';
import headroom from 'headroom.js';

// Init Colette object
const colette = window.colette || {};

colette.iframeResizer = iframeResizer;
colette.headroom = headroom;
colette.fonts = new FontFaceLoader({data: fontsData});

export {
    colette
};
