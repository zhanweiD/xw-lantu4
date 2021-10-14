import React from 'react'
import {observer} from 'mobx-react-lite'
import cloneDeep from 'lodash/cloneDeep'
import c from 'classnames'
import Exhibit from '../exhibit'
import Material from '../material'

const Box = ({box, frame}) => {
  const {layout, materials = []} = box
  const reverseMaterials = cloneDeep(materials)
  reverseMaterials.reverse()
  return (
    <div
      id={`box-${box.boxId}`}
      className={c('pa box')}
      style={{
        top: `${layout.y}px`,
        left: `${layout.x}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      }}
    >
      {reverseMaterials.map((material) => (
        <Material material={material} key={material.id} target={box} frame={frame} />
      ))}
      <Exhibit box={box} frame={frame} />
    </div>
  )
}

export default observer(Box)
