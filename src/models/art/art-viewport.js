import {getEnv, types, flow, getParent, getRoot} from "mobx-state-tree"
import {reaction} from "mobx"
import minBy from "lodash/minBy"
import maxBy from "lodash/maxBy"
import isEmpty from "lodash/isEmpty"
import commonAction from "@utils/common-action"
import {MZoom, viewport} from "@utils/zoom"
import uuid from "@utils/uuid"
import {shortcut} from "@utils/create-event"
import {MArtFrame} from "./art-frame"
import {MSelectRange} from "./select-range"

const MRect = types.model({
  x1: types.number,
  y1: types.number,
  height: types.number,
  width: types.number
})

const getCoordinate = (rects) => {
  const minX = minBy(rects, (o) => o.x1_).x1_
  const minY = minBy(rects, (o) => o.y1_).y1_
  const maxX = maxBy(rects, (o) => o.x2_).x2_
  const maxY = maxBy(rects, (o) => o.y2_).y2_
  return {
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY
  }
}

export const MArtViewport = types
  .model("MArtViewport", {
    id: types.number,
    projectId: types.maybe(types.number),
    frames: types.optional(types.array(MArtFrame), []),
    selected: types.maybe(types.reference(MArtFrame)),

    initMinX: types.optional(types.number, 0),
    initMinY: types.optional(types.number, 0),
    totalWidth: types.optional(types.number, 1),
    totalHeight: types.optional(types.number, 1),
    scaler: types.optional(types.number, 1),
    baseOffsetX: types.optional(types.number, 0),
    baseOffsetY: types.optional(types.number, 0),

    zoom: types.optional(MZoom, {}),
    drawRect: types.maybe(MRect),
    selectRange: types.maybe(MSelectRange),
    isGridVisible: types.optional(types.boolean, true),
    isBoxBackgroundVisible: types.optional(types.boolean, true),
    isSnap: types.optional(types.boolean, true),
    deepKeys: types.frozen(["frames"])
  })
  .views((self) => ({
    get art_() {
      return getParent(self)
    },
    get env_() {
      return getEnv(self)
    },
    get mainFrame_() {
      return self.frames.filter((frame) => frame.isMain)[0]
    },
    get activeTabId_() {
      return getRoot(self).editor.activeTabId
    }
  }))
  .actions(commonAction(["set", "selectItem", "selectNone", "getSchema"]))
  .actions((self) => {
    let removeShortcutDelete
    let removeShortcutBackspace
    const afterCreate = () => {
      removeShortcutDelete = shortcut.add({
        keyName: "delete",
        keyUp: () => {
          if (self.id === self.activeTabId_ && self.selectRange) {
            self.selectRange.remove()
          }
        }
      })
      removeShortcutBackspace = shortcut.add({
        keyName: "backspace",
        keyUp: () => {
          if (self.id === self.activeTabId_ && self.selectRange) {
            self.selectRange.remove()
          }
        }
      })
      reaction(
        () => {
          return {
            selectRange: self.selectRange && self.selectRange.toJSON()
          }
        },
        ({selectRange}) => {
          if (selectRange) {
            saveSession()
          }
        },
        {
          fireImmediately: true,
          delay: 300
        }
      )
    }

    const applySession = () => {
      const {session} = self.env_
      const sessionSchema = session.get(`SKViewport.${self.id}`)
      if (self.frames.length) {
        sessionSchema && self.set(sessionSchema)
      }
    }

    const saveSession = () => {
      const {session} = self.env_
      session.set(`SKViewport.${self.id}`, {
        selectRange: self.selectRange
      })
    }

    const removeSelectRange = () => {
      const {event, session} = self.env_
      self.selectRange = undefined
      event.fire(`art.${self.id}.art-option.clearTab`)
      session.set("SKViewport", undefined)
    }

    const viewportClick = (e) => {
      // panzoom过程中，不触发此选中和取消选中的行为
      if (shortcut.space) {
        return
      }

      // 从点击元素一直查找到画板容器，如果没有找到boxContainer，则取消所有选中的box
      if (
        e.target.closest(".artframeName") === null &&
        e.target.closest(".box") === null
      ) {
        // NOTE 临时先取消画布的选中状态
        self.selectNone()
        self.removeSelectRange()
      }
    }

    const initZoom = () => {
      const updateViewportProps = () => {
        const {scaler, offsetX, offsetY} = self.zoom
        self.set({
          scaler,
          baseOffsetX: offsetX,
          baseOffsetY: offsetY
        })
        if (self.zoomStatus) {
          self.set({
            zoomStatus: "transform"
          })
        }
      }
      self.zoom.init(document.querySelector(`#art-viewport-${self.id}`), {
        transform: () => {
          updateViewportProps()
        }
      })
    }

    const initFrame = ({artId, frameId, name, isMain, layout, boxes}) => {
      const frame = MArtFrame.create({
        id: `${frameId}`,
        frameId,
        artId,
        name,
        isMain,
        projectId: self.projectId,
        layout,
        logicLayout: layout
      })
      self.frames.push(frame)
      boxes.forEach((box) => {
        frame.initBox(box)
      })
    }

    const initXY = () => {
      const frames = self.frames.map((v) => {
        const {x, y, height, width} = v.logicLayout
        return {
          x1_: x,
          y1_: y,
          x2_: x + width,
          y2_: y + height
        }
      })
      const logicXY = getCoordinate(frames)

      const {x1, y1, x2, y2} = getCoordinate(self.frames)

      // 更新每个画布的左上角坐标
      self.frames.forEach((item) => {
        item.layout.set({
          x: item.x1_ - x1,
          y: item.y1_ - y1
        })
      })
      self.initMinX = logicXY.x1
      self.initMinY = logicXY.y1
      self.totalWidth = x2 - x1
      self.totalHeight = y2 - y1
    }

    const setSchema = ({projectId, frames}) => {
      self.projectId = projectId
      frames.forEach((frame) => {
        initFrame(frame)
      })
      self.initXY()
      applySession()
    }

    const onMouseDown = (mouseDownEvent) => {
      if (shortcut.space) {
        return
      }
      const origin = document
        .querySelector(`#artFrame-${self.mainFrame_.id}`)
        .getBoundingClientRect()
      const originXY = {
        x: origin.x,
        y: origin.y
      }
      self.frames.forEach((v) => {
        v.boxes.forEach((box) => {
          box.set("isSelected", false)
        })
      })
      const {artToolbar} = self.art_
      const {activeTool} = artToolbar
      const {scaler} = self
      self.viewportClick(mouseDownEvent)

      // !! 这里有个很坑的点在于不可以直接使用onMouseUp和onMouseMove 会触发不到mouseUp
      self.drawRect = undefined
      let fixDiv
      const mouseMove = (mouseMoveEvent) => {
        if (!fixDiv) {
          fixDiv = document.createElement("div")
          fixDiv.style.position = "fixed"
          fixDiv.style.top = `${mouseDownEvent.clientY}px`
          fixDiv.style.left = `${mouseDownEvent.clientX}px`
          fixDiv.style.border = "1px solid"
          document.body.appendChild(fixDiv)
        } else {
          const width = mouseMoveEvent.clientX - mouseDownEvent.clientX
          const height = mouseMoveEvent.clientY - mouseDownEvent.clientY
          let x1 = mouseDownEvent.clientX
          let y1 = mouseDownEvent.clientY
          if (width < 0) {
            fixDiv.style.left = `${mouseDownEvent.clientX + width}px`
            x1 = mouseDownEvent.clientX + width
          } else {
            fixDiv.style.left = `${mouseDownEvent.clientX}px`
            x1 = mouseDownEvent.clientX
          }
          if (height < 0) {
            fixDiv.style.top = `${mouseDownEvent.clientY + height}px`
            y1 = mouseDownEvent.clientY + height
          } else {
            fixDiv.style.top = `${mouseDownEvent.clientY}px`
            y1 = mouseDownEvent.clientY
          }
          fixDiv.style.width = `${Math.abs(width)}px`
          fixDiv.style.height = `${Math.abs(height)}px`
          // 这里的坐标系实际上是针对视窗的坐标系 非实际逻辑中的坐标系，需除以缩放系数才是有意义的
          self.setRect({
            x1,
            y1,
            width: Math.abs(width),
            height: Math.abs(height)
          })
          if (activeTool === "select") {
            const {logicLayout} = self.mainFrame_
            const {x, y} = logicLayout
            const offsetX = x1 - originXY.x
            const offsetY = y1 - originXY.y
            const logicX = Math.round(offsetX / scaler) + x
            const logicY = Math.round(offsetY / scaler) + y
            const range = {
              x1: logicX,
              y1: logicY,
              x2: Math.round(logicX + Math.abs(width) / scaler),
              y2: Math.round(logicY + Math.abs(height) / scaler)
            }
            self.frames.forEach((v) => {
              const boxes = v.boxes.filter(
                (b) =>
                  Math.max(range.x1, v.logicLayout.x + b.x1_) <=
                    Math.min(range.x2, v.logicLayout.x + b.x2_) &&
                  Math.max(range.y1, v.logicLayout.y + b.y1_) <=
                    Math.min(range.y2, v.logicLayout.y + b.y2_)
              )
              v.boxes.forEach((box) => {
                const value = boxes.some((b) => b.boxId === box.boxId)
                box.set("isSelected", value)
              })
            })
          }
        }
      }

      const mouseUp = () => {
        fixDiv && fixDiv.remove()
        if (!self.drawRect) {
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
          return
        }

        const {drawRect} = self
        const {x1, y1, height, width} = drawRect
        const {logicLayout} = self.mainFrame_
        const {x, y} = logicLayout
        const offsetX = x1 - originXY.x
        const offsetY = y1 - originXY.y
        //  逻辑坐标系中的位置,针对主画布为原点
        const logicX = Math.round(offsetX / scaler) + x
        const logicY = Math.round(offsetY / scaler) + y
        if (activeTool === "createFrame") {
          self.createFrame({
            x: logicX,
            y: logicY,
            width: Math.round(width / scaler),
            height: Math.round(height / scaler),
            projectId: self.projectId,
            artId: self.id
          })
        } else if (activeTool === "select") {
          const range = {
            x1: logicX,
            y1: logicY,
            x2: Math.round(logicX + width / scaler),
            y2: Math.round(logicY + height / scaler)
          }
          const ranges = []
          self.frames.forEach((v) => {
            const boxes = v.boxes.filter(
              (b) =>
                Math.max(range.x1, v.logicLayout.x + b.x1_) <=
                  Math.min(range.x2, v.logicLayout.x + b.x2_) &&
                Math.max(range.y1, v.logicLayout.y + b.y1_) <=
                  Math.min(range.y2, v.logicLayout.y + b.y2_)
            )
            if (boxes.length) {
              ranges.push({
                frameId: v.frameId,
                boxIds: boxes.map((b) => b.boxId)
              })
            }
          })
          if (!isEmpty(ranges)) {
            // ! 这里是为了让操作更平滑，否则会有粘滞感
            setTimeout(() => {
              self.toggleSelectRange({
                target: "box",
                selectRange: ranges
              })
            }, 40)
          }
        }
        document.body.removeEventListener("mousemove", mouseMove)
        document.body.removeEventListener("mouseup", mouseUp)
      }
      document.body.addEventListener("mousemove", mouseMove)
      document.body.addEventListener("mouseup", mouseUp)
    }

    const setRect = (selectRangeRect) => {
      self.drawRect = selectRangeRect
    }

    const createFrame = flow(function* createFrame(params) {
      const {x, y, height, width, projectId, artId} = params
      try {
        const {io} = self.env_
        const {frameId, isMain, name, layout} = yield io.art.addFrame({
          name: `画布-${uuid().substring(0, 4)}`,
          layout: {x, y, height, width},
          ":projectId": projectId,
          ":artId": artId
        })

        const frame = MArtFrame.create({
          id: `${frameId}`,
          frameId,
          artId,
          name,
          isMain,
          layout: {},
          logicLayout: layout,
          projectId: self.projectId
        })
        frame.layout.set({
          x: x - self.initMinX,
          y: y - self.initMinY,
          width,
          height
        })
        self.frames.push(frame)
        self.selectItem(frame)
        self.toggleSelectRange({
          target: "frame"
        })
      } catch (error) {
        console.log(error)
      }
    })

    const removeFrame = () => {
      self.frames = self.frames.filter(
        (f) => f.frameId !== self.selected.frameId
      )
      self.removeSelectRange()
      self.selected = undefined
    }

    const removeBoxes = () => {
      const {range} = self.selectRange
      range.forEach((v) => {
        const frame = self.frames.filter((f) => f.frameId === v.frameId)[0]
        frame.removeBoxes(v.boxIds)
      })
      self.removeSelectRange()
    }
    const toggleSelectRange = ({target, selectRange}) => {
      self.removeSelectRange()
      if (target === "frame") {
        const frame = self.selected
        self.selectRange = {
          target,
          range: [
            {
              frameId: frame.frameId
            }
          ],
          x1: frame.x1_,
          y1: frame.y1_,
          x2: frame.x2_,
          y2: frame.y2_
        }
      } else if (target === "box") {
        const layouts = selectRange.map((value) => {
          const frame = self.frames.filter(
            (v) => v.frameId === value.frameId
          )[0]
          const boxes = frame.boxes.filter((v) =>
            value.boxIds.includes(v.boxId)
          )
          const {x1, y1, x2, y2} = getCoordinate(boxes)
          return {
            x1_: frame.x1_ + x1,
            y1_: frame.y1_ + y1,
            x2_: frame.x1_ + x2,
            y2_: frame.y1_ + y2
          }
        })
        const {x1, y1, x2, y2} = getCoordinate(layouts)
        self.selectRange = {
          target,
          range: selectRange,
          x1,
          y1,
          x2,
          y2
        }
      }
    }

    const beforeDestroy = () => {
      removeShortcutDelete()
      removeShortcutBackspace()
    }

    const zoomSingleToView = () => {
      self.initXY(false)
      const frame = self.selected || self.mainFrame_
      const {x, y, height, width} = frame.layout
      self.zoom.update({
        x,
        y,
        height,
        width
      })

      if (self.selected) {
        self.selectRange.set({
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height
        })
      }
    }

    const zoomAllToView = () => {
      self.initXY()
      self.zoom.update({
        x: 0,
        y: 0,
        height: self.totalHeight,
        width: self.totalWidth
      })

      if (self.selected) {
        const {x, y, height, width} = self.selected.layout
        self.selectRange.set({
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height
        })
      }
      self.zoomStatus = "init"
    }

    const resizeViewport = () => {
      viewport.update()
      if (self.zoomStatus !== "transform") {
        self.zoomAllToView()
      }
    }

    return {
      afterCreate,
      beforeDestroy,
      initXY,
      initZoom,
      setSchema,
      onMouseDown,
      viewportClick,
      setRect,
      createFrame,
      removeFrame,
      removeBoxes,
      toggleSelectRange,
      zoomAllToView,
      zoomSingleToView,
      resizeViewport,
      removeSelectRange
    }
  })
