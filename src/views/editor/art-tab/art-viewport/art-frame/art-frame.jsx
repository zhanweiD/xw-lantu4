import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import {DropTarget} from '@components/drag-and-drop'
import Grid from '@waves4/grid'
import WaterMark from '@components/watermark'
import Material from '@views/public/material'
import Box from '../box'
import s from './art-frame.module.styl'

const ArtFrame = ({frame}) => {
  const {
    frameId,
    grid,
    viewLayout,
    isCreateFail,
    art_,
    boxes,
    backgroundImage_,
    backgroundColor_,
    materials = [],
  } = frame
  const {isGridVisible, global} = art_
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
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
        lineOpacity: grid.lineOpacity_,
        lineColor: grid.lineColor_,
        guideLineColor: grid.guideLineColor_,
        guideLineOpacity: grid.guideLineOpacity_,
      }).draw()
    }
  }, [
    grid.width_,
    grid.height_,
    grid.unit_,
    grid.lineOpacity_,
    grid.lineColor_,
    grid.guideLineOpacity_,
    grid.guideLineColor_,
    isGridVisible,
  ])

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
        {effective && (
          <WaterMark
            text={fields.content.value}
            opacity={fields.opacity.value}
            rotation={fields.angle.value}
            zIndex={0}
          />
        )}
        {reverseMaterials.map((material) => (
          <Material material={material} key={material.id} target={frame} frame={frame} />
        ))}
        {boxes.map((box) => (
          <Box key={box.uid} box={box} />
        ))}
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
          acceptKey={['CREATE_EXHIBIT_DRAG_KEY', 'UPDATE_BACKGROUND_DRAGE_KEY']}
          data={{
            create: (data) => {
              frame.createBox({
                ...data,
              })
            },
            addBackground: (data) => {
              frame.addBackground({
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
