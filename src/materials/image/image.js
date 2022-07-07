import isDef from '@utils/is-def'

class Image {
  constructor({container, url, blendMode, fillMode, opacity, effective}) {
    this.container = container
    this.url = url
    this.fillMode = fillMode
    this.opacity = opacity
    this.effective = effective
    this.blendMode = blendMode
  }

  draw() {
    if (!isDef(this.effective) || this.effective) {
      if (!this.div) {
        this.div = document.createElement('div')
        this.div.style.height = '100%'
        this.div.style.width = '100%'
        this.div.style.backgroundImage = `url(${this.url})`
        this.div.style.backgroundRepeat = 'no-repeat'
        this.div.style.backgroundPosition = 'center'
        this.div.style.isolation = 'isolate'
      }
      this.setStyle()
      this.container.appendChild(this.div)
    } else {
      setTimeout(() => this.div && this.container.removeChild(this.div), 1)
    }
  }

  setStyle() {
    switch (this.fillMode) {
      case 'shortEdgeFill':
        this.div.style.backgroundSize = 'cover'
        break
      case 'longEdgeFill':
        this.div.style.backgroundSize = 'contain'
        break
      case 'stretchFill':
        this.div.style.backgroundSize = '100% 100%'
        break
      default:
        this.div.style.backgroundSize = 'cover'
    }
    this.div.style.mixBlendMode = this.blendMode
    this.div.style.opacity = this.opacity
  }

  update({fillMode = this.fillMode, blendMode = this.blendMode, opacity = this.opacity, effective = this.effective}) {
    this.opacity = opacity
    this.fillMode = fillMode
    this.effective = effective
    this.blendMode = blendMode
    this.draw()
  }

  destroy() {
    setTimeout(() => this.div && this.container.removeChild(this.div), 1)
    this.div = undefined
  }
}

export default Image
