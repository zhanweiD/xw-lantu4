import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {draw} from '@exhibit-collection'

const Material = ({material, box, frame}) => {
  const el = useRef(null)
  const {layout} = box
  const {height, width} = layout
  const {id} = material || {}
  useEffect(() => {
    console.log('sss')
    console.log(material)
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
    <div className="wh100p pr">
      <div ref={el} className="wh100p material" />
    </div>
  )
}

export default observer(Material)
