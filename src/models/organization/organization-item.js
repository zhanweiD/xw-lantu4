import {types, getEnv, getParent, flow} from "mobx-state-tree"
import commonAction from "@utils/common-action"
// import {MOrganization} from './organization'

import {MOrganizationMembers} from "./organization-members"
import {MOrganizationAddUserModal} from "./organization-add-user-modal"

export const MOrganizationItem = types
  .model("MOrganizationItem", {
    organizationId: types.identifierNumber,
    joinTime: types.optional(types.number, 0),
    userId: types.optional(types.number, 0),
    organizationName: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    type: types.optional(types.number, 1),
    count: types.optional(types.number, 0),
    ctime: types.optional(types.number, 0),
    isMaster: types.optional(types.boolean, false),
    roleName: types.optional(types.string, ""),
    owner: types.optional(types.string, ""),
    permissions: types.optional(types.array(types.string), []),
    loginDefault: types.enumeration(["Y", "N"], "N"),
    isMouseOver: types.optional(types.boolean, false),
    // organization: types.maybe(MOrganization),
    // modal: types.optional(MUserModal, {}),
    members: types.maybe(MOrganizationMembers),
    addUserModal: types.optional(MOrganizationAddUserModal, {})
  })
  .views((self) => ({
    hasPermission(permissionCode = "") {
      if (self.isMaster || self.permissions.includes(permissionCode)) {
        return true
      }
      return false
    },
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      // console.log('MOrganizationItem afterCreate')
    }
    /**
     * 更新组织信息
     * value {
     *  @param {String} name 组织名称
     *  @param {String} description 组织描述
     * }
     */
    const updateOrganization = flow(function* updateOrganization(value) {
      const {io, tip} = self.env_
      console.log("value", value)
      try {
        yield io.organization.updateOrgById({
          ":organizationId": self.organizationId,
          ...value
        })
        // 新增组织后调用接口获取最新组织列表
        // TOOD 使用多语言处理  这里会切换到那个组织里面去的
        tip.success({content: "更新组织信息成功"})
        self.set({
          organizationName: value.name,
          description: value.description
        })
        const userM = getParent(self, 2)
        if (userM.organizationId === self.organizationId) {
          userM.set("organizationName", value.name)
        }
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        return false
      }
      return true
    })
    return {
      afterCreate,
      updateOrganization
    }
  })
