/* eslint-disable no-unused-vars */
// window.onload = function () {
//   initDragElement()
//   initResizeElement()
// }

export function initResizeElement({target}) {
  const popups = document.querySelectorAll(target)
  let element = null
  let startX
  let startY
  let startWidth
  let startHeight

  for (let i = 0; i < popups.length; i++) {
    const p = popups[i]

    const right = document.createElement('div')
    right.className = 'resizer-right'
    p.appendChild(right)
    right.addEventListener('mousedown', initDrag, false)
    right.parentPopup = p

    // const bottom = document.createElement('div')
    // bottom.className = 'resizer-bottom'
    // p.appendChild(bottom)
    // bottom.addEventListener('mousedown', initDrag, false)
    // bottom.parentPopup = p

    // const both = document.createElement('div')
    // both.className = 'resizer-both'
    // p.appendChild(both)
    // both.addEventListener('mousedown', initDrag, false)
    // both.parentPopup = p
  }

  function initDrag(e) {
    element = this.parentPopup

    startX = e.clientX
    startY = e.clientY
    startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
    document.documentElement.addEventListener('mousemove', doDrag, false)
    document.documentElement.addEventListener('mouseup', stopDrag, false)
  }

  function doDrag(e) {
    const width = startWidth + e.clientX - startX
    // const height = startHeight + e.clientY - startY
    element.style.width = `${width}px`
    // element.style.height = `${height}px`
  }

  function stopDrag() {
    document.documentElement.removeEventListener('mousemove', doDrag, false)
    document.documentElement.removeEventListener('mouseup', stopDrag, false)
  }
}

export default initResizeElement
