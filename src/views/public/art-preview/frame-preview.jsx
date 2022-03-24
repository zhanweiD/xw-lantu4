import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import WaterMark from '@components/watermark'
import Box from './box-preview'
import Material from '../material'
import {themeConfigs} from '@common/theme'

const ArtFrame = ({art, frame}) => {
  const {global, overflowX, overflowY} = art
  const {effective, fields} = global.options.sections.watermark
  const {frameId, layout, boxes, materials = [], backgroundImage_, backgroundColor_} = frame
  const {theme} = global.options.sections.themeColor.fields

  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    flex: 'none',
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    overflowX,
    overflowY,
    background: themeConfigs[theme].background,
  }

  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  console.log(style)
  return (
    <div
      id={`artFrame-${frameId}`}
      className="pr fbh fbac fbjc"
      style={{
        overflowX,
        overflowY,
        width: '100vw',
        height: '100vh',
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
