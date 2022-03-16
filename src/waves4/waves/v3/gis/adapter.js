// import Xt from 'xt-earth/Earth'
import {toJS} from 'mobx'
// import debounce from 'lodash/debounce'
// import cloneDeep from 'lodash/cloneDeep'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import uuid from '@common/uuid'
// import createEvent from '@common/event'
import translate from './translate'

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      console.log(options)
      const translatedOptions = translate(options)
      console.log(translatedOptions)
      this.options = translatedOptions
      this.containerId = uuid()
      this.maskDivId = uuid()

      const div = document.createElement('div')
      div.id = this.containerId
      div.style.width = '100%'
      div.style.height = '100%'
      div.addEventListener('contextmenu', (e) => {
        e.stopPropagation()
        e.preventDefault()
      })
      translatedOptions.container.innerHTML = ''
      translatedOptions.container.append(div)

      const maskDiv = document.createElement('div')
      maskDiv.id = this.maskDivId
      maskDiv.style.width = '100%'
      maskDiv.style.height = '100%'
      maskDiv.style.top = '0'
      maskDiv.style.left = '0'
      maskDiv.style.position = 'absolute'

      if (!this.model.art.isEdit) {
        maskDiv.style.display = 'none'
      }
      translatedOptions.container.append(div)
      translatedOptions.container.append(maskDiv)
      translatedOptions.container.addEventListener('click', this.onclick)
      this.layers = []
      this.state = {}
      // this.draw()
    },

    // 配置组件数据
    // @param data 新数据
    // @param prevData 上一次的data
    data(/* , prevData */) {
      // this.instance.data(data)
    },
    onclick(event) {
      // 阻止向上冒泡
      event.stopPropagation()
    },
    // 绘制组件
    draw() {
      const {origin, viewport, layers, backgroundColor, terrain, viewFixed} = this.options
      console.log(toJS(this.options))

      // const {scaler} = this.model.art.zoom
      const earthOptions = {
        // terrain:'http://47.94.231.113:10086/terrain',// 测试浙江高程服务
        terrain,
        // terrain: 'https://lab.earthsdk.com/terrain/577fd5b0ac1f11e99dbd8fd044883638', // 是否开启地形
        destination: [origin[0], origin[1], origin[2]], // 相机初始化位置
        orientation: [viewport[0], viewport[1], viewport[2]], // 相机初始化方向
        // operationMode: Xt.Enum.OperationMode.FIT,
        // sceneMode: Xt.Enum.SceneMode[sceneMode],
        backgroundColor,
        globeColor: backgroundColor,
      }
      if (terrain) {
        earthOptions.terrain = terrain
      }
      // 将选项映射到函数
      // this.instance = new Xt.Earth(this.containerId, earthOptions)
      // this.instance = new Xt.Earth(this.containerId, earthOptions)

      // 绑定事件
      // this.instance.interaction.bind(
      //   Xt.Enum.InteractionEvent.CLICK,
      //   (e) => {
      //     //coordinate为WGS-84的经纬度坐标
      //     const {coordinate} = e
      //     coordinate && this.model.style.coordinateAcquisitionResult.setValue(`${coordinate[0]},${coordinate[1]}`)
      //     // console.log('coordinate', coordinate)
      //   },
      //   {
      //     enabled: true,
      //   }
      // )
      //销毁点击交互事件,销毁earth时应该会被销毁？
      // earth.renderDispatcher.unbind(Xt.Enum.InteractionEvent.CLICK, clickInteractionEvent)

      // this.instance.domScale = scaler

      // this.instance.event = createEvent('wave.gis')

      // 如果设置了视角固定，主动调用一下
      if (viewFixed) {
        this.setViewFixed(!viewFixed)
      }

      layers.forEach((layer, i) => {
        this.createLayer({
          layerIndex: i,
          key: layer.key,
          style: layer[layer.key],
          dataSource: layer.dataSource,
        })

        if (layer.location) {
          this.layers[i].location()
        }
      })
      setTimeout(() => {
        this.event.fire('ready')
      }, 3000)

      if (this.model.art.isEdit) {
        // 这个主动触发数据渲染针对于，图表重新渲染，但不需要重新请求数据的情况。此情况下各层拿不到部署
        setTimeout(() => {
          this.triggerData()
        }, 0)
      }
    },

    // flyTo(origin) {
    //   // const {destination} = this.instance
    //   this.instance.destination = [Number(origin[0]), Number(origin[1]), Number(origin[2])]
    // },
  })

export default Adapter
