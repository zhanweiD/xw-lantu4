import {flow, getEnv, types} from 'mobx-state-tree'
import {MZoom} from '@utils/zoom'
import createLog from '@utils/create-log'
import commonAction from '@utils/common-action'
import check from '@utils/check'

const log = createLog('@models/editor/material.js')

export const MMaterial = types
  .model('MMaterial', {
    materialId: types.string,
    name: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    type: types.optional(types.enumeration(['GeoJSON', 'image']), 'image'),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    zoom: types.optional(MZoom, {}),
    ctime: types.maybe(types.number),
    path: types.optional(types.string, ''),
    user: types.frozen(),
    // 标注项目素材
    projectId: types.maybe(types.number),
    // 标注官方素材
    isOfficial: types.optional(types.boolean, false),
    folderId: types.maybe(types.number),
    fetchState: types.optional(
      types.enumeration('MMaterialTab.fetchState', ['loading', 'success', 'error']),
      'loading'
    ),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const getMaterialDetail = flow(function* getMaterialDetail() {
      const {io} = self.env_
      self.fetchState = 'loading'
      try {
        let material
        if (self.isOfficial) {
          material = yield io.material.getOfficialMaterialDetail({
            ':materialId': self.materialId,
          })
        } else if (self.projectId) {
          material = yield io.material.getProjectMaterialDetail({
            ':projectId': self.projectId,
            ':materialId': self.materialId,
          })
        } else {
          material = yield io.material.getMaterialDetail({
            ':materialId': self.materialId,
          })
        }
        self.set(material)
        self.fetchState = 'success'
      } catch (error) {
        self.fetchState = 'error'
        log.error('getMaterialDetail Error: ', error)
      }
    })

    const save = flow(function* save() {
      const {io, tip, event} = self.env_
      if (!self.name) {
        tip.error({content: '素材名称不可为空'})
        return
      }
      if (!check('folderName', self.name)) {
        tip.error({content: '素材名称不符合规范，请输入1～32位中英文、数字、下划线'})
        return
      }
      try {
        if (self.projectId) {
          yield io.material.updateProjectMaterial({
            ':projectId': self.projectId,
            ':folderId': self.folderId,
            ':materialId': self.materialId,
            name: self.name,
            description: self.description,
          })
        } else {
          yield io.material.updateMaterial({
            ':folderId': self.folderId,
            ':materialId': self.materialId,
            name: self.name,
            description: self.description,
          })
        }
        tip.success({content: '更新素材信息成功'})
        event.fire('editor.updateTabname', {name: self.name, id: self.materialId})
        // 区分项目素材和空间素材
        if (self.projectId) {
          event.fire('materialPanel.getProjectFolders')
        } else {
          event.fire('materialPanel.getFolders')
        }
      } catch (error) {
        tip.error({content: `更新素材信息失败: ${error.message}`})
      }
    })

    const initZoom = () => {
      self.isInit = true
      self.zoom.init(document.querySelector(`#material-${self.materialId}`))
    }

    return {
      getMaterialDetail,
      initZoom,
      save,
    }
  })
