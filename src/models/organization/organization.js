import {types, getEnv, getRoot} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import {MOrganizationMembers} from "./organization-members"
import {MOrganizationAddUserModal} from "./organization-add-user-modal"
/**
 * 组织模型
 */
export const MOrganization = types
  .model("MOrganization", {
    organizationId: types.number,
    logo: types.maybeNull(types.string),
    organizationName: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    // 组织创建者
    cname: types.optional(types.string, ""),
    userId: types.number,
    // 组织创建时间
    ctime: types.optional(types.number, 0),
    // 当前激活的组织ID
    members: types.optional(MOrganizationMembers, {}),
    addUserModal: types.optional(MOrganizationAddUserModal, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions(() => {
    const afterCreate = () => {
      console.log("MOrganization")
    }
    return {
      afterCreate
    }
  })
