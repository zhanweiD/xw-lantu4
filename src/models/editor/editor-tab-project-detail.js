/**
 * @author 南风
 * @description 项目详情tab
 */
import commonAction from "@utils/common-action"
import {flow, getEnv, getParent, getRoot, types} from "mobx-state-tree"
import {createConfigModelClass} from "@components/field"
import uuid from "@utils/uuid"
import {MProjectMember} from "./editor-tab-project-detail-member"
import {MDataTab} from "./editor-tab-data"

export const MProjectDetail = types
  .model({
    id: types.number,
    name: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    arts: types.optional(types.array(types.frozen()), []),
    members: types.optional(types.array(MProjectMember), []),
    filterMemberIds: types.optional(types.array(types.number), []),
    organizationMembers: types.optional(types.array(types.frozen()), []),
    data: types.optional(types.array(MDataTab), [])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get roleCodeMapping_() {
      return [
        {
          key: "成员",
          value: "project-member"
        },
        {
          key: "管理员",
          value: "project-admin"
        },
        {
          key: "只读成员",
          value: "project-readonly"
        }
      ]
    },
    get members_() {
      return self.filterMemberIds.length
        ? self.members.filter((member) =>
            self.filterMemberIds.includes(member.userId)
          )
        : self.members
    },
    get tab_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      self.getMembers()
      self.getData()
      event.on("projectDetail.getDetail", self.getDetail)
      event.on("projectDetail.getData", self.getData)
    }

    const getMembers = flow(function* getMembers() {
      const {io} = self.env_
      const {user} = self.root_
      try {
        const members = yield io.organization.getOrgMembers({
          ":organizationId": user.organizationId
        })
        self.organizationMembers = members.list
      } catch (error) {
        // TODO: 统一替换
        console.log("error")
      }
    })

    const update = flow(function* update() {
      const {io, event, tip} = self.env_
      const {id} = self
      try {
        yield io.project.update({
          ":projectId": id,
          name: self.name,
          description: self.description
        })
        event.fire("editor.finishUpdate", {
          type: "project"
        })
        event.fire("project-panel.getProjects")
        self.tab_.set({name: self.name})
      } catch (error) {
        // TODO: 统一替换
        console.log("error")
        tip.error({content: error.message})
      }
    })

    const removeConfirm = () => {
      if (self.arts.length) {
        self.root_.confirm({
          content: `确认删除"${self.name}"项目么? 删除之后无法恢复`,
          onConfirm: self.removeProject
        })
      } else {
        self.removeProject()
      }
    }

    const removeProject = flow(function* remove() {
      try {
        const {io, event} = self.env_
        yield io.project.remove({
          ":projectId": self.id
        })
        event.fire("editor.closeTab", self.id)
        event.fire("project-panel.getProjects")
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const getDetail = flow(function* getDetail() {
      try {
        const {io} = self.env_
        const project = yield io.project.getDetail({
          ":projectId": self.id
        })
        self.description = project.description
        self.arts = project.arts
        self.members = project.members
        self.getData()
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const addMembers = flow(function* addMembers({userIds, roleCode}) {
      const {io, tip, event} = self.env_
      try {
        yield io.project.addMembers({
          ":projectId": self.id,
          userIds,
          roleCode
        })
        event.fire("projectDetail.getDetail")
        tip.success({content: "添加成员成功！"})
        const modal = self.root_.overlayManager.get("fieldModal")
        modal.hide()
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        tip.error({content: "添加成员失败！"})
      }
    })

    const addMemberConfirm = () => {
      const modal = self.root_.overlayManager.get("fieldModal")

      const MFieldModdal = createConfigModelClass("MFieldModdal", {
        sections: ["__hide__"],
        fields: [
          {
            section: "__hide__",
            option: "userIds",
            field: {
              type: "select",
              label: "添加成员",
              option: "userIds",
              required: true,
              isMulti: true,
              options: self.organizationMembers
                .filter(
                  (member) =>
                    !self.members.find((m) => m.userId === member.userId)
                )
                .map((member) => ({
                  key: member.nickname,
                  value: member.userId
                }))
            }
          },
          {
            section: "__hide__",
            option: "roleCode",
            field: {
              type: "select",
              label: "成员角色",
              option: "roleCode",
              value: "project-member",
              options: self.roleCodeMapping_
            }
          }
        ]
      })
      modal.show({
        attachTo: false,
        title: "添加成员",
        content: MFieldModdal.create(),
        height: 160,
        buttons: [
          {
            name: "取消",
            action: () => {
              modal.hide()
            }
          },
          {
            name: "确定",
            action: (option) => {
              option.userIds = Array.isArray(option.userIds)
                ? option.userIds
                : [option.userIds]
              self.addMembers(option)
            }
          }
        ]
      })
    }

    const filterMember = (filterValue) => {
      filterValue
        ? self.set({
            filterMemberIds: self.members
              .filter((member) => member.roleCode === filterValue.value)
              .map((member) => member.userId)
          })
        : self.set({
            filterMemberIds: []
          })
    }

    // 授权
    const authorizeRole = flow(function* authorizeRole({
      roleCode,
      userIds = []
    }) {
      const {event, io, tip} = self.env_
      try {
        yield io.project.authorizeRole({
          ":projectId": self.id,
          userIds,
          roleCode
        })
        event.fire("projectDetail.getDetail")
        tip.success({content: "修改权限成功"})
      } catch (error) {
        console.log("MProjectPanel addMember: ", error)
        tip.error({content: "修改权限失败"})
      }
      return self.length
    })

    // 退出项目
    const removeMemberConfirm = ({nickname, userIds}) => {
      self.root_.confirm({
        content: `确认要删除成员‘${nickname}’吗？`,
        onConfirm: () => self.removeMembers({userIds})
      })
    }

    // 删除成员
    const removeMembers = flow(function* remove({userIds = []}) {
      const {event, io, tip} = self.env_
      try {
        yield io.project.removeMembers({
          ":projectId": self.id,
          userIds
        })
        event.fire("projectDetail.getDetail")
        tip.success({content: "删除成员成功"})
      } catch (error) {
        console.log("MProjectPanel addMember: ", error)
        tip.error({content: "删除成员失败"})
      }

      return self.length
    })

    // 退出项目
    const leaveConfirm = () => {
      self.root_.confirm({
        content: "确认退出本项目吗？",
        onConfirm: self.leave
      })
    }

    // 退出项目
    const leave = flow(function* leave() {
      const {event, io, tip} = self.env_
      try {
        yield io.project.quit({":projectId": self.projectId})
        event.fire("projectDetail.getDetail")
        tip.success({content: "删除成员成功"})
      } catch (error) {
        console.log("MProjectPanel addMember: ", error)
        tip.error({content: "删除成员失败"})
      }

      return self.length
    })

    // 数据相关
    // 打开相关的数据tab
    const openTabByData = ({data, type}) => {
      const {event} = self.env_
      let defaultDataName = "未命名数据"
      if (type === "excel") {
        defaultDataName = "新建Excel"
      } else if (type === "json") {
        defaultDataName = "新建JSON"
      } else if (type === "database") {
        defaultDataName = "新建SQL"
      } else if (type === "api") {
        defaultDataName = "新建API"
      }

      event.fire("editor.openTab", {
        id: data ? data.dataId : uuid(),
        name: data?.dataName || defaultDataName,
        type: "data",
        tabOptions: {
          isProject: true,
          dataType: type,
          projectId: self.id
        }
      })
    }

    // 新建数据
    const createMenu = (e, button) => {
      e.stopPropagation()
      const menu = self.root_.overlayManager.get("menu")
      const list = [
        {
          name: "新建Excel",
          action: () => {
            self.openTabByData({type: "excel"})
            menu.hide()
          }
        },
        {
          name: "新建JSON",
          action: () => {
            self.openTabByData({type: "json"})
            menu.hide()
          }
        },
        {
          name: "新建API",
          action: () => {
            self.openTabByData({type: "api"})
            menu.hide()
          }
        },
        {
          name: "新建SQL",
          action: () => {
            self.openTabByData({type: "database"})
            menu.hide()
          }
        }
      ]
      menu.toggle({
        attachTo: button,
        list
      })
    }

    const getData = flow(function* getData() {
      const {io, event} = self.env_
      try {
        const data = yield io.project.data.getDataList({
          ":projectId": self.id
        })
        self.set({
          data: data.list
        })
        // self.root_.sidebar.projectPanel.projects.find(x => x.projectId === self.id).updateData({dataList: data.list})
        event.fire(`projectThumbnail.updateData${self.id}`, {
          dataList: data.list
        })
      } catch (error) {
        // TODO: 统一替换
        console.log("error", error)
      }
    })

    const removeData = flow(function* removeData({dataId}) {
      const {io, event} = self.env_
      try {
        yield io.project.data.removeData({
          ":dataId": dataId,
          ":projectId": self.id
        })
        event.fire("projectDetail.getDetail")
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    return {
      getMembers,
      update,
      removeConfirm,
      removeProject,
      getDetail,
      addMemberConfirm,
      afterCreate,
      addMembers,
      filterMember,
      authorizeRole,
      removeMembers,
      removeMemberConfirm,
      leave,
      leaveConfirm,
      createMenu,
      openTabByData,
      getData,
      removeData
    }
  })
