const glob = require('glob')

const defaultScenarioConfig = {
  label: null,
  url: null,
  hideSelectors: [
    'img[src^="http://lorempixel.com/"]',
    'iframe',
  ],
  removeSelectors: [],
  selectorExpansion: true,
  selectors: [
    '.co_subsection-demo',
  ],
  readyEvent: null,
  delay: 500,
  misMatchThreshold: 0.1,
  requireSameDimensions: false,
  onReadyScript: 'onReady.js',
}

const config = {
  id: 'test',
  asyncCaptureLimit: 1,
  asyncCompareLimit: 1,
  viewports: [
    {
      name: 's',
      width: 320,
      height: 480,
    },
    {
      name: 'm',
      width: 768,
      height: 1024,
    },
    {
      name: 'l',
      width: 1280,
      height: 1024,
    },
  ],
  scenarios: [],
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report',
  },
  engineFlags: [],
  engine: 'chrome',
  report: ['browser', 'CI'],
  debug: false,
  debugWindow: false,
}

const files = glob.sync('./docs/item-*.html')

if (files.lenght <= 0) {
  console.log('No files found to test in the docs/ folder.')
  console.log('Try running `gulp docs` to solve the problem.')
} else {
  files.forEach((filename) => {
    config.scenarios.push(Object.assign({}, defaultScenarioConfig, {
      label: filename,
      url: filename,
    }))
  })
}

module.exports = config
