import {types, getEnv} from 'mobx-state-tree'
import isPlainObject from 'lodash/isPlainObject'
import onerStorage from 'oner-storage'
import hJSON from 'hjson'
import {MDataField} from '@builders/data-section'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
import {transform} from './exhibit-config'
import {createExhibitLayersClass} from './create-exhibit-layer-class'

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
      deepKeys: types.frozen(['title', 'layers', 'data', 'dimension']),
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
        if (config.data) {
          self.setData(config.data)
        }
        if (config.dimension) {
          self.setDimension(config.dimension)
        }
        if (config.title) {
          self.setTitle(config.title)
        }
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
        self.layers = createExhibitLayersClass(config.key, layers, {
          exhibitId: self.id,
          art: self.art_,
          event: self.event_,
          globalData: self.globalData_,
          projectData: self.projectData_,
          officialData: self.officialData_,
        })
        if (self.data) {
          const models = []
          self.layers.forEach((layer) => {
            models.push(...layer.options.getRelationFields('columnSelect'))
          })

          const relationModels = [].concat(...self.data.getRelationModels(), ...models)
          self.data.setRelationModels(relationModels)
        }
      }

      const addLayer = () => {
        console.log('addLayer')
      }

      // 这里是每一个层需要做的事情，暂时未实现，先占位
      const doSomething = () => {
        console.log('open menu')
      }

      const setData = (data) => {
        self.data = MDataField.create(
          {
            type: 'data',
            sectionStyleType: 0,
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
        let data
        if (self.data) {
          const {type, private: privateData} = self.data.getSchema()
          if (type === 'private') {
            data = hJSON.parse(privateData)
          }
        }
        return data
      }

      const setDimension = (dimension) => {
        const {id} = self
        const {sections, fields} = dimension
        const MDimension = transform({id, sections, fields})

        self.dimension = MDimension.create()
        const relationModels = [].concat(
          ...self.data.getRelationModels(),
          ...self.dimension.getRelationFields('columnSelect')
        )
        self.data.setRelationModels(relationModels)
      }

      const getDimension = () => {
        let dimension
        if (self.dimension) {
          const schema = self.dimension.getSchema()
          dimension = getObjectData(schema)
        }
        return dimension
      }

      const setTitle = (title) => {
        const {id} = self
        const {sections, fields, effective} = title
        const MTitle = transform({id, name: 'title', effective, sections, fields})

        self.title = MTitle.create()
        console.log(self.title)
      }

      const getTitle = () => {
        let title
        if (self.title) {
          const schema = self.title.getSchema()
          title = getObjectData(schema)
        }
        return title
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
        setTitle,
        getTitle,
        addOptionUtil,
      }
    })

  return MExhibit
}
