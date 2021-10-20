import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import WaterMark from '@components/watermark'
import Box from './box-preview'
import Material from '../material'

const ArtFrame = ({art, frame}) => {
  const {watermark} = art
  const {frameId, layout, boxes, materials = [], backgroundImage_, backgroundColor_} = frame
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    width: `${layout.width}px`,
    height: `${layout.height}px`,
  }

  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  return (
    <>
      <div id={`artFrame-${frameId}`} className="pa" style={style}>
        {reverseMaterials.map((material) => (
          <Material material={material} key={material.id} target={frame} frame={frame} />
        ))}
        {boxes.map((box) => (
          <Box key={box.boxId} box={box} frame={frame} />
        ))}
        <WaterMark text={watermark.value} opacity={watermark.opacity} rotation={watermark.rotation} zIndex={0} />
      </div>
    </>
  )
}

export default observer(ArtFrame)
