const defaultOption = {
  yTickSize: 12,
  yTickColor: 'RGBA(255, 255, 255, 0.65)',
  tickCount: 6,
  offsetY: 0,
  offsetRightY: 0,
}

/**
 * 生成y轴
 *
 * @export
 * @param {IAxisY}  opt
 * @return {object} 左边和右边坐标轴的刻度数组
 */
export function drawAxisY(axisYOpiton) {
  const option = {...defaultOption, ...axisYOpiton, ...this._option}
  const {scale, rightScale, yTickSize, yTickColor, tickCount, offsetY = 0, offsetRightY = 0} = option

  const {translateY} = this
  // y轴上下偏移 默认跟随图表主题的偏移
  const y = typeof translateY === 'number' ? translateY : this._translateY

  // 绘制Y轴的宽度为图表的真正宽度
  const width = this.isDev ? this.mainWidth + this.padding[1] + this.padding[3] : this.containerWidth

  // Y轴的容器 默认在 svg上
  const container = option.root || (this.isDev ? this.root : this.container.select('svg'))

  // 如果该图表之前绘制过Y轴 那么现在需要对比之前的轴 如果一样那么不需要重绘
  this.__cache__ = this.__cache__ || {}
  const oldScale = this.__cache__.axisy || [null, null]
  const newScale = [scale, rightScale]
  let redraw = false
  oldScale.forEach((os, i) => {
    const ns = newScale[i]
    if (os && ns) {
      if (JSON.stringify(os.domain()) !== JSON.stringify(ns.domain())) {
        redraw = true
      }
    } else if ((os && !ns) || (!os && ns)) {
      redraw = true
    }
  })
  if (!redraw) {
    return
  }
  container.select('.wave-axis-y').remove()
  this.__cache__.axisy = newScale

  // 是否显示网格线
  const lineVisible = option.lineVisible !== undefined && option.lineVisible !== null ? option.lineVisible : true

  const fixed = 0
  const niceScale = niceYaxis(scale, tickCount)
  const leftTickValues = tickValues(scale, tickCount)

  let rightTickValues
  if (rightScale) {
    niceYaxis(rightScale, tickCount)
    rightTickValues = tickValues(rightScale, tickCount)
  }

  // y轴
  const axisYContainer = container
    .append('g')
    .attr('transform', `translate(${this.isDev ? -this.padding[3] : offsetY}, ${this.isDev ? 0 : y})`)
    .attr('class', 'wave-axis-y')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'text-before-edge')
    .attr('fill', 'none')
    .style('pointer-events', 'none')

  axisYContainer
    .append('path')
    .attr('stroke', 'transparent')
    .attr('d', `M-6,${niceScale.range()[0]}H0.5V${niceScale.range()[1]}H-6`)

  const yKeys = axisYContainer
    .selectAll('g')
    .data(tickValues(niceScale, tickCount, fixed))
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(0, ${scale(d)})`)

  if (lineVisible) {
    yKeys.append('line').attr('stroke', '#fff').attr('x2', width).attr('opacity', 0.2)
  }

  // warn时y轴不写数值
  this._isWarn ||
    yKeys
      .append('text')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('font-size', this.fontSize(yTickSize))
      .attr('fill', yTickColor)
      .text((d, i) => {
        if (scale) {
          return i !== 0 ? this.formatMoney(leftTickValues[i]) : null
        }
        return i !== 0 ? this.formatMoney(d) : null
      })

  if (rightScale) {
    this._isWarn ||
      yKeys
        .append('text')
        .attr('x', width)
        .attr('text-anchor', 'end')
        .attr('font-size', this.fontSize(yTickSize))
        .attr('fill', yTickColor)
        .attr('transform', `translate(-${offsetY + offsetRightY}, 0)`)
        .text((d, i) => {
          if (scale) {
            return i !== 0 ? this.formatMoney(rightTickValues[i]) : null
          }
          return i !== 0 ? this.formatMoney(d) : null
        })
  }

  // eslint-disable-next-line consistent-return
  return {
    leftTickValues,
    rightTickValues,
  }
}

/**
 * 优化tick的数值
 *
 * @param {*} scale
 * @param {number} [tickCount=6]
 * @param {number} [fixed=0]
 * @returns {number[]}
 */
export function tickValues(scale, tickCount = 6, fixed = 0) {
  const domain = scale.domain()
  const distance = domain[1] - domain[0]

  if (distance === 0 || tickCount === 0) {
    return []
  }

  const step = distance / tickCount
  const result = []

  for (let i = 0; i < tickCount + 1; i += 1) {
    // result[i] = step * i + domain[0]
    // result[i] = fixed ? result[i].toFixed(fixed + 1).slice(0, -1) : result[i]
    let value = step * i + domain[0]
    if (fixed === Math.abs(fixed)) {
      const multi = 10 ** Math.floor(fixed)
      // eslint-disable-next-line no-mixed-operators
      value =
        domain[1] / tickCount > 2 ? Math.round(value * multi) / multi : Number(((value * multi) / multi).toFixed(2))
    }
    result[i] = value
  }

  return result
}

// 判断一个实数的数量级
const judgeLevel = (number) => {
  const absNumber = Math.abs(number)
  let result = 1

  if (absNumber >= 1) {
    result = 10 ** (String(Math.round(absNumber)).length - 1)
  } else if (absNumber > 0 && absNumber < 1) {
    let tmp = absNumber

    while (tmp < 1) {
      tmp *= 10
      result /= 10
    }
  }

  return number > 0 ? result : -result
}

/**
 * nice一下scale
 *
 * @param {*} scale
 * @returns
 */
function niceYaxis(scale, tickCount) {
  const domain = scale.domain()

  // 数据同质判断
  let [start, end] = domain
  if (start === end) {
    if (start === 0) {
      end += tickCount
    } else {
      start -= tickCount
      end += tickCount
    }
  }

  // 数据大小判断
  let isAscending = true
  if (start >= end) {
    [start, end] = [end, start]
    isAscending = false
  }

  // 生成合适的刻度范围
  if (tickCount !== 0) {
    const distance = end - start
    const level = judgeLevel(distance / tickCount)

    // 保证图表不会溢出的 step，但有时候空白空间过大
    let step = Math.ceil(distance / tickCount / level) * level
    const newStart = Math.floor(start / step) * step
    const tempEnd = newStart + tickCount * step
    const tempDistance = tempEnd - newStart
    // 对 step 进行修正
    if (end + (level / 2) * tickCount < tempEnd && (tempEnd - end) / tempDistance > 0.2) {
      step -= level / 2
    } else if (tempEnd < end) {
      if (tempEnd + (level / 2) * tickCount < end) {
        step += level
      } else {
        step += level / 2
      }
    }

    const newEnd = newStart + tickCount * step
    const newDomain = isAscending ? [newStart, newEnd] : [newEnd, newStart]

    scale.domain(newDomain)
  }

  return scale
}

export function yy() {
  console.log('this is y')
}
