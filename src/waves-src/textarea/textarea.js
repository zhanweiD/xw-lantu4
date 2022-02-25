import * as d3 from 'd3'
import {set} from 'mobx'
import uuid from '../../common/uuid'
import Base from '../base'
import {dataUtil, getTextHeight, formatNumber, getTextWidth, computePercent, dataTransformFor111} from '../util'

const {
  isObject,
} = Base

const defaultOption = {
  labelSize: 30,
  color: 'rgba(255,255,255,1)',
  valueKey: 'value',
  scrollDelay: 100,
  // 轮播速度
  scrollAmount: 5,
  // 超出后状态。loop轮播。wrap换行。omit省略。over溢出。
  overflowMethod: 'loop',
  // 轮播对齐方式
  loopAlign: 'bottom',
  _type: 'canLayout',
}

export default class Text extends Base {

  constructor(option) {
    super(option, defaultOption, 'textarea')
    this._data = {}
    console.log('==============')
    console.log(this._option)
    console.log('==============')
    // debugger
    this.root.attr('class', 'wave-textarea')
  }

  drawFallback() {
    // 默认显示数据
    const data = {
      key: '示例关键词A',
      open: '示例关键词B',
    }
    this.data(data)
    this.root.style('opacity', 0.5)
    this.draw({redraw: true})
    this._isWarn = false
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(data) {
    // 判断数据版本
    if (isObject(data.data)) {
      this._data = [
        Object.keys(data.data),
        Object.entries(data.data).map(([, v]) => v),
      ]
      // 取出文本
      this.templateContent = data?.content || ''
    } else {
      this._data = [
        Object.keys(data),
        Object.entries(data).map(([, v]) => v),
      ]
    }

    return this
  }

  /**
   * 绘制图表和处理所有不可变的内容
   * 不可变 - 比如绘制图表的框架结构、计算一些数据发生改变但是不会被影响的内容
   * @return {object} 图表实例
   */
  draw({redraw}) {
    if (redraw === true) {
      this.root.html('')
    }
    if (!this._data.length) {
      console.error('Data cannot be empty')
      return
    }

    // 文字容器
    this.textareaContainer = this.root.append('foreignObject')
      .attr('width', this.mainWidth)
      .attr('height', this.mainHeight)

    // 更新图表
    this.update()

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach(x => {
        this.container.select(x)
          .attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 入场动画
    !this._isWarn && this.animation()

    if (!this._isWarn) {
      this.root.style('opacity', 1)
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach(x => {
        this.container.select(x)
          .attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // return this
  }

  changeKeyWords() {

  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // 段落文字颜色
    const fontColor = this.config('color')
    // 段落字重
    const fontWeight = this.config('labelWeight')
    // 行高
    const lineHeight = this.config('lineHeight')
    // 关键词颜色
    const keywordColor = this.config('keywordColor')
    const keywordFontWeight = this.config('keywordFontWeight')
    const hasKeywordFontSize = this.config('hasKeywordFontSize')
    const keywordFontSize = this.config('keywordFontSize')
    // 文字大小
    const fontSize = this.config('fontSize')
    // 首行缩进
    const textIndent = this.config('textIndent')
    // 段落对齐
    const textAlign = this.config('textAlign')
    // 段间距
    const paragraphMargin = this.config('paragraphMargin')
    // 段落内容
    let content = this.templateContent || this.config('content')

    // 唯一的key
    const key = uuid()
    // 按数据提取关键词
    this._data[0].forEach((item, index) => {
      const rule = new RegExp(`\\$\\{${item}\\}`, 'g')
      content = content.replace(rule, `@@WAVEVIEW@@~~~${key}~~~${this._data[1][index]}@@WAVEVIEW@@`)
    })

    const contents = content.split(/[\n]/).filter(v => v).map((v, i) => ({
      index: i,
      children: v.split('@@WAVEVIEW@@').map((value, index) => {
        const rule = new RegExp(`~~~${key}~~~`, 'g')
        return ({
          index,
          value: value.replace(rule, ''),
          isKeyword: value.indexOf(`~~~${key}~~~`) !== -1,
        })
      }),
    }))

    // 绘制
    this.textareaContainer.append('xhtml:div')
      .attr('class', 'wave-textarea-container scrollbar')
      .attr('style', `
        color: ${fontColor};
        font-size: ${this.fontSize(fontSize)}px;
        font-weight: ${fontWeight};
        white-space: pre-wrap;
        overflow-wrap: break-word;
        line-height: ${this.fontSize(lineHeight * fontSize)}px;
        height: 100%;
        text-align: ${textAlign};
        word-break: normal;
      `)
      .append('xhtml:div')
      .attr('class', 'wave-textarea-container-height-counter')
      .selectAll('.textarea')
      .data(contents)
      .enter()
      // 绘制段落
      .append('xhtml:p')
      .attr('class', 'wave-textarea-paragraph')
      .attr('style', `
        display: block;
        text-indent: ${this.fontSize(textIndent)}px;
        margin-bottom: ${this.fontSize(paragraphMargin)}px;
      `)
      .selectAll()
      .data(({children}) => children)
      .enter()
      .append('xhtml:span')
      .attr('class', d => (d.isKeyword ? 'hand keywordsActive' : ''))
      .attr('style', d => `
        color: ${d.isKeyword && keywordColor};
        font-weight: ${d.isKeyword && keywordFontWeight};
        font-size: ${d.isKeyword && hasKeywordFontSize ? this.fontSize(keywordFontSize) : this.fontSize(fontSize)}px;
        line-height:  ${d.isKeyword && hasKeywordFontSize ? this.fontSize(keywordFontSize) : this.fontSize(fontSize)}px;
        
      `)
      .on('click', data => {
        if (data.isKeyword) {
          this.event.fire('onClickKeywords', {
            data: {
              key: this._data[1].map((v, i) => (v === data.value ? this._data[0][i] : data.value))[0],
              value: data.value,
            }
          })
        }
      })
      .text(d => d.value)

    return this
  }

  /**
   * 动画
   */
  animation() {
    // 动画开关控制
    // const enableAnimation = this.config('enableAnimation')
    // 动画时间
    const enterAnimationDuration = this.config('enterAnimationDuration')

    // 段落文本组件动画开始时已经展现视图，所以直接提供一个ready状态即可
    this.ready()

    // 如果动画未开启
    // if (!enableAnimation) {
    //   return
    // }

    // 获取容器
    const element = this.textareaContainer.selectAll('.wave-textarea-container')._groups[0][0]
    const elementRealHeight = this.textareaContainer.selectAll('.wave-textarea-container-height-counter')._groups[0][0]

    let top = 0
    let textareaAnimationTimer = ''

    // element.onscroll(v => {
    //   console.log(v, 'v')
    // })
    element.onscroll = v => {
      if (element.scrollTop === top && element.scrollTop !== 0) {
        return
      }
      console.log(v, 'v', element.scrollTop, top)
      top = element.scrollTop
      clearInterval(textareaAnimationTimer)
      scroll()
    }

    const scroll = () => setTimeout(() => {
      clearInterval(textareaAnimationTimer)
      textareaAnimationTimer = setInterval(() => {
        if ((elementRealHeight.offsetHeight - element.offsetHeight) >= top) {
          element.scrollTo(0, top += 1)
        } else {
          element.scrollTo(0, 0)
        }
      }, 50)
    }, enterAnimationDuration)

    scroll()
  }
}

Text.version = '__VERSION__'
