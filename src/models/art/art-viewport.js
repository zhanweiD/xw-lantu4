import {types, getParent, flow, getEnv, getRoot} from 'mobx-state-tree'
import {toJS} from 'mobx'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import isEmpty from 'lodash/isEmpty'
import {MZoom, viewport} from '@utils/zoom'
import commonAction from '@utils/common-action'
import {shortcut} from '@utils/create-event'
import createLog from '@utils/create-log'
import uuid from '@utils/uuid'
import {MArtFrame} from './art-frame'
import {MSelectRange} from './select-range'

const log = createLog('@models/art/art-viewport.js')

const getCoordinate = (rects) => {
  const minX = minBy(rects, (o) => o.x1_).x1_
  const minY = minBy(rects, (o) => o.y1_).y1_
  const maxX = maxBy(rects, (o) => o.x2_).x2_
  const maxY = maxBy(rects, (o) => o.y2_).y2_
  return {
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY,
  }
}

const MRect = types.model({
  x1: types.number,
  y1: types.number,
  x2: types.number,
  y2: types.number,
})

export const MArtViewport = types
  .model('MArtViewprot', {
    frames: types.optional(types.array(MArtFrame), []),

    // 存储框选状态，不必保存
    selectRange: types.maybe(MSelectRange),
    // 存储框选时的位置信息，不必保存
    drawRect: types.maybe(MRect),
    // 用于计算画布大小的数据，不必保存
    initMinX: types.optional(types.number, 0),
    initMinY: types.optional(types.number, 0),
    totalWidth: types.optional(types.number, 1),
    totalHeight: types.optional(types.number, 1),
    scaler: types.optional(types.number, 1),
    baseOffsetX: types.optional(types.number, 0),
    baseOffsetY: types.optional(types.number, 0),
    zoom: types.optional(MZoom, {}),
    isInit: types.optional(types.boolean, false),
    deepKeys: types.frozen(['frames']),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get art_() {
      return getParent(self)
    },
    get mainFrame_() {
      return self.frames.find((frame) => frame.isMain)
    },
    get activeTabId_() {
      return self.root_.editor.activeTabId
    },
  }))
  .actions(commonAction(['set', 'getSchema']))
  .actions((self) => {
    const defaultBackground = {
      options: {
        sections: {
          gradientColor: {
            effective: true,
            fields: {
              gradientColor: [
                ['rgb(0,56,144)', 0],
                ['rgb(0,22,82)', 0.5],
                ['rgb(0,7,61)', 1],
              ],
            },
          },
        },
      },
    }

    let removeShortcutDelete
    const afterCreate = () => {
      removeShortcutDelete = shortcut.add({
        keyName: 'commandDelete',
        keyDown: () => {
          const {artId} = self.art_
          if (artId === self.activeTabId_ && self.selectRange) {
            self.selectRange.remove()
          }
        },
      })
    }

    // 初始化缩放系数、画布摆放位置等
    const initZoom = () => {
      const {artId} = self.art_
      const updateViewportProps = () => {
        const {scaler, offsetX, offsetY} = self.zoom
        self.set({
          scaler,
          baseOffsetX: offsetX,
          baseOffsetY: offsetY,
        })
      }
      // 此句非常重要，它代表着初始化成功，页面应该正常展示，jsx页面需要根据此字段来判断是否展示画布等相关信息。
      self.isInit = true
      self.zoom.init(document.querySelector(`#art-viewport-${artId}`), {
        transform: () => {
          updateViewportProps()
        },
      })
    }

    // 初始化整个可视区域的宽高及其左上角的坐标
    const initXY = () => {
      const frames = self.frames.map((v) => {
        const {x, y, height, width} = v.layout
        return {
          x1_: x,
          y1_: y,
          x2_: x + width,
          y2_: y + height,
        }
      })
      const xy = getCoordinate(frames)
      const {x1, y1, x2, y2} = getCoordinate(self.frames)
      self.frames.forEach((item) => {
        item.viewLayout.set({
          x: item.x1_ - x1,
          y: item.y1_ - y1,
        })
      })
      self.initMinX = xy.x1
      self.initMinY = xy.y1
      self.totalWidth = x2 - x1
      self.totalHeight = y2 - y1
    }

    // 初始化画布
    const initFrame = ({frameId, name, isMain, layout, boxes, materials, background, groups}) => {
      const {exhibitCollection, event} = self.env_
      const {artId} = self.art_
      const frame = MArtFrame.create({
        frameId,
        artId,
        name,
        isMain,
        layout,
        viewLayout: layout,
        materials,
      })

      frame.background.setSchema(background || defaultBackground)
      self.frames.push(frame)
      boxes.forEach((box) => {
        frame.initBox(box)
      })
      // init组
      groups?.forEach((group) => {
        frame.initGroup(group)
      })
      if (materials) {
        materials.forEach((material) => {
          const model = exhibitCollection.get(`${material.lib}.${material.key}`)
          if (model) {
            const art = self.art_
            art.exhibitManager.set(
              material.id,
              model.initModel({
                art,
                schema: material,
                event,
              })
            )
          }
        })
      }
    }

    // 循环调用初始化画布，并调整布局
    const setSchema = ({frames}) => {
      frames.forEach((frame) => {
        initFrame(frame)
      })
      initXY()
    }

    // 可视化区域按住鼠标进行拖拽操作
    const onMouseDown = (mouseDownEvent) => {
      const {activeTool} = self.art_
      const {scaler} = self
      if (shortcut.space) return
      // 获取原点，以主画布的左上角为原点构建坐标系
      const origin = document.querySelector(`#artFrame-${self.mainFrame_.frameId}`).getBoundingClientRect()
      const originXY = {
        x: origin.x,
        y: origin.y,
      }
      // 所有的容器均取消选中状态
      self.frames.forEach((v) => {
        v.boxes.forEach((box) => {
          box.set({
            isSelected: false,
          })
        })
      })
      // 这里实际上是做了一次清除操作，清除选中状态及其临时绘制所存的草稿记录
      if (mouseDownEvent.target.closest('.artframeName') === null && mouseDownEvent.target.closest('.box') === null) {
        self.removeSelectRange()
      }
      self.drawRect = undefined
      let fixDiv
      const mouseMove = (mouseMoveEvent) => {
        if (!fixDiv) {
          // 按下鼠标之后初次进入到这里 记录鼠标位置信息准备绘制框选矩形
          fixDiv = document.createElement('div')
          fixDiv.style.position = 'fixed'
          fixDiv.style.top = `${mouseDownEvent.clientY}px`
          fixDiv.style.left = `${mouseDownEvent.clientX}px`
          fixDiv.style.border = '1px solid'
          document.body.appendChild(fixDiv)
        } else {
          // 鼠标移动过程中不断记录绘制的矩形的宽高，此时由于绘制方向的不确定性，宽高可能为负值，其会导致矩形的左上角坐标变化
          const width = mouseMoveEvent.clientX - mouseDownEvent.clientX
          const height = mouseMoveEvent.clientY - mouseDownEvent.clientY
          // 以初次按下鼠标的点为起点 进行绘制
          let x1 = mouseDownEvent.clientX
          let y1 = mouseDownEvent.clientY
          if (width < 0) {
            // 当计算宽度小于0时 矩形的左上角x坐标为起始x轴坐标加上宽度
            fixDiv.style.left = `${mouseDownEvent.clientX + width}px`
            x1 = mouseDownEvent.clientX + width
          } else {
            // 否则 矩形x坐标起始x轴坐标
            fixDiv.style.left = `${mouseDownEvent.clientX}px`
            x1 = mouseDownEvent.clientX
          }
          if (height < 0) {
            // 逻辑同x轴
            fixDiv.style.top = `${mouseDownEvent.clientY + height}px`
            y1 = mouseDownEvent.clientY + height
          } else {
            fixDiv.style.top = `${mouseDownEvent.clientY}px`
            y1 = mouseDownEvent.clientY
          }
          fixDiv.style.width = `${Math.abs(width)}px`
          fixDiv.style.height = `${Math.abs(height)}px`
          // 这里的坐标系实际上是针对视窗的坐标系 非实际逻辑中的坐标系 e.g. 设置宽高1920x1080的数据屏实际上在小屏幕展示为960x540
          // 需除以缩放系数才是有意义的
          // 由于是以主画布为原点来进行操作，主画布的坐标并不一定是(0, 0) 因此需要构建坐标系计算此时绘制的矩形的实际坐标
          const {layout} = self.mainFrame_
          const {x, y} = layout
          const offsetX = x1 - originXY.x
          const offsetY = y1 - originXY.y
          const logicX = Math.round(offsetX / scaler) + x
          const logicY = Math.round(offsetY / scaler) + y
          const range = {
            x1: logicX,
            y1: logicY,
            x2: Math.round(logicX + Math.abs(width) / scaler),
            y2: Math.round(logicY + Math.abs(height) / scaler),
          }
          // 此时 range对应的即是真实存放在后端以主画布左上角为原点的坐标
          self.set({
            drawRect: range,
          })
          if (activeTool === 'select') {
            // 需求: 当绘制矩形的时候 若与页面上的容器有交点 则容器高亮
            // 进一步提炼需求: 判断两个矩形相交
            // 如果重心的在x轴和y轴上的距离都比他们边长和的一半要小就符合相交的条件
            // 极限情况就是A矩形的右下角与B矩形的左上角相交一个点
            // 此时(ax1, ax2, ay1, ay2)和(bx1, bx2, by1, by2)重心在x轴和y轴的距离分别是 (ax2-ax1) / 2 + (bx2 -bx1) / 2与 (ay2-ay1) / 2 + (by2 -by1) / 2
            // 只要这两个距离分别小于此极限数值则必定相交 得出下列代码
            // 我已经写的十分详细了 别再说看不懂了 求求了
            self.frames.forEach((v) => {
              const boxes = v.boxes.filter(
                (b) =>
                  Math.max(range.x1, v.layout.x + b.x1_) <= Math.min(range.x2, v.layout.x + b.x2_) &&
                  Math.max(range.y1, v.layout.y + b.y1_) <= Math.min(range.y2, v.layout.y + b.y2_)
              )
              v.boxes.forEach((box) => {
                const value = boxes.some((b) => b.boxId === box.boxId)
                box.set('isSelected', value)
              })
            })
          }
        }
      }
      const mouseUp = () => {
        try {
          fixDiv && fixDiv.remove()
          const {drawRect} = self
          const {x1, y1, x2, y2} = drawRect
          if (activeTool === 'createFrame') {
            self.createFrame({
              x: x1,
              y: y1,
              width: Math.round(x2 - x1),
              height: Math.round(y2 - y1),
            })
          } else {
            const ranges = []
            // 这里的逻辑参考上面那段超长的注释，一个逻辑。这里的表层需求是框选框覆盖到的组件容器均被框选
            self.frames.forEach((v) => {
              const boxes = v.boxes.filter(
                (b) =>
                  Math.max(x1, v.layout.x + b.x1_) <= Math.min(x2, v.layout.x + b.x2_) &&
                  Math.max(y1, v.layout.y + b.y1_) <= Math.min(y2, v.layout.y + b.y2_)
              )
              if (boxes.length) {
                // 此处过滤不可被选中的box
                ranges.push({
                  frameId: v.frameId,
                  boxIds: boxes.map((b) => b.boxId),
                })
              }
            })
            if (!isEmpty(ranges)) {
              // 这里是为了让操作更平滑，否则会有粘滞感
              setTimeout(() => {
                self.toggleSelectRange({
                  target: 'box',
                  selectRange: ranges,
                })
              }, 40)
            }
          }
          document.body.removeEventListener('mousemove', mouseMove)
          document.body.removeEventListener('mouseup', mouseUp)
        } catch (error) {
          document.body.removeEventListener('mousemove', mouseMove)
          document.body.removeEventListener('mouseup', mouseUp)
        }
      }
      document.body.addEventListener('mousemove', mouseMove)
      document.body.addEventListener('mouseup', mouseUp)
    }

    // 删除框选状态
    const removeSelectRange = () => {
      // const {session} = self.env_
      self.selectRange = undefined
      // session.set('SKViewport', undefined)
    }

    // 创建画布
    const createFrame = flow(function* createFrame({x, y, height, width}) {
      const {artId, projectId} = self.art_
      const {io} = self.env_
      // 这里做法就相对来说比较有趣了，假设接口成功，先把位置等信息展示在可视区域同时发送请求给后端
      // 若成功则直接替换id 失败则在视图区域展示错误警告并询问是否重新执行保存。重新执行保存属于画布自身行为
      const id = uuid()
      const params = {
        name: `画布-${id.substring(0, 4)}`,
        layout: {x, y, height, width},
      }
      const frame = MArtFrame.create({
        frameId: id,
        artId,
        ...params,
        viewLayout: {},
        projectId,
      })
      frame.background.setSchema(defaultBackground)
      frame.viewLayout.set({
        x: x - self.initMinX,
        y: y - self.initMinY,
        width,
        height,
      })
      self.frames.push(frame)
      self.toggleSelectRange({
        target: 'frame',
        selectRange: [
          {
            frameId: id,
          },
        ],
      })
      const realFrame = self.frames.find((o) => o.frameId === id)
      try {
        const {frameId} = yield io.art.addFrame({
          ...params,
          ':projectId': projectId,
          ':artId': artId,
        })
        realFrame.set({
          frameId,
        })
        self.selectRange.range[0].frameId = frameId
      } catch (error) {
        realFrame.set({
          isCreateFail: true,
        })
        log.error('createFrame Error:', error)
      }
    })

    const removeFrame = () => {
      const {range} = self.selectRange
      self.frames = self.frames.filter((frame) => frame.frameId !== range[0].frameId)
      self.removeSelectRange()
    }

    const removeBoxes = () => {
      const {range} = self.selectRange
      range.forEach((v) => {
        const frame = self.frames.find((f) => f.frameId === v.frameId)
        frame.removeBoxes(v.boxIds)
      })
      self.removeSelectRange()
    }

    // 选中
    const toggleSelectRange = ({target, selectRange}) => {
      self.removeSelectRange()
      if (target === 'frame') {
        const frame = self.frames.find((f) => f.frameId === selectRange[0].frameId)
        self.selectRange = {
          target,
          range: [{frameId: frame.frameId}],
          x1: frame.x1_,
          y1: frame.y1_,
          x2: frame.x2_,
          y2: frame.y2_,
        }
      } else {
        const layouts = selectRange.map((value) => {
          const frame = self.frames.find((v) => v.frameId === value.frameId)
          const boxes = frame.boxes.filter((v) => value.boxIds.includes(v.boxId || v.uid))
          const {x1, y1, x2, y2} = getCoordinate(boxes)
          return {
            x1_: frame.x1_ + x1,
            y1_: frame.y1_ + y1,
            x2_: frame.x1_ + x2,
            y2_: frame.y1_ + y2,
          }
        })
        const {x1, y1, x2, y2} = getCoordinate(layouts)
        self.selectRange = {target, range: selectRange, x1, y1, x2, y2}
      }
    }

    // 选中图层
    const toggleSelectBox = (box, shiftKey) => {
      const {boxId, frameId} = box
      let boxIds = []

      if (shiftKey) {
        const {range = []} = self.selectRange || {}
        const have = range[0]?.boxIds?.find((item) => item === boxId)
        if (have) boxIds = range[0]?.boxIds?.filter((item) => item !== boxId)
        else boxIds = [...(range[0]?.boxIds || []), boxId]
      } else {
        boxIds = [boxId]
      }

      if (!boxIds.length) {
        removeSelectRange()
        return
      }

      toggleSelectRange({
        target: 'box',
        selectRange: [
          {
            frameId,
            boxIds,
          },
        ],
      })
    }

    const zoomSingleToView = () => {
      initXY()
      const frame = self.selectRange
        ? self.frames.find((f) => f.frameId === self.selectRange.range[0].frameId)
        : self.mainFrame_
      const {x, y, height, width} = frame.viewLayout
      self.zoom.update({
        x,
        y,
        height,
        width,
      })
      if (self.selectRange && self.selectRange.target === 'frame') {
        self.selectRange.set({
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        })
      }
    }

    const zoomAllToView = () => {
      initXY()
      console.log(toJS(self))
      self.zoom.update({
        x: 0,
        y: 0,
        height: self.totalHeight,
        width: self.totalWidth,
      })
      if (self.selectRange && self.selectRange.target === 'frame') {
        const {x, y, height, width} = self.frames.find(
          (f) => f.frameId === self.selectRange.range[0].frameId
        )?.viewLayout
        self.selectRange.set({
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        })
      }
    }

    // 当视窗改变时自动去改变可视化区域
    const resizeViewport = () => {
      viewport.update()
    }

    const beforeDestroy = () => {
      removeShortcutDelete()
    }

    return {
      // 生命周期函数
      afterCreate,
      beforeDestroy,
      // 初始化可视区域 & 设置可视区域中画布及组件的信息
      initZoom,
      setSchema,
      // 在画布中按住鼠标移动的事件，配合toolbar来进行操作
      onMouseDown,
      // 框选与删除框选
      toggleSelectRange,
      removeSelectRange,
      // 改变选中box
      toggleSelectBox,
      // 创建画布 & 删除画布
      createFrame,
      removeFrame,
      // 删除组件容器 之所以放在这个js里是因为牵扯到selectRange以及frames
      removeBoxes,
      // 缩放全部画布到可视区域 & 缩放选中画布到可视区域
      zoomAllToView,
      zoomSingleToView,
      resizeViewport,
    }
  })
