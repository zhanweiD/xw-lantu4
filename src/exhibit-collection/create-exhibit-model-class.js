import {types, getEnv} from 'mobx-state-tree'
import isPlainObject from 'lodash/isPlainObject'
import onerStorage from 'oner-storage'
import hJSON from 'hjson'
import {MDataField} from '@builders/data-section'
import commonAction from '@utils/common-action'
import getObjectData from '@utils/get-object-data'
import isDef from '@utils/is-def'
import addOptionMethod from '@utils/add-option-method'
import {createExhibitLayersClass} from './create-exhibit-layer-class'
import {createPropertyClass} from './create-exhibit-property-class'

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
      parts: types.optional(types.array(types.string), ['title', 'legend', 'axis', 'polar', 'other']),
      normalKeys: types.frozen(['id', 'lib', 'key', 'initSize']),
      deepKeys: types.frozen(['title', 'legend', 'axis', 'polar', 'other', 'layers', 'data', 'dimension']),
    })
    .views((self) => ({
      get art_() {
        return getEnv(self).art
      },
      get event_() {
        return getEnv(self).event
      },
      // 这里的data和上面的data可不一样，这里的data_是指数据源里的真实数据，上面的data是指普通图表的data配置项
      get data_() {
        return getEnv(self).data
      },
    }))
    .actions(commonAction(['set', 'getSchema', 'setSchema', 'dumpSchema']))
    .actions((self) => {
      const afterCreate = () => {
        // if (config.data) {
        //   self.setData(config.data)
        // }
        // if (config.dimension) {
        //   self.setDimension(config.dimension)
        // }
        // if (config.title) {
        //   self.setTitle(config.title)
        // }
        // if (config.legend) {
        //   self.setLegend(config.legend)
        // }
        // if (config.axis) {
        //   self.setAxis(config.axis)
        // }
        // if (config.other) {
        //   self.setOther(config.other)
        // }
      }
      const init = () => {
        if (config.data) {
          self.setData(config.data)
        }
        if (config.dimension) {
          self.setDimension(config.dimension)
        }
        if (config.title) {
          self.setTitle(config.title)
        }
        if (config.legend) {
          self.setLegend(config.legend)
        }
        if (config.axis) {
          self.setAxis(config.axis)
        }
        if (config.other) {
          self.setOther(config.other)
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
            addOptionMethod(values)
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
          data: self.data_,
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
            exhibitId: self.id,
            art: self.art_,
            event: self.event_,
            data: self.data_,
          }
        )
      }
      const getData = () => {
        let data
        if (self.data) {
          const {type, private: privateData, source} = self.data.getSchema()
          if (type === 'private') {
            data = hJSON.parse(privateData)
          } else {
            const datas = self.art_.datas
            data = datas?.find((v) => v.id === source)?.data
          }
        }
        return data
      }

      const setDimension = (dimension) => {
        self.dimension = createPropertyClass(config.key, dimension, 'dimension')
        const relationModels = [].concat(
          ...self.data.getRelationModels(),
          ...self.dimension.options.getRelationFields('columnSelect')
        )
        self.data.setRelationModels(relationModels)
      }

      const getDimension = () => {
        if (self.dimension) {
          return self.dimension.getData()
        }
      }

      const setTitle = (title) => {
        self.title = createPropertyClass(config.key, title, 'title')
        // console.log('⛑', self.title, self.title.toJSON())
      }

      const getTitle = () => {
        if (self.title) {
          return self.title.getData()
        }
      }

      const setLegend = (legend) => {
        self.legend = createPropertyClass(config.key, legend, 'legend')
      }

      const getLegend = () => {
        if (self.legend) {
          return self.legend.getData()
        }
      }

      const setAxis = (axis) => {
        self.axis = createPropertyClass(config.key, axis, 'axis')
      }

      const getAxis = () => {
        if (self.axis) {
          return self.axis.getData()
        }
      }
      const setOther = (other) => {
        self.other = createPropertyClass(config.key, other, 'other')
      }
      const getOther = () => {
        if (self.other) {
          return self.other.getData()
        }
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
        setLegend,
        getLegend,
        setAxis,
        getAxis,
        setOther,
        getOther,
        init,
      }
    })

  return MExhibit
}
