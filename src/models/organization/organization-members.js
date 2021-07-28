import {types, flow, getEnv} from "mobx-state-tree"
import commonAction from "@utils/common-action"
// 成员管理
export const MMemberItem = types.model("MMemberItem", {
  userId: types.identifierNumber,
  // 昵称
  nickname: types.optional(types.string, ""),
  // 用户手机号 唯一标识
  mobile: types.optional(types.string, ""),
  // 角色 0 - 管理员 1 - 成员
  roleCode: types.optional(types.string, ""),
  roleName: types.optional(types.string, ""),
  // 邮箱
  email: types.maybeNull(types.string),
  // createTime
  ctime: types.optional(types.number, 0),
  // 判断此条数据是否是自己
  isSelf: types.optional(types.boolean, false),
  // 是否为超级管理员
  isMaster: types.optional(types.boolean, false),
  //
  isAdded: types.optional(types.boolean, false)
})

// 已加入成员模型
export const MOrganizationMembers = types
  .model("MOrganizationMembers", {
    organizationId: types.number,
    // export const MJoinedMember = types.model('MJoinedMember', {
    list: types.optional(types.array(MMemberItem), []),
    // 表格数据加载状态
    state: types.optional(
      types.enumeration("State", ["loading", "loadSuccess", "loadError"]),
      "loadSuccess"
    ),
    count: types.optional(types.number, 0),
    // 是否显示“没有更多了”文字条
    isNoMoreVisible: types.optional(types.boolean, false),
    // 请求的当前页数
    currentPage: types.optional(types.number, 0),
    // 请求的每页条数
    pageSize: types.optional(types.number, 5),
    searchValue: types.optional(types.string, ""),
    roleCode: types.optional(types.string, "")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get memmberCount_() {
      return self.list.length
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      console.log("MOrganizationMembers afterCreate")
      getList()
    }

    // 获取当前组织下所有已加入成员列表 组织id
    const getList = flow(function* getList(reTry = false) {
      const {io, tip} = self.env_
      if (self.isNoMoreVisible && !reTry) return self.state
      if (reTry === true) self.currentPage = 0
      try {
        if (self.state === "loading") return self.state
        self.state = "loading"
        // todo 分页处理： step？
        // ? 获取到到数据结构{count: 1, rows: [{...}]}
        const {count, list} = yield io.organization.getOrgMembers({
          ":organizationId": self.organizationId,
          currentPage: self.currentPage + 1,
          pageSize: self.pageSize,
          search: self.searchValue,
          roleCode: self.roleCode
        })
        self.count = count
        self.currentPage += 1
        // 判断当前是否是刷新，如果是刷新，则直接覆盖数据
        // yield new Promise(r => setTimeout(() => { r() }, 2000))
        self.list = reTry === true ? list : self.list.concat(list)
        // console.log(self.list.length)
        // 设置加载状态
        self.state = "loadSuccess"
        if (list.length < self.pageSize) {
          self.isNoMoreVisible = true
        }
      } catch (error) {
        self.state = "loadError"
        // 取消"没有更多"文字的显示，便于重新加载数据
        self.isNoMoreVisible = false
        // 错误日志
        tip.error({content: error.message, isManuallyClose: true})
      }
      return self.state
    })

    // 下拉加载更多,设置请求页数
    const setOffset = () => {
      if (self.list.length > self.limit) {
        self.offset += 1
      }
    }

    // 授权用户角色
    const updateMember = flow(function* updateMember(value, userId) {
      const {io, tip} = self.env_
      try {
        const {roleCode} = value
        const index = self.list.findIndex((i) => i.userId === userId)
        if (self.list[index].roleCode !== roleCode) {
          const roleInfo = yield io.organization.updateMember({
            ":organizationId": self.organizationId,
            ":userId": userId,
            roleCode
          })
          // 请求成功后,修改显示的角色
          self.list[index].roleCode = roleInfo.roleCode
          self.list[index].roleName = roleInfo.roleName
        }
      } catch (error) {
        // 错误日志
        tip.error({content: error.message, isManuallyClose: true})
      }
    })

    // 删除成员
    const remove = flow(function* remove(userId) {
      const {io, tip} = self.env_
      try {
        yield io.organization.removeMember({
          ":organizationId": self.organizationId,
          ":userId": userId
        })
        const index = self.list.findIndex((i) => i.userId === userId)
        self.list.splice(index, 1)
        // getList()
      } catch (error) {
        // 错误日志
        // log.error(`Remove user fail, ${error}`)
        tip.error({content: error.message, isManuallyClose: true})
      }
    })
    const search = flow(function* search() {
      self.currentPage = 0
      yield self.getList(true)
      // console.log('search', search)
    })
    return {
      getList,
      afterCreate,
      remove,
      updateMember,
      search,
      setOffset
    }
  })
