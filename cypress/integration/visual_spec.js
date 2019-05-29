const items = require('../fixtures/items')

describe('FirstTest', () => {
  items.forEach((item) => {
    it(`Take a screenshot for “${item}”`, () => {
      cy.visit(`http://localhost:8000/item-${item}.html`)
      cy.percySnapshot()
    })
  })
})
