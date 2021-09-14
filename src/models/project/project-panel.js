import {types, getEnv, flow, applySnapshot, getRoot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import {MProjectList} from './project-list'
import {MArtThumbnail} from '../art/art-thumbnail'
import createLog from '@utils/create-log'
import check from '@utils/check'

const log = createLog('@models/project/project-panel.js')

export const MProjectPanel = types
  .model({
    name: 'projectPanel',
    templates: types.optional(types.array(MArtThumbnail), []),
    projects: types.optional(types.array(MProjectList), []),
    projectSort: types.optional(types.array(types.number), []),
    // 最近访问的项目
    recentProjectIds: types.optional(types.array(types.number), []),
    // 激活的 Tab 索引
    activeIndex: types.optional(types.number, 0),
    // 对应 Loading 组件的状态
    state: types.optional(types.enumeration(['loading', 'success', 'error']), 'loading'),
    // 搜索关键字
    keyword: types.optional(types.string, ''),
    // 是否展示缩略图
    isThumbnailVisible: types.optional(types.boolean, true),
    // 创建项目的浮窗是否可见
    isCreateModalVisible: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get recentProjects_() {
      let recentProjects = self.recentProjectIds
        .map((id) => self.projects.find(({projectId}) => id === projectId))
        .filter(Boolean)
      // 搜索过滤
      if (self.keyword) {
        recentProjects = recentProjects.filter((project) => project.arts_.length || project.name.match(self.keyword))
      }
      return recentProjects
    },
    get projects_() {
      let topProjects = self.projectSort
        .map((id) => self.projects.find(({projectId}) => projectId === id))
        .filter(Boolean)
      let basicProjects = self.projects.filter(({projectId}) => !self.projectSort.includes(projectId))
      // 搜索过滤
      if (self.keyword) {
        topProjects = topProjects.filter((project) => project.arts_.length || project.name.match(self.keyword))
        basicProjects = basicProjects.filter((project) => project.arts_.length || project.name.match(self.keyword))
      }
      return {basicProjects, topProjects}
    },
    get templates_() {
      return self.templates.filter(({name}) => name.match(self.keyword))
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      // 项目变化时更新
      event.on('project-panel.getProjects', self.getProjects)
      // 模板变化时更新
      event.on('project-panel.getTemplates', self.getTemplates)
      // 最近访问发生变化时更新
      event.on('project-panel.createRecentProject', self.createResentProject)
      // 大屏发生变化时更新
      event.on('project-panel.updateArt', self.updateArt)
      // 初始化调用一次获取数据
      self.getProjects()
    }

    // 最近访问新增一个大屏
    const createResentProject = (id) => {
      const index = self.recentProjectIds.findIndex((projectId) => projectId === id)
      if (index === -1) {
        self.recentProjectIds.unshift(id)
      } else {
        const id = self.recentProjectIds.splice(index, 1)[0]
        self.recentProjectIds.unshift(id)
      }
      self.saveLocal()
    }

    // 更新大屏数据
    const updateArt = ({projectId, artId, ...params}) => {
      const project = self.projects.find((project) => project.projectId === projectId)
      project && project.arts.find((art) => art.artId === artId)?.set(params)
    }

    // 本地信息记录
    const applyLocal = () => {
      const {local} = self.env_
      const localSchema = local.get('SKRecentProject')
      localSchema && applySnapshot(self, localSchema)
      if (self.recentProjects_.length) {
        self.activeIndex = 2
      } else {
        self.activeIndex = 0
      }
    }

    // 本地信息存储
    const saveLocal = () => {
      const {local} = self.env_
      local.set('SKRecentProject', {
        recentProjectIds: self.recentProjectIds.toJSON(),
        isThumbnailVisible: self.isThumbnailVisible,
      })
    }

    // 获取项目数据
    const getProjects = flow(function* getProjects() {
      const {io, tip} = self.env_
      try {
        const projects = yield io.project.getProjects()
        self.applyLocal()
        // apply 之后 template 数据会丢失
        self.getTemplates()
        self.projects = projects.list
        self.projectSort = projects.projectSort
        self.state = 'success'
      } catch (error) {
        self.state = 'error'
        log.error(error.message)
        tip.error({content: '加载项目列表失败'})
      }
    })

    // 获取模板数据
    const getTemplates = flow(function* getTemplates() {
      const {io, tip} = self.env_
      try {
        // art 表示用户自定义模板
        const templates = yield io.project.getTemplates({source: 'art'})
        self.templates = templates.list
      } catch (error) {
        log.error(error.message)
        tip.error({content: '加载模板列表失败'})
      }
    })

    // 项目置顶
    const toggleProjectTop = flow(function* toggleProjectTop(project, isTop) {
      const {io, tip} = self.env_
      try {
        yield io.user.top({
          ':type': 'project',
          id: project.projectId,
          action: isTop ? 'top' : 'cancel',
        })
        self.getProjects()
      } catch (error) {
        log.error(error.message)
        tip.error({content: '置顶失败'})
      }
    })

    // 切换展示方式
    const toggleDisplay = () => {
      self.isThumbnailVisible = !self.isThumbnailVisible
      self.saveLocal()
    }

    // 创建新的项目
    const createProject = flow(function* createProject({name, description}, callback) {
      const {io, event, tip} = self.env_
      if (!name) {
        tip.error({content: '项目名称不可为空'})
        return
      }
      if (!check('folderName', name)) {
        tip.error({content: '项目名称不符合规范，请输入1～32位中英文、数字、下划线'})
        return
      }
      try {
        yield io.project.create({name, description})
        event.fire('editor.finishCreate', {type: 'project'})
        tip.success({content: '新建项目成功'})
        self.getProjects()
        callback()
      } catch (error) {
        log.error(error)
        tip.error({content: `新建项目失败：${error.message}`})
      }
    })

    return {
      afterCreate,
      getProjects,
      getTemplates,
      applyLocal,
      saveLocal,
      updateArt,
      toggleProjectTop,
      toggleDisplay,
      createProject,
      createResentProject,
    }
  })
