import {types, flow, getParent} from 'mobx-state-tree'
import onerStorage from 'oner-storage'
import io from '@utils/io'
import cloneDeep from 'lodash/cloneDeep'
import createEvent from '@utils/create-event'
import createLog from '@utils/create-log'
import commonAction from '@utils/common-action'
import tip from '@components/tip'
import CryptoJS from 'crypto-js'
import encryptionType from '@utils/base64-decode'
import {registerExhibit} from '@exhibit-collection'
import {MZoom} from '@utils/zoom'
import {MData} from '../data2/data'
import {MOffset} from './art-ui-tab-property'

const log = createLog('@models/art/art-preview.js')
const event = createEvent()

const MBox = types
  .model('MBoxPreview', {
    boxId: types.number,
    exhibit: types.frozen(),
    layout: types.frozen(),
    materials: types.frozen(),
    background: types.frozen(),
    padding: types.optional(MOffset, {}),
    constraints: types.frozen(),
    constraintValue: types.frozen(),
    visible: types.boolean,
    actionParams: types.frozen(),
  })
  .views((self) => ({
    get art_() {
      return getParent(self, 4)
    },
    get frame_() {
      return getParent(self, 2)
    },
    get backgroundImage_() {
      if (self.background.options.sections.gradientColor.effective) {
        return self.background.options.sections.gradientColor.fields.gradientColor.reduce((total, current) => {
          total += `${current[0]} ${current[1] * 100}%`
          if (current[1] !== 1) {
            total += `,`
          }
          return total
        }, '')
      }
      return undefined
    },
    get backgroundColor_() {
      if (self.background.options.sections.singleColor.effective) {
        const rgb = self.background.options.sections.singleColor.fields.singleColor.match(/[\d.]+/g)
        const opatity = self.background.options.sections.singleColor.fields.opacity
        if (rgb && rgb.length >= 3) {
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opatity})`
        }
        return self.background.options.sections.singleColor.fields.singleColor
      }
      return undefined
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const resize = () => {
      const {layout, padding} = self
      const {width, height} = layout
      const {areaOffset} = padding.getData()
      const [top, right, bottom, left] = areaOffset
      if (self.exhibit) {
        const exhibitModel = self.art_.exhibitManager.get(self.exhibit.id)
        if (exhibitModel.adapter) {
          exhibitModel.adapter.refresh(width - left - right, height - top - bottom)
        }
      }
      if (self.materials) {
        self.materials.forEach((material) => {
          const materialModel = self.art_.exhibitManager.get(material.id)
          if (materialModel.adapter) {
            materialModel.adapter.refresh(width - left - right, height - top - bottom)
          }
        })
      }
    }
    const update = () => {
      const {layout} = self.frame_
      if (self.constraints.ctString === 'tlwh') {
        const {top, left, width, height} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: top,
            height,
            width,
          },
        })
      }
      if (self.constraints.ctString === 'trlh') {
        const {top, left, right, height} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: top,
            height,
            width: layout.width - right - left,
          },
        })
      }

      if (self.constraints.ctString === 'trwh') {
        const {top, right, width, height} = self.constraintValue

        self.set({
          layout: {
            x: layout.width - right - width,
            y: top,
            height,
            width,
          },
        })
      }
      if (self.constraints.ctString === 'tblw') {
        const {top, bottom, width, left} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: top,
            height: layout.height - top - bottom,
            width,
          },
        })
      }
      // 中间
      if (self.constraints.ctString === 'trbl') {
        const {top, left, right, bottom} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: top,
            height: layout.height - top - bottom,
            width: layout.width - right - left,
          },
        })
      }
      if (self.constraints.ctString === 'trbw') {
        const {top, bottom, right, width} = self.constraintValue

        self.set({
          layout: {
            x: layout.width - right - width,
            y: top,

            height: layout.height - top - bottom,
            width,
          },
        })
      }

      if (self.constraints.ctString === 'blwh') {
        const {left, bottom, width, height} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: layout.height - bottom - height,
            height,
            width,
          },
        })
      }
      if (self.constraints.ctString === 'rblh') {
        const {left, bottom, right, height} = self.constraintValue

        self.set({
          layout: {
            x: left,
            y: layout.height - bottom - height,
            height,
            width: layout.width - right - left,
          },
        })
      }
      if (self.constraints.ctString === 'rbwh') {
        const {bottom, right, width, height} = self.constraintValue

        self.set({
          layout: {
            x: layout.width - right - width,
            y: layout.height - bottom - height,
            height,
            width,
          },
        })
      }
      self.resize()
    }
    let initVisible = self.visible
    const afterCreate = () => {
      initVisible = self.visible
    }
    const actions = {
      show: () => {
        self.visible = true
      },
      hidden: () => {
        self.visible = false
      },
      toggle_visible: () => {
        self.visible = !self.visible
      },
      data_effect: (v) => {
        self.actionParams = v
      },
      reset: () => {
        // 目前reset只针对显示隐藏属性
        self.visible = initVisible
      },
    }
    const dipatchAction = function (actionType, ...restParams) {
      actions[actionType].apply(self, restParams)
    }
    return {
      resize,
      update,
      dipatchAction,
      afterCreate,
    }
  })

const MFrame = types
  .model('MFramePreview', {
    frameId: types.number,
    originLayout: types.frozen(),
    layout: types.frozen(),
    isMain: types.optional(types.boolean, false),
    background: types.frozen(),
    boxes: types.optional(types.array(MBox), []),
    materials: types.frozen(),
    global: types.frozen(),
  })
  .views((self) => ({
    get art_() {
      return getParent(self, 2)
    },
    get backgroundImage_() {
      if (self.background.options.sections.gradientColor.effective) {
        return self.background.options.sections.gradientColor.fields.gradientColor.reduce((total, current) => {
          total += `${current[0]} ${current[1] * 100}%`
          if (current[1] !== 1) {
            total += `,`
          }
          return total
        }, '')
      }
      return undefined
    },
    get backgroundColor_() {
      if (self.background.options.sections.singleColor.effective) {
        const rgb = self.background.options.sections.singleColor.fields.singleColor.match(/[\d.]+/g)
        const opatity = self.background.options.sections.singleColor.fields.opacity
        if (rgb && rgb.length >= 3) {
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opatity})`
        }
        return self.background.options.sections.singleColor.fields.singleColor
      }
      return undefined
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const initBox = ({boxId, exhibit, layout, materials, background, padding, constraints, ...rest}) => {
      const box = MBox.create({
        boxId,
        exhibit,
        materials,
        background,
        padding,
        constraints,
        ...rest,
      })
      if (constraints.ctString === 'tlwh') {
        const top = layout.y - self.originLayout.y
        const left = layout.x - self.originLayout.x
        const height = layout.height
        const width = layout.width
        box.set({
          layout: {
            x: left,
            y: top,
            height,
            width,
          },
          constraintValue: {
            top,
            left,
            height,
            width,
          },
        })
      }
      if (constraints.ctString === 'trlh') {
        const top = layout.y - self.originLayout.y
        const left = layout.x - self.originLayout.x
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        const height = layout.height
        box.set({
          layout: {
            x: left,
            y: top,
            height,
            width: self.layout.width - right - left,
          },
          constraintValue: {
            top,
            left,
            right,
            height,
          },
        })
      }
      if (constraints.ctString === 'trwh') {
        const top = layout.y - self.originLayout.y
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        const height = layout.height
        const width = layout.width
        box.set({
          layout: {
            x: self.layout.width - right - width,
            y: top,
            height,
            width,
          },
          constraintValue: {
            top,
            right,
            width,
            height,
          },
        })
      }
      if (constraints.ctString === 'tblw') {
        const top = layout.y - self.originLayout.y
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const left = layout.x - self.originLayout.x
        const width = layout.width
        box.set({
          layout: {
            x: left,
            y: top,
            height: self.layout.height - top - bottom,
            width,
          },
          constraintValue: {
            top,
            bottom,
            width,
            left,
          },
        })
      }
      // 中间
      if (constraints.ctString === 'trbl') {
        const top = layout.y - self.originLayout.y
        const left = layout.x - self.originLayout.x
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        box.set({
          layout: {
            x: left,
            y: top,
            height: self.layout.height - top - bottom,
            width: self.layout.width - right - left,
          },
          constraintValue: {
            top,
            left,
            bottom,
            right,
          },
        })
      }
      if (constraints.ctString === 'trbw') {
        const top = layout.y - self.originLayout.y
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        const width = layout.width
        box.set({
          layout: {
            x: self.layout.width - right - width,
            y: top,
            height: self.layout.height - top - bottom,
            width,
          },
          constraintValue: {
            top,
            bottom,
            right,
            width,
          },
        })
      }
      if (constraints.ctString === 'blwh') {
        const left = layout.x - self.originLayout.x
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const height = layout.height
        const width = layout.width
        box.set({
          layout: {
            x: left,
            y: self.layout.height - bottom - height,
            height,
            width,
          },
          constraintValue: {
            left,
            bottom,
            width,
            height,
          },
        })
      }
      if (constraints.ctString === 'rblh') {
        const left = layout.x - self.originLayout.x
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const height = layout.height
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        box.set({
          layout: {
            x: left,
            y: self.layout.height - bottom - height,
            height,
            width: self.layout.width - right - left,
          },
          constraintValue: {
            left,
            bottom,
            right,
            height,
          },
        })
      }
      if (constraints.ctString === 'rbwh') {
        const right = self.originLayout.x + self.originLayout.width - (layout.x + layout.width)
        const bottom = self.originLayout.y + self.originLayout.height - (layout.y + layout.height)
        const height = layout.height
        const width = layout.width

        box.set({
          layout: {
            x: self.layout.width - right - width,
            y: self.layout.height - bottom - height,
            height,
            width,
          },
          constraintValue: {
            bottom,
            right,
            width,
            height,
          },
        })
      }
      box.padding.setSchema(padding)

      self.boxes.push(box)
      if (exhibit) {
        const model = registerExhibit(exhibit.key)
        if (model) {
          const art = self.art_
          art.exhibitManager.set(
            exhibit.id,
            model.initModel({
              art,
              boxId,
              schema: exhibit,
              event,
            })
          )
        }
      }
      if (materials) {
        materials.forEach((material) => {
          const model = registerExhibit(material.key)
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
    const resize = () => {
      let view = {}
      const scaler = self.originLayout.width / self.originLayout.height
      const {heightAdaption, widthAdaption} = self.art_.global.options.sections.screenAdaption.fields
      const {clientWidth, clientHeight} = document.body
      if (heightAdaption === 'zoomToScreenHeight' && widthAdaption === 'zoomToScreenWidth') {
        view = {
          x: 0,
          y: 0,
          width: clientWidth,
          height: clientHeight,
        }
      }

      if (heightAdaption === 'zoomToScreenHeight' && widthAdaption === 'scrollHorizontal') {
        view = {
          x: 0,
          y: 0,
          width: clientHeight * scaler,
          height: clientHeight,
        }
      }

      if (heightAdaption === 'scrollVertical' && widthAdaption === 'zoomToScreenWidth') {
        view = {
          x: 0,
          y: 0,
          width: clientWidth,
          height: clientWidth / scaler,
        }
      }

      if (heightAdaption === 'scrollVertical' && widthAdaption === 'scrollHorizontal') {
        if (scaler >= 1) {
          view = {
            x: 0,
            y: 0,
            width: clientHeight * scaler,
            height: clientHeight,
          }
        } else {
          view = {
            x: 0,
            y: 0,
            width: clientWidth,
            height: clientWidth / scaler,
          }
        }
      }

      self.set({
        layout: view,
      })
      self.boxes.forEach((box) => {
        box.update()
      })
    }

    return {
      initBox,
      resize,
    }
  })

const MArtPreview = types
  .model('MArtPreview', {
    artId: types.maybe(types.number),
    name: types.maybe(types.string),
    publishId: types.maybe(types.string),
    frames: types.optional(types.array(MFrame), []),
    totalWidth: types.optional(types.number, 1),
    totalHeight: types.optional(types.number, 1),
    overflowX: types.optional(types.enumeration(['hidden', 'auto']), 'hidden'),
    overflowY: types.optional(types.enumeration(['hidden', 'auto']), 'hidden'),
    fetchState: types.optional(
      types.enumeration('MArtPreview.fetchState', ['loading', 'success', 'error', 'password']),
      'loading'
    ),
    zoom: types.optional(MZoom, {}),
  })
  .views((self) => ({
    get mainFrame_() {
      return self.frames.find((v) => v.isMain)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      const exhibitManager = onerStorage({
        type: 'variable',
        key: `waveview-exhibit-manager-${self.artId}`, // !!! 唯一必选的参数, 用于内部存储 !!!
      })

      self.exhibitManager = exhibitManager
    }
    const getArt = flow(function* getArt(artId) {
      self.fetchState = 'loading'
      try {
        const art = yield io.art.getDetail({
          ':artId': artId,
          hasBoxes: true,
        })
        const ids = []
        self.dataManager = art.dataManager

        art.dataManager.map &&
          Object.keys(art.dataManager.map).forEach((key) => {
            ids.push(key)
          })
        let data = []
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(','),
          })
        }

        self.datas = data.map((v) => {
          return MData.create({
            ...v,
          })
        })
        self.set({
          artId: art.artId,
          name: art.name,
          global: art.global,
        })
        art.frames.forEach((frame) => {
          initFrame(frame)
        })
        initXY()
        self.fetchState = 'success'
      } catch (error) {
        self.fetchState = 'error'
        tip.error({content: error.message})
        log.error('preview error', error)
      }
    })

    const getOnlineType = flow(function* getOnlineType(publishId) {
      self.fetchState = 'loading'
      // console.log(self.art_.get('isPrivate'))
      try {
        const res = yield io.art.getOnlineType({
          ':publishId': publishId,
        })
        if (res.type === 'private') {
          self.fetchState = 'password'
          return
        }
        self.getPublishArt(publishId)
      } catch (error) {
        self.fetchState = 'error'
        tip.error({content: error.message})
        log.error('getOnlineType', error)
      }
    })

    const getPublishArt = flow(function* getPublishDetail(publishId) {
      const params = self.preViewPassword
        ? {
            ':publishId': publishId,
            password: CryptoJS.AES.encrypt(self.preViewPassword, encryptionType).toString(),
          }
        : {':publishId': publishId}
      try {
        const art = yield io.art.getPublishDetail(params)
        self.set({
          artId: art.artId,
          publishId: art.publishId,
          name: art.name,
          global: art.global,
        })

        const ids = []
        self.dataManager = art.dataManager

        art.dataManager.map &&
          Object.keys(art.dataManager.map).forEach((key) => {
            ids.push(key)
          })
        let data = []
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(','),
          })
        }

        self.datas = data.map((v) => {
          return MData.create({
            ...v,
          })
        })
        self.set({
          artId: art.artId,
          name: art.name,
          global: art.global,
        })

        art.frames.forEach((frame) => {
          initFrame(frame)
        })
        initXY()
        self.fetchState = 'success'
      } catch (error) {
        self.fetchState = 'error'
        tip.error({content: error.message})
        log.error('preview error', error)
      }
    })

    const initFrame = ({boxes, layout, isMain, frameId, background, materials}) => {
      let view = cloneDeep(layout)
      let overflowX = 'hidden'
      let overflowY = 'hidden'
      const scaler = view.width / view.height
      const {effective, fields} = self.global.options.sections.screenAdaption
      const {heightAdaption, widthAdaption} = fields
      const {clientWidth, clientHeight} = document.body
      if (effective) {
        if (heightAdaption === 'zoomToScreenHeight' && widthAdaption === 'zoomToScreenWidth') {
          view = {
            x: 0,
            y: 0,
            width: clientWidth,
            height: clientHeight,
          }
        }

        if (heightAdaption === 'zoomToScreenHeight' && widthAdaption === 'scrollHorizontal') {
          view = {
            x: 0,
            y: 0,
            width: clientHeight * scaler,
            height: clientHeight,
          }

          overflowX = 'auto'
        }

        if (heightAdaption === 'scrollVertical' && widthAdaption === 'zoomToScreenWidth') {
          view = {
            x: 0,
            y: 0,
            width: clientWidth,
            height: clientWidth / scaler,
          }

          overflowY = 'auto'
        }

        if (heightAdaption === 'scrollVertical' && widthAdaption === 'scrollHorizontal') {
          if (scaler >= 1) {
            view = {
              x: 0,
              y: 0,
              width: clientHeight * scaler,
              height: clientHeight,
            }
          } else {
            view = {
              x: 0,
              y: 0,
              width: clientWidth,
              height: clientWidth / scaler,
            }
          }
          overflowX = 'auto'
          overflowY = 'auto'
        }
      } else {
        if (scaler >= 1) {
          // 这时候 width大于height 则判断 clientWidth 比例后的高是否高于clientHeight 如果高于 则最短边为clientHeight 再反推width的值
          if (clientWidth / scaler > clientHeight) {
            view = {
              x: 0,
              y: 0,
              width: clientHeight * scaler,
              height: clientHeight,
            }
          } else {
            view = {
              x: 0,
              y: 0,
              width: clientWidth,
              height: clientWidth / scaler,
            }
          }
        } else {
          // 这时候 width小于height 则判断 clientHeight计算比例后的width是否大于clientWidth 如果大于 则最短边为clientWidth 再反推height的值
          if (clientHeight * scaler > clientWidth) {
            view = {
              x: 0,
              y: 0,
              width: clientWidth,
              height: clientWidth / scaler,
            }
          } else {
            view = {
              x: 0,
              y: 0,
              width: clientHeight * scaler,
              height: clientHeight,
            }
          }
        }
      }
      self.set({
        overflowX,
        overflowY,
      })
      const frame = MFrame.create({
        frameId,
        isMain,
        layout: view,
        originLayout: layout,
        background,
        materials,
      })

      self.frames.push(frame)
      boxes.forEach((box) => {
        frame.initBox(box)
      })
      if (materials) {
        materials.forEach((material) => {
          const model = registerExhibit(material.key)
          if (model) {
            self.exhibitManager.set(
              material.id,
              model.initModel({
                art: self,
                schema: material,
                event,
              })
            )
          }
        })
      }
    }

    const initXY = () => {
      self.totalHeight = self.mainFrame_.layout.height
      self.totalWidth = self.mainFrame_.layout.width
    }
    const update = () => {
      self.frames.forEach((frame) => {
        frame.resize()
      })
    }
    return {
      afterCreate,
      getArt,
      update,
      getPublishArt,
      getOnlineType,
    }
  })

const art = MArtPreview.create({})

export default art
