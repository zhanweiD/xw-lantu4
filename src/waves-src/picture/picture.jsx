import React from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import s from './picture.module.styl'

const MPicture = MUIBase.named('MPicture')
  .props({
    name: types.optional(types.string, '图片'),
    pictureData: types.array(types.frozen()),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiPicture'
    }

    // 传入数据
    const data = (pictureData) => {
      self.pictureData = pictureData.data
      self.name = pictureData.name || '图片'
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {}
      ;[
        'width',
        'height',
        'backgroundColor',
        'borderWidth',
        'borderColor',
        'dotColor',
        'dotSize',
        'borderRadius',
        'padding',
        'opacity',
        'top',
        'left',
        'right',
        'updateDuration',
        'animationType',
      ]?.forEach((name) => (style[name] = self.config(name)))
      const {borderWidth, borderColor, dotColor, dotSize, ...others} = style

      // 轮播
      const handleIntervalImage = () => {
        let interval
        let total = self.pictureData.length
        let i = 0

        interval = setInterval(() => {
          if (i < total) {
            document.getElementsByTagName('section')[0].style.transform = `translate(${-style.width * i}px)` // 每次往左拽一个容器的宽度
            document.getElementById('box1').style.backgroundImage = `url(${self.config('data')[i][0]})` // 只展示当前图片
            i++
          } else {
            clearInterval(interval)
            handleIntervalImage()
          }
        }, style.updateDuration)
      }

      self.pictureData.length > 1 ? handleIntervalImage() : null

      self.render(
        <div
          id="box1"
          style={{
            border: `${borderWidth}px solid ${borderColor}`,
            width: style.width,
            height: style.height,
            backgroundImage: `url(${self.pictureData[0][0]})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            ...others,
          }}
          className={s.swiper}
        >
          <section
            className={s.img_container}
            style={{
              paddingTop: style.padding[0],
              paddingRight: style.padding[1],
              paddingBottom: style.padding[2],
              paddingLeft: style.padding[3],
            }}
          ></section>

          {/* 轮播圆点 */}
          {self.pictureData.length > 1 && (
            <div className={s.num_container}>
              {self.pictureData.map((t, ind) => (
                <button
                  key={ind}
                  style={{background: dotColor, width: dotSize, height: dotSize}}
                  className={s.btn}
                  onClick={() => {
                    document.getElementById('div0').style.transform = `translate(${-style.width * ind}px)`
                  }}
                ></button>
              ))}
            </div>
          )}
        </div>
      )
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

export default MPicture
