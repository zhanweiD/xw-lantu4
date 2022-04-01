import commonAction from '@utils/common-action'
import {getEnv, types, getParent, flow, getRoot} from 'mobx-state-tree'
import debounce from 'lodash/debounce'
import {reaction} from 'mobx'
import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import uuid from '@utils/uuid'
import {MLayout} from '../common/layout'
import {MBackgroundColor, MOffset} from './art-ui-tab-property'

const log = createLog('@models/art/box.js')

const MConstraints = types
  .model('MConstraints', {
    top: types.optional(types.boolean, true),
    left: types.optional(types.boolean, true),
    bottom: types.optional(types.boolean, false),
    right: types.optional(types.boolean, false),
    height: types.optional(types.boolean, true),
    width: types.optional(types.boolean, true),
    ctString: types.optional(
      types.enumeration(['tlwh', 'trlh', 'trwh', 'tblw', 'rlh', 'trbl', 'tbw', 'trbw', 'blwh', 'rblh', 'rbwh']),
      'tlwh'
    ),
    normalKeys: types.frozen(['top', 'right', 'bottom', 'left', 'height', 'width', 'ctString']),
  })
  .actions(commonAction(['getSchema', 'set', 'setSchema']))

export const MBox = types
  .model({
    uid: types.optional(types.string, ''),
    boxId: types.maybe(types.number),
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),
    background: types.optional(MBackgroundColor, {}),
    constraints: types.optional(MConstraints, {}),
    materials: types.frozen(),
    remark: types.maybe(types.string),
    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),
    padding: types.optional(MOffset, {}),
    isSelected: types.optional(types.boolean, false),
    groupIds: types.frozen(),
    // 是否有效：失效状态不能选中、画布不渲染
    isEffect: types.optional(types.boolean, true),
    // 容器是否被锁定
    isLocked: types.optional(types.boolean, false),
    normalKeys: types.frozen([
      'uid',
      'frameId',
      'boxId',
      'artId',
      'exhibit',
      'materials',
      'name',
      'remark',
      'isEffect',
      'isLocked',
    ]),
    deepKeys: types.frozen(['layout', 'constraints', 'paddding', 'background']),
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get x1_() {
      return self.layout.x
    },
    get y1_() {
      return self.layout.y
    },
    get x2_() {
      return self.x1_ + self.layout.width
    },
    get y2_() {
      return self.y1_ + self.layout.height
    },
    get art_() {
      return getParent(self, 5)
    },
    get viewport_() {
      return getParent(self, 4)
    },
    get frame_() {
      return getParent(self, 2)
    },
    get zIndex_() {
      const zIndex = getParent(self, 2)
        .boxes.map((item) => item.boxId)
        .indexOf(self.boxId)
      return zIndex
    },
    get isHover() {
      return self.boxId === self.frame_.hoverBox?.hoverBoxId
    },
  }))
  .views((self) => ({
    get backgroundImage_() {
      if (self.background.options.sections.gradientColor.effective) {
        return self.background.options.sections.gradientColor.fields.gradientColor.value.reduce((total, current) => {
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
        const rgb = self.background.options.sections.singleColor.fields.singleColor.value.match(/[\d.]+/g)
        const opatity = self.background.options.sections.singleColor.fields.opacity.value
        if (rgb && rgb.length >= 3) {
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opatity})`
        }
        return self.background.options.sections.singleColor.fields.singleColor.value
      }
      return undefined
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'dumpSchema']))
  .actions((self) => {
    const afterCreate = () => {
      reaction(
        () => {
          return {
            padding: self.padding.options.updatedOptions,
          }
        },
        () => {
          const {layout, padding} = self
          const {areaOffset} = padding.getData()
          const [top, right, bottom, left] = areaOffset
          const {width, height} = layout
          if (self.exhibit) {
            const exhibitModel = self.art_.exhibitManager.get(self.exhibit.id)
            if (exhibitModel.adapter) {
              exhibitModel.adapter.refresh(width - left - right, height - top - bottom)
            }
          }
          debounceUpdate()
        }
      )
      setTimeout(() => {
        updateGroup()
      }, 200)
    }
    const updateGroup = () => {
      const {groups} = self.frame_
      self.set({
        groupIds: groups.filter((item) => item.boxIds.includes(self.boxId)).map((item) => item.id),
      })
    }
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

    const updateBox = flow(function* updateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit, background, boxId, remark, materials} = self
      try {
        yield io.art.updateBox({
          ':boxId': boxId,
          ':artId': artId,
          ':frameId': frameId,
          ':projectId': projectId,
          name,
          layout,
          exhibit,
          background,
          materials,
          remark,
        })
      } catch (error) {
        log.error('update Error: ', error)
      }
    })

    const debounceUpdate = debounce(() => {
      self.updateBox()
    }, 2000)

    const addBackground = ({key, lib, name, materialId, type}) => {
      const {exhibitCollection, event} = self.env_
      const model = exhibitCollection.get(`${lib}.${key}`)
      if (model) {
        const art = self.art_
        const schema = {
          lib,
          key,
        }
        if (type === 'image') {
          schema.id = `${materialId}.${uuid()}`

          schema.layers = [
            {
              id: materialId,
              name,
            },
          ]
        } else {
          schema.id = uuid()
        }
        const materialModel = model.initModel({
          art,
          schema,
        })
        const material = materialModel.getSchema()
        art.exhibitManager.set(
          material.id,
          model.initModel({
            art,
            schema: material,
            event,
          })
        )
        const materials = self.materials?.map((material) => art.exhibitManager.get(material.id).getSchema()) || []

        self.materials = [].concat(material).concat(...materials)
        debounceUpdate()
        // if (type === 'image') {
        //   event.fire(`art.${art.artId}.addMaterial`, {
        //     materialId,
        //     id: self.boxId,
        //   })
        // }
      }
    }

    const removeBackground = (materialId) => {
      // const {event} = self.env_
      const materials = self.materials.map((material) => self.art_.exhibitManager.get(material.id).getSchema())
      self.materials = materials.filter((material) => material.id !== materialId)
      debounceUpdate()
      self.art_.exhibitManager.remove(materialId)
      // 为什么删除素材要去更新整个art数据
      // event.fire(`art.${self.art_.artId}.removeMaterial`, {
      //   materialId: materialId.split('.')[0],
      //   id: self.boxId,
      // })
    }

    const sortBackground = (materialId, direction) => {
      const index = self.materials.findIndex((material) => material.id === materialId)
      if (direction === 'up') {
        if (index !== 0) {
          self.materials = []
            .concat(self.materials.slice(0, index - 1))
            .concat(self.materials[index])
            .concat(self.materials[index - 1])
            .concat(self.materials.slice(index + 1))
        }
      }

      if (direction === 'down') {
        if (index !== self.materials.length - 1) {
          self.materials = []
            .concat(self.materials.slice(0, index))
            .concat(self.materials[index + 1])
            .concat(self.materials[index])
            .concat(self.materials.slice(index + 2))
        }
      }
    }
    const recreateBox = flow(function* recreateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {uid, layout, name, frameId, exhibit, background} = self
      try {
        const box = yield io.art.createBox({
          uid,
          exhibit,
          layout,
          name,
          background,
          ':artId': artId,
          ':frameId': frameId,
          ':projectId': projectId,
        })

        self.boxId = box.boxId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}],
        })
      } catch (error) {
        log.error('recreateBox Error: ', error)
      }
    })

    const setLayout = ({x, y, height, width}) => {
      const {event} = self.env_
      self.layout.set({
        x: isDef(x) ? +x : self.layout.x,
        y: isDef(y) ? +y : self.layout.y,
        height: isDef(height) ? +height : self.layout.height,
        width: isDef(width) ? +width : self.layout.width,
      })
      const {x: x1, y: y1, height: h, width: w} = self.layout
      event.fire(`art.${self.artId}.select-range.setLayout`, {
        x1,
        y1,
        x2: x1 + w,
        y2: y1 + h,
      })
      debounceUpdate()
      self.resize()
    }

    const setRemark = ({name = self.name, remark = self.remark}) => {
      self.set({
        name,
        remark,
      })
      debounceUpdate()
    }

    const setConstraints = (constraints) => {
      self.constraints.setSchema(constraints)
    }

    // 重命名图层
    const reName = (name) => {
      self.set({name})
      debounceUpdate()
    }

    // 图层添加组
    const addGroup = (groupId) => {
      self.groupIds = [groupId]
    }

    // 移除图层组
    const removeGroup = () => {
      self.set({groupIds: []})
    }

    // 更新容器显示隐藏状态
    const toggleEffect = () => {
      self.isEffect = !self.isEffect
    }

    // 更新容器锁定解锁状态
    const toggleLock = () => {
      self.isLocked = !self.isLocked
    }

    return {
      afterCreate,
      resize,
      recreateBox,
      addBackground,
      removeBackground,
      sortBackground,
      setRemark,
      setLayout,
      updateBox,
      setConstraints,
      reName,
      addGroup,
      removeGroup,
      toggleEffect,
      toggleLock,
      updateGroup,
    }
  })
