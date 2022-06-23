import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import WaterMark from '@components/watermark'
import Box from './box-preview'
import Material from '../material'
import {themeConfigs} from '@common/theme'

const ArtFrame = ({art, frame}) => {
  const {global, overflowX, overflowY, zoom, totalHeight, totalWidth} = art
  const {effective, fields} = global.options.sections.watermark
  const {originLayout, frameId, layout, boxes, materials = [], backgroundImage_, backgroundColor_} = frame
  const {theme} = global.options.sections.themeColor.fields
  const {heightAdaption, widthAdaption} = global.options.sections.screenAdaption.fields
  const adaptionEff = global.options.sections.screenAdaption.effective
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    flex: 'none',
    width: '100%',
    height: '100%',
    overflowX,
    overflowY,
  }

  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }
  if (!backgroundColor_ && !backgroundImage_) {
    style.background = themeConfigs[theme].background
  }
  const scaleArt = () => {
    const art = document.querySelector(`#artFrame-${frameId}`)
    const x = window.innerWidth / originLayout.width
    const y = window.innerHeight / originLayout.height
    art.style.transform = `scale(${x}, ${y})`
  }
  const resizeFun = () => {
    if (adaptionEff) {
      if (heightAdaption === 'zoomToScreenHeight' && widthAdaption === 'zoomToScreenWidth') return scaleArt()
      // else if (heightAdaption === 'scrollVertical' && widthAdaption === 'scrollHorizontal') return null
    }
    art.zoom.init(document.querySelector(`#artFrame-${frameId}`), {})
  }

  useEffect(() => {
    window.addEventListener('resize', resizeFun)
    return () => window.removeEventListener('resize', resizeFun)
  }, [frameId])

  useEffect(() => {
    resizeFun()
  }, [frameId])
  return (
    <div
      id={`artFrame-${frameId}`}
      className="pr fbh fbac fbjc"
      style={{
        overflowX,
        overflowY,
        transformOrigin: '0% 0%',
        width: originLayout.width,
        height: originLayout.height,
      }}
    >
      <div className="pr" style={style}>
        {reverseMaterials.map((material) => (
          <Material material={material} key={material.id} target={frame} frame={frame} />
        ))}
        {boxes.map((box) => (
          <Box key={box.boxId} box={box} frame={frame} />
        ))}
        {effective && <WaterMark text={fields.content} opacity={fields.opacity} rotation={fields.angle} zIndex={0} />}
      </div>
    </div>
  )
}

export default observer(ArtFrame)
