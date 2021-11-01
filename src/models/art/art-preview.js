import {types, flow, getParent} from 'mobx-state-tree'
import onerStorage from 'oner-storage'
import io from '@utils/io'
import createEvent from '@utils/create-event'
import createLog from '@utils/create-log'
import commonAction from '@utils/common-action'
import tip from '@components/tip'
import {MZoom} from '@utils/zoom'
import {registerExhibit} from '@exhibit-collection'
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
  })
  .views((self) => ({
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

const MFrame = types
  .model('MFramePreview', {
    frameId: types.number,
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

  .actions((self) => {
    const initBox = ({boxId, exhibit, layout, materials, background, padding}) => {
      const box = MBox.create({
        boxId,
        exhibit,
        layout,
        materials,
        background,
        padding,
      })
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
    return {
      initBox,
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
    zoom: types.optional(MZoom, {}),
    fetchState: types.optional(types.enumeration('MArtPreview.fetchState', ['loading', 'success', 'error']), 'loading'),
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

    const getPublishArt = flow(function* getPublishDetail(publishId) {
      self.fetchState = 'loading'
      try {
        const art = yield io.art.getPublishDetail({
          ':publishId': publishId,
        })
        self.set({
          artId: art.artId,
          publishId: art.publishId,
          gridUnit: art.gridUnit,
          watermark: art.watermark,
          password: art.password,
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
      let view = layout
      if (self.global.options.sections.other.fields.screenAdaption) {
        view = {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      }
      const frame = MFrame.create({
        frameId,
        isMain,
        layout: view,
        background,
        materials,
      })

      self.frames.push(frame)
      boxes.forEach((box) => {
        frame.initBox(box)
      })
      if (materials) {
        materials.forEach((material) => {
          // const model = exhibitCollection.get(`${material.lib}.${material.key}`)
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
    const initZoom = () => {
      self.zoom.init(document.querySelector(`#art-viewport-${self.artId}`))
      setTimeout(() => {
        self.zoom.zoom.pause()
      }, 200)
    }
    return {
      afterCreate,
      initZoom,
      getArt,
      getPublishArt,
    }
  })

const art = MArtPreview.create({})

export default art
