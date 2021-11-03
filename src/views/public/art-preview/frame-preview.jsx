import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import WaterMark from '@components/watermark'
import Box from './box-preview'
import Material from '../material'

const ArtFrame = ({art, frame}) => {
  const {global} = art
  const {effective, fields} = global.options.sections.watermark
  const {frameId, layout, boxes, materials = [], backgroundImage_, backgroundColor_} = frame
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    margin: 'auto',
  }

  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  return (
    <>
      <div id={`artFrame-${frameId}`} className="pr" style={style}>
        {reverseMaterials.map((material) => (
          <Material material={material} key={material.id} target={frame} frame={frame} />
        ))}
        {boxes.map((box) => (
          <Box key={box.boxId} box={box} frame={frame} />
        ))}
        {effective && <WaterMark text={fields.content} opacity={fields.opacity} rotation={fields.angle} zIndex={0} />}
      </div>
    </>
  )
}

export default observer(ArtFrame)
