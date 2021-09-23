import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {DropTarget} from '@components/drag-and-drop'
import Grid from '@waves4/grid'
import {themeConfigs} from '@utils/theme'
import Box from '../box'
import s from './art-frame.module.styl'

const ArtFrame = ({frame}) => {
  const {frameId, grid, viewLayout, isCreateFail, art_, boxes} = frame
  const {isGridVisible} = art_
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

  const Frame = (
    <div id={`artFramegrid-${frameId}`}>
      <div
        id={`artFrame-${frameId}`}
        className="pa"
        style={{
          top: `${grid.extendY_}px`,
          left: `${grid.extendX_}px`,
          width: `${viewLayout.width}px`,
          height: `${viewLayout.height}px`,
          background: `${themeConfigs[art_.basic.themeId].background}`,
        }}
      >
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
        {/* <WaterMark
    text={option.basic['watermark.value'].value}
    opacity={option.basic['watermark.opacity'].value}
    rotation={option.basic['watermark.rotation'].value}
    zIndex={0}
  /> */}

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
                type: 'exhibit',
              })
            },
            createBackground: (data) => {
              frame.createBox({
                ...data,
                type: 'material',
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
