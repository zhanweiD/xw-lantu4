import {types, getEnv} from 'mobx-state-tree'
import commonAction from '@utils/common-action'

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
      deepKeys: types.frozen(['layers']),
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
          const values = {}
          nodes.forEach((node) => {
            values[node.name] = {
              ...node.fields,
            }

            if (node.sections) {
              values[node.name] = {...values[node.name], ...getLayerData(node.sections)}
            }
          })
          return values
        }
        const layers = self.layers.map((layer) => {
          const {id, type, name, sections} = layer.getSchema()
          const values = {
            id,
            name,
            type,
            options: getLayerData(sections),
          }
          return values
        })
        // 这种格式是给组件的 但是不能用于保存
        // const getValues = () => {
        //   let values = {}
        //   if (self.sections) {
        //     const data = {}
        //     self.sections.forEach((section) => {
        //       data[section.name] = section.getValues()
        //     })
        //     values = {...data}
        //   }
        //   if (self.fields) {
        //     self.fields.forEach((field) => {
        //       Object.entries(field).forEach(([key, value]) => {
        //         values[key] = value.getValue()
        //       })
        //     })
        //   }
        //   return values
        // }
        return layers
      }

      return {
        afterCreate,
        setCachedData,
        setContext,
        setAdapter,
        getLayers,
      }
    })

  return MExhibit
}
