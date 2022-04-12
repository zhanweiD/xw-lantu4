import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import c from 'classnames'
import Exhibit from '../exhibit'
import Material from '../material'

const Box = ({box, frame}) => {
  const {layout, materials = [], padding, backgroundImage_, backgroundColor_, visibility} = box

  const {areaOffset = [0, 0, 0, 0]} = padding.options.updatedOptions || {}
  const [top, right, bottom, left] = areaOffset
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    top: `${layout.y}px`,
    left: `${layout.x}px`,
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    padding: `${top}px ${right}px ${bottom}px ${left}px`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    visibility,
  }
  if (backgroundImage_) {
    style.backgroundImage = `linear-gradient(${backgroundImage_})`
  }
  if (backgroundColor_) {
    style.backgroundColor = backgroundColor_
  }

  return (
    <div id={`box-${box.boxId}`} className={c('pa box')} style={style}>
      {reverseMaterials.map((material) => (
        <Material material={material} key={material.id} target={box} frame={frame} />
      ))}
      <Exhibit box={box} frame={frame} />
    </div>
  )
}

export default observer(Box)
