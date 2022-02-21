import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import art from '@models/art/art-preview'
import ArtPreview from '@views/public/art-preview'
import s from './publish.module.styl'

const Publish = ({match}) => {
  const {publishId} = match.params
  useEffect(() => {
    art.getPublishArt(publishId)
  }, [publishId])
  if (art.fetchState === 'success') {
    return (
      <div className={s.publish}>
        {art.fetchState === 'success' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: "url('/public/is-bg.png')",
            }}
          >
            <div className="fbh fbjc pt140">
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
            </div>

            <div>1</div>
          </div>
        )}
      </div>
    )
  }
  return <div className={s.publish}>{art.fetchState === 'success' && <ArtPreview art={art} />}</div>
}

export default observer(Publish)
