// Polyfills
import 'babel-polyfill' // es polyfill
import 'dom4' // dom4 polyfill
import 'focus-visible' // focus-visible polyfill
// modules
import Blazy from 'blazy'
import Tablist from '@accede-web/tablist'
import iframeResizer from './modules/iframeResizer'
import FontFaceLoader from './modules/fontFaceLoader'
import Pager from './modules/pager'
import fontsData from '../../fontfaces.json'

// Init Colette object
const colette = window.colette || {}

colette.iframeResizer = iframeResizer
colette.fonts = new FontFaceLoader({ data: fontsData })

colette.Pager = Pager
colette.pagers = []
Array.prototype.forEach.call(document.querySelectorAll('.block-list'), (item) => {
  colette.pagers.push(new Pager({ blockList: item }))
})

colette.Tablist = Tablist
colette.tablists = []
Array.prototype.forEach.call(document.querySelectorAll('.tabpanel-list'), (item) => {
  const tab = new Tablist(item)
  tab.mount()
  colette.tablists.push(tab)
})

// lazyload init (images)
colette.lazy = new Blazy({
  offset: 500,
})

export { colette }
