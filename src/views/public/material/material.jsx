import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {draw} from '@exhibit-collection'

const Material = ({material, target, frame}) => {
  const el = useRef(null)
  const {layout} = target
  const {height, width} = layout
  const {id} = material || {}
  useEffect(() => {
    if (material) {
      draw({
        material,
        container: el.current,
        height,
        width,
        frame,
      })
    }
  }, [id])

  return (
    <div className="wh100p pa" style={{top: 0}}>
      <div ref={el} className="wh100p material" />
    </div>
  )
}

export default observer(Material)
