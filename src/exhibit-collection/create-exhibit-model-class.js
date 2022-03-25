import {types, getEnv} from 'mobx-state-tree'
import hJSON from 'hjson'
import {MDataField} from '@builders/data-section'
import commonAction from '@utils/common-action'
import getObjectData from '@utils/get-object-data'
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
      padding: types.frozen(config.padding),
      state: types.optional(types.enumeration(['loading', 'success', 'error']), 'loading'),
      parts: types.optional(types.array(types.string), ['title', 'legend', 'axis', 'polar', 'other', 'echartsoption']), // 配置面板顶部tab
      normalKeys: types.frozen(['id', 'lib', 'key', 'initSize']),
      deepKeys: types.frozen([
        'title',
        'legend',
        'axis',
        'polar',
        'other',
        'layers',
        'data',
        'dimension',
        'echartsoption',
        'gisBase',
      ]), // 配置面板配置项
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
      const init = () => {
        // !! NOTE 素材也需要有category 暂时没有categgory的都是素材
        if (!exhibit.category) {
          self.set({
            state: 'success',
          })
        }
        if (config.gisBase) {
          self.setGisBase(config.gisBase)
        }
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
        if (config.echartsoption) {
          self.setEchartsoption(config.echartsoption)
        }
        if (config.polar) {
          self.setPolar(config.polar)
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
          const values = {
            id,
            name,
            type,
            effective,
          }

          if (effective) {
            values.data = layer.getData()
            values.options = getObjectData(options)
          }
          return addOptionMethod(values, 'init')
        })
        return layers
      }

      const setLayers = (layers) => {
        self.layers = createExhibitLayersClass(config.category, config.key, layers, {
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
          self.data.bindRelationModels(relationModels)
        }
        if (config.key === 'text' || config.key === 'button' || config.key === 'gis') {
          self.set({
            state: 'success',
          })
        }
      }

      const addLayer = (layers) => {
        self.set({
          layers: [
            ...self.layers,
            ...createExhibitLayersClass(config.category, config.key, layers, {
              exhibitId: self.id,
              art: self.art_,
              event: self.event_,
              data: self.data_,
            }),
          ],
        })
        // self.layers = [
        //   ...self.layers,
        //   ...createExhibitLayersClass(config.category, config.key, layers, {
        //     exhibitId: self.id,
        //     art: self.art_,
        //     event: self.event_,
        //     data: self.data_,
        //   }),
        // ]
      }

      const delLayer = (index) => {
        const oldLayers = [...self.layers]
        oldLayers.splice(index, 1)
        self.layers = oldLayers
      }

      const setData = (data) => {
        self.data = MDataField.create(
          {
            type: 'data',
            sectionStyleType: 1,
            value: {
              type: 'private',
              private: hJSON.stringify(data, {space: 2, quotes: 'strings', separator: true}),
            },
          },
          {
            exhibitId: self.id,
            exhibit: self,
            art: self.art_,
            event: self.event_,
            data: self.data_,
          }
        )
      }

      const getData = () => {
        if (self.data) {
          return self.data.value.data
        }
      }

      const setDimension = (dimension) => {
        self.dimension = createPropertyClass(config.key, dimension, 'dimension')
        const relationModels = [].concat(
          ...self.data.getRelationModels(),
          ...self.dimension.options.getRelationFields('columnSelect')
        )
        self.data.bindRelationModels(relationModels)
      }

      const getDimension = () => {
        if (self.dimension) {
          return self.dimension.getData()
        }
      }

      const setTitle = (title) => {
        self.title = createPropertyClass(config.key, title, 'title')
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

      const setEchartsoption = (echartsoption) => {
        self.echartsoption = createPropertyClass(config.key, echartsoption, 'echartsoption')
      }
      const getEchartsoption = () => {
        if (self.echartsoption) {
          return self.echartsoption.getData()
        }
      }

      const setPolar = (polar) => {
        self.polar = createPropertyClass(config.key, polar, 'polar')
      }
      const getPolar = () => {
        if (self.polar) {
          return self.polar.getData()
        }
      }
      const setGisBase = (gisBase) => {
        self.gisBase = createPropertyClass(config.key, gisBase, 'gisBase')
      }
      const getGisBase = () => {
        if (self.gisBase) {
          return self.gisBase.getData()
        }
      }

      return {
        setGisBase,
        getGisBase,
        setCachedData,
        setContext,
        setAdapter,
        addLayer,
        delLayer,
        setLayers,
        getLayers,
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
        getEchartsoption,
        setEchartsoption,
        setPolar,
        getPolar,
        init,
      }
    })

  return MExhibit
}
