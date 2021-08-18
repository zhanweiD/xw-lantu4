import {types, getEnv, flow, applySnapshot, getRoot} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import {MProjectToolbar} from "./project-toolbar"
import {MProjectThumbnail} from "./project-thumbnail"
import {MArtThumbnail} from "../art/art-thumbnail"

export const MProjectPanel = types
  .model({
    name: "projectPanel",
    templates: types.optional(types.array(MArtThumbnail), []),
    projects: types.optional(types.array(MProjectThumbnail), []),
    projectSort: types.optional(types.array(types.number), []),
    // 最近访问的大屏
    recentProjectIds: types.optional(types.array(types.number), []),
    // 搜索工具栏
    toolbar: types.optional(MProjectToolbar, {}),
    // 激活的 Tab 索引
    activeIndex: types.optional(types.number, 2),
    // 对应 Loading 组件的状态
    state: types.optional(types.enumeration(["loading", "success", "error"]), "loading")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get recentProjects_() {
      return self.recentProjectIds.map((id) => self.projects.find(({projectId}) => id === projectId)).filter(Boolean)
    },
    get hasProject_() {
      return self.projects.length
    },
    get projects_() {
      const basicProjects = []
      const topProjects = []
      self.projects.forEach((project) => {
        if (self.projectSort.includes(project.projectId)) {
          topProjects.push(project)
        } else {
          basicProjects.push(project)
        }
      })
      return {basicProjects, topProjects}
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      // 项目变化时更新
      event.on("project-panel.getProjects", self.getProjects)
      // 模板变化时更新
      event.on("project-panel.getTemplates", self.getTemplates)
      // 最近访问发生变化时更新
      event.on("project-panel.createRecentProject", self.createResentProject)
      // 大屏发生变化时更新
      event.on("project-panel.project.updateArt", self.updateArt)
      // 初始化调用一次获取数据
      self.getProjects()
      self.getTemplates()
      self.applyLocal()
    }

    // 最近访问新增一个大屏
    const createResentProject = (id) => {
      if (!self.recentProjectIds.includes(id)) {
        self.recentProjectIds.unshift(id)
        self.saveLocal()
      }
    }

    // 更新大屏数据
    const updateArt = ({projectId, artId, ...params}) => {
      const project = self.projects.find((project) => project.projectId === projectId)
      project && project.arts.find((art) => art.artId === artId)?.set(params)
    }

    // 本地信息记录
    const applyLocal = () => {
      const {local} = self.env_
      const localSchema = local.get("SKRecentProject")
      localSchema && applySnapshot(self, localSchema)
    }

    // 本地信息存储
    const saveLocal = () => {
      const {local} = self.env_
      local.set("SKRecentProject", {
        recentProjectIds: self.recentProjectIds,
        toolbar: self.toolbar
      })
    }

    // 获取项目数据
    const getProjects = flow(function* getProjects() {
      const {io, tip} = self.env_
      try {
        const projects = yield io.project.getProjects()
        self.projects = projects.list
        self.projectSort = projects.projectSort
        self.state = "success"
      } catch (error) {
        self.state = "error"
        tip.error({content: "加载项目列表失败"})
      }
    })

    // 获取模板数据
    const getTemplates = flow(function* getTemplates() {
      const {io, tip} = self.env_
      try {
        // art 表示用户自定义模板
        const templates = yield io.project.getTemplates({source: "art"})
        self.templates = templates.list
      } catch (error) {
        self.state = "error"
        tip.error({content: "加载模板列表失败"})
      }
    })

    // 项目置顶
    const toggleProjectTop = flow(function* toggleProjectTop(project, isTop) {
      const {io, tip} = self.env_
      try {
        if (isTop || self.projectSort.includes(project.projectId)) {
          self.projectSort = self.projectSort.filter((sortId) => sortId !== project.projectId)
        } else {
          self.projectSort.push(project.projectId)
        }
        yield io.user.top({
          ":type": "project",
          organizationId: self.root_.user.organizationId,
          sortArr: self.projectSort
        })
      } catch (error) {
        tip.error({content: "置顶失败"})
      }
    })

    return {
      afterCreate,
      getProjects,
      getTemplates,
      createResentProject,
      applyLocal,
      saveLocal,
      updateArt,
      toggleProjectTop
    }
  })
