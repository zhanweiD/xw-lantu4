import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {DropTarget} from '@components/drag-and-drop'
import config from '@utils/config'
import Exhibit from '@views/public/exhibit'
import s from './box.module.styl'

const Box = ({box}) => {
  const {layout, isSelected, art_, viewport_, frame_, background, exhibit} = box
  const {isBoxBackgroundVisible} = art_

  const image = `${config.urlPrefix}material/download/${background?.path}`

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
          box.updateBackground(data)
        },
        create: (data) => {
          box.updateExhibit(data)
        },
      }}
    >
      <div
        id={`box-${box.boxId}`}
        style={{
          top: `${layout.y}px`,
          left: `${layout.x}px`,
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          backgroundImage: `url("${image}")`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
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
        这里就是我们需要的组件啊！
        <Exhibit box={box} frame={frame_} />
      </div>
    </DropTarget>
  )
}

export default observer(Box)
