import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import s from './watermark.module.styl'

const WaterMark = ({text = '', rotation = 0, opacity = 1, size = 24, gap = 50, zIndex = 999}) => {
  const [background, setBackground] = useState('')

  const STYLE = {
    FONT_FAMILY: "'PingFang SC', 'Helvetica Neue', Helvetica, Tahoma, Helvetica, sans-serif",
  }
  const getTextWidth = () => {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = `${size}px ${STYLE.FONT_FAMILY}`
    return ctx.measureText(text).width
  }

  useEffect(() => {
    const canvas = document.createElement('canvas')

    const rectWidth = getTextWidth() + gap
    // 设置画布的长宽, 包含一个水印文本
    canvas.width = rectWidth
    canvas.height = rectWidth

    const rectCenterPoint = {x: rectWidth / 2, y: rectWidth / 2}

    const ctx = canvas.getContext('2d')
    // 旋转前将当前绘图ctx左顶点偏移到其中心点
    ctx.translate(rectCenterPoint.x, rectCenterPoint.y)
    // TODO 这里需要改进
    ctx.rotate((rotation * Math.PI) / 180)
    // 旋转后文本中心点偏移回到原绘图中心点
    ctx.translate(-rectCenterPoint.x, -rectCenterPoint.y)
    // 设置字体字号
    ctx.font = `${size}px ${STYLE.FONT_FAMILY}`
    // 设置填充绘画的颜色、渐变或者模式
    ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`
    // 设置文本内容的当前对齐方式
    ctx.textAlign = 'center'
    // 设置在绘制文本时使用的当前文本基线
    ctx.textBaseline = 'Middle'
    // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
    ctx.fillText(text, rectCenterPoint.x, rectCenterPoint.y)
    // 重复铺满水印文本
    setBackground(`url(${canvas.toDataURL('image/png')}) left top repeat`)
  }, [text, rotation, opacity])

  return (
    <div
      className={c('pa', s.watermark)}
      style={{
        background,
        zIndex,
      }}
    />
  )
}

export default observer(WaterMark)
