import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import config from '@utils/config'
import Geo from '@components/geo-preview'
import w from '@models'
import s from './material.module.styl'

const MaterialTab = ({material}) => {
  const {editor} = w
  const viewRef = useRef(null)
  const {type, materialId, isInit} = material
  useEffect(() => {
    // 初始化可视区域元素尺寸数据，用于Tab内容缩放
    editor.initZoom(viewRef.current)
  }, [])
  useEffect(() => {
    // 将整个art缩放到可视区域之内
    material.initZoom()
  }, [materialId])
  return (
    <div className="wh100p fbh" ref={viewRef}>
      <div className={c('p24 wh100p fbv fbjc fbac')} id={`material-${materialId}`}>
        {isInit &&
          (type === 'image' ? (
            <img className={s.preview} src={`${config.urlPrefix}material/download/${materialId}`} alt="" />
          ) : (
            <Geo className={s.preview} path={`${config.urlPrefix}material/download/${materialId}`} />
          ))}
      </div>
    </div>
  )
}

export default observer(MaterialTab)
