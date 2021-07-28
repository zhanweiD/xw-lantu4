import {types} from "mobx-state-tree"
import {createConfigModelClass} from "@components/field"
import isDef from "@utils/is-def"
import makeFunction from "@utils/make-function"
import createEvent from "@utils/create-event"
import createLog from "@utils/create-log"
import {defaultDataProcessor} from "@utils/field-processor"

const log = createLog("@models/common/data-processor")

export const MDataProcessor = createConfigModelClass("MDataProcessor", {
  sections: [
    "optionPanel.inputData",
    "optionPanel.dataProcessor",
    "optionPanel.outputData"
  ],
  fields: [
    {
      section: "optionPanel.inputData",
      option: "inputCode",
      field: {
        type: "code",
        label:
          "执行要调试的触发事件，可获取对应事件的数据，作为下方数据处理函数的输入数据",
        defaultValue: "",
        height: 160
        // readOnlyCode: true,
      }
    },
    {
      section: "optionPanel.dataProcessor",
      option: "processorCode",
      field: {
        type: "code",
        height: 200,
        defaultValue: defaultDataProcessor
      }
    },
    {
      section: "optionPanel.outputData",
      option: "outputCode",
      field: {
        type: "code",
        label:
          "点击下方的`测试运行`按钮，可以复用当前的`输入数据`对`数据处理函数`进行测试",
        defaultValue: "",
        height: 100
      }
    }
  ]
})
  .props({
    // 如果有值，说明数据处理浮层是打开的，这个时候触发事件执行的数据处理函数是浮层内的。否则执行的是各自配置好的
    linkedId: types.maybe(types.string)
  })
  .views((self) => ({
    // 用于processor的参数
    get input() {
      let js
      try {
        // NOTE inputCode是数值，布尔，JSON字符串时，都可以正确解析
        js = JSON.parse(self.inputCode.getValue())
      } catch (error) {
        // inputCode是普通字符串
        js = self.inputCode.getValue()
      }
      return js
    },
    // 可执行的处理函数
    get processor() {
      return makeFunction(self.processorCode.getValue())
    }
  }))
  .actions((self) => {
    self.event = createEvent()

    // 执行数据处理
    // @param inputData 可选
    const process = (inputData) => {
      if (isDef(inputData)) {
        // 输入数据更新并展示
        self.inputCode.setValue(JSON.stringify(inputData, null, 2))
      }

      // 获取输出数据
      let output
      try {
        output = self.processor(self.input)
        // 展示输出数据
        self.outputCode.setValue(JSON.stringify(output, null, 2))
      } catch (error) {
        output = error.message
        // 展示错误信息
        self.outputCode.setValue(output)
        log.error(output, inputData)
      }

      console.log("output", output)

      return output
    }

    const save = () => {
      self.event.fire("save", {
        processorCode: self.processorCode.getValue()
      })
    }

    const reset = () => {
      self.linkedId = undefined
      self.event.off("save")
      self.inputCode.setValue("")
      self.processorCode.setValue(defaultDataProcessor)
      self.outputCode.setValue("")
    }

    return {
      process,
      save,
      reset
    }
  })
