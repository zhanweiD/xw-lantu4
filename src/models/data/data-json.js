import {types, getEnv, getParent} from 'mobx-state-tree'
import {createConfigModelClass} from '@components/field'
import commonAction from '@utils/common-action'
import makeFunction from '@utils/make-function'
import hJSON from 'hanson'
import createLog from '@utils/create-log'

// import {MSection} from '../common/section'

const log = createLog('@models/data/data-json')

const defaultDataProcessorCode = `// @param data {object} 原始数据
 return function ({data}) {
   return data
 }`

const MJsonCodeOptions = createConfigModelClass('MJsonCodeOptions', {
  id: types.identifier,
  sections: [
    'dataPanel.json',
    {
      section: 'optionPanel.dataProcessor',
      fields: [
        {
          type: 'sectionConfig',
          option: 'useDataProcessor',
          defaultValue: true,
          readOnly: false,
          icon: 'checkbox',
        },
      ],
    },
    'dataPanel.dataField',
  ],
  fields: [
    {
      section: 'dataPanel.json',
      option: 'data',
      field: {
        type: 'code',
        defaultValue: '',
        readOnly: false,
        height: 300,
        value: '{}',
        buttons: [
          {
            name: '格式化',
            position: 'left',
            action: (self) => {
              const parent = getParent(self, 1)
              parent.formatData()
            },
          },
        ],
      },
    },
    {
      section: 'optionPanel.dataProcessor',
      option: 'dataProcessor',
      field: {
        type: 'code',
        defaultValue: defaultDataProcessorCode,
        readOnly: false,
        height: 300,
        buttons: [
          {
            name: '执行',
            position: 'left',
            action: (self) => {
              const parent = getParent(self, 1)
              parent.getResult()
            },
          },
        ],
      },
    },
    {
      section: 'optionPanel.dataProcessor',
      option: 'result',
      field: {
        type: 'code',
        defaultValue: '',
        readOnlyCode: true,
        height: 300,
        value: '{}',
      },
    },
  ],
})

export const MJson = types
  .model('MJson', {
    codeOptions: types.optional(MJsonCodeOptions, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get data_() {
      return getParent(self, 1)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const onOptionsChange = (options) => {
      if (options.useDataProcessor === true) {
        self.codeOptions.setConfigs({
          dataProcessor: {readOnly: false},
        })
      } else {
        self.codeOptions.setConfigs({
          dataProcessor: {readOnly: true},
        })
      }
    }

    const getResult = () => {
      const {tip} = self.env_
      const {dataProcessor, data, useDataProcessor} = self.codeOptions.getSchema()
      if (useDataProcessor) {
        try {
          let result = makeFunction(dataProcessor)({data: hJSON.parse(data)})
          result = JSON.stringify(result, null, 2)
          self.codeOptions.setValues({result})
          self.data_.updateDataField(JSON.parse(result))

          // self.data_.isExhibit || tip.success({content: '数据处理函数成功'})
        } catch (error) {
          log.error(error)
          tip.error({content: '数据处理函数错误'})
          self.data_.updateDataField([])
        }
      } else {
        // tip.error({content: '数据处理函数未开启'})
        self.codeOptions.setValues({result: data})
        self.data_.updateDataField(JSON.parse(data))
      }
    }

    // 加载文件
    const loadFiles = (files) => {
      const {tip} = self.env_
      try {
        const reader = new FileReader()
        reader.readAsText(files[0], 'utf-8')
        reader.onload = () => {
          const {result} = reader
          const data = JSON.stringify(JSON.parse(result), null, 2)
          self.codeOptions.setValues({data})
        }
        tip.success({content: '数据加载成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: '数据加载失败'})
      }
    }

    // 格式化数据
    const formatData = () => {
      const {tip} = self.env_
      try {
        const originalData = self.codeOptions.data.value
        const data = JSON.stringify(hJSON.parse(originalData), null, 2)
        self.codeOptions.setValues({data})
        // if (isNotice) {
        //   tip.success({content: "数据格式化成功"})
        // }
      } catch (error) {
        log.error(error)
        tip.error({content: '数据格式化错误'})
      }
    }

    // 赋值
    const setData = (data) => {
      const {config} = data
      const {useDataProcessor} = config
      const codeOptions = {
        data: data.fileData,
        useDataProcessor: typeof useDataProcessor === 'boolean' ? useDataProcessor : true,
      }
      self.codeOptions.setValues(codeOptions)
      self.formatData()
      self.onOptionsChange(codeOptions)
      data.processorFunction &&
        self.codeOptions.setValues({
          dataProcessor: data.processorFunction,
        })
    }

    return {
      onOptionsChange,
      getResult,
      loadFiles,
      formatData,
      setData,
    }
  })
