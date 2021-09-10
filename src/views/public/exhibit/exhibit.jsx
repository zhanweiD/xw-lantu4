import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {draw} from '@exhibit-collection'

const Exhibit = ({box, frame}) => {
  const el = useRef(null)
  const {exhibit, layout} = box
  const {height, width} = layout
  const {id} = exhibit
  useEffect(() => {
    if (exhibit) {
      draw({
        exhibit,
        container: el.current,
        height,
        width,
        frame,
      })
    }
  }, [id])

  return (
    <div className="wh100p pr">
      <div ref={el} className="wh100p exhibit" />
    </div>
  )
}

export default observer(Exhibit)
