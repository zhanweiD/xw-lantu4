import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import c from 'classnames'
import {DropTarget} from '@components/drag-and-drop'
import Exhibit from '@views/public/exhibit'
import Material from '@views/public/material'
import s from './box.module.styl'

const Box = ({box}) => {
  const {layout, isSelected, art_, viewport_, frame_, backgroundImage_, backgroundColor_, materials = [], padding} = box

  const {areaOffset = [0, 0, 0, 0]} = padding.options.updatedOptions || {}
  const [top, right, bottom, left] = areaOffset
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const {isBoxBackgroundVisible} = art_

  const style = {
    top: `${layout.y}px`,
    left: `${layout.x}px`,
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    padding: `${top}px ${right}px ${bottom}px ${left}px`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  }
  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  return (
    <DropTarget
      className={c('pa box')}
      style={{
        top: `${layout.y}px`,
        left: `${layout.x}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      }}
      acceptKey="UPDATE_BACKGROUND_DRAGE_KEY"
      data={{
        addBackground: (data) => {
          box.addBackground(data)
        },
      }}
    >
      <div
        id={`box-${box.boxId}`}
        className={c({
          [s.boxBackgroundColor]: isBoxBackgroundVisible,
          [s.outline]: isSelected,
        })}
        style={style}
        onMouseDown={(e) => {
          e.stopPropagation()
          viewport_.toggleSelectRange({
            target: 'box',
            selectRange: [
              {
                frameId: frame_.frameId,
                boxIds: [box.boxId],
              },
            ],
          })
        }}
      >
        {reverseMaterials.map((material) => (
          <Material material={material} key={material.id} target={box} frame={frame_} />
        ))}
        <Exhibit box={box} frame={frame_} />
      </div>
    </DropTarget>
  )
}

export default observer(Box)
