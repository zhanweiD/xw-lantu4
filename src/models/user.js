import {types, getEnv, flow, getRoot} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import i18n from "@i18n"
import {MOrganizationItem} from "./organization/organization-item"
import {MCreateOrganizationModal} from "./organization/organization-modal-list"

// 后续组织信息
export const MUser = types
  .model({
    isHideDropMenu: types.optional(types.boolean, true),
    userId: types.optional(types.number, 0),
    isMaster: types.optional(types.boolean, false),
    maxOrg: 0,
    maxArt: 0,
    dataPermission: 0,
    permissions: types.optional(types.array(types.string), []),
    nickname: "",
    email: types.maybeNull(types.string),
    mobile: "",
    avatar: types.maybeNull(types.string),
    organizationId: types.maybeNull(types.number),
    levelType: types.optional(types.string, "personal"),
    organizationList: types.optional(types.array(MOrganizationItem), []),
    organizationName: types.maybe(types.string),
    language: types.optional(types.string, i18n.language)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    getOganization_(organizationId) {
      return self.organizationList.find(
        (item) => item.organizationId === organizationId
      )
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      self.getOrganizationList()
    }
    const changeLanguage = (lang = "zh-CN") => {
      self.language = lang
      i18n.changeLanguage(lang)
    }
    const hasPermission = (permissionCode = "", permissions = []) => {
      if (
        self.isMaster ||
        self.permissions.includes(permissionCode) ||
        permissions.includes(permissionCode)
      ) {
        return true
      }
      return false
    }
    // 退出登陆
    const logout = flow(function* logout() {
      const {io} = self.env_
      try {
        yield io.auth.logout()
      } catch (error) {
        // w.tip.error({content: error.message, isManuallyClose: true})
      }
    })
    // 是否是下拉状态
    const hideDropMenu = (hide = true) => {
      self.isHideDropMenu = hide
    }

    const getOrganizationList = flow(function* getOrganizationList() {
      const {io, tip} = self.env_
      try {
        const content = yield io.organization.getOrganizationList()
        self.organizationList = content
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
      }
    })
    // 退出登陆
    const changeUserDetail = flow(function* changeUserDetail(values) {
      const {io, tip} = self.env_
      try {
        const content = yield io.user.update(values)
        Object.keys(values).forEach((e) => {
          self[e] = content[e]
        })
        tip.success({content: "修改成功！"})
      } catch (error) {
        // 错误日志
        tip.error({content: error.message, isManuallyClose: true})
      }
    })

    const showCreateOrganizationModal = () => {
      const {tip} = self.env_
      const modal = self.root_.overlayManager.get("fieldModal")

      modal.show({
        attachTo: false,
        title: "新建组织",
        content: MCreateOrganizationModal.create(),
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
            action: (value) => {
              value.name = value.name.trim()
              if (
                value.name === "个人空间" ||
                value.name === "PersonalSpace" ||
                self.organizationList.find(
                  (item) =>
                    item.organizationName === value.name && item.isMaster
                )
              ) {
                tip.error({content: "organization.originalExist"})
              } else {
                self.createOrganization(value)
              }
            }
          }
        ]
      })
    }

    /**
     * 新建组织
     * value {
     *  @param {String} name 组织名称
     *  @param {String} description 组织描述
     * }
     */
    const createOrganization = flow(function* createOrganization(value) {
      const {io, tip} = self.env_
      const modal = self.root_.overlayManager.get("fieldModal")
      console.log("value", value)
      try {
        yield io.organization.create(value)
        // 新建组织后调用接口获取最新组织列表
        getOrganizationList()
        // TOOD 使用多语言处理  这里会切换到那个组织里面去的
        tip.success({content: "组织新建成功"})
        modal.hide()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        return false
      }
      return true
    })
    // TODO 删除和退出组织都会影响后续后退的按钮处理， 因为大屏开发的初始页面路由对应组织没了
    const removeOrganization = flow(function* removeOrganization(
      organizationId
    ) {
      const {io, tip} = self.env_
      try {
        yield io.organization.removeOrganization({
          ":organizationId": organizationId
        })
        getOrganizationList()
        const modal = self.root_.overlayManager.get("fieldModal")
        modal.hide()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
      }
    })
    const quitOrganization = flow(function* quitOrganization(organizationId) {
      const {io, tip} = self.env_
      try {
        yield io.organization.quitOrganization({
          ":organizationId": organizationId
        })
        getOrganizationList()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
      }
    })
    // 设置和取消设置登陆默认的组织跳转
    const changeLoginDefault = flow(function* changeLoginDefault(
      organizationId,
      isDefault
    ) {
      const {io, tip} = self.env_
      try {
        yield io.user.changeLoginDefault({organizationId, isDefault})
        getOrganizationList()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
      }
    })

    // TODO 有一个提示确认的弹框 让用户保存后确认
    const changechangeWorkspace = flow(function* changechangeWorkspace(
      organizationId
    ) {
      const {io, session, tip} = self.env_
      try {
        yield io.user.changeWorkspace({organizationId})
        // 清理session
        session.data({})
        // 页面刷新
        window.location.reload()
      } catch (error) {
        // 错误日志
        tip.error({content: error.message, isManuallyClose: true})
      }
    })

    return {
      afterCreate,
      changeLanguage,
      hasPermission,
      logout,
      hideDropMenu,
      getOrganizationList,
      changechangeWorkspace,
      changeLoginDefault,
      createOrganization,
      removeOrganization,
      quitOrganization,
      changeUserDetail,
      showCreateOrganizationModal
    }
  })
