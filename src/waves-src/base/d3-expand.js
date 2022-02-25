/**
 * @file d3上扩展的api 最好不要修改这里的代码 有疑问联系枫🍁
 */

// 现有的wave图表库依赖此文件，后续解除这种依赖，后面写组件时尽量使用原生的d3
import * as d3 from 'd3'
import {isArray, timer, isWindows, isObject, isNumber} from '../util'

// const waveDataKey = '__wave_data__'
// const d3remove = d3.selection.prototype.remove
const textShadowName = 'text-shadow'

const getKeys = Object.keys
const d3Animation = {
  d3tween: 'd3tween',
}

// interface IOperating {
//   [propName: string]: any
// }

// interface ITransitionOperating {
//   style?: IOperating
//   attr?: IOperating
// }

// interface IAnimation {
//   from: (d, i, elms) => void | string | number
//   to: (d, i, elms) => void | string | number
// }

// interface IAnimationAttr {
//   [key: string]: any | IAnimation
// }

// interface ISetAnimation {
//   // 动画类型
//   type?: string
//   style?: IAnimationAttr
//   attr?: IAnimationAttr
//   // 结束的回调
//   onEnd?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => {}
//   // 动画描述 transition的完整的属性值 优先级高于duration
//   description?: string
//   // 等待时间
//   // 也可是另一个已经就绪但还未执行的动画(setAnimation返回值) 一般传它是为了在某个动画执行完毕后再做一些操作
//   delay?: any
//   // 动画持续时间
//   duration?: number
//   // 每个元素的动画等待间隔
//   interval?: number
// }

// interface IOptions {
//   // 当前图表
//   wave?: Base
//   // 绑定的数据
//   data: any[]
//   // 数据如何取key
//   dataKey?: (d: any, i?: number, elms?: any[]) => void
//   // 旧的节点如何操作？
//   update?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
//   // 新的节点如何操作？
//   enter?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
//   // 新旧合并操作（如果旧的节点和新的节点有相同的操作可以写这里）？
//   all?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
//   // 直接传操作 这里的操作算在all头上
//   [propName: string]: any

//   /* ------------------以下是带过渡的更新操作 将会自动为节点添加同名的transition过渡样式 仅当图表就绪后执行才会生效------------------ */
//   // 旧节点带过渡效果的操作
//   transitionUpdate?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
//   // 新节点带过渡效果的操作
//   transitionEnter?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
//   // 新旧合并带过渡效果的操作
//   transitionAll?: (selection: d3.Selection<d3.BaseType, any, HTMLElement, any>) => void | IOperating
// }

const filterKeys = /^(wave|data|dataKey|update|enter|all|transitionUpdate|transitionEnter|transitionAll|isAnimation)$/

/**
 * 找到根节点上的wave实例
 * @param {Element} elm dom节点
 */
function findWave(elm) {
  if (!elm) return null
  return elm.wave ? elm.wave : findWave(elm.parentNode)
}

/**
 * 解析名称中的class和节点名
 * @param {string} name 传入的描述名称
 */
function resolveName(name) {
  const strs = name.split('.')
  return {
    className: strs.slice(1).join('.'),
    element: strs[0],
  }
}

/**
 * 运行d3 twenn过度
 * @param {array} nodes  需要运行动画的选择器数组
 * @param {number} time  动画时间
 */
function runTwenn(nodes, time) {
  for (let i = 0; i < nodes.length; i++) {
    let selection = nodes[i].selection.transition().delay(0).duration(time)
    getKeys(nodes[i].operating).forEach((k) => {
      selection = selection.tween(k, (data, index, elms) => {
        // 是否有旧的数据
        const formerData = d3.select(elms[index]).property('formerData')
        d3.select(elms[index]).property('formerData', data)
        return nodes[i].operating[k](data, index, elms, formerData)
      })
    })
  }
}

/**
 * 为选择集执行操作
 * @param {object} selection d3的选择集
 * @param {[type]} operating 要执行的操作
 */
// eslint-disable-next-line no-shadow
function operating(selection, operating) {
  const node = selection.node()
  let shadowValue = null

  // 如果没有操作 或者当前选择器没有dom节点那么直接退出
  if (!operating || !node) return

  // 如果node是text标签那么看看需要设置阴影不
  if (node.nodeName === 'text' && operating.style) {
    shadowValue = operating.style[textShadowName]
    if (typeof shadowValue === 'boolean') {
      delete operating.style[textShadowName]
    } else {
      shadowValue = false
    }
  }

  if (typeof operating === 'function') {
    operating(selection)
  } else {
    let result = selection
    let value = null
    getKeys(operating).forEach((key) => {
      value = operating[key]

      // 如果操作的值是对象，那么细化操作
      if (isObject(value)) {
        getKeys(value).forEach((name) => (result = result[key](name, value[name])))

        // 如果操作的值是个数组，那么数组当做形参传入
      } else if (isArray(value)) {
        // eslint-disable-next-line prefer-spread
        result = result[key].apply(result, value)

        // 普通的操作
      } else {
        result = result[key](value)
      }
    })

    // 是否需要添加阴影
    if (shadowValue) {
      // 尝试寻找字号
      const fs = parseFloat(node.getAttribute('font-size') || operating.style['font-size']) || 20
      selection.style('text-shadow', `${fs / 10}px ${fs / 10}px ${fs / 4.3}px rgba(0, 0, 0, 0.82)`)
    }
  }
}

function setTransition(updateDuration, nodes) {
  nodes.forEach((node) => {
    // eslint-disable-next-line no-shadow
    const {operating} = node
    let {selection} = node
    const dom = selection.node()

    // 如果没有操作
    // 或者当前选择器没有dom节点那么直接退出
    if (!operating || !dom) return

    getKeys(operating).forEach((k) => {
      const value = operating[k]
      if (k === 'style' || k === 'attr') {
        const transitionStyle = {}
        getKeys(value).forEach((name) => (transitionStyle[name] = `${updateDuration}s`))
        selection.setTransition(transitionStyle)
      } else {
        selection = isArray(value) ? selection[k](...value) : selection[k](value)
      }
    })
  })
}

/**
 * 根据data快速绘制和更新节点
 * @param {string}   name    节点名称或带class(elementName.className)的节点选择器
 *                           完整语法    - 'g.className'
 *                           省略class  - 'g'
 *                           不支持多层级过滤 例如 - 'g.class path.class'
 * @param {IOptions} options 配置项 见文件顶部定义
 */
function update(name, options) {
  const {data} = options
  const select = name.replace(/^\s*|\s*$/g, '')
  if (!select) {
    console.error('d3.update 方法缺少名称')
    return this
  }

  // 解析名称和class
  const {className, element} = resolveName(select)

  // 必须要节点名
  if (!element) {
    console.error('d3.update 方法缺少节点名称')
    return this
  }

  // 没有数据那么对于父节点来说在他下面所更新的子节点为 0 个，并且返回空的子节点的选择器 (返回的依然是子节点选择器，依然需要调用upper才能返回到父节点)
  if (!data) {
    return this.selectAll()
  }

  const {dataKey, transitionUpdate, transitionEnter, transitionAll} = options
  const oldOptions = options.update
  const newOptions = options.enter
  const allOptions = options.all || {}

  // 找到第一级的操作并把它们都算在allOptions头上
  // 当allOptions上已经存在同名操作时将忽略第一级的操作
  getKeys(options).forEach((k) => {
    if (!filterKeys.test(k)) {
      allOptions[k] = allOptions[k] || options[k]
    }
  })

  // 如果没有wave那么启用过渡动画
  const wave = options.wave || findWave(this.node())
  // eslint-disable-next-line no-unused-vars
  let waveName = 'updateAnimation'
  // 控制组件动画
  let isAnimation = options.isAnimation || false
  let updateDuration = 0.75
  let enableEnterAnimation = false
  let waveState = true
  if (wave) {
    waveState = wave.state === 'ready'
    updateDuration = wave.config('updateDuration') / 1000
    // eslint-disable-next-line no-unused-vars
    waveName = wave.uuid
    isAnimation = wave.config('updateAnimation') && waveState
    enableEnterAnimation = wave.config('enableEnterAnimation')
  }

  // 更新的部分
  // eslint-disable-next-line no-shadow
  const update = this.selectAll(name).data(data, dataKey)

  // 添加的部分
  const add = update
    .enter()
    .append(element)
    .attr('class', className ? className.split('.').join(' ') : '')

  // 删除的部分
  // eslint-disable-next-line no-shadow
  const remove = update.exit()

  // 更新和添加
  const all = update.merge(add)

  /* --------------------------------------------------------------------------------------------------------- */

  // 更新的部分操作
  operating(update, oldOptions)

  // 添加部分的操作
  operating(add, newOptions)

  // 所有操作
  operating(all, allOptions)

  /* --------------------------------------------------------------------------------------------------------- */

  const transitions = [
    {selection: update, operating: transitionUpdate},
    {selection: add, operating: transitionEnter},
    {selection: all, operating: transitionAll},
  ]

  // 三个部分css过渡操作
  const nodes = []

  // 有没有d3tween
  const d3tween = []

  for (let i = 0; i < transitions.length; i++) {
    const item = transitions[i]

    // 如果存在需要用动画进行过度的属性
    if (item.operating) {
      // 如果存在使用d3tween过度的属性那么单独提取出来
      const tween = item.operating.d3tween
      if (tween) {
        delete item.operating.d3tween

        // 如果图表就绪前 并且还需要显示入场动画并且tween.firstInvalid还为true
        if (!waveState && enableEnterAnimation && tween.firstInvalid) {
          // 啥都不做。。。。 但是数据还是要绑定的
          item.selection.each(function (d) {
            d3.select(this).property('formerData', d)
          })
        } else {
          delete tween.firstInvalid
          d3tween.push({selection: item.selection, operating: tween})
        }
      }

      // 经过一番提取后如果还存在利用css过度的属性
      if (getKeys(item.operating).length) {
        nodes.push(item)
      }
    }
  }

  // 如果.... 那么就执行
  if (d3tween.length) {
    if (isAnimation) {
      timer.setTask(() => {
        runTwenn(d3tween, updateDuration * 1000)
      })
    } else {
      runTwenn(d3tween, 0)
    }
  }

  // 如果.... 那么就执行
  if (nodes.length) {
    if (isAnimation) {
      // 先补充过渡属性
      setTransition(updateDuration, nodes)
      // 设置过渡
      timer.setTask(() => {
        nodes.forEach((node) => operating(node.selection, node.operating))
      }, true)
    } else {
      nodes.forEach((node) => operating(node.selection, node.operating))
    }
  }

  // 删除多余
  remove.remove()

  // 保存父级
  all.parent = this

  // 绑定数据的索引
  all.each(function (d, i) {
    this.__index__ = i
  })

  return all
}

// 由于在window的chrome上text标签不能和mac显示保持一致 所以针对window要额外设置text的向下偏移量
// 该方法使用text 的dy 属性 使用时注意同属性被覆盖
// 方法被挂在d3 selection 使用时：text.setTextDy()
function textHack(v = 0) {
  if (isWindows()) {
    this.attr('dy', `${v + 0.1}em`)
  }
  return this
}

/**
 * 返回d3选择器的上一层（element的父级选择器）
 * 优先查看是否有父级的快捷方式 有的话直接返回
 * 如果没有快捷方式那么将尝试获取当前选择器的所有原生节点的父节点并返回
 * 如果还没有那么尝试返回选择器上的_parents
 * @param {number} n 默认往上走一层
 * @param {boolean} precise 返回精准的父节点(所有原生节点的父节点)
 */
function upper(n, precise = false) {
  let selection = null
  const level = n ? n - 1 : 0

  // 如果有父节点的快捷引用则直接返回
  if (this.parent && !precise) {
    selection = this.parent
  } else {
    // 没有父节点快捷引用那么获取当前选择器中所有节点的原生父节点
    const groups = this._groups
    let elms = []
    for (let i = 0, l = groups.length; i < l; i += 1) {
      const gs = groups[i]
      for (let e = 0; e < gs.length; e += 1) {
        if (gs[e] && gs[e].parentNode) {
          elms.push(gs[e].parentNode)
          break
        }
      }
    }

    // 如果在_groups中没有找到父节点那么可能这个选择器是空节点
    // 直接看是否存在_parents
    if (!elms.length) {
      elms = this._parents
    }

    if (elms.length) {
      selection = d3.selectAll(elms)
    }
  }

  // 如果在_groups中没有找到父节点 并且_parents也没有那就得抛错了啊
  if (!selection) {
    console.error('d3-expand: upper 无法返回上一层 请检查当前层的节点或父节点是否存在')
    return this
  }

  return level ? selection.upper(level, precise) : selection
}

/**
 * 为节点设置过渡样式
 * @param {IOperating} style   需要过渡的属性
 * @param {Boolean}    isCover 是否直接覆盖transition样式？
 *                             true 覆盖
 *                             false 不覆盖 如果不覆盖的话那么会在transition上增加不同命的属性 如果同名那么会替换
 */
function transition(style, isCover = false) {
  const node = this.node()
  // eslint-disable-next-line no-shadow
  let transition = null
  if (!node) return this

  if (isCover) {
    getKeys(style).forEach((name) => style[name] && transition.push(`${name} ${style[name]}`))
  } else {
    // 先拿到当前节点上的过渡样式
    transition = node.style.transition
    transition = !transition ? [] : transition.split(',')
    if (!transition.length) {
      getKeys(style).forEach((name) => style[name] && transition.push(`${name} ${style[name]}`))
    } else {
      getKeys(style).forEach((name) => {
        for (let i = 0; i < transition.length; i += 1) {
          // 如果当前过渡样式上已经存在同名样式那么覆盖
          // 否则添加
          if (transition[i].split(' ').indexOf(name) > -1) {
            if (style[name]) {
              transition[i] = `${name} ${style[name]}`
            } else {
              transition.splice(i, 1)
              i -= 1
            }
            break
          } else if (i === transition.length - 1) {
            style[name] && transition.push(`${name} ${style[name]}`)
          }
        }
      })
    }
  }

  // 设置过渡
  this.style('transition', transition.join(', '))
  return this
}

/**
 * 对选择器设置过渡动画
 * @param {ISetAnimation} options       动画配置
 *                        options.style 每个样式的完整格式应该是对象并且包含from 和 to 也可以不是对象而直接使用to值 这时from默认值为 0
 *
 */
function setAnimation(options) {
  const transitionStyles = {}
  const style = options.style || {}
  const attr = options.attr || {}
  const delay = isNumber(options.delay) ? options.delay : 0
  const {duration} = options
  const callback = options.onEnd
  const {description} = options
  const attrs = [options.style, options.attr]
  const interval = options.interval || 0
  // eslint-disable-next-line no-underscore-dangle
  const upperQueue = (isObject(options.delay) ? options.delay : {}).__queue__

  const node = this.node() || this._parents[0]
  const wave = node ? findWave(node) : null
  const name = wave ? wave.uuid : null
  const nodesLength = this.nodes().length || 1

  const time = (delay || 0) + (duration || 0) + (nodesLength - 1) * interval

  // 记录当前节点绑定的过度属性 回头用来还原
  // eslint-disable-next-line no-shadow
  const transition = node.style.transition || ''

  // 在当前实例上绑定一个队列
  // 当动画执行完毕之前可以在该队列中添加任务
  // 这是一个内部属性 外部不需要知道
  this.__queue__ = []

  const backFn = () => {
    // 检索并执行队列
    const queue = this.__queue__

    // 解除队列
    this.__queue__ = null

    // 将过渡样式清除
    if (node && (duration || description) && !d3Animation[options.type]) {
      getKeys(transitionStyles).forEach((k) => (transitionStyles[k] = null))
      this.style('transition', transition)
    }

    for (let i = 0; i < queue.length; i++) {
      if (typeof queue[i] === 'function') queue[i]()
    }

    if (typeof callback === 'function') callback(this)
  }

  // 只有真实DOM节点存在才会设置动画
  if (node) {
    let to = null

    // 设置起始状态
    getKeys(style).forEach((k) => this.style(k, isObject(style[k]) ? style[k].from : 0))
    getKeys(attr).forEach((k) => this.attr(k, isObject(attr[k]) ? attr[k].from : 0))

    // 用于d3的tween动画
    const d3tween = () => () => {
      const keys = {...attr, ...style}
      let selection = this.transition()
        .delay((d, i) => i * interval)
        .duration(duration || 0)

      getKeys(keys).forEach((k) => {
        selection = selection.tween(k, isObject(keys[k]) ? keys[k].to : keys[k])
      })
    }

    // 用于css动画
    const css = () => {
      // 设置过渡样式
      if (duration || description) {
        const transitionStyle = description ? String(description) : `${duration / 1000}s`
        attrs.forEach((a) => {
          if (!a) return
          getKeys(a).forEach((k) => (transitionStyles[k] = transitionStyle))
        })
        this.setTransition(transitionStyles)
      }

      // 设置终止状态
      return () => {
        // 是否有间隔时间？
        const that = interval
          ? this.transition()
              .duration(0)
              .delay((d, i) => i * interval)
          : this
        getKeys(style).forEach((k) => {
          that.style(k, isObject(style[k]) ? style[k].to : style[k])
        })
        getKeys(attr).forEach((k) => {
          that.attr(k, isObject(attr[k]) ? attr[k].to : attr[k])
        })
      }
    }

    // 用的是什么动画
    switch (options.type) {
      case d3Animation.d3tween:
        to = d3tween()
        break
      default:
        to = css()
        break
    }

    if (upperQueue) {
      upperQueue.push(to)
    } else if (delay && delay > 0) {
      timer.setDelay(to, delay, name)
    } else {
      // 这里要加个 强制刷新 以防大屏图表过多时某些图表无法展示入场动画
      timer.setTask(to, true)
    }
  }

  // 如果传了上一个动画 那么将动画移到上一个动画的队列中执行
  if (upperQueue) {
    upperQueue.push(() => {
      timer.setDelay(backFn, time, name)
    })
  } else if (delay && delay > 0) {
    // 不管DOM是否存在都会执行动画完成的回调
    timer.setDelay(backFn, time, name)
  } else {
    timer.setTask(() => {
      timer.setDelay(backFn, time, name)
    })
  }

  return this
}

/**
 * 清除绑定在节点上的数据
 * @param {HTMLElement} elm 节点
 */
// function clear(elm) {
//   elm[waveDataKey] = null
//   const children = elm.children || []
//   for (let i = 0; i < children.length; i++) {
//     clear(children[i])
//   }
// }

/**
 * 改写d3 remove方法
 */
// function remove() {
//   // 清除绑定在节点上的数据

//   const nodes = this.nodes()
//   for (let i = 0; i < nodes.length; i++) {
//     clear(nodes[i])
//   }

//   // 调用真正的remove
//   d3remove.call(this)
// }

function expand(proto) {
  proto.update = update
  proto.textHack = textHack
  proto.upper = upper
  proto.upperPrecise = function (n) {
    return this.upper(n, true)
  }
  proto.setTransition = transition
  proto.setAnimation = setAnimation
  // proto.remove = remove
}

expand(d3.selection.prototype)

export default expand
