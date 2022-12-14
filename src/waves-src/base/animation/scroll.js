import * as d3 from 'd3'
import anime from 'animejs'
import AnimationBase from './base'

// 默认参数
const defaultOptions = {
  offsetX: 0,
  offsetY: 0,
  delay: 2000,
  duration: 2000,
  reverse: false,
  loop: true,
  hide: false,
}

export default class ScrollAnimation extends AnimationBase {
  constructor(options, context) {
    super(options)
    this.options = {...defaultOptions, ...options}
    const {clone, offsetX, offsetY, reverse} = this.options
    const {root} = context
    // 复制一份相同的元素，使得滚动动画连续
    if (typeof clone === 'function') {
      const targets = (root || d3).selectAll(options.targets)._groups[0]
      const extraNodes = Array.from(targets).map(node => clone(node))
      // 统一在原来列表的末端追加复制的元素（svg 会停留在原地）
      root && anime({
        targets: extraNodes,
        translateX: `+=${extraNodes.length * offsetX}`,
        translateY: `+=${extraNodes.length * offsetY}`,
        duration: 0,
      })
    }
    this.options = {...this.options, targets: (root || d3).selectAll(options.targets)._groups[0]}
    this.elementNumber = this.options.targets.length
    this.activeIndex = reverse ? this.elementNumber - 1 : 0
    this.isAnimationStart = false
    this.isAnimationAvailable = true
    // 在反方向情况下整体移动，使得滚动动画连续
    typeof clone === 'function' && reverse && anime({
      targets: this.options.targets,
      translateX: `-=${offsetX}`,
      translateY: `-=${offsetY}`,
      duration: 0,
    })
  }

  play() {
    const {targets, hide, delay, duration, offsetX, offsetY, reverse} = this.options
    const keyframes = [{
      translateX: `${reverse ? '+=' : '-='}${offsetX}`,
      translateY: `${reverse ? '+=' : '-='}${offsetY}`,
      opacity: (el, index) => (this.activeIndex === index ? 0 : 1),
      duration,
    }, {
      translateX: (el, index, length) => {
        return this.activeIndex === index ? `${reverse ? '-=' : '+='}${offsetX * length}` : '+=0'
      },
      translateY: (el, index, length) => {
        return this.activeIndex === index ? `${reverse ? '-=' : '+='}${offsetY * length}` : '+=0'
      },
      opacity: 1,
      duration: 0,
    }]
    if (hide) {
      keyframes.forEach(item => delete item.opacity)
    }
    anime({
      targets,
      duration,
      delay,
      keyframes,
      update: this.process.bind(this),
      loopBegin: this.start.bind(this),
      loopComplete: this.end.bind(this),
      easing: 'linear',
    })
  }

  start() {
    this.isAnimationStart = true
    this.event.has('start') && this.event.fire('start')
  }

  process(data) {
    this.event.has('process') && this.event.fire('process', data.progress)
  }

  end() {
    this.isAnimationStart = false
    this.activeIndex = !this.options.reverse
      ? (this.activeIndex + 1) % this.elementNumber
      : (this.activeIndex + this.elementNumber - 1) % this.elementNumber
    this.event.has('end') && this.event.fire('end')
    this.isAnimationAvailable && this.options.loop && this.play()
  }

  destory() {
    anime.remove(this.options.targets)
    this.isAnimationAvailable = false
  }
}
