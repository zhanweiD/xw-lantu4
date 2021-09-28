import isDef from '@utils/is-def'

class Image {
  constructor({container, url, fillType, opacity, effective}) {
    this.container = container
    this.url = url
    this.fillType = fillType
    this.opacity = opacity
    this.effective = effective
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
      }
      this.setStyle()
      this.container.appendChild(this.div)
    } else {
      this.container.removeChild(this.div)
    }
  }

  setStyle() {
    switch (this.fillType) {
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
    this.div.style.opacity = this.opacity
  }

  update({fillType = this.fillType, opacity = this.opacity, effective = this.effective}) {
    this.opacity = opacity
    this.fillType = fillType
    this.effective = effective
    this.draw()
  }
}

export default Image