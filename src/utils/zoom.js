import {types} from "mobx-state-tree"
import panzoom from "panzoom"
import isPlainObject from "lodash/isPlainObject"
import isString from "lodash/isString"
import round from "lodash/round"
import createEvent from "./create-event"

/**
 * 全局共享的可视区域的尺寸数据
 * ! 多个大屏Tab在缩放内容的时候，都不需要重复计算
 * ! 当浏览器窗口有缩放的时候，该模型自身负责更新
 */
// NOTE 目标：在大屏的运行时也可以独立运行
const MViewport = types
  .model("MViewport", {
    width: types.maybe(types.number),
    height: types.maybe(types.number),
    isSpaceKeyDown: types.optional(types.boolean, false)
  })
  .views((self) => ({
    // 可视区域的宽高比
    get ratio() {
      return self.width / self.height
    }
  }))
  .actions((self) => {
    let viewportEl

    // 全局仅初始化一次
    // NOTE 目标：解耦大屏的运行时和编辑状态，enhance回调函数用于在编辑环境下的增强行为
    const init = (el, enhance = () => {}) => {
      viewportEl = el
      self.update()
      enhance()

      let timer
      window.addEventListener("resize", () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          self.update()
        }, 600)
      })
    }

    // 更新数据
    const update = () => {
      const {width, height} = viewportEl.getBoundingClientRect()
      self.width = width
      self.height = height
    }

    return {
      init,
      update,
      set(key, value) {
        if (isString(key)) {
          self[key] = value
        } else if (isPlainObject(key)) {
          Object.entries(key).forEach(([k, v]) => (self[k] = v))
        }
      }
    }
  })

export const viewport = MViewport.create()

// NOTE 目标：解耦大屏的运行时和编辑状态
// NOTE 因为缩放模型是Art模型的子节点，所以该模型不应该依赖任何上游模型
export const MZoom = types
  .model("MZoom", {
    /**
     * 原始数据
     */
    // 缩放目标的原始尺寸
    originWidth: types.maybe(types.number),
    originHeight: types.maybe(types.number),
    // 缩放目标的宽高比
    originRatio: types.maybe(types.number),
    // NOTE 内部实现的思路是，为了性能，全局只有唯一的可视区域元素(由viewport.init()初始化时确定)，但不同的Tab的可视区域是有变化的，比如Art类型的Tab有ArtToolBar区域，这个区域的宽度是需要修复掉的，xxxFix参数就是用于抽象这种修复，所有Tab实例NOTE 都可以实现私有的可视区域大小
    viewportWidthFix: types.optional(types.number, 0),
    viewportHeightFix: types.optional(types.number, 0),
    /**
     * 缩放数据
     */
    // zoom/pan的偏移量
    offsetX: types.optional(types.number, 0),
    offsetY: types.optional(types.number, 0),
    // 缩放系数
    scaler: types.optional(types.number, 1),
    // panzoom的的缩放实例
    zoom: types.frozen()
  })
  .views((self) => ({
    // NOTE 经验：
    // - view属性的计算可以使用外部的模型实例属性，如这里的viewport.width
    // - view属性可以嵌套
    get viewportWidth() {
      return viewport.width + self.viewportWidthFix
    },
    get viewportHeight() {
      return viewport.height + self.viewportHeightFix
    },
    get viewportRatio() {
      return self.viewportWidth / self.viewportHeight
    }
  }))
  .actions((self) => {
    const zoomEvent = createEvent()

    // 实例化panzoom实例
    // NOTE 实例化之后根据session记录判断，执行默认缩放或恢复缩放
    const init = (zoomTargetEl, events = {}) => {
      // 原始数据初始化
      const {width: originWidth, height: originHeight} = zoomTargetEl.getBoundingClientRect()

      self.originWidth = originWidth
      self.originHeight = originHeight
      self.originRatio = originWidth / originHeight

      Object.entries(events).forEach(([name, fn]) => {
        zoomEvent.on(name, fn)
      })

      // 文档地址：https://github.com/anvaka/panzoom
      self.zoom = panzoom(zoomTargetEl, {
        // NOTE 官方文档里没有autocenter参数，demo里有
        // NOTE 当目标元素在初始化时就需要缩放到可视窗口中间时，设置为true。
        autocenter: true,
        // 1表示禁止双击缩放
        zoomDoubleClickSpeed: 1,
        beforeWheel() {
          return !viewport.isSpaceKeyDown
        },
        beforeMouseDown() {
          return !viewport.isSpaceKeyDown
        }
      })

      // 首次触发下面的zoomend和panend之前，要同步模型属性，供外部使用
      const {scale: initScale, x: initX, y: initY} = self.zoom.getTransform()

      self.set({
        scaler: round(initScale, 5),
        offsetX: round(initX, 3),
        offsetY: round(initY, 3)
      })

      zoomEvent.fire("transform")

      // 下面是基于panzoom缺陷而做的临时方案，panzoom自身的zoomend有bug，按照官方文档，并不触发
      // let zoomEndTimer

      self.zoom.on("zoom", () => {
        const {scale, x, y} = self.zoom.getTransform()

        self.set({
          scaler: round(scale, 5),
          offsetX: round(x, 3),
          offsetY: round(y, 3)
        })

        zoomEvent.fire("zoom")
        zoomEvent.fire("transform")
      })

      self.zoom.on("panstart", () => {
        document.body.classList.add("cursorGrabing")
        zoomEvent.fire("panstart")
        zoomEvent.fire("transform")
      })

      self.zoom.on("pan", () => {
        const {x, y} = self.zoom.getTransform()

        self.set({
          offsetX: round(x, 3),
          offsetY: round(y, 3)
        })
        zoomEvent.fire("pan")
        zoomEvent.fire("transform")
      })

      self.zoom.on("panend", () => {
        document.body.classList.remove("cursorGrabing")
        zoomEvent.fire("panend")
        zoomEvent.fire("transform")
        // self.saveSession()
      })
    }

    const beforeDestroy = () => {
      zoomEvent.off("zoomstart")
      zoomEvent.off("zoom")
      zoomEvent.off("zoomend")
      zoomEvent.off("panstart")
      zoomEvent.off("pan")
      zoomEvent.off("panend")

      if (self.zoom && self.zoom.dispose) {
        self.zoom.dispose()
      }
    }

    const set = (key, value) => {
      if (isString(key)) {
        self[key] = value
      } else if (isPlainObject(key)) {
        Object.entries(key).forEach(([k, v]) => (self[k] = v))
      }
    }

    const update = ({x, y, height, width}) => {
      const {viewportWidth, viewportHeight} = self
      const dh = viewportHeight / height
      const dw = viewportWidth / width
      const scaler = Math.min(dw, dh)
      self.zoom.zoomAbs(0, 0, scaler)
      const transformX = -(x + width / 2) * scaler + viewportWidth / 2
      const transformY = -(y + height / 2) * scaler + viewportHeight / 2
      self.zoom.moveTo(transformX, transformY)
    }

    const {on, off} = zoomEvent

    return {
      init,
      beforeDestroy,
      set,
      on,
      off,
      update
    }
  })
