import {types, flow, getEnv, getParent} from 'mobx-state-tree'
import makeFunction from '@utils/make-function'
import commonAction from '@utils/common-action'
import {createConfigModelClass} from '@components/field'
import createLog from '@utils/create-log'

const log = createLog('@models/data/data-api')

const defaultHeaders = `// 返回自定义的请求头(键值对)
 // 全局配置 默认为{}
 return function () {
   // 直接返回全局请求头
   return {
     //key1: 'value1',
     //key2: 'value2',
   }
 }`

const defaultQuery = `// 返回自定义的请求参数(键值对)
 return function () {
   return {
     //key1: 'value1',
     //key2: 'value2',
   }
 }`

const defaultBody = `// 返回自定义的Body数据(键值对)
 return function () {
   return {
     //key1: 'value1',
     //key2: 'value2',
   }
 }`

const defaultDataProcessorCode = `return function ({content}) {
   return content
 }`

const MApiOptions = createConfigModelClass('MApiOptions', {
  id: types.maybe(types.number),
  sections: ['optionPanel.apiInfo'],
  fields: [
    {
      section: 'optionPanel.apiInfo',
      option: 'url',
      field: {
        type: 'text',
        label: 'optionPanel.filePath',
        defaultValue: '',
      },
    },
    {
      section: 'optionPanel.apiInfo',
      option: 'method',
      field: {
        type: 'select',
        label: 'optionPanel.method',
        defaultValue: 'GET',
        options: [
          {
            key: 'GET',
            value: 'GET',
          },
          {
            key: 'POST',
            value: 'POST',
          },
          {
            key: 'PUT',
            value: 'PUT',
          },
        ],
      },
    },
  ],
})

const MApiCodeOptions = createConfigModelClass(
  'MApiCodeOptions',
  {
    id: types.maybe(types.number),
    sections: [
      'dataPanel.headers',
      'dataPanel.queries',
      'dataPanel.body',
      'optionPanel.dataProcessor',
      // {
      //   section: 'optionPanel.dataProcessor',
      //   fields: [
      //     {
      //       type: 'sectionConfig',
      //       option: 'useDataProcessor',
      //       defaultValue: true,
      //       readOnly: false,
      //       icon: 'checkbox',
      //     },
      //   ],
      // },
    ],
    fields: [
      {
        section: 'dataPanel.headers',
        option: 'headers',
        field: {
          type: 'code',
          defaultValue: defaultHeaders,
          readOnly: false,
          height: 300,
        },
      },
      {
        section: 'dataPanel.queries',
        option: 'query',
        field: {
          type: 'code',
          defaultValue: defaultQuery,
          readOnly: false,
          height: 300,
        },
      },
      {
        section: 'dataPanel.body',
        option: 'body',
        when: {
          key: 'method',
          value: 'POST',
        },
        field: {
          type: 'code',
          defaultValue: defaultBody,
          readOnly: false,
          height: 300,
        },
      },
      // 不太优雅的实现方式和丛鱼聊下怎么改
      {
        section: '',
        option: 'method',
        field: {
          type: 'text',
          defaultValue: '',
        },
      },
      {
        section: 'optionPanel.dataProcessor',
        option: 'useDataProcessor',
        field: {
          type: 'switch',
          label: 'optionPanel.dataProcessor',
          defaultValue: false,
        },
      },
      {
        section: 'optionPanel.dataProcessor',
        option: 'dataProcessor',
        field: {
          type: 'code',
          defaultValue: defaultDataProcessorCode,
          readOnly: true,
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
          defaultValue: '{}',
          readOnlyCode: true,
          height: 300,
        },
      },
    ],
  },
  {
    // allSection: types.optional(types.array(MSection), []),
  }
)

export const MApi = types
  .model('MApi', {
    id: types.maybe(types.number),
    options: types.optional(MApiOptions, {}),
    codeOptions: types.optional(MApiCodeOptions, {}),

    result: types.frozen(),
    body: types.optional(
      types.string,
      `// 返回自定义的Body数据(键值对)
   return function () {
     return {
       //key1: 'value1',
       //key2: 'value2',
     }
   }`
    ),
    query: types.optional(
      types.string,
      `// 返回自定义的请求参数(键值对)
   return function () {
     return {
       //key1: 'value1',
       //key2: 'value2',
     }
   }`
    ),
    headers: types.optional(
      types.string,
      `// 返回自定义的请求头(键值对)
   // 全局配置 默认为{}
   return function () {
     // 直接返回全局请求头
     return {
       //key1: 'value1',
       //key2: 'value2',
     }
   }`
    ),
    normalKeys: types.frozen(['query', 'headers', 'body']),
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
  .actions((self) => {
    // 获取结果
    const getResult = flow(function* getResult() {
      const {tip, io} = self.env_
      const {method, url} = self.options.getSchema()
      const {dataProcessor, useDataProcessor} = self.codeOptions.getSchema()
      if (!url) {
        tip.error({content: 'url不能为空'})
        self.data_.updateDataField([])
        return
      }

      let queries
      let headers
      let body = {}

      try {
        headers = makeFunction(self.codeOptions.headers.value)()
      } catch (headersProcessError) {
        headers = {}
        tip.error({content: '请求头解析出错，请检查代码'})
        self.data_.updateDataField([])
        return
      }

      try {
        queries = makeFunction(self.codeOptions.query.value)()
      } catch (queryProcessError) {
        queries = {}
        tip.error({content: '请求参数解析出错，请检查代码'})
        self.data_.updateDataField([])
        return
      }

      if (method === 'POST') {
        try {
          body = makeFunction(self.codeOptions.body.value)()
        } catch (bodyProcessError) {
          body = {}
          tip.error({content: '请求体解析出错，请检查代码'})
          self.data_.updateDataField([])
          return
        }
      }

      try {
        const response = yield io.data.proxy({
          method,
          url,
          body,
          queries,
          headers,
        })
        if (useDataProcessor) {
          try {
            let result = makeFunction(dataProcessor)({content: response})
            result = JSON.stringify(result, null, 2)
            self.codeOptions.setValues({result})
            self.data_.updateDataField(JSON.parse(result))
          } catch (error) {
            tip.error({content: '数据处理函数失败'})
            self.data_.updateDataField([])
            return
          }
        } else {
          const result = JSON.stringify(response, null, 2)
          self.codeOptions.setValues({result})
          self.data_.updateDataField(JSON.parse(result))
        }
        tip.success({content: '请求成功'})
      } catch (error) {
        tip.error({content: '请求发起失败，请检查填写的api信息'})
        self.data_.updateDataField([])
        self.result = JSON.stringify(error, null, 2)
        log.error('getApiResult.Error:', error)
      }
    })

    const onOptionsChange = (options) => {
      self.codeOptions.setValues({method: options.method})
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

    const setData = (data) => {
      const {processorFunction, config} = data
      const {url, method, headers, qs, body, useDataProcessor} = config

      self.options.setValues({url, method})
      self.codeOptions.setValues({
        headers,
        dataProcessor: processorFunction,
        query: qs,
        useDataProcessor: typeof useDataProcessor === 'boolean' ? useDataProcessor : true,
        method,
      })
      body && self.codeOptions.setValues({body})
    }

    return {
      getResult,
      onOptionsChange,
      setData,
    }
  })
