import React from 'react'
import {observer} from 'mobx-react-lite'
import {themeConfigs} from '@utils/theme'
import WaterMark from '@components/watermark'
import Box from './box-preview'

const ArtFrame = ({art, frame}) => {
  const {watermark} = art
  const {frameId, layout, boxes} = frame
  return (
    <>
      <div
        id={`artFrame-${frameId}`}
        className="pa"
        style={{
          width: `${layout.width}px`,
          height: `${layout.height}px`,
        }}
      >
        <WaterMark text={watermark.value} opacity={watermark.opacity} rotation={watermark.rotation} zIndex={0} />
        {boxes.map((box) => (
          <Box key={box.boxId} box={box} frame={frame} />
        ))}
      </div>
    </>
  )
}

export default observer(ArtFrame)
