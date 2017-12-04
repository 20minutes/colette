const colette = window.colette || {};

import iframeResizer from './modules/iframeResizer';
colette.iframeResizer = iframeResizer;

import headroom from 'headroom.js';
colette.headroom = headroom;

import FontFaceLoader from './modules/fontFaceLoader';
import fontsData from '../../fontfaces.json';

colette.fonts = new FontFaceLoader({data: fontsData});

export {
    colette
};
