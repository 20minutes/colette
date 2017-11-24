const colette = window.colette || {};

import iframeResizer from './modules/iframeResizer';
colette.iframeResizer = iframeResizer;

import headroom from 'headroom.js';
colette.headroom = headroom;

import './modules/fontFaceLoader';

export {
    colette
};
