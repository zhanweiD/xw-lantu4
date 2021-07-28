/**
 * @author fenfen.wff 白浅
 * @description deck地图组件的主入口
 */

import {Earth} from "wave-map"
import {flatten} from "lodash"
import hJSON from "hanson"
import "./adapter.styl"
import uuid from "@utils/uuid"
import createEvent from "@utils/create-event"
import createExhibitAdapter from "../../exhibit-adapter-creater"
import {Adapters} from "./layers"
import {getBaseMapConfig} from "./parser"

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    // init的option，除了组件schema中定义的配置项，还注入了用于标准化的配置项，如下
    // - baseFontSize 基准字号，12号字的大小就是 baseFontSize * 12
    // - theme 主题id值
    // - container 容器dom节点
    // TODO jsx组件也要标准化 baseFontSize和theme这两个props
    // TODO 如 <Button baseFontSize={baseFontSize} theme={theme} ... />

    // ! TODO 修改大屏主屏的高度，会触发整个屏幕重新渲染，因为屏高影响 baseFontSize
    init(options) {
      if (options.container) {
        options.container.id = uuid()
      }
      // Layer对象，子图层
      this.deckLayers = []
      this.options = options
      const {origin, pitchRange, theme, zoomRange, viewport} =
        getBaseMapConfig(options) || {}

      this.instance = new Earth({
        container: options.container.id,
        baseMapStyle: theme,
        longitude: origin[0],
        latitude: origin[1],
        zoom: origin[2],
        pitch: viewport[0],
        minPitch: pitchRange[0],
        maxPitch: pitchRange[1],
        bearing: viewport[1],
        minZoom: zoomRange[0],
        maxZoom: zoomRange[1],
        showMapHelper: this.isEdit,
        enableMapInteractive: true
      })
      this.instance.event = createEvent("wave.gis")
      // 这个layers是最初的layers配置，id、config、other
      this.instance.layerConfigs = options.layers
      this.draw()
      return this.instance
    },

    update({action, layerId, value, instance, totalValue, schema}) {
      // 如果是数据更新
      if (action === "data") {
        const {data} = schema
        console.log("全量数据，以 layerId 为 key 的 map", schema.data)

        // 更新指定层
        if (layerId !== "") {
          console.log("需要更新的层", layerId, "新数据", data[layerId])
          // TODO 调用对应层的 reData 更新指定层数据 @白浅

          // 全量更新
        } else {
          console.log("全部层id自己获取", "全量新数据", data)
          // TODO 更新全部层数据 @白浅
        }
        return
      }

      const {layerConfigs} = instance
      const updatedLayer = layerConfigs.find((layer) => layer.id === layerId)
      if (!updatedLayer) {
        return
      }
      // 更新属性
      updatedLayer.other = totalValue
      const {type} = updatedLayer
      // 如果更新底图样式
      if (type === "basemap") {
        const {theme, origin, viewport, zoomRange, pitchRange, viewFixed} =
          value
        try {
          theme && this.setBaseMapStyle(theme)
          origin && this.flyTo(origin)
          viewport && this.setBearingAndPitch(viewport)
          zoomRange && this.setZoomRange(zoomRange)
          pitchRange && this.setPitchRange(pitchRange)
          viewFixed && this.setViewFixed(viewFixed)
        } catch (e) {
          console.log(e)
        }
      } else {
        const deckLayer = this.deckLayers.find((layer) => layer.id === layerId)
        // 有些可以直接update Value，但有些被隐藏的属性不会更新，所以一刀切；如果有性能问题再优化
        deckLayer.update(totalValue)
      }
    },

    // 配置组件数据
    // @param data 新数据
    // @param prevData 上一次的data
    data(data /* , prevData */) {
      // this.instance.data(data)
    },

    toggleLayers(layers) {
      console.log(layers)
      this.instance.layerConfigs = layers
      this.draw()
    },

    // 阻止向上冒泡
    onClick: (e) => {
      e.stopPropagation()
    },

    // 绘制组件
    draw() {
      const {baseFontSize, themeColors} = this.options
      this.deckLayers = []
      this.instance?.layerConfigs.map((layerConfig) => {
        const {type, other: config, id, data: dataConfig} = layerConfig
        if (type === "basemap") {
          return
        }
        const LayerAdapter = Adapters[type]
        const layerData = this.getDataByLayerId(
          this.options.data,
          id,
          dataConfig
        )
        const adapter = new LayerAdapter({
          id,
          earth: this.instance,
          container: this.options.container,
          baseFontSize,
          themeColors,
          style: config,
          data: layerData,
          // 传给每个图层reDraw函数
          deckReDraw: () => {
            this.reDraw()
          }
        })
        this.deckLayers.unshift(adapter)
      })
      this.reDraw()
    },

    getDataByLayerId(data, id, dataConfig) {
      try {
        if (!dataConfig[`${id}_0`]) {
          return
        }
        const {fields, sourceId} = dataConfig[`${id}_0`]
        const currentLayerData = hJSON.parse(data[sourceId])
        if (!currentLayerData) {
          return
        }
        const cellsHead = currentLayerData[0]
        const mappingCellsHead = cellsHead.map((cell) => {
          const item = fields.find((field) => field?.value?.[0]?.key === cell)
          return item?.key || cell
        })
        const drawData = []
        for (let i = 1; i < currentLayerData.length; i++) {
          const d = currentLayerData[i]
          let item = {}
          mappingCellsHead.forEach((cell, j) => {
            item[cell] = d[j]
          })
          drawData.push(item)
        }

        console.log("draw---------", drawData)

        return drawData
      } catch (e) {
        console.log(e)
      }
    },

    reDraw() {
      const layers = flatten(
        this.deckLayers.map((layerAdapter) =>
          layerAdapter.getLayerInstance().getLayers()
        )
      )
      // 关于层级顺序的问题：https://github.com/visgl/deck.gl/issues/5216，并行绘制没有解决方法，只能用z上的一点位移来区分
      this.instance.updateProps({layers})
    },

    flyTo(origin) {
      this.instance.flyTo(origin)
    },

    setBearingAndPitch(viewport) {
      this.instance.setBearingAndPitch(viewport)
    },

    setViewFixed(enable) {
      this.instance.setViewFixed(enable)
    },

    // 设置缩放范围
    setZoomRange(zoomRange) {
      const minZoom = Math.max(-2, zoomRange[0])
      const maxZoom = Math.min(24, zoomRange[1])
      if (minZoom <= maxZoom) {
        this.instance.setZoomRange([minZoom, maxZoom])
      }
    },

    setPitchRange(pitchRange) {
      const minPitch = Math.max(0, pitchRange[0])
      const maxPitch = Math.min(85, pitchRange[1])
      if (minPitch <= maxPitch) {
        this.instance.setPitchRange([minPitch, maxPitch])
      }
    },

    // 设置主题
    setBaseMapStyle(theme) {
      this.instance.setBaseMapStyle(theme)
    },

    setDefaultViewport() {},

    // 切换预览模式
    setPreview() {},

    setContextMeunDisabled(disabled) {
      this.model.setContextMeunDisabled(disabled)
    },
    triggerData() {
      try {
        this.model.style.layers.value?.forEach((layer) => {
          layer.triggerData()
        })
      } catch (error) {
        // log.error('gis 数据主动触发渲染出错', error.message)
      }
    },

    /**
     * 添加图层
     * @param {*} layerConfig 图层配置
     */
    addLayer(layerConfig, data) {
      this.instance.layerConfigs.unshift(layerConfig)
      this.options.data = data
      this.draw()
    },

    /**
     * 删除图层
     * @param {*} layerId
     */
    removeLayer(layerId) {
      this.instance.layerConfigs = this.instance.layerConfigs.filter(
        (layerConfig) => layerConfig.id !== layerId
      )
      this.deckLayers = this.deckLayers.filter((layer) => layer.id !== layerId)
      this.reDraw()
    },

    /**
     * 定位图层
     * @param {*} layerId
     * https://deck.gl/docs/developer-guide/views
     */
    locateLayer(layerId) {
      // TODO 待研究具体实现
    },

    gisEvent: (() => {
      const id = `__event-${uuid()}`
      const rename = (name) => `${id}-${name}`
      const cache = {}
      return {
        on: (name, fn, remark) => {
          if (typeof name === "string" && typeof fn === "function") {
            const prefixedName = rename(name)
            cache[prefixedName] = cache[prefixedName] || []
            fn.remark = remark
            cache[prefixedName].push(fn)
          } else if (typeof name === "object") {
            Object.entries(name).forEach(([n, f]) => {
              this.event.on(n, f, remark)
            })
          }
        },
        off: (name, fn) => {
          const prefixedName = rename(name)
          if (!fn) {
            delete cache[prefixedName]
          } else {
            const fns = cache[prefixedName] || []
            fns.splice(fns.indexOf(fn), 1)
            if (!fns.length) {
              delete cache[prefixedName]
            }
          }
        },
        fire: (name, args, context) => {
          const fns = cache[rename(name)]
          if (fns) {
            for (let i = 0, l = fns.length; i < l; i++) {
              fns[i].apply(context || null, [].concat(args))
            }
          }
        }
      }
    })(),

    destroy() {
      this.options.container.innerHTML = ""
      // 遍历所有层的adapter，调用destroy方法
      this.deckLayers.forEach((layerAdapter) => {
        layerAdapter.destroy()
      })
      delete this.instance
    }
  })

export default Adapter
