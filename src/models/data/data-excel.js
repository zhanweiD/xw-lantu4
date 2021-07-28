/**
 * @author 南风
 * @description Excel数据类型
 */
import {types, getEnv, getParent} from "mobx-state-tree"
import {createConfigModelClass} from "@components/field"
import commonAction from "@utils/common-action"
import {flow} from "mobx"
import configs from "@utils/config"

const MExcelOptions = createConfigModelClass("MExcelOptions", {
  sections: ["optionPanel.excelInfo"],
  fields: [
    {
      section: "optionPanel.excelInfo",
      option: "row",
      field: {
        type: "number",
        label: "optionPanel.dataRows",
        defaultValue: 0,
        readOnly: true
      }
    },
    {
      section: "optionPanel.excelInfo",
      option: "limit",
      field: {
        type: "number",
        label: "optionPanel.limitRow",
        defaultValue: 100
      }
    },
    {
      section: "",
      option: "isSetAlias",
      field: {
        type: "switch",
        label: "optionPanel.setAlias",
        defaultValue: false
      }
    }
  ]
})

const Columns = types.model("Columns", {
  type: types.string,
  name: types.string,
  alias: ""
})

export const MExcel = types
  .model("MExcel", {
    hasExcel: types.maybe(types.boolean, false),
    columns: types.optional(types.array(Columns), []),
    data: types.optional(types.frozen(), {}),
    options: types.optional(MExcelOptions, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get data_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
  .actions(commonAction(["getSchema"]))
  .actions((self) => {
    const setDataType = (key, value) => {
      key.type = value
    }
    const setAlias = (col, value) => {
      col.alias = value
    }

    const getConfig = () => {
      const config = {...self.config}
      const {row, limit} = self.options.getSchema()
      config.row = row
      config.limit = limit
      return {
        ...config,
        data: self.data
      }
    }

    const loadFiles = flow(function* loadFiles(files) {
      const {tip} = self.env_
      try {
        const formData = new FormData()
        formData.append("file", files[0])
        const result = yield fetch(`${configs.urlPrefix}data/parse/excel`, {
          method: "POST",
          body: formData,
          header: {
            "Content-Type": "multipart/*"
          }
        })

        result.json().then((response) => {
          try {
            self.set({
              data: response.content.data,
              columns: response.content.columns,
              hasExcel: true
            })
            self.options.setSchema({
              row: response.content.data.length || 0
            })
            self.data_.updateDataField(response.content.columns)
            tip.success({content: "Excel解析成功"})
          } catch (error) {
            tip.error({content: "Excel解析失败"})
          }
        })
      } catch (error) {
        console.log(error, "error")
        tip.error({content: "Excel解析失败"})
      }
    })

    return {
      setDataType,
      setAlias,
      getConfig,
      loadFiles
    }
  })
