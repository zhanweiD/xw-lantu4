import {scaleThreshold} from "d3-scale"
import hex2rgb from "@utils/hex2rgb"
import rgba2obj from "@utils/rgba2obj"

const {Xt} = window
class Adapter {
  constructor(props) {
    this.id = props.id
    this.container = props.container
    this.baseFontSize = props.baseFontSize
    this.earth = props.earth
    this.earthAdapter = props.earthAdapter
    this.style = props.style || {}
    this.data = props.data
    this.model = props.model
    this.layerModel = props.layerModel
    // this.modelId = this.layerModel.id
    this.themeColors = props.themeColors
    this.themeRGBColors = props.themeColors.map((d) => {
      const colorObj = rgba2obj(hex2rgb(d))
      return [colorObj.r, colorObj.g, colorObj.b]
    })
    // 获取 tooptip 相关配置项，render 时用到
    this.tooltipOptions = props?.style?.tooltip
    this.deckReDraw = props.deckReDraw
    this.deckOptions = {
      widthUnits: "pixels"
    }
    this.getColor()
  }

  font = (n) => {
    return this.baseFontSize * n || n
  }

  warn = (str) => {
    console.log("warn", this.name, str)
  }

  location() {
    this.earth.flyManager.flyTo(this.layer)
  }

  reData() {}

  setTooltip(tooltip) {
    this.tooltipOptions = tooltip
  }

  getColor(value) {
    const colorRange = this.themeColors.map((hexColor) => {
      const colorObj = rgba2obj(hex2rgb(hexColor))
      return [colorObj.r, colorObj.g, colorObj.b]
    })

    const COLOR_SCALE = scaleThreshold()
      .domain(colorRange.map((d, i) => i / (colorRange.length - 1)))
      .range(colorRange)

    return COLOR_SCALE(value)
  }

  setIsLoopTooltip(isLoopTooltip) {
    // 后面应该放到tooltipOptions字段一起
    // this.tooltipOptions = {...this.tooltipOptions, isLoopTooltip}
    this.style.isLoopTooltip = isLoopTooltip
    this.loopTooltip()
  }

  setLoopDuration(loopDuration) {
    // 后面应该放到tooltipOptions字段一起
    // this.tooltipOptions = {...this.tooltipOptions, loopDuration}
    this.style.loopDuration = loopDuration
    this.loopTooltip()
  }

  // TODO
  // 当前这种方式不支持一个画布上有两个gis组件
  // 容器隐藏如何通知到我停止轮播
  // 跳出分画布如何通知到我停止轮播，我如何判断我在分画布还是主画布
  loopTooltip() {
    // 获取可以展示tooltip的坐标范围，计算一次就够了，gis容器位置不会改变
    const containerClientRect = this.container.getBoundingClientRect()
    const {scaler} = this.model.art.zoom

    const hideTooltip = () => {
      window.waveview.tooltip.hide()
    }
    // 获取当前此点的真实坐标

    if (!this.style.isLoopTooltip) {
      this.earth.camera.changed.removeEventListener(hideTooltip)
      return
    }

    this.earth.camera.changed.addEventListener(hideTooltip)
    const getRealPosition = (i) => {
      const key = this.earth.render.bind(
        Xt.Enum.RenderEvent.POST_RENDER,
        () => {
          // 节约性能这样写，只有在要显示tooltip的时候监听一下最新的位置。
          this.realPosition = [-999, -999]
          const index = i
          const {length} = this.cacheData
          // 循环所有的点
          // 这样写的根源在于没有改变视角这个监听事件
          for (let g = index; g < index + length; g += 1) {
            // 指针的概念，找到当前计算的指针
            let pointer = g
            if (g >= length) {
              pointer = g - length
            }
            const position = this.earth.coordinateToScreenCoordinate(
              this.cacheData[pointer].position
            )

            if (
              position[0] * scaler < 0 ||
              position[0] * scaler > containerClientRect.width ||
              position[1] * scaler < 0 ||
              position[1] * scaler > containerClientRect.height
            ) {
              continue
            } else {
              // 将当前指针指向返回回去
              this.loopIndex = pointer
              this.realPosition = position
              break
            }
          }

          // console.log('渲染了这里', this.realPosition)
          // console.log('获取最新值', i)
          this.earth.render.unbind(Xt.Enum.RenderEvent.POST_RENDER, key)
        }
      )
    }

    // 指针指向当前正在显示的tooltip
    this.loopIndex = 0
    const loop = () => {
      // 求出当前真实的坐标点
      this.timer.loopTimer = setTimeout(() => {
        getRealPosition(this.loopIndex)

        // 异步，使tooltip取得最新的值
        setTimeout(() => {
          // console.log('弹出tooltip', index)
          if (this.style.isLoopTooltip) {
            this.openTooltip(this.realPosition, this.loopIndex)
            this.loopIndex += 1
            if (this.loopIndex === this.cacheData.length) {
              this.loopIndex = 0
            }
            loop()
          }
        }, 40)
      }, this.style.loopDuration)
    }
    if (this.timer.loopTimer) {
      clearTimeout(this.timer.loopTimer)
    }
    loop()
  }

  // 点击显示tooltip
  showTooltip = (e) => {
    const {
      disabled,
      width,
      title,
      fields = [],
      videoUrl,
      iframeUrl,
      imageUrl,
      tooltipTypeArray = ["list", "video", "iframe", "image"],
      tooltipStyle
    } = this.tooltipOptions
    const {object} = e

    if (!window.waveview.layerManager.get(this.layerModel.id)) {
      window.waveview.addTooltipLayer(`gisTooltip-${this.layerModel.id}`)
    }
    if (object && !disabled) {
      const rect = this.container.getBoundingClientRect()
      const {scaler, zoom} = this.model.art.zoom
      const options = {
        title: object[title],
        list: fields.map(({name}) => {
          return {
            key: name,
            value: object[name]
          }
        }),
        attachTo: {
          top: e.y * scaler + rect.top,
          bottom: e.y * scaler + rect.top + 20 * scaler,
          left: e.x * scaler + rect.left,
          right: e.x * scaler + rect.left + 20 * scaler
        },
        tooltipTypeArray,
        width,
        tooltipStyle
      }

      if (videoUrl) {
        options.video = {
          url: object[videoUrl]
        }
      }

      if (iframeUrl) {
        options.iframe = {
          src: object[iframeUrl]
        }
      }

      if (imageUrl) {
        options.image = {
          src: object[imageUrl]
        }
      }
      // 临时写法，没取到zoom意味着scale无效
      if (zoom) {
        window.waveview.layerManager
          .get(`gisTooltip-${this.layerModel.id}`)
          .show(options)
      }
    } else {
      window.waveview.layerManager
        .get(`gisTooltip-${this.layerModel.id}`)
        .hide()
    }
  }

  // 根据坐标展现tooltip
  openTooltip = (position, index) => {
    const {
      disabled,
      title,
      fields = [],
      videoUrl,
      iframeUrl,
      imageUrl
    } = this.tooltipOptions

    const object = this.cacheData[index]
    if (object && !disabled) {
      const rect = this.container.getBoundingClientRect()
      const {scaler, zoom} = this.model.art.zoom
      // console.log(scaler)
      const options = {
        title: object[title],
        list: fields.map(({name}) => {
          return {
            key: name,
            value: object[name]
          }
        }),
        attachTo: {
          top: position[1] * scaler + rect.top,
          bottom: position[1] * scaler + rect.top,
          left: position[0] * scaler + rect.left,
          right: position[0] * scaler + rect.left
        }
      }

      if (videoUrl) {
        options.video = {
          url: object[videoUrl]
        }
      }

      if (iframeUrl) {
        options.iframe = {
          src: object[iframeUrl]
        }
      }

      if (imageUrl) {
        options.image = {
          src: object[imageUrl]
        }
      }
      if (zoom) {
        window.waveview.tooltip.show(options)
      }
    } else {
      window.waveview.tooltip.hide()
    }
  }

  // 动态获取触发事件，每次触发事件的菜单打开之前，都会请求一次
  getTriggers({config, earthAdapter, _layer}) {
    const trigger = config.interaction.triggers
    // 如果config里的interaction里有触发事件，则进行bind函数的一层转换，传递我们需要的参数
    if (trigger && trigger.length > 0) {
      trigger.forEach((item) => {
        item.bind = (atmBim, action) => {
          item._bind({
            adapter: this,
            action,
            earthAdapter,
            layerModel: this.layerModel
          })
        }
        item.id += _layer.id
        item.name = ""
        if (item.name.search(_layer.name) === -1) {
          item.name = `${_layer.name}`
        }
      })
      return trigger
    }
    return []
  }

  // 动态获取响应事件，每次触发事件的菜单打开之前，都会请求一次
  getResponsers({config, _layer}) {
    const responser = config.interaction.responsers
    // 如果config里的interaction里有响应事件，则进行action函数的一层转换，传递我们需要的参数
    if (responser && responser.length > 0) {
      responser.forEach((item) => {
        item.action = ({ruleValue}) => {
          item._action({
            ruleValue,
            adapter: this,
            layerModel: this.layerModel
          })
        }
        item.id += _layer.id
        item.name = ""
        if (item.name.search(_layer.name) === -1) {
          item.name = `${_layer.name}`
        }
      })
      return responser
    }
    return []
  }
}

export default Adapter
