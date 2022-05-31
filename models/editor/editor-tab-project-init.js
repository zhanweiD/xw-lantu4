/**
 * @author 南风
 * @description 项目创建
 */
import commonAction from '@utils/common-action'
import {flow, getEnv, types} from 'mobx-state-tree'

export const MProjectInit = types
  .model({
    id: types.string,
    name: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const create = flow(function* create() {
      try {
        const {io, event} = self.env_
        const project = yield io.project.create({
          name: self.name,
          description: self.description,
        })
        event.fire('editor.finishCreate', {
          type: 'project',
        })
        event.fire('project-panel.getProjects')
        event.fire('project-panel.setNewCreateProjectId', project.projectId)
      } catch (error) {
        // TODO: 统一替换
        console.log('error')
      }
    })
    return {
      create,
    }
  })
