import {types, getEnv} from 'mobx-state-tree'
import isPlainObject from 'lodash/isPlainObject'
import onerStorage from 'oner-storage'
import hJSON from 'hjson'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
import {transform} from './exhibit-config'
import {MDataField} from '../builders/data-section'

// 根据schema创建组件独有的模型
export const createExhibitModelClass = (exhibit) => {
  const {config} = exhibit

  const MExhibit = types
    .model(`MExhibit${config.key}`, {
      id: types.optional(types.string, ''),
      lib: types.optional(types.enumeration(['wave', 'echarts']), 'wave'),
      key: types.optional(types.string, ''),
      icon: types.optional(types.string, ''),
      name: types.optional(types.string, config.name),
      initSize: types.frozen(config.layout()),
      context: types.frozen(),
      normalKeys: types.frozen(['id', 'lib', 'key', 'initSize']),
      deepKeys: types.frozen(['layers', 'data', 'dimension']),
    })
    .views((self) => ({
      get art_() {
        return getEnv(self).art
      },
      get event_() {
        return getEnv(self).event
      },
      get globalData_() {
        return getEnv(self).globalData
      },
      get projectData_() {
        return getEnv(self).projectData
      },
      get officialData_() {
        return getEnv(self).officialData
      },
    }))
    .actions(commonAction(['set', 'getSchema', 'setSchema', 'dumpSchema']))
    .actions((self) => {
      const afterCreate = () => {
        // setTimeout(() => {
        //   self.dumpSchema()
        // }, 10000)
      }
      const setCachedData = (data) => {
        self.cachedData = data
      }

      const setContext = (context) => {
        self.context = context
      }
      const setAdapter = (adapter) => {
        self.adapter = adapter
      }

      const getObjectData = (nodes) => {
        const {sections, fields} = nodes
        let values = {}
        if (isDef(sections)) {
          Object.values(sections).forEach((node) => {
            if (!isDef(node.effective) || node.effective) {
              values[node.name] = {
                ...node.fields,
              }

              if (node.sections) {
                values[node.name] = {...values[node.name], ...getObjectData(node)}
              }
            }
          })
        }
        if (isDef(fields)) {
          values = {
            ...values,
            ...nodes.fields,
          }
        }

        return values
      }

      const getLayers = () => {
        const layers = self.layers.map((layer) => {
          const {id, type, name, options, effective} = layer.getSchema()
          let values = {
            id,
            name,
            type,
            effective,
          }
          if (effective) {
            values = {
              id,
              name,
              type,
              effective,
              options: getObjectData(options),
            }
            if (config.key !== 'demo') {
              values.data = layer.getData()
            }
            self.addOptionUtil(values)
          }

          return values
        })

        return layers
      }

      const setLayers = (layers) => {
        self.layers = layers
      }

      const addLayer = () => {
        console.log('addLayer')
      }

      // 这里是每一个层需要做的事情，暂时未实现，先占位
      const doSomething = () => {
        console.log('open menu')
      }

      const setData = (data) => {
        const relationModels = []
        self.layers.forEach((layer) => {
          relationModels.push(...layer.options.getRelationFields('columnSelect'))
        })

        relationModels.push(...self.dimension.getRelationFields('columnSelect'))

        self.data = MDataField.create(
          {
            type: 'data',
            sectionStyleType: 0,
            relationModels,
            value: {
              type: 'private',
              private: hJSON.stringify(data, {space: 2, quotes: 'strings', separator: true}),
            },
          },
          {
            art: self.art_,
            event: self.event_,
            globalData: self.globalData_,
            projectData: self.projectData_,
            officialData: self.officialData_,
          }
        )
      }

      const setDimension = (dimension) => {
        const {id} = self
        const {sections, fields} = dimension
        const MDimension = transform({id, sections, fields})

        self.dimension = MDimension.create()
      }

      const getDimension = () => {
        const schema = self.dimension.getSchema()
        return getObjectData(schema)
      }

      const getData = () => {
        const {type, private: privateData} = self.data.getSchema()
        let data
        if (type === 'private') {
          data = hJSON.parse(privateData)
        }
        return data
      }

      // 在带有options属性的对象上, 添加getOption和mapOption方法
      const addOptionUtil = (obj) => {
        if (isPlainObject(obj) && isPlainObject(obj.options)) {
          // storage化的options数据
          const storageOptions = onerStorage({
            type: 'variable',
            key: `exhibit-options-${self.id}`, // !!! 唯一必选的参数, 用于内部存储 !!!
          })

          storageOptions.data(obj.options)

          // 根据路径取得参数的便捷方式
          obj.getOption = (path) => {
            return storageOptions.get(path)
          }

          // 三文的需求，实验性开放
          obj.mapOption = (pairs = {}) => {
            console.info('!!! 收集什么时候使用这个方法？`getOption()`就应该可以满足 !!!')
            if (isPlainObject(pairs)) {
              const newStorageOptions = onerStorage({
                type: 'variable',
                key: `exhibit-new-options-${self.id}`, // !!! 唯一必选的参数, 用于内部存储 !!!
              })
              newStorageOptions.data({})
              Object.entries(pairs).map(([oldPath, newPath]) => {
                newStorageOptions.set(newPath, storageOptions.get(oldPath))
              })
              return newStorageOptions.get()
            }
            return {}
          }

          return obj
        }
        console.warn('obj不合法')
        return obj
      }

      return {
        afterCreate,
        setCachedData,
        setContext,
        setAdapter,
        addLayer,
        setLayers,
        getLayers,
        doSomething,
        setData,
        getData,
        setDimension,
        getDimension,
        addOptionUtil,
      }
    })

  return MExhibit
}
