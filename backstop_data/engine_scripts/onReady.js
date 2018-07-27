module.exports = (casper, scenario, vp) => {
  casper.evaluate(function () {
    var styleEl = document.createElement('style');

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    var styleSheet = styleEl.sheet;

    // Insert CSS Rule
    styleSheet.insertRule('*, *:before, *:after { -webkit-animation-delay: 0s !important; -webkit-animation-duration: 0s !important; animation-delay: 0s !important; animation-duration: 0s !important; }', styleSheet.cssRules.length);
  })

  console.log(`onReady.js has run for \`${vp.label}\` on \`${scenario.label}\`.`)
}
