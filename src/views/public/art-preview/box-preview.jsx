import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import c from 'classnames'
import Exhibit from '../exhibit'
import Material from '../material'

const Box = ({box, frame}) => {
  const {layout, materials = [], padding, backgroundImage_, backgroundColor_} = box
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  const style = {
    top: `${layout.y}px`,
    left: `${layout.x}px`,
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
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
    <div id={`box-${box.boxId}`} className={c('pa box')} style={style}>
      {reverseMaterials.map((material) => (
        <Material material={material} key={material.id} target={box} frame={frame} />
      ))}
      <Exhibit box={box} frame={frame} />
    </div>
  )
}

export default observer(Box)
