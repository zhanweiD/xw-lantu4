import {types, getEnv} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
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
          sections.forEach((node) => {
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
          const values = {
            id,
            name,
            type,
            options: getLayerData(options),
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

      const setData = () => {
        const relationModels = []
        self.layers.forEach((layer) => {
          relationModels.push(...layer.options.getRelationFields('columnSelect'))
        })
        self.data = MDataField.create(
          {
            type: 'data',
            sectionStyleType: 0,
            relationModels,
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
        return self.data.getSchema()
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
