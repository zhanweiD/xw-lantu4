import React from 'react'
import ReactDOM from 'react-dom'
import {types, flow} from 'mobx-state-tree'
// import interpolate from 'color-interpolate'
import {Field} from '@components/field'
import Warning from '@components/warning'
// import createLog from '@common/create-log'
import createEvent from '@common/event'
import isDev from '@common/is-dev'
import tip from '@components/tip'
import * as util from './util'
import {chromaScale} from '../base/chroma'
// import {generateColorList} from '../util'

const {getValueByPath} = util
const {assign} = Object

// 通用参数
const commonOption = {
  // 必选容器
  container: null,
  // 容器宽度
  containerWidth: null,
  // 容器高度
  containerHeight: null,
  // 基准字号
  baseFontSize: 1,
}

// 交互组件基础模型
const MUIBase = types
  .model('MUIBase', {
    // config 配置的参数值
    _option: types.frozen(),
    // 默认参数值，不能覆盖通用配置
    _defaultOption: types.frozen(),
    // 是否抛出警告信息
    _isWarn: types.maybe(types.boolean),
    // 基础缩放字号
    _baseFontSize: types.maybe(types.number),
    // 是否开发环境
    _isDef: types.optional(types.boolean, isDev),
    // 容器
    container: types.frozen(),
    // 容器宽度
    containerWidth: types.maybe(types.number),
    // 容器高度
    containerHeight: types.maybe(types.number),
    // 事件
    event: types.frozen(),
    // 全局提示
    tip: types.frozen(),
    // 日志信息
    log: types.frozen(),
    // 公共方法
    util: types.frozen(),
    // 组件库名称
    lib: types.optional(types.string, 'wave'),
    // 组件名称
    key: types.optional(types.string, 'unnamedWave'),
  })
  .views((self) => ({
    // 设定容器布局样式
    drawLayout(extraStyle = {}) {
      const style = {
        width: '100%',
        height: '100%',
        marginBottom: '-8px',
        ...extraStyle,
      }

      // 为容器添加样式
      Object.keys(style).forEach((key) => {
        self.container && (self.container.style[key] = style[key])
      })
    },

    // 获取参数的方法
    config(path) {
      const optionValue = getValueByPath(path, self._option)
      return optionValue !== undefined ? optionValue : getValueByPath(path, self._defaultOption)
    },

    // 计算文字大小
    fontSize(n) {
      return self._baseFontSize * n
    },

    // 单元格自适应最大宽度计算，这个方法将被弃用，请用 self.util 中的方法
    getPixelWidth(text, fontSize) {
      const span = document.createElement('span')

      span.style.cssText = `visibility:hidden;white-space:nowrap;font-size:${fontSize}`
      document.body.appendChild(span)
      span.innerText = text
      setTimeout(() => document.body.removeChild(span), 0)

      return span.offsetWidth
    },
  }))
  .actions((self) => ({
    // 初始化模型实例
    init(options, defaultOption) {
      const {container, ...optionWithoutContainer} = options
      console.log(container, optionWithoutContainer)

      // 编辑模式下关闭动画
      if (!optionWithoutContainer.isPreview) {
        optionWithoutContainer.enableEnterAnimation = false
        optionWithoutContainer.enableLoopAnimation = false
      }

      self._container = container
      self._option = optionWithoutContainer
      self._defaultOption = assign(defaultOption, commonOption)
      self._isWarn = false
      // self.log = createLog(__filename)
      self.event = createEvent(`${self.lib}.${self.key}`)
      self.tip = tip

      // 所有图表都强制传入容器元素
      if (!self._container) {
        self.log.warn('`container` is required for WaveX constructor')
      }
      // 初始化主体容器
      self.container = document.createElement('div')
      self._container.appendChild(self.container)

      // 基准字号
      self._baseFontSize = self.config('baseFontSize')

      // 取出容器的宽高
      self.containerWidth = +self._container.clientWidth
      self.containerHeight = +self._container.clientHeight
      // 溢出控制
      self.drawLayout()
      // 拓展公共方法
      // self.util = util
      self.tooltip = window.waveview.tooltip
    },

    // 删除 container 节点下通过 ReactDOM.render 方法生成的组件实例
    removeNode(node, isCreatedByReactDOM = true) {
      if (isCreatedByReactDOM) {
        node && ReactDOM.unmountComponentAtNode(node)
      } else {
        node && (node.innerHTML = '')
      }
    },

    // 渲染函数，由于 types.frozen 和 ReactDOM.render 组合使用会有问题，故设置中间层转换
    render: flow(function* render(element, extraStyle) {
      const componentRef = React.createRef(null)
      const component = (
        <div ref={componentRef}>
          <Field>{element}</Field>
        </div>
      )

      yield new Promise((resolve) => resolve(ReactDOM.render(component, self._container)))
      self.container = componentRef.current
      self.drawLayout(extraStyle)
      self.ready()

      return componentRef
    }),

    // 销毁已渲染的内部组件
    destroy() {
      // container 被定义为 React 组件，销毁需要传入容器组件
      self.removeNode(self.container?.parentNode)
      self.event?.clear()
    },

    // 渲染无数据状态的备用UI，默认显示错误，应由子组件重写
    drawFallback() {
      self.log.warn('drawFallback is not rewritten')
    },

    getColor(colorAmount, rangeColors = null) {
      const colorAmounts = Array.isArray(colorAmount) ? colorAmount : [colorAmount]
      let colors = self.config('themeColors')
      // 此处对主题色进行筛选使其更符合设计师的选色逻辑
      // 颜色数量小于等于三时
      if (colorAmounts[0] <= 3) {
        colors = colors.slice(2, 7)
      }
      // 颜色数量等于4时
      if (colorAmounts[0] === 4) {
        colors = colors.slice(2)
      }
      // 是否自选颜色
      if (self.config('useColors')) {
        // 返回渐变色比例尺
        if (self.config('rangeColors')) {
          if (Array.isArray(self.config('rangeColors')[0])) {
            return chromaScale(self.config('rangeColors'), colorAmount)
          }
        }
        colors = self.config(self.config('checkColorModel') || 'customColors') || self.config('rangeColors')
        // 这里可以由自己传一个颜色数组来定义颜色，这边先只允许传一个颜色
        colors = [colors]
      }
      // 如果传入一个rangeColors则使用这个颜色
      if (rangeColors) {
        colors = rangeColors
        if (Array.isArray(rangeColors[0])) {
          return chromaScale(rangeColors, colorAmount)
        }
      }
      // colors = generateColorList(colors)
      colors = ['#FD926D', '#FFBD6D', '#FFEA92', '#B5E4AA', '#6CDDC3', '#3EBFDA', '#119BFF', '#0B78FF', '#2A43FF']

      if (!Array.isArray(colors) || !colors.length) {
        console.error('colors应该传一个颜色数组或二维数组')
        return []
      }
      const colorList = Array.isArray(colors[0]) ? colors : [colors]
      const result = []
      colorAmounts.forEach((amount, index) => {
        const color = colorList[index] || colorList[index - 1]
        if (!color || !color.length || !amount) {
          result.push([])
          return
        }
        // 如果配置的颜色个数和colorAmount相等那么直接返回配置的颜色
        if (amount === color.length) {
          result.push(color)
        } else {
          // 如果需要的颜色个数和配置的颜色不相等那么进行插值
          const interpolateColors = []
          // const compute = interpolate(color)
          const compute = color
          const scale = amount > 1 ? 1 / (amount - 1) : 1
          for (let i = 0; i < amount; i++) {
            interpolateColors.push(compute(scale * i))
          }
          result.push(interpolateColors)
        }
      })
      return Array.isArray(colorAmount) ? result : result[0]
    },

    /**
     * 定义组件如何在视图中报错
     * @param text 错误提示文本
     * @param onTextClick 点击错误文本时，可以往控制台打印自定义信息
     */
    warn({text, onTextClick}) {
      // 错误判断字段
      self._isWarn = true

      if (self._option.isPreview) {
        self.drawFallback()
      } else {
        self.tip.error({content: text})
        self.render(<Warning onClick={onTextClick} content={text} height={self.containerHeight} />)
      }
    },

    // 组件渲染完成后触发
    ready() {
      self.state = 'ready'
      self.event.fire('ready')
    },
  }))

export default MUIBase
