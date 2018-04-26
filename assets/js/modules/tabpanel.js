import Tablist from 'accedeweb-tablist'

function TabPanel() {
  const list = document.querySelector('[role="tablist"]')
  console.log(list)
  this.tablist = new window.Tablist(list)
}

export default TabPanel
