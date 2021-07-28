/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-14 15:15:19
 * @Description: 添加用户的弹窗模型
 */
import {types, getEnv, flow, getParent} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import {MMemberItem} from "./organization-members"

export const MOrganizationAddUserModal = types
  .model("MOrganizationAddUserModal", {
    isVisible: types.optional(types.boolean, false),
    searchUsers: types.optional(types.array(MMemberItem), []),
    searchValue: types.optional(types.string, ""),
    addUsers: types.optional(types.array(MMemberItem), []),
    roleCode: types.optional(
      types.enumeration("RoleCode", ["admin", "member"]),
      "member"
    ),
    pageSize: types.optional(types.number, 10),
    // ⏰定时器
    timer: types.frozen()
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get options_() {
      return self.list.map((item) => {
        return {
          key: item.nickname,
          value: item.userId
        }
      })
    },
    get roles_() {
      return [
        {
          key: "成员",
          value: "member"
        },
        {
          key: "管理员",
          value: "admin"
        }
      ]
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {}
    // 防抖
    const doSearch = flow(function* doSearch() {
      self.timer = null
      const {io, tip} = self.env_
      const organizationM = getParent(self)
      try {
        const {list} = yield io.organization.search({
          search: self.searchValue,
          pageSize: self.pageSize,
          ":organizationId": organizationM.organizationId
        })
        self.searchUsers = list
        resetSearhUsers()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
      }
    })
    const search = (searchValue) => {
      self.searchValue = searchValue
      if (self.timer) {
        clearTimeout(self.timer)
        self.timer = setTimeout(() => {
          self.doSearch()
        }, 1000)
      } else {
        self.doSearch()
        self.timer = setTimeout(() => {}, 1000)
      }
    }
    const resetSearhUsers = () => {
      self.searchUsers.forEach((user) => {
        user.isAdded = false
        if (self.addUsers.find((item) => item.userId === user.userId)) {
          user.isAdded = true
        }
      })
    }
    const onCancel = () => {
      self.isVisible = false
      self.searchValue = ""
      self.searchUsers = []
      self.addUsers = []
      self.timer
    }
    const setSearchValue = (searchValue = "") => {
      self.searchValue = searchValue
    }
    const removeAddUser = (user) => {
      self.addUsers = self.addUsers.filter(
        (item) => item.userId !== user.userId
      )
      resetSearhUsers()
    }
    const addUser = (user) => {
      self.addUsers.push({...user})
      resetSearhUsers()
    }
    const changeRoleCode = (value) => {
      self.roleCode = value
    }
    const submit = flow(function* submit() {
      const {io, tip} = self.env_
      if (self.addUsers.length <= 0) return
      self.isVisible = false
      const userIds = self.addUsers.map((user) => user.userId)
      const organizationM = getParent(self)
      try {
        yield io.organization.addMembers({
          userIds,
          roleCode: self.roleCode,
          ":organizationId": organizationM.organizationId
        })
      } catch (error) {
        // 错误日志
        tip.error({content: error.message, isManuallyClose: true})
      }
      self.onCancel()
    })
    return {
      afterCreate,
      search,
      doSearch,
      setSearchValue,
      onCancel,
      removeAddUser,
      addUser,
      resetSearhUsers,
      submit,
      changeRoleCode
    }
  })
