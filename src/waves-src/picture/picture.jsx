import React from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import s from './picture.module.styl'

const MPicture = MUIBase.named('MPicture')
  .props({
    name: types.optional(types.string, '图片'),
    pictureData: types.array(types.frozen()),
    others: types.optional(types.model(), {}),
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
        'borderRadius',
        'paddingLeft',
        'opacity',
        'top',
        'left',
        'right',
        'content',
      ]?.forEach((name) => (style[name] = self.config(name)))
      // console.log('style', style)

      self.render(
        <div style={style} className={s.center}>
          <img
            width={self.containerWidth * 0.8}
            height={self.containerHeight * 0.8}
            src={self.pictureData[1][0]}
            alt={style.content}
          />
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
