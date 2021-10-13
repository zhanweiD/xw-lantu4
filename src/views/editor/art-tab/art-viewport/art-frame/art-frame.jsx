import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {DropTarget} from '@components/drag-and-drop'
import Grid from '@waves4/grid'
import WaterMark from '@components/watermark'
import Box from '../box'
import s from './art-frame.module.styl'

const ArtFrame = ({frame}) => {
  const {frameId, grid, viewLayout, isCreateFail, art_, boxes, backgroundImage_, backgroundColor_} = frame
  const {isGridVisible, global} = art_

  const {effective, fields} = global.options.sections.watermark

  const gridRef = useRef(null)

  useEffect(() => {
    if (isGridVisible) {
      new Grid({
        container: gridRef.current,
        autoScale: true,
        width: grid.width_,
        height: grid.height_,
        unit: grid.unit_,
      }).draw()
    }
  }, [grid.width_, grid.height_, grid.unit_, isGridVisible])

  const style = {
    top: `${grid.extendY_}px`,
    left: `${grid.extendX_}px`,
    width: `${viewLayout.width}px`,
    height: `${viewLayout.height}px`,
  }

  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  const Frame = (
    <div id={`artFramegrid-${frameId}`}>
      <div id={`artFrame-${frameId}`} className={c('pa', s.origin)} style={style}>
        {isGridVisible && (
          <div
            ref={gridRef}
            className={c(s.grid)}
            style={{
              top: `${-grid.extendY_}px`,
              left: `${-grid.extendX_}px`,
              width: `${grid.width_}px`,
              height: `${grid.height_}px`,
            }}
          />
        )}
        {effective && (
          <WaterMark
            text={fields.content.value}
            opacity={fields.opacity.value}
            rotation={fields.angle.value}
            zIndex={0}
          />
        )}

        {boxes.map((box) => (
          <Box key={box.boxId} box={box} />
        ))}
      </div>
    </div>
  )
  return (
    <>
      {isCreateFail ? (
        <div
          style={{
            top: `${viewLayout.y - grid.extendY_}px`,
            left: `${viewLayout.x - grid.extendX_}px`,
            width: `${grid.width_}px`,
            height: `${grid.height_}px`,
          }}
          className={c('pa art-frame', s.root)}
        >
          {Frame}
        </div>
      ) : (
        <DropTarget
          style={{
            top: `${viewLayout.y - grid.extendY_}px`,
            left: `${viewLayout.x - grid.extendX_}px`,
            width: `${grid.width_}px`,
            height: `${grid.height_}px`,
          }}
          className={c('pa art-frame', s.root)}
          acceptKey={['CREATE_EXHIBIT_DRAG_KEY', 'UPDATE_BOX_BACKGROUND_DRAGE_KEY']}
          data={{
            create: (data) => {
              frame.createBox({
                ...data,
              })
            },
            createBackground: (data) => {
              frame.createBox({
                ...data,
              })
            },
          }}
        >
          {Frame}
        </DropTarget>
      )}
    </>
  )
}

export default observer(ArtFrame)
