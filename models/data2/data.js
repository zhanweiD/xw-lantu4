import {types, flow} from 'mobx-state-tree'
import io from '@utils/io'
import makeFunction from '@utils/make-function'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import hJSON from 'hjson'
import DataFrame from '@utils/data-frame'

const log = createLog('@models/data2/data')

export const MData = types
  .model('MData', {
    dataId: types.maybe(types.number),
    dataName: types.maybe(types.string, ''),
    dataType: types.maybe(types.string, ''),
    processorFunction: types.maybe(types.string, ''),
    data: types.maybe(types.string, ''),
    remark: types.maybe(types.string, ''),
    config: types.frozen(),
  })
  .views((self) => ({
    get displayName_() {
      return `${self.dataType}: ${self.dataName}`
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      // TODO
    }

    // 得到DataFrame对象
    const getDataFrame = (options) => {
      const data = hJSON.parse(self.data || '')
      const {useDataProcessor = false} = self.config

      // const {headers = {}, queries = {}, body = {}} = options
      switch (self.dataType) {
        case 'excel': {
          // const keys = data.columns.map((columns) => {
          //   return columns.name
          // })
          // const result = [keys]
          // data.data.forEach((item) => {
          //   const row = keys.map((key) => item[key])
          //   result.push(row)
          // })

          return Promise.resolve(new DataFrame({source: data.data}))
        }
        case 'json': {
          let source = data
          if (useDataProcessor) {
            try {
              source = makeFunction(self.processorFunction)({data})
            } catch (error) {
              return throwError(error)
            }
          }
          return Promise.resolve(new DataFrame({source}))
        }
        case 'api':
          return fetch(options)
        case 'database':
          return getSQLResult(options)
      }
    }

    // 请求接口
    const fetch = flow(function* getResult(options = {}) {
      const {processorFunction, config} = self
      const {useDataProcessor = false, method, url} = config
      const {headers, queries, body} = options

      if (!url) {
        log.error({content: 'url不能为空'})
        return {error: 'url不能为空'}
      }
      let realQueries
      let realHeaders
      let realBody = {}

      try {
        realHeaders = makeFunction(self.config.headers)()
        if (headers) {
          realHeaders = {...realHeaders, ...headers}
        }
      } catch (error) {
        realHeaders = {}
        log.error({content: '请求头解析出错，请检查代码', error})
        return throwError(error)
      }

      try {
        realQueries = makeFunction(self.config.qs)()
        if (queries) {
          realQueries = {...realQueries, ...queries}
        }
      } catch (error) {
        realQueries = {}
        log.error({content: '请求头解析出错，请检查代码', error})
        return throwError(error)
      }

      if (method === 'POST') {
        try {
          realBody = makeFunction(self.config.body)()
          if (body) {
            realBody = {...realBody, ...body}
          }
        } catch (error) {
          realBody = {}
          log.error({content: '请求头解析出错，请检查代码', error})
          return throwError(error)
        }
      }

      try {
        const response = yield io.data.proxy({
          method,
          url,
          body: realBody,
          queries: realQueries,
          headers: realHeaders,
        })
        if (useDataProcessor) {
          try {
            return new DataFrame({source: makeFunction(processorFunction)({content: response})})
          } catch (error) {
            log.error({content: '数据处理函数失败'})
            return throwError(error)
          }
        } else {
          return new DataFrame({source: response})
        }
      } catch (error) {
        log.error({content: '请求发起失败', error})
        return throwError(error)
      }
    })

    // 获取sql结果
    const getSQLResult = flow(function* getResult() {
      const {config, dataId, processorFunction} = self
      try {
        const response = yield io.data.getDatabaseResult({
          ':dataId': dataId,
          sql: config.sql,
        })
        if (config.useDataProcessor) {
          try {
            return new DataFrame({source: makeFunction(processorFunction)({content: response})})
          } catch (error) {
            log.error({content: '数据处理函数失败'})
            return throwError(error)
          }
        } else {
          return new DataFrame({source: response})
        }
      } catch (error) {
        log.error('getResult.Error:', error)
      }
    })

    const throwError = (error) => {
      // TODO 错误分类
      const result = new DataFrame({source: []})
      result.error = error
      return result
    }

    return {
      afterCreate,
      getDataFrame,
    }
  })
