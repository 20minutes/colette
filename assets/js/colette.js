// Polyfills
import 'babel-polyfill' // es polyfill
import 'dom4' // dom4 polyfill
import 'focus-visible' // focus-visible polyfill
// modules
import headroom from 'headroom.js'
import Blazy from 'blazy'
import iframeResizer from './modules/iframeResizer'
import FontFaceLoader from './modules/fontFaceLoader'
import Pager from './modules/pager'
import fontsData from '../../fontfaces.json'

// Init Colette object
const colette = window.colette || {}

colette.iframeResizer = iframeResizer
colette.headroom = headroom
colette.fonts = new FontFaceLoader({ data: fontsData })
colette.pagers = []
Array.prototype.forEach.call(document.querySelectorAll('.block-list'), (item) => {
  colette.pagers.push(new Pager({ blockList: item }))
})

// lazyload init (images)
colette.lazy = new Blazy({
  offset: 500,
})

export { colette }
