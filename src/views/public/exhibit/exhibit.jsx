import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {draw} from '@exhibit-collection'

const Exhibit = ({box, frame}) => {
  const el = useRef(null)
  // 这里不能直接exhibit = {}
  const {exhibit, layout, padding} = box
  const {height, width} = layout
  const {id} = exhibit || {}
  useEffect(() => {
    if (exhibit) {
      draw({
        exhibit,
        container: el.current,
        height: height - padding[0] - padding[2],
        width: width - padding[1] - padding[3],
        frame,
      })
    }
  }, [id])

  return (
    <div className="pa">
      <div ref={el} className="exhibit" />
    </div>
  )
}

export default observer(Exhibit)
