import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {DropTarget} from '@components/drag-and-drop'

import Exhibit from '@views/public/exhibit'
import s from './box.module.styl'

const Box = ({box}) => {
  const {layout, isSelected, art_, viewport_, frame_, exhibit, backgroundImage_, backgroundColor_} = box
  const {isBoxBackgroundVisible} = art_

  const style = {
    top: `${layout.y}px`,
    left: `${layout.x}px`,
    width: `${layout.width}px`,
    height: `${layout.height}px`,
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
      className={c('pa box', {
        [s.boxBackgroundColor]: isBoxBackgroundVisible,
        [s.outline]: isSelected,
      })}
      style={{
        top: `${layout.y}px`,
        left: `${layout.x}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      }}
      acceptKey={
        exhibit ? ['UPDATE_BOX_BACKGROUND_DRAGE_KEY'] : ['CREATE_EXHIBIT_DRAG_KEY', 'UPDATE_BOX_BACKGROUND_DRAGE_KEY']
      }
      data={{
        createBackground: (data) => {
          box.updateMaterialId(data)
        },
        create: (data) => {
          box.updateExhibit(data)
        },
      }}
    >
      <div
        id={`box-${box.boxId}`}
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
        <Exhibit box={box} frame={frame_} />
      </div>
    </DropTarget>
  )
}

export default observer(Box)
