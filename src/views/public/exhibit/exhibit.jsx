import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {draw} from '@exhibit-collection'

const Exhibit = ({box, frame}) => {
  const el = useRef(null)
  // 这里不能直接exhibit = {}
  const {exhibit, layout, padding} = box
  const {areaOffset} = padding.getData()
  const [top, right, bottom, left] = areaOffset
  const {height, width} = layout
  const {id} = exhibit || {}
  useEffect(() => {
    if (exhibit) {
      draw({
        exhibit,
        container: el.current,
        height: height - top - bottom,
        width: width - left - right,
        frame,
      })
    }
  }, [id])

  return (
    <div className="pa wh100p">
      <div ref={el} className="exhibit" />
    </div>
  )
}

export default observer(Exhibit)
