import {types} from "mobx-state-tree"

import isFunction from "lodash/isFunction"
import commonAction from "@utils/common-action"

// 模态框模型
export const MUserModal = types
  .model("MUserModal", {
    // 是否显示
    isVisible: types.optional(types.boolean, false),
    // modal的标题
    title: types.optional(types.string, "提示"),
    // field组件
    fields: types.optional(types.array(types.frozen()), []),
    // 底部
    footer: types.optional(types.frozen(), ""),

    // 宽度
    width: types.optional(types.number, 360),
    // 提示信息
    tips: types.optional(types.frozen(), null),

    // 错误信息
    error: types.optional(types.frozen(), {}),
    // 当前数据
    fieldData: types.frozen(),

    // ⏰定时器
    timer: types.frozen(),

    // 当前modal状态是否点击✅确定按钮可被关闭
    canConfirm: types.optional(types.boolean, false)
  })
  .actions(commonAction(["set"]))
  .actions((self) => ({
    // 打开modal
    // 两种用法   1. 传入完整到数据
    //           2. 简易模式，传入key，callback形式，第一个参数为展示的内容{title, label}，第二个参数为回调函数
    open(keys = {}, callback) {
      if (isFunction(callback)) {
        self.set({
          fields: [
            {
              label: keys.label
            }
          ],
          title: keys.title,
          onConfirm: callback,
          isVisible: true
        })
        return
      }
      self.destroy()
      Object.keys(keys).map((v) => (self[v] = keys[v]))
      self.fields.forEach(({key, defaultValue}) =>
        self.setData(key, defaultValue || undefined)
      )
      self.isVisible = true
    },

    // 关闭modal
    onClose() {
      self.clearTimer()
      self.isVisible = false
    },

    // 清理定时器
    clearTimer() {
      clearInterval(self.timer)
      self.timer = null
    },

    // 设置fieldData值
    setData(key, value) {
      if (typeof key === "object") {
        self.fieldData = value
      } else {
        self.fieldData = {...self.fieldData, [key]: value}
      }
    },

    // 设置fieldData值
    setError(key, value) {
      if (typeof key === "object") {
        self.error = value
      } else {
        self.error = {...self.error, [key]: value}
      }
    },

    // 修改值
    changeData(values) {
      self.setData(values.key, values.value)
      self.onChange(self.fieldData)
    },

    // modal中代理onConfirm事件
    // onConfirm() {},
    // modal中代理onChange事件
    // onChange() {},

    // 恢复初始值
    destroy() {
      self.set({
        title: "",
        fields: [],
        footer: "",
        width: 360,
        tips: null,
        error: {},
        fieldData: {},
        canConfirm: false,
        isVisible: false,
        timer: null
      })
      // 清理方法
      self.onChange = () => {}
      self.Confirm = () => {}
    }
  }))
