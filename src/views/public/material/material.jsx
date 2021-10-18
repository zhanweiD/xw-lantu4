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

  return <div ref={el} className="material wh100p pa" style={{top: 0, left: 0}} />
}

export default observer(Material)
