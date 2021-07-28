import {types} from "mobx-state-tree"

// 项目成员模型
export const MProjectMember = types.model("MProjectMember", {
  userId: types.number,
  avatar: types.optional(types.frozen(), ""),
  ctime: types.number,
  email: types.maybe(types.frozen()),
  isSelf: types.boolean,
  nickname: types.string,
  roleCode: types.string,
  roleName: types.string
})
