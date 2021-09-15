import {types, getEnv} from 'mobx-state-tree'
import isPlainObject from 'lodash/isPlainObject'
import commonAction from '@utils/common-action'
import onerStorage from 'oner-storage'
import hJSON from 'hjson'
import isDef from '@utils/is-def'
import {MDataField} from '../builders/data-section'

// 根据schema创建组件独有的模型
export const createExhibitModelClass = (exhibit) => {
  const {config, data} = exhibit

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
      deepKeys: types.frozen(['layers', 'data']),
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
      const getLayers = () => {
        const getLayerData = (nodes) => {
          const {sections} = nodes
          const values = {}

          Object.values(sections).forEach((node) => {
            if (!isDef(node.effective) || node.effective) {
              values[node.name] = {
                ...node.fields,
              }

              if (node.sections) {
                values[node.name] = {...values[node.name], ...getLayerData(node)}
              }
            }
          })

          return values
        }

        const layers = self.layers.map((layer) => {
          const {id, type, name, options, data} = layer.getSchema()

          // 原始options数据
          const layerOptions = getLayerData(options)

          // storage化的options数据
          const storageLayerOptions = onerStorage({
            type: 'variable',
            key: `exhibit-layer-options-${self.id}`, // !!! 唯一必选的参数, 用于内部存储 !!!
          })

          storageLayerOptions.data(layerOptions)

          const values = {
            id,
            name,
            type,
            options: layerOptions,
            // 根据路径取得参数的便捷方式
            getOption(path) {
              return storageLayerOptions.get(path)
            },
            // 三文的需求，实验性开放
            mapOption(pairs = {}) {
              console.info('!!! 收集什么时候使用这个方法？`getOption()`就应该可以满足 !!!')
              if (isPlainObject(pairs)) {
                const newStorageLayerOptions = onerStorage({
                  type: 'variable',
                  key: `exhibit-new-layer-options-${self.id}`, // !!! 唯一必选的参数, 用于内部存储 !!!
                })
                Object.entries(pairs).map(([oldPath, newPath]) => {
                  newStorageLayerOptions.set(newPath, storageLayerOptions.get(oldPath))
                })
                return newStorageLayerOptions.get()
              }
              return {}
            },
          }
          if (exhibit.key !== 'demo') {
            values.data = data
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
      const getData = () => {
        const {type, private: privateData} = self.data.getSchema()
        let data
        if (type === 'private') {
          data = hJSON.parse(privateData)
        }
        return data
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
      }
    })

  return MExhibit
}
