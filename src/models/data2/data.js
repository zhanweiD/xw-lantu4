import {types, flow, getEnv} from 'mobx-state-tree'
import makeFunction from '@utils/make-function'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import hJSON from 'hjson'

const log = createLog('@models/data2/data')

export const MData = types
  .model('MData', {
    dataId: types.maybe(types.number),
    dataName: types.maybe(types.string, ''),
    dataType: types.maybe(types.string, ''),
    processorFunction: types.maybe(types.string, ''),
    fileData: types.maybe(types.string, ''),
    config: types.frozen(),
  })
  .views((self) => ({
    get displayName_() {
      return `${self.dataType}: ${self.dataName}`
    },
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!self.dataName) {
        // TODO 根据dataId发起数据请求
      }
    }

    const getDataFrame = async ({headers = {}, queries = {}, body = {}}) => {
      const data = hJSON.parse(self.fileData || '')
      const {useDataProcessor = false} = self.config
      switch (self.dataType) {
        case 'excel':
          return data
        case 'json':
          return useDataProcessor ? makeFunction(self.processorFunction)({data}) : data
        case 'api':
          return fetch({headers, queries, body})
      }
    }

    const fetch = flow(function* getResult({headers, queries, body}) {
      const {io} = self.env_
      const {processorFunction, config} = self
      const {useDataProcessor = false, method, url} = config

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
        return {error}
      }

      try {
        realQueries = makeFunction(self.config.qs)()
        if (headers) {
          realQueries = {...realQueries, ...queries}
        }
      } catch (error) {
        realQueries = {}
        log.error({content: '请求头解析出错，请检查代码', error})
        return {error}
      }

      if (method === 'POST') {
        try {
          realBody = makeFunction(self.config.body)()
          if (headers) {
            realBody = {...realBody, ...body}
          }
        } catch (error) {
          realBody = {}
          log.error({content: '请求头解析出错，请检查代码', error})
          return {error}
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
            return makeFunction(processorFunction)({content: response})
          } catch (error) {
            log.error({content: '数据处理函数失败'})
            return {error}
          }
        } else {
          return response
        }
      } catch (error) {
        log.error({content: '请求发起失败', error})
        return {error}
      }
    })

    return {
      afterCreate,
      getDataFrame,
    }
  })
