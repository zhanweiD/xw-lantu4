import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import art from '@models/art/art-preview'
import {useTranslation} from 'react-i18next'
import ArtPreview from '@views/public/art-preview'
import c from 'classnames'
import Modal from '@components/modal'
import s from './publish.module.styl'

const Publish = ({match}) => {
  const {publishId} = match.params
  const [visitAuthorVisible, setVisitAuthorVisible] = useState(true)
  useEffect(() => {
    art.getPublishArt(publishId)
  }, [publishId])
  const {t} = useTranslation()
  if (art.fetchState !== 'success') {
    return (
      <div className={s.publish}>
        {art.fetchState !== 'success' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: "url('/public/is-bg.png')",
            }}
          >
            <div className="fbh fbv fbac pt140">
              <div
                style={{
                  width: '160px',
                  height: '170px',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center ',
                  backgroundImage: "url('/public/waveview-line.svg')",
                }}
                // style={{opacity}}
                // height={size}
                // fill={fill}
              />
              <div className={c(s.logoText, 'ctw36 pt16')}>
                澜 图 可 视 化<span className={s.nullSpan} />
              </div>
              <div className={c(s.logoSubText, 'ctw28 pt8')}>
                好 设 计 即 刻 呈 现<span className={s.nullSpan} />
              </div>
            </div>
          </div>
        )}
        <Modal
          title={t('art.visitAuthor')}
          width={700}
          height={200}
          isVisible={visitAuthorVisible}
          onClose={() => {
            setVisitAuthorVisible(false)
          }}
          buttons={[
            {name: '取消', action: () => setVisitAuthorVisible(false)},
            {name: '确定', action: () => art.getPublishArt(publishId)},
          ]}
        >
          <div className="p28 pt24 pb24 fb1">
            <div className={c(s.talign, 'fbh mt24')}>
              <span>访问密码</span>
              <input
                type="password"
                className={c(s.pwdInput, 'fb1 ml12 mr12 pb4 ')}
                placeholder="请输入密码"
                // value={password}
                onChange={(e) => art.set({preViewPassword: e.target.value})}
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
  return <div className={s.publish}>{art.fetchState === 'success' && <ArtPreview art={art} />}</div>
}

export default observer(Publish)
