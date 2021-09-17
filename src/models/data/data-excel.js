import {types, getEnv, getParent} from 'mobx-state-tree'
import {createConfigModelClass} from '@components/field'
import commonAction from '@utils/common-action'
import {flow} from 'mobx'
import configs from '@utils/config'
import createLog from '@utils/create-log'

const log = createLog('@models/data/data-json')

const MExcelOptions = createConfigModelClass('MExcelOptions', {
  sections: ['optionPanel.excelInfo'],
  fields: [
    {
      section: 'optionPanel.excelInfo',
      option: 'row',
      field: {
        type: 'number',
        label: 'optionPanel.dataRows',
        defaultValue: 0,
        readOnly: true,
      },
    },
    {
      section: 'optionPanel.excelInfo',
      option: 'limit',
      field: {
        type: 'number',
        label: 'optionPanel.limitRow',
        defaultValue: 100,
        min: 1,
        max: 200,
      },
    },
    {
      section: '',
      option: 'isSetAlias',
      field: {
        type: 'switch',
        label: 'optionPanel.setAlias',
        defaultValue: false,
      },
    },
  ],
})

const Columns = types.model('Columns', {
  type: types.string,
  name: types.string,
  alias: '',
})

export const MExcel = types
  .model('MExcel', {
    hasExcel: types.maybe(types.boolean, false),
    columns: types.optional(types.array(Columns), []),
    data: types.optional(types.frozen(), {}),
    options: types.optional(MExcelOptions, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get data_() {
      return getParent(self, 1)
    },
  }))
  .actions(commonAction(['set', 'getSchema']))
  .actions(commonAction(['getSchema']))
  .actions((self) => {
    const setDataType = (key, value) => {
      key.type = value
    }
    const setAlias = (col, value) => {
      col.alias = value
    }

    // 加载表格
    const loadFiles = flow(function* loadFiles(files) {
      self.data_.set({state: 'loading'})
      const {tip} = self.env_
      try {
        const formData = new FormData()
        formData.append('file', files[0])
        const result = yield fetch(`${configs.urlPrefix}data/parse/excel`, {
          method: 'POST',
          body: formData,
          header: {
            'Content-Type': 'multipart/*',
          },
        })

        result.json().then((response) => {
          try {
            // code异常捕获
            if (response.code === 'ERROR_EXCEL_CLOUMSN_TOO_MUCH') {
              tip.error({content: '该excel文件列数过多(>100)，请检查文件'})
              self.data_.set({state: 'loadError'})
              return
            }
            // 文件夹为空时不通过
            if (response.content.data.length === 0) {
              tip.error({content: 'excel为空或格式有误，请检查文件'})
              self.data_.set({state: 'loadError'})
              return
            }
            // 赋值给excel
            self.set({
              data: response.content.data,
              columns: response.content.columns.map((x) => ({
                ...x,
                name: x.name.toString(),
              })),
              hasExcel: true,
            })
            self.options.setSchema({
              row: response.content.data.length || 0,
            })
            self.data_.updateDataField(response.content.columns)
            tip.success({content: 'Excel解析成功'})
            self.data_.set({state: 'loadSuccess'})
          } catch (error) {
            log.error(error, 'error')
            tip.error({content: 'Excel解析失败'})
            self.data_.set({state: 'loadError'})
          }
        })
      } catch (error) {
        log.error(error, 'error')
        tip.error({content: 'Excel解析失败'})
        self.data_.set({state: 'loadError'})
      }
    })

    // 给表格赋值，现在的表格逻辑：加载仅是加载，保存通过json保存（待优化）
    const setData = (data) => {
      const {tip} = self.env_
      const {config, fileData} = data
      try {
        self.options.setSchema({...config})
        const excelData = JSON.parse(fileData)
        self.set({
          data: excelData.data,
          columns: excelData.columns,
          hasExcel: excelData.data.length > 0,
        })
      } catch (error) {
        tip.error({content: 'Excel解析失败'})
      }
    }

    return {
      setDataType,
      setAlias,
      loadFiles,
      setData,
    }
  })
