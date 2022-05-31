import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import {NumberField} from '@components/field'
import Button from '@components/button'
import {DropTarget} from '@components/drag-and-drop'
import IconButton from '@components/icon-button'
import ArtThumbnail from '@views/public/art-thumbnail'
import s from './art-init-tab.module.styl'

const ArtInitTab = ({art, id}) => {
  const {t} = useTranslation()
  const {width, height, set, name} = art
  return (
    <>
      <div className={c('fbv fbac fbjc wh100p')}>
        <div className={c('fs24 mb30 pb30')}>新建数据屏</div>
        <DropTarget
          acceptKey="CREATE_ART_DRAG_KEY"
          data={{
            create: (data) => {
              art.set('template', data.art)
              art.set('source', data.source)
            },
          }}
        >
          <div className={c(s.initContent, 'fbv fbjc fbac m30 pr')}>
            {art.template ? (
              <>
                <IconButton icon="close" className={c('pa', s.closeButton)} onClick={art.resetArtCreateType} />
                <ArtThumbnail art={art.template} withoutOptions />
              </>
            ) : (
              <>
                <div className={c(s.textInput, 'mb30')}>
                  <input
                    className={c(s.input)}
                    placeholder="请输入数据屏名称"
                    value={name}
                    onChange={(value) => set('name', value.target.value)}
                  />
                </div>
                <div className={c('fbh fbac fbjc pl30 pr30 mb30')}>
                  <NumberField className={s.input} value={width} onChange={(value) => set('width', value)} />
                  <span className="ml16 mr16 lh28 fb1">×</span>
                  <NumberField className={s.input} value={height} onChange={(value) => set('height', value)} />
                </div>
                <p className="ctw40">可直接从左侧【模板列表】拖拽模板至此处，基于模板创建数据屏</p>
              </>
            )}
          </div>
        </DropTarget>
        <div className="mt30 pt30 fbh fbje">
          <Button
            name={t('cancel')}
            className="mr24"
            width={60}
            circle={16}
            type="cancel"
            onClick={() => art.cancelCreate(id)}
          />
          <Button
            name={t('create')}
            width={60}
            circle={16}
            type="primary"
            onClick={art.template ? art.createByArt : art.createBySize}
          />
        </div>
      </div>
    </>
  )
}
export default observer(ArtInitTab)
