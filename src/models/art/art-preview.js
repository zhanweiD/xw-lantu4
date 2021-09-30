import {types, flow, getParent} from 'mobx-state-tree'
import onerStorage from 'oner-storage'
import io from '@utils/io'
import createEvent from '@utils/create-event'
import createLog from '@utils/create-log'
import commonAction from '@utils/common-action'
import tip from '@components/tip'
import {MZoom} from '@utils/zoom'
import {registerExhibit} from '@exhibit-collection'

const log = createLog('@models/art/art-preview.js')
const event = createEvent()
const MWatermark = types.model('MWatermark', {
  isEnable: types.optional(types.boolean, false),
  value: types.optional(types.string, ''),
  rotation: types.optional(types.frozen(), -15),
  opacity: types.optional(types.number, 1),
})

const MPassword = types.model('MPassword', {
  isEnable: types.optional(types.boolean, false),
  value: types.optional(types.string, ''),
})

const MBox = types.model('MBoxPreview', {
  boxId: types.number,
  exhibit: types.frozen(),
  layout: types.frozen(),
  materials: types.frozen(),
})

const MFrame = types
  .model('MFramePreview', {
    frameId: types.number,
    layout: types.frozen(),
    isMain: types.optional(types.boolean, false),
    background: types.frozen(),
    boxes: types.optional(types.array(MBox), []),
  })
  .views((self) => ({
    get art_() {
      return getParent(self, 2)
    },
  }))
  .actions((self) => {
    const initBox = ({boxId, exhibit, layout, materials}) => {
      const box = MBox.create({
        boxId,
        exhibit,
        layout,
        materials,
      })
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
    publishId: types.maybe(types.string),
    gridUnit: types.optional(types.number, 40),
    watermark: types.optional(MWatermark, {}),
    password: types.optional(MPassword, {}),
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
        Object.keys(art.dataManager.map).forEach((key) => {
          ids.push(key)
        })
        let data
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(','),
          })
        }

        self.datas = data
        self.set({
          artId: art.artId,
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
    const initFrame = ({boxes, layout, isMain, frameId, background}) => {
      const frame = MFrame.create({
        frameId,
        isMain,
        layout,
        background,
      })
      self.frames.push(frame)
      boxes.forEach((box) => {
        frame.initBox(box)
      })
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
