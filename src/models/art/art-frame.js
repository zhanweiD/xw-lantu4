import {types, getParent, getEnv, getRoot, flow} from 'mobx-state-tree'
import debounce from 'lodash/debounce'
import commonAction from '@utils/common-action'
import uuid from '@utils/uuid'
import isDef from '@utils/is-def'
import createLog from '@utils/create-log'
import {MBox} from './box'
import {MArtFrameGrid} from './art-frame-grid'
import {MLayout} from '../common/layout'
import {MBackgroundColor} from './art-ui-tab-property'
import {MGroup} from './group'
import {registerExhibit} from '@exhibit-collection'
import createEvent from '@utils/create-event'

const log = createLog('@models/art/art-frame.js')
const HoverBox = types.model('HoverBox', {
  hoverBoxId: types.maybe(types.number),
  location: types.maybe(types.string),
})
export const MArtFrame = types
  .model('MArtFrame', {
    frameId: types.union(types.string, types.number),
    artId: types.number,
    name: types.string,
    isMain: types.optional(types.boolean, false),
    // 实际上的位置信息，基于主画布的左上角坐标构建
    layout: types.maybe(MLayout),
    boxes: types.optional(types.array(MBox), []),
    background: types.optional(MBackgroundColor, {}),
    remark: types.maybe(types.string),
    materials: types.frozen(),
    hoverBox: types.maybe(HoverBox, {}),

    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),
    // 动态展示的位置信息，原点不定，可视区域中最小的左上角计算得出
    viewLayout: types.maybe(MLayout),
    grid: types.optional(MArtFrameGrid, {}),
    groups: types.optional(types.array(MGroup), []),
    normalKeys: types.frozen(['frameId', 'artId', 'name', 'isMain', 'materials', 'remark', 'groups']),
    deepKeys: types.frozen(['boxes', 'layout', 'background']),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get art_() {
      return getParent(self, 3)
    },
    get viewport_() {
      return getParent(self, 2)
    },
    get baseOffsetX_() {
      return getParent(self, 2).baseOffsetX
    },
    get baseOffsetY_() {
      return getParent(self, 2).baseOffsetY
    },
    get scaler_() {
      return getParent(self, 2).scaler
    },
    get x1_() {
      return self.viewLayout.x
    },
    get y1_() {
      return self.viewLayout.y
    },
    get x2_() {
      return self.x1_ + self.viewLayout.width
    },
    get y2_() {
      return self.y1_ + self.viewLayout.height
    },
    get nameX_() {
      return self.x1_ * self.scaler_ + self.baseOffsetX_
    },
    get nameY_() {
      // 24是画布标题Y轴相对于画布定边缘的偏移
      return self.y1_ * self.scaler_ + self.baseOffsetY_ - 19
    },
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

    // 将box根据groupId分类
    get layerTreeList_() {
      const boxes = [...self.boxes]
      let treeList = []
      // 统一面板和图层显示顺序
      boxes.reverse()

      boxes.forEach((item) => {
        const {groupIds = []} = item
        if (groupIds.length) {
          const groupIndex = treeList.findIndex((item) => {
            return item.group?.id === groupIds[0]
          })
          if (groupIndex !== -1) {
            treeList[groupIndex]?.boxes?.push(item)
          } else {
            treeList.push({
              group: self.groups.find((group) => group.id === groupIds[0]) || {},
              boxes: [item],
            })
          }
        } else {
          // 保持treeList中的item格式统一，否则mobx无法观测到treeList的改变
          // treeList.push(item) // 控制台mobx会警告访问越界
          treeList.push({
            group: self.groups.find((group) => group.id === groupIds[0]) || {},
            boxes: [item],
          })
        }
      })
      return treeList
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'dumpSchema']))
  .actions((self) => {
    const getNearlyOrigin = (origin, target) => {
      const grid = self.grid.unit_ * self.scaler_
      const x = Math.floor((target.x - origin.x) / grid) * grid - self.grid.extendX_ * self.scaler_
      const y = Math.floor((target.y - origin.y) / grid) * grid - self.grid.extendY_ * self.scaler_
      return {
        x,
        y,
      }
    }

    const initBox = ({
      uid,
      artId,
      boxId,
      name,
      frameId,
      exhibit,
      layout,
      background,
      remark,
      materials,
      padding,
      constraints,
      groupIds = [],
      insertIndex,
      isEffect = true,
      isLocked = false,
    }) => {
      const {exhibitCollection, event} = self.env_
      const box = MBox.create({
        uid,
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout,
        remark,
        materials,
        groupIds,
        isEffect,
        isLocked,
      })

      box.padding.setSchema(padding)
      box.background.setSchema(background)
      box.constraints.setSchema(constraints)
      if (insertIndex || insertIndex === 0) {
        // 复制时需要将复制之后的box插入到复制源的上方（基于self.boxes纬度）
        self.boxes = [].concat(self.boxes.slice(0, insertIndex)).concat([box]).concat(self.boxes.slice(insertIndex))
      } else {
        self.boxes.push(box)
      }
      if (exhibit) {
        const model = exhibitCollection.get(`${exhibit.lib}.${exhibit.key}`)
        const {dataPanel} = self.root_.sidebar

        if (model) {
          const art = self.art_

          art.exhibitManager.set(
            exhibit.id,
            model.initModel({
              art,
              schema: exhibit,
              event,
              data: dataPanel,
            })
          )
        }
      }
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

    const createBox = flow(function* createBox({name, position, lib, key, materialId, type}) {
      const {io, exhibitCollection} = self.env_
      const {artId, projectId} = self.art_
      const {frameId} = self
      const art = self.art_
      const findAdapter = exhibitCollection.has(`${lib}.${key}`)
      const model = findAdapter.value.initModel({
        art,
        schema: {
          lib,
          key,
          id: uuid(),
        },
      })
      const exhibit = model.getSchema()
      const frameviewport = document.querySelector(`#artFrame-${frameId}`).getBoundingClientRect()
      const gridOrigin = document.querySelector(`#artFramegrid-${frameId}`).getBoundingClientRect()
      const deviceXY = {
        x: frameviewport.x,
        y: frameviewport.y,
      }
      const nomal = {
        x: position.x - deviceXY.x,
        y: position.y - deviceXY.y,
      }
      const targetPosition = art.isSnap ? getNearlyOrigin(gridOrigin, position) : nomal
      const layout = {
        x: Math.round(targetPosition.x / self.scaler_),
        y: Math.round(targetPosition.y / self.scaler_),
        width: Math.round(exhibit.initSize[0] * self.grid.unit_),
        height: Math.round(exhibit.initSize[1] * self.grid.unit_),
      }

      const uid = uuid()
      const params = {
        artId,
        name: `${name || '容器'}-${uid.substring(0, 4)}`,
        frameId,
        exhibit,
        layout,
      }
      self.initBox({uid, ...params})
      changeBoxSelectRange([uid])
      const realBox = self.boxes.find((o) => o.uid === uid)
      try {
        const box = yield io.art.createBox({
          uid,
          exhibit,
          layout,
          name: params.name,
          ':artId': params.artId,
          ':frameId': params.frameId,
          ':projectId': projectId,
          isEffect: true, // 初始化状态
          isLocked: false, // 初始化状态
        })
        realBox.set({
          boxId: box.boxId,
        })

        self.viewport_.selectRange.set({
          range: [
            {
              frameId,
              boxIds: [realBox.boxId],
            },
          ],
        })
        // 是否是图片容器组件
        if (materialId) {
          realBox.addBackground({key, lib, name, materialId, type})
        }
      } catch (error) {
        realBox.set({
          isCreateFail: true,
        })
        log.error('createBox Error: ', error)
      }
    })

    const recreateFrame = flow(function* recreateFrame() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name} = self
      try {
        const {frameId} = yield io.art.addFrame({
          name,
          layout,
          ':projectId': projectId,
          ':artId': artId,
        })

        self.frameId = frameId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}],
        })
      } catch (error) {
        log.error('recreateFrame Error:', error)
      }
    })

    const updateFrame = flow(function* updateFrame() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {frameId, layout, background, remark, name, materials} = self
      try {
        yield io.art.updateFrame({
          layout,
          background,
          remark,
          name,
          materials,
          ':artId': artId,
          ':projectId': projectId,
          ':frameId': frameId,
        })
      } catch (error) {
        log.error('updateFrame Error:', error)
      }
    })

    // 局部更新frame
    const updatePartFrame = flow(function* updatePartFrame(params) {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {frameId} = self
      try {
        yield io.art.updateFrame({
          ...params,
          ':artId': artId,
          ':projectId': projectId,
          ':frameId': frameId,
        })
      } catch (error) {
        log.error('updateFrame Error:', error)
      }
    })

    const removeBoxes = (boxIds) => {
      self.boxes = self.boxes.filter((box) => !boxIds.includes(box.boxId))
      // 同时处理box的关联的分组
      filterGroupByBoxIds(boxIds)
    }

    const setLayout = ({x, y, height, width}) => {
      const {event} = self.env_
      const layout = {
        x: isDef(x) ? +x + self.viewLayout.x - self.layout.x : self.viewLayout.x,
        y: isDef(y) ? +y + self.viewLayout.y - self.layout.y : self.viewLayout.y,
        height: isDef(height) ? +height + self.viewLayout.height - self.layout.height : self.viewLayout.height,
        width: isDef(width) ? +width + self.viewLayout.width - self.layout.width : self.viewLayout.width,
      }
      const {x: x1, y: y1, height: h, width: w} = layout
      event.fire(`art.${self.artId}.select-range.setLayout`, {
        x1,
        y1,
        x2: x1 + w,
        y2: y1 + h,
      })
      self.viewLayout.set(layout)
      self.layout.set({
        x: isDef(x) ? +x : self.layout.x,
        y: isDef(y) ? +y : self.layout.y,
        height: isDef(height) ? +height : self.layout.height,
        width: isDef(width) ? +width : self.layout.width,
      })
      debounceUpdate()
    }

    const debounceUpdate = debounce(() => {
      self.updateFrame()
    }, 2000)

    const setRemark = ({name = self.name, remark = self.remark}) => {
      self.set({
        name,
        remark,
      })
      debounceUpdate()
      if (self.isMain) {
        const {event} = self.env_
        event.fire('editor.updateTabname', {id: self.artId, name})
      }
    }

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
        // 去掉实时保存
        // event.fire(`art.${art.artId}.addMaterial`, {
        //   materialId,
        //   id: box ? box.boxId : self.frameId,
        //   // id: self.frameId,
        // })
      }
    }

    const removeBackground = (materialId) => {
      // const {event} = self.env_
      const materials = self.materials.map((material) => self.art_.exhibitManager.get(material.id).getSchema())
      self.materials = materials.filter((material) => material.id !== materialId)
      debounceUpdate()
      self.art_.exhibitManager.remove(materialId)
      // event.fire(`art.${self.art_.artId}.removeMaterial`, {
      //   materialId: materialId.split('.')[0],
      //   id: self.frameId,
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

    const initGroup = ({id, name, boxIds}) => {
      const group = MGroup.create({id, boxIds, name})
      self.groups.push(group)
    }

    const copyBox = flow(function* copyBox(box, isGroup) {
      const copiedMaterials = box?.materials?.map((item) => {
        return {
          ...item,
          id: `${item.id.slice(0, item.id.indexOf('.') + 1)}${uuid()}`,
        }
      })
      const {io} = self.env_
      const event = createEvent()
      const {artId, projectId} = self.art_
      const uid = uuid()
      const exhibit = {
        ...box.exhibit,
        id: uuid(),
      }
      const model = registerExhibit(box.exhibit.key)
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
      const layout = {...box.layout, x: box.layout.x + 20, y: box.layout.y + 20}
      const params = {
        materials: copiedMaterials,
        artId,
        frameId: box.frameId,
        exhibit: exhibit,
        uid,
        name: `${box.name}-copy`,
        layout,
        groupIds: isGroup ? [] : box.groupIds,
        insertIndex: box.zIndex_,
      }
      self.initBox(params)
      const realBox = self.boxes.find((o) => o.uid === uid)
      try {
        const currentBox = yield io.art.createBox({
          uid: params.uid,
          materials: copiedMaterials,
          exhibit: exhibit,
          layout,
          name: params.name,
          groupIds: isGroup ? [] : box.groupIds,
          isEffect: box.isEffect, // 初始化状态
          isLocked: box.isLocked, // 初始化状态
          ':artId': params.artId,
          ':frameId': params.frameId,
          ':projectId': projectId,
          // isEffect: true,
        })
        realBox.set({
          boxId: currentBox.boxId,
        })

        // isGroup组复制
        if (box.groupIds?.length && !isGroup) {
          self.groups = self.groups.map((item) => {
            if (box.groupIds?.includes(item.id)) {
              return {...item, boxIds: item.boxIds.concat([currentBox.boxId])}
            }
            return item
          })
          updatePartFrame({groups: self.groups})
        }
        const selectedBoxIds = self.viewport_.selectRange?.range[0]?.boxIds || []
        changeBoxSelectRange(selectedBoxIds.concat([currentBox.boxId]))
        return realBox
      } catch (error) {
        realBox.set({
          isCreateFail: true,
        })
        log.error('createBox Error: ', error)
      }
    })

    const changeBoxSelectRange = (boxIds) => {
      // 选中组内所有box
      self.viewport_.toggleSelectRange({
        target: 'box',
        selectRange: [
          {
            frameId: self.frameId,
            boxIds,
          },
        ],
      })
    }

    // 复制图层
    const copyBoxes = (boxes) => {
      changeBoxSelectRange([])
      boxes.map((box) => {
        copyBox(box)
      })
    }

    // 组复制
    const copyGroup = flow(function* copyGroup(boxes) {
      changeBoxSelectRange([])
      const copyBoxes = yield Promise.all(
        boxes.map(
          flow(function* boxesMap(item) {
            const box = yield copyBox(item, true)
            return box
          })
        )
      )
      createGroup(copyBoxes)
    })

    // box添加到group
    const addBoxesToGroup = (boxes, groupId) => {
      const sortBoxes = boxes.sort((a, b) => a.zIndex_ - b.zIndex_)
      const sortBoxIds = sortBoxes.map((item) => item.boxId)
      let tempBoxes = [...self.boxes].filter((item) => !sortBoxIds.includes(item.boxId))
      sortBoxes.forEach((item) => {
        // 将tempbox处理为不包含成组box
        tempBoxes = tempBoxes.filter((box) => box.boxId !== item.boxId)
        item.addGroup(groupId)
      })
      let box = []
      // 成组元素最后一个元素的zIndex
      const targetIndex = sortBoxes[sortBoxes.length - 1].zIndex_
      if (targetIndex === self.boxes.length - 1) {
        box = tempBoxes.concat(sortBoxes)
      } else {
        tempBoxes.forEach((item) => {
          if (item.zIndex_ === sortBoxes[sortBoxes.length - 1].zIndex_ + 1) {
            box = box.concat(sortBoxes)
          }
          box.push(item)
        })
      }
      self.boxes = box
      updatePartFrame({groups: self.groups, boxSort: self.boxes.map((item) => item.boxId)})
    }

    // 创建分组
    const createGroup = (boxes) => {
      // 成组之前如果box在其他组内，需要先解组
      // removeGroupByBoxes(boxes)
      const id = uuid()
      const groups = MGroup.create({
        id,
        boxIds: boxes.map((item) => item.boxId),
        name: `分组_${id.substring(0, 4)}`,
      })
      self.groups.push(groups)
      addBoxesToGroup(boxes, id)
    }

    // 根据box批量解组 支持组解组
    const removeGroupByBoxes = (boxes) => {
      boxes.forEach((box) => {
        if (!box.groupIds.length) return // 兼容拖拽操作
        // 移出分组同时box进行排序
        const sourceGroup = self.groups.find((item) => item.id === box?.groupIds[0])
        // 找到组内最后一个元素，解组后插到最后一个元素后边
        const lastBoxId = sourceGroup.boxIds[sourceGroup.boxIds.length - 1]
        const targetIndex = self.boxes.find((item) => item.boxId === lastBoxId).zIndex_
        if (targetIndex > box.zIndex_) {
          self.boxes = self.boxes
            .slice(0, box.zIndex_)
            .concat(self.boxes.slice(box.zIndex_ + 1, targetIndex + 1))
            .concat(box)
            .concat(self.boxes.slice(targetIndex + 1))
        }
        // 在box解除绑定关系
        box.removeGroup()
      })
      // 处理group
      filterGroupByBoxIds(boxes.map((item) => item.boxId))
    }

    /**
     * 图层移动
     * @param {*} currentIndex box的原来位置
     * @param {*} targetIndex box的目标位置
     */
    const moveBox = (currentIndex, targetIndex) => {
      const boxList = [...self.boxes]
      const tmp = boxList[currentIndex] // 被移动的元素
      boxList.splice(currentIndex, 1) // 移除拖拽项
      boxList.splice(targetIndex, 0, tmp) // 插入放置项
      self.boxes = boxList
    }

    /**
     * 拖拽移动
     * @param {*} boxes 拖拽box
     * @param {*} targetIndex 拖拽的目标位置
     */
    const dropMove = (boxes, targetIndex) => {
      // 判断目标位置是否在组内
      const targetGroup = self.boxes[targetIndex]?.groupIds
      boxes.forEach((box) => {
        // 拖到组内（组到组或组外到组内）
        if (targetGroup.length) {
          // 同组拖动
          if (box.groupIds[0] === targetGroup[0]) {
            moveBox(box.zIndex_, targetIndex)
          } else {
            // 不同组拖动(组外到组内，a组到b组)
            box.set({groupIds: targetGroup})
            self.groups = self.groups
              .map((group) => {
                // 目标组添加
                if (group.id === targetGroup[0]) {
                  return {
                    ...group,
                    boxIds: [...group.boxIds, box.boxId],
                  }
                }
                // 其他组移除
                return {
                  ...group,
                  boxIds: group.boxIds.filter((item) => item !== box.boxId),
                }
              })
              .filter((group) => group.boxIds.length)
          }
        } else {
          // 拖到组外（组内到组外）
          // removeGroupByBoxes([box])
          if (box?.groupIds?.length) {
            box.removeGroup()
            self.groups = self.groups
              .map((group) => {
                return {
                  ...group,
                  boxIds: group.boxIds.filter((item) => item !== box.boxId),
                }
              })
              .filter((group) => group.boxIds.length)
          } else {
            // 组外到组外
            moveBox(box.zIndex_, targetIndex)
          }
        }
        updatePartFrame({groups: self.groups})
      })
    }

    /**
     * 选中组
     * @param {*} group 点击group
     * @param {*} multiSelect 是否多选（是否按着shift选中）
     */
    const selectGroup = (group, multiSelect) => {
      let boxIds = []
      if (multiSelect) {
        const {range = []} = self.viewport_.selectRange || {}
        const originalBoxIds = range[0]?.boxIds || []
        boxIds = [...new Set([...group.boxIds, ...originalBoxIds])]
        group.set({isSelect: !group.isSelect})
      } else {
        boxIds = group.boxIds.toJSON()
        self.groups?.forEach((item) => {
          if (item.id === group.id) item.set({isSelect: true})
          else item.set({isSelect: false})
        })
      }

      // 选中组内所有box
      changeBoxSelectRange(boxIds)
    }
    const removeSelectGroup = () => {
      self.groups.forEach((group) => group.set({isSelect: false}))
    }

    /**
     * 组的显示隐藏，锁定解锁
     * @param {*} group 选中group
     * @param {*} type 需要修改的状态
     */
    const toggleGroupState = (group, type) => {
      const {range = []} = self.viewport_.selectRange || {}
      const currentFrameRange = range.find((item) => item.frameId === self.frameId) || {}
      const {boxIds = []} = currentFrameRange
      self.boxes.forEach((box) => {
        if (group.boxIds.includes(box.boxId)) {
          box.set({[type]: !group[type]})
        }
        if (box.isLocked || !box.isEffect) {
          changeBoxSelectRange(boxIds.filter((rangeBoxId) => rangeBoxId !== box.id))
        }
      })
      group.set({[type]: !group[type]})
    }

    /**
     * 组移动
     * @param {*} group 移动组
     * @param {*} targetIndex 目标位置
     */
    const moveGroup = (group, targetIndex) => {
      const tempBoxes = self.boxes.filter((item) => !group.boxIds.includes(item.boxId))
      const currentBoxes = self.boxes.filter((item) => group.boxIds.includes(item.boxId))
      let boxList = []
      const currentStartIndex = Math.min(...currentBoxes.map((item) => item.zIndex_))
      // 注意boxes与显示顺序实际是相反的
      if (targetIndex > currentStartIndex) {
        // 图层上移
        boxList = self.boxes
          .slice(0, currentStartIndex)
          .concat(self.boxes.slice(currentStartIndex + currentBoxes.length, targetIndex + 1))
          .concat(currentBoxes)
          .concat(self.boxes.slice(targetIndex + 1))
      } else {
        // 图层下移
        boxList = tempBoxes.slice(0, targetIndex).concat(currentBoxes).concat(tempBoxes.slice(targetIndex))
      }
      self.boxes = boxList
    }

    // 根据boxid获取其组内box的数量移动经常会用到
    const getGroupBoxNum = (boxId) => {
      return self.groups.find((item) => item.boxIds.includes(boxId))?.boxIds?.length || 0
    }

    // 根据boxId处理分组
    const filterGroupByBoxIds = (boxIds) => {
      self.groups = self.groups
        .map((group) => {
          return {...group, boxIds: group.boxIds.filter((boxId) => !boxIds.includes(boxId))}
        })
        .filter((item) => item.boxIds?.length)
      updatePartFrame({groups: self.groups})
    }

    return {
      initBox,
      createBox,
      setRemark,
      setLayout,
      updateFrame,
      addBackground,
      removeBackground,
      removeBoxes,
      sortBackground,
      recreateFrame,
      initGroup,
      copyBoxes,
      copyGroup,
      createGroup,
      removeGroupByBoxes,
      addBoxesToGroup,
      moveBox,
      dropMove,
      moveGroup,
      selectGroup,
      removeSelectGroup,
      getGroupBoxNum,
      updatePartFrame,
      toggleGroupState,
    }
  })
