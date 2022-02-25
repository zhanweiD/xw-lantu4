const doc = document
const win = window

// 鼠标拖拽类

export default class Drag {
  // 拖拽起点
  startPageX

  // 拖拽起点
  startPageY

  // 上一次拖拽结束后的移动距离记录
  lastDeltaX = 0

  lastDeltaY = 0

  // 本次拖拽的累积移动距离
  deltaX = 0

  deltaY = 0

  maxDeltaX

  minDeltaX

  maxDeltaY

  minDeltaY

  // 某一时刻的起点
  // basePageX

  // 某一时刻的起点
  // basePageY

  // 正在移动的标识
  moving = false

  constructor({handler, target, start = () => {}, move = () => {}, end = () => {}}) {
    this.handler = handler
    this.target = target
    this.handler.addEventListener('mousedown', this, false)
    this.start = start
    this.move = move
    this.end = end
    // console.log('new drag')
  }

  handleEvent(e) {
    switch (e.type) {
      case 'mousedown':
        this._start(e)
        break
      case 'mousemove':
        this._move(e)
        break
      case 'mouseup':
        this._end(e)
        break
      default:
        break
    }
  }

  _start(e) {
    if (e.target && e.target.closest('.stopDrag') !== null) {
      return
    }

    // 禁止选中
    doc.body.classList.add('noSelect')

    const {pageX, pageY} = e
    this.startPageX = pageX
    this.startPageY = pageY
    // this.basePageX = pageX
    // this.basePageY = pageY

    const {x, y, width, height} = this.target.getBoundingClientRect()

    this.maxDeltaX = win.innerWidth - x - 100
    this.maxDeltaY = win.innerHeight - y - 100
    this.minDeltaX = (width + x - 100) * -1
    this.minDeltaY = (height + y - 100) * -1

    doc.addEventListener('mousemove', this, false)
    doc.addEventListener('mouseup', this, false)
  }

  _move(e) {
    const {pageX, pageY} = e

    // 任意时刻的位移值
    // let distX
    // let distY

    const originDeltaX = pageX - this.startPageX
    const originDeltaY = pageY - this.startPageY

    this.deltaX =
      originDeltaX > this.maxDeltaX ? this.maxDeltaX : originDeltaX < this.minDeltaX ? this.minDeltaX : originDeltaX
    this.deltaY =
      originDeltaY > this.maxDeltaY ? this.maxDeltaY : originDeltaY < this.minDeltaY ? this.minDeltaY : originDeltaY

    // 如果已经开始移动
    if (this.moving) {
      // distX = pageX - this.basePageX
      // distY = pageY - this.basePageY
      this.move({
        // distX,
        // distY,
        deltaX: this.deltaX,
        deltaY: this.deltaY,
      })

      if (this.target) {
        this.target.style.transform = `matrix(1, 0, 0, 1, ${this.lastDeltaX + this.deltaX}, ${
          this.lastDeltaY + this.deltaY
        })`
      }
    } else if (Math.abs(this.deltaX) > 1 || Math.abs(this.deltaY) > 1) {
      this.moving = true
    }

    // this.basePageX = pageX
    // this.basePageY = pageY
  }

  _end() {
    // 恢复禁止选中
    doc.body.classList.remove('noSelect')

    this.moving = false
    this.lastDeltaX += this.deltaX
    this.lastDeltaY += this.deltaY
    this.deltaX = 0
    this.deltaY = 0

    doc.removeEventListener('mousemove', this, false)
    doc.removeEventListener('mouseup', this, false)
  }

  destroy() {
    this.handler.removeEventListener('mousedown', this, false)
  }
}
