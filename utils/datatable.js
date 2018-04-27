export function generateTable (element, getWindow, className) {
  element.tableCreated = false
  let oldDivTable = element.$el.querySelector('.' + className)
  let oldTable = element.$el.querySelector('.' + className + ' table')
  oldTable.addEventListener('onresize', onResizeTable)
  var tableHead = oldTable.cloneNode(true)
  let tHead = element.$el.querySelector('.' + className + ' table thead')
  let headTableHeight = tHead.clientHeight
  // let clonetHead = tHead.cloneNode(true)
  let thtHead = tHead.querySelectorAll('th[role="columnheader"]')
  tHead.querySelector('tr.datatable__progress').remove()
  let columnGroup = document.createElement('colgroup')
  let toolbars = element.$parent.$parent.$el.querySelectorAll('.toolbar')
  let toolbarHeight = 1
  toolbars.forEach((item) => {
    toolbarHeight += item.clientHeight
  })

  let lastSeenOriTop = 0
  let lastSeenOriLeft = 0
  let lastSeenTempTop = 0
  let lastSeenHorizontalLeft = 0

  function oriScroll (e) {
    lastSeenOriLeft = e.target.scrollLeft
    lastSeenOriTop = e.target.scrollTop
    if (lastSeenTempTop !== e.target.scrollTop) {
      let item = element.$el.querySelector('.tempScroll')
      item.scrollTop = e.target.scrollTop
      let scrollBottomHeight = e.target.scrollHeight - e.target.scrollTop
      if (scrollBottomHeight === e.target.clientHeight) {
        element.scrollBottom = true
      } else {
        element.scrollBottom = false
      }
    }
    if (lastSeenHorizontalLeft !== e.target.scrollLeft) {
      let item = element.$el.querySelector('.dataTableContent')
      item.scrollLeft = e.target.scrollLeft
    }
  }

  function onResizeTable (e) {
    console.log(e)
  }

  function horizontalScroll (e) {
    lastSeenHorizontalLeft = e.target.scrollLeft
    if (lastSeenOriLeft !== e.target.scrollLeft) {
      let item = element.$el.querySelector('.FourBro')
      item.scrollLeft = e.target.scrollLeft
    }
  }

  function tempVerticalScroll (e) {
    lastSeenTempTop = e.target.scrollTop
    if (lastSeenOriTop !== e.target.scrollTop) {
      let item = element.$el.querySelector('.FourBro')
      item.scrollTop = e.target.scrollTop
      let scrollBottomHeight = e.target.scrollHeight - e.target.scrollTop
      if (scrollBottomHeight === e.target.clientHeight) {
        element.scrollBottom = true
      } else {
        element.scrollBottom = false
      }
    }
  }

  thtHead.forEach((item, i) => {
    let col = document.createElement('col')
    if (i === 0) {
      col.setAttribute('style', 'width: ' + item.clientWidth + 'px;')
    }
    if (item.className.search('action') !== -1) {
      col.setAttribute('style', 'width: 84px;')
    }
    if (item.className.search('small') !== -1) {
      col.setAttribute('style', 'width: 72px;')
    }
    columnGroup.appendChild(col)
  })

  let cloneColumnGroup = columnGroup.cloneNode(true)
  tableHead.tBodies[0].remove()
  tableHead.deleteTHead()
  tableHead.appendChild(tHead)
  tableHead.insertBefore(columnGroup, tHead)
  // oldTable.insertBefore(clonetHead, oldTable.querySelector('tbody'))
  oldTable.insertBefore(cloneColumnGroup, oldTable.querySelector('tbody'))

  let divtHead = document.createElement('div')
  divtHead.setAttribute('class', 'headTableView')
  divtHead.appendChild(tableHead)

  // generate div table body
  let heightTable = toolbarHeight + headTableHeight
  if (getWindow.outerWidth > getWindow.innerWidth) {
    if (getWindow.innerWidth < 1000) {
      heightTable = toolbarHeight + headTableHeight + 16
    }
  } else {
    if (getWindow.outerWidth < 1000) {
      heightTable = toolbarHeight + headTableHeight + 16
    }
  }
  let divTable = document.createElement('div')
  divTable.setAttribute('class', 'dataTable')
  let divTableOne = document.createElement('div')
  divTableOne.setAttribute('class', 'OneBro')
  divTableOne.setAttribute('style', 'position: absolute; left: 0px; width: 100%; overflow: hidden; top: ' + (toolbarHeight + headTableHeight) + 'px; height: calc(100vh - ' + heightTable + 'px);')
  let divTableTwo = document.createElement('div')
  divTableTwo.setAttribute('class', 'TwoBro')
  divTableTwo.setAttribute('style', 'position: relative; overflow: hidden;height: 100%;')
  let divTableThree = document.createElement('div')
  divTableThree.setAttribute('class', 'ThreeBro')
  divTableThree.setAttribute('style', 'position: absolute; overflow: hidden; left: 0px; top: 0px; bottom: -16px; right: -16px;')
  let divTableFour = document.createElement('div')
  divTableFour.setAttribute('class', 'FourBro')
  divTableFour.setAttribute('style', 'position: absolute; zoom: 1; overflow: scroll; left: 0px; top: 0px; right: 0px; bottom: 0px;')
  divTableFour.addEventListener('scroll', oriScroll)

  divTableFour.appendChild(oldDivTable)
  divTableThree.appendChild(divTableFour)
  divTableTwo.appendChild(divTableThree)
  divTableOne.appendChild(divTableTwo)
  element.$el.appendChild(divTable).appendChild(divTableOne)
  divTable.insertBefore(divtHead, divTableOne)

  // generate scrollbar
  let divScrollOne = document.createElement('div')
  divScrollOne.setAttribute('class', 'heightScroll')
  divScrollOne.setAttribute('style', 'height: ' + oldDivTable.querySelector('table').clientHeight + 'px')
  let divScrollTwo = document.createElement('div')
  divScrollTwo.setAttribute('style', 'cursor: default;position: absolute; top: 0; right: 0; height: 100%; width: 100px; overflow-y: scroll; overflow-x: hidden;opacity: .7; filter: alpha(opacity=70); -webkit-transition: opacity 350ms; -moz-transition: opacity 350ms; -o-transition: opacity 350ms; transition: opacity 350ms;')
  divScrollTwo.setAttribute('class', 'tempScroll')
  divScrollTwo.addEventListener('scroll', tempVerticalScroll)
  let divScrollThree = document.createElement('div')
  divScrollThree.setAttribute('style', 'width: 16px; position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;overflow: hidden; direction: ltr;display: inline-block;')
  let divScrollFour = document.createElement('div')
  divScrollFour.setAttribute('style', 'position: absolute; overflow: hidden; top: 0px; right: 0px; bottom: 0px; width: 16px;')
  divTableTwo.appendChild(divScrollFour)
  divScrollFour.appendChild(divScrollThree)
  divScrollThree.appendChild(divScrollTwo)
  divScrollTwo.appendChild(divScrollOne)

  let divContentTable = document.createElement('div')
  divContentTable.setAttribute('class', 'dataTableContent')
  divContentTable.addEventListener('scroll', horizontalScroll)

  divContentTable.setAttribute('style', 'overflow-x: auto; overflow-y: hidden; height: calc(100vh - ' + toolbarHeight + 'px);')
  divContentTable.appendChild(divTable)
  divTable.setAttribute('style', 'min-width: 1000px; overflow: hidden; height: 100%;')
  oldDivTable.querySelector('table').setAttribute('style', 'table-layout: fixed;')
  divtHead.querySelector('table').setAttribute('style', 'table-layout: fixed;')
  element.$el.appendChild(divContentTable)
  element.tableCreated = true
}

export function resizeTable (element, getWindow, className) {
  let divTableOne = element.$el.querySelector('.OneBro')
  let divContentTable = element.$el.querySelector('.dataTableContent')
  let toolbars = element.$parent.$parent.$el.querySelectorAll('.toolbar')
  let toolbarHeight = 1
  let tHead = element.$el.querySelector('.headTableView table thead')
  let headTableHeight = 1
  if (tHead) {
    headTableHeight += tHead.clientHeight
    toolbars.forEach((item) => {
      toolbarHeight += item.clientHeight
    })

    let heightTable = toolbarHeight + headTableHeight
    if (getWindow.outerWidth > getWindow.innerWidth) {
      if (getWindow.innerWidth < 1000) {
        heightTable = toolbarHeight + headTableHeight + 16
      }
    } else {
      if (getWindow.outerWidth < 1000) {
        heightTable = toolbarHeight + headTableHeight + 16
      }
    }

    divTableOne.setAttribute('style', 'position: absolute; left: 0px; width: 100%; overflow: hidden; top: ' + (toolbarHeight + headTableHeight) + 'px; height: calc(100vh - ' + heightTable + 'px);')
    divContentTable.setAttribute('style', 'overflow-x: auto; overflow-y: hidden; height: calc(100vh - ' + toolbarHeight + 'px);')
  }
}

export function loadData (element, className, total) {
  let oldDivTable = element.$el.querySelector('.' + className + ' table tbody tr')
  let totalHeight = total * (oldDivTable.clientHeight)
  let divScrollOne = element.$el.querySelector('.heightScroll')
  divScrollOne.setAttribute('style', 'height: ' + totalHeight + 'px')
}

export function expandRow (element, className, position, colspan) {
  let tr = element.$el.querySelectorAll('.' + className + ' table tbody tr.datatable__expand-row')
  let td = tr[position].querySelector('td')
  tr[position].setAttribute('style', 'display: table-row')
  td.setAttribute('colspan', colspan)
}
