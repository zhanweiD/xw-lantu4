import './wave-base.styl'

const LEGEND_POSITION = [{
  key: 'TOP',
  value: '上',
}, {
  key: 'RIGHT',
  value: '右',
}, {
  key: 'BOTTOM',
  value: '下',
}, {
  key: 'TITLE',
  value: '标题栏',
}, {
  key: 'LEFT',
  value: '左',
}]

const LEGEND_ALIGN = [{
  key: 'LEFT',
  value: '首端',
}, {
  key: 'CENTER',
  value: '居中',
}, {
  key: 'RIGHT',
  value: '末端',
}, {
  key: 'AVERAGE',
  value: '均分',
}]

const defaultOption = {
  legendSize: 30,
  legendColor: 'RGBA(255, 255, 255, 0.65)',
  legendPosition: LEGEND_POSITION[3].key,
  legendWidth: 120,
  legendAlign: LEGEND_ALIGN[2].key,
  legendY: 0,
}

export function drawLegends(legendOption) {
  // if (!this.config('legendVisible')) return

  const option = {...defaultOption, ...legendOption, ...this._option}
  
  const {
    legends,
    legendSize,
    legendColor,
    legendPosition,
    titleSize,
    // artboardHeight,
    titleY,
    // unitSize,
    // height,
    // width,
    legendY = 0,
    legendWidth,
    // padding,
    legendAlign,
    legendGap = 0,
    canFilteringData = true,
  } = option

  if (!legends.length) return
  if (!option.legendVisible) return

  // 如果当前图表之前绘制过图例那么绘制前和之前的对比 如果两次图例的参数不变将不会重新绘制
  this.__cache__ = this.__cache__ || {}
  const oldLegends = this.__cache__.legends || []
  let redraw = false
  if (oldLegends.length !== legends.length) {
    redraw = true
  } else {
    for (let i = 0, l = legends.length; i < l; i += 1) {
      const ol = oldLegends[i]
      const nl = legends[i]
      // eslint-disable-next-line no-restricted-syntax
      for (const k in nl) {
        if (nl[k] !== ol[k]) {
          // eslint-disable-next-line no-unused-vars
          redraw = true
          break
        }
      }
    }
  }
  // if (!this._isWarn) {
  //   if (!redraw) return
  // }

  this.__cache__.legends = legends
  this.container.select('.wave-legends').remove()

  const titleText = (option.titleText || '').replace(/^\s*|\s*$/g, '')
  // const unitContent = (option.unitContent || '').replace(/^\s*|\s*$/g, '')
  // 图例文本大小
  const size = this.fontSize(legendSize)
  // 图例圆点大小应该喝图例字体大小保持比例
  const r = size * 0.75
  // 图例圆圈与左右的间隙
  // const gap = 4
  // 图例左边部分的长度(除了文字)
  // const legendLeft = 2 * (r + gap)
  // 计算标题的高度
  const titleHeight = titleText ? this._titleHeight || this.getTextHeight(titleSize) + (titleY || 0) : 0
  // 单位高度
  // const unitHeight = unitContent ? this._unitHeight || this.getTextHeight(unitSize) : 0
  // 图例Y轴位置
  let positionY = 0

  // 如果图例显示在标题下面那么应该算上标题的高度
  if (legendPosition === LEGEND_POSITION[0].key) {
    positionY += titleHeight
  }

  // 如果图例显示在底部那么应该算上标题 单位 和图表的高度
  if (legendPosition === LEGEND_POSITION[2].key) {
    positionY = this.containerHeight - this.getTextHeight(size) - legendY
  }

  // 如果图例显示在右边那么Y轴位置应该和图表的Y保持一致
  if (legendPosition === LEGEND_POSITION[1].key || legendPosition === LEGEND_POSITION[4].key) {
    positionY = this.translateY
  }

  const legendsContainer = this.container.select('svg')
    .append('foreignObject')
    .attr('class', 'wave-legends')

  // 设置图例位置
  if (legendPosition === LEGEND_POSITION[1].key) {
    legendsContainer.attr('width', legendWidth)
      .attr('height', this.mainHeight)
      .attr('x', this.containerWidth - legendWidth - legendY)
      .attr('y', positionY)
  } else if (legendPosition === LEGEND_POSITION[4].key) {
    legendsContainer.attr('width', 0)
      .attr('height', this.mainHeight)
      .attr('x', 0 + legendY)
      .attr('y', positionY)
  } else {
    legendsContainer.attr('width', this.containerWidth)
      .attr('height', this.getTextHeight(size))
      .attr('x', 0)
      .attr('y', positionY)
  }

  // 绘制图例
  let liWidth = 0
  let className = legendAlign === LEGEND_ALIGN[0].key ? 'wave-legend-left'
    : legendAlign === LEGEND_ALIGN[1].key ? 'wave-legend-center'
      : legendAlign === LEGEND_ALIGN[2].key ? 'wave-legend-right'
        : legendAlign === LEGEND_ALIGN[3].key ? 'wave-legend-all' : ''

  if (legendPosition === LEGEND_POSITION[1].key || legendPosition === LEGEND_POSITION[4].key) {
    liWidth = Math.max(...legendOption.legends.map(l => this.getTextWidth(l.label, this.fontSize(legendSize))))
    liWidth = liWidth + r + r / 2
    className = `${className} wave-legend-vertical`
  }

  const ul = legendsContainer.append('xhtml:ul')
    .style('height', '100%')
    .style('flex-direction', legendPosition === LEGEND_POSITION[1].key || legendPosition === LEGEND_POSITION[4].key ? 'column' : 'row')
    .attr('class', className)

  // 参考线
  if (this.config('showReferenceLineY')) {
    const referenceContainer = ul.append('xhtml:li')
    referenceContainer.append('xhtml:b')
      .attr('class', 'wave-legend-reference')
      .style('width', `${this.getTextWidth('阈值', size)}px`)
      .style('height', '0px')
      .style('margin', '0px 5px')
      .style('border-bottom', `${this.config('referenceLineColorY')} 2px dashed`)
      .style('border-radius', 0)
    referenceContainer.append('xhtml:span')
      .text(this.config('referenceLineNameY'))
      .style('font-size', `${size}px`)
      .style('color', legendColor)
      .style('cursor', 'pointer')
  }

  const li = ul.selectAll('.wave-legend')
    .data(legendOption.legends)
    .enter()
    .append('xhtml:li')
    .attr('class', 'wave-legend')
    .style('width', liWidth ? `${liWidth}px` : 'auto')

  if (legendPosition !== LEGEND_POSITION[1].key && legendPosition !== LEGEND_POSITION[4].key) {
    if (legendAlign === LEGEND_ALIGN[2].key) {
      li.style('margin-left', `${size * 0.8 + legendGap}px`)
    }
    if (legendAlign === LEGEND_ALIGN[0].key) {
      li.style('margin-right', `${size * 0.8 + legendGap}px`)
    }
    if (legendAlign === LEGEND_ALIGN[1].key) {
      li.style('margin', `0 ${size * 0.4 + legendGap}px`)
    }
  }
  if (legendPosition === LEGEND_POSITION[1].key || legendPosition === LEGEND_POSITION[4].key) {
    li.style('height', `${size * 1.8}px`)
    li.style('text-align', 'right')
    li.style('margin', `${legendGap}px 0px`)
  }

  // 圆点
  li.append('xhtml:b')
    .style('width', `${r}px`)
    .style('height', `${r}px`)
    .style('background-color', d => d.color)
    .style('margin-right', `${r / 2}px`)
    .style('cursor', 'pointer')

  // label
  li.append('xhtml:span')
    .text(d => d.label)
    .style('font-size', `${size}px`)
    .style('color', legendColor)
    .style('cursor', 'pointer')

  // 保存运行的图表当前 this
  const that = this
  // 初次渲染图例，将 backupSource 准备好，用于保存图表原始数据以便恢复
  that.backupSource = {}
  // 设定 legend 激活状态
  li._groups[0].forEach(legend => {
    let isActive = true
    const dot = legend.firstElementChild
    const label = legend.lastElementChild
    const activeStyle = {
      backgroundColor: dot.style.backgroundColor,
      textDecoration: 'none',
    }
    const inactiveStyle = {
      backgroundColor: 'gray',
      textDecoration: 'line-through',
    }

    legend.onclick = e => {
      // 筛除暂未处理的图表
      const classType = this.key
      const configuredType = ['line', 'column', 'stackedColumn', 'waterfall', 'pie', 'donut', 'nightingaleRose', 'radar']
      if (configuredType.findIndex(type => classType === type) === -1) return
      if (!canFilteringData) return
      
      // 开始筛选
      isActive = !isActive
      dot.style.backgroundColor = isActive ? activeStyle.backgroundColor : inactiveStyle.backgroundColor
      label.style.textDecoration = isActive ? activeStyle.textDecoration : inactiveStyle.textDecoration
      // source 是数组，判定为键值对
      if (Array.isArray(that._data.source)) {
        // 图例数为数组长度，为饼图的数据类型
        if (that._data.source.length === legends.length) {
          // 初始化键值对数据
          Object.keys(that.backupSource).length === 0 && that._data.source.forEach(item => {
            const name = Object.keys(item).filter(key => key !== 'label')[0]
            that.backupSource[item.label] = Number(item[name])
          })
          // 找到图例对应对数据元素
          const data = that._data.source.find(item => item.label === label.innerText)
          if (!isActive) {
            data.value = 0
          } else {
            data.value = that.backupSource[data.label]
          }
        } else if (Object.keys(that._data.source[0]).length === legends.length + 1) {
          // 图例数为记录内容数，判定为雷达图类型
          // 初始化键值对数据
          Object.keys(that.backupSource).length === 0 && that._data.source.forEach(item => {
            const names = Object.keys(item).filter(key => key !== 'label')
            that.backupSource[item.label] = {}
            names.forEach(name => {
              that.backupSource[item.label][name] = Number(item[name])
            })
          })
          // 找到图例对应对数据元素
          that._data.source.forEach(item => {
            item[label.innerText] = isActive ? that.backupSource[item.label][label.innerText] : 0
          })
        }
      } else if (typeof that._data.source === 'object' && that._data.source.label && that._data.source.value) {
        // source 是对象，且有 label 和 value 类型，判定为柱状图和折线图采用的数据格式
        that._data.source.value.forEach(item => {
          if (item.name === label.innerText) {
            if (!isActive) {
              that.backupSource[label.innerText] = item.data
              item.data = []
            } else {
              item.data = that.backupSource[label.innerText]
            }
          }
          return item
        })
      }

      // 先更新一波数据
      that.data(that._data.source)
      // 在更新图表
      that.update()
      // 执行动画，让效果更加丝滑
      that.animation && that.animation()
      // fire出去一个交互事件，表示当前图例被点击
      that.event.fire('lengendClick', {data: label.innerText, e})
    }
  })
}
