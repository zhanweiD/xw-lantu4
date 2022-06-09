import React from 'react'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import Video from './VideoPlayer'
import c from 'classnames'
import s from './video.module.styl'
import Scroll from '../../components/scroll'

const MVideoMulti = MUIBase.named('MVideoMulti')
  .props({})
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'videoMulti'
    }
    const data = (data) => {
      console.log('接收data', data)
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw = false}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {}
      ;['']?.forEach((name) => {
        style[name] = self.config(name)
      })

      // 默认自适应
      Object.assign(style, {
        width: self.containerWidth,
        height: self.containerHeight,
      })
      const arr1 = self.config('data')
      let type = ''
      const arrTemp = []
      if (arr1 && arr1.length > 0) {
        arr1.map((v) => {
          if (v[0].indexOf('?') !== -1) {
            [v[0]] = v[0].split('?')
          }
          if (v[0].endsWith('mp4')) {
            type = 'mp4'
          } else if (v[0].endsWith('m3u8')) {
            type = 'm3u8'
          } else {
            console.log('self', self)
            self.event.fire('ready', {})
          }
          return arrTemp.push({
            type,
            url: v[0],
          })
        })
      } else {
        self.event.fire('ready', {})
      }

      // 渲染组件
      self.render(<VideoComponent modal={self} videoUrl={arrTemp} />)
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

const VideoComponent = observer(({modal, videoUrl}) => {
  const fontSize = 24
  const createRandomId = () => {
    return `${(Math.random() * 10000000).toString(16).substr(0, 4)}-${new Date().getTime()}-${Math.random()
      .toString()
      .substr(2, 5)}`
  }

  try {
    return (
      <Scroll className="h100p">
        <div style={{position: 'relative'}}>
          <div className={s.videoDiv}>
            {videoUrl.map((v, i) => (
              <div key={i} style={{height: modal.containerHeight}}>
                <Video
                  srcUrl={v.url}
                  type={v.type}
                  boxId={createRandomId()}
                  readyEvent={() => {
                    modal.event.fire('ready', {})
                  }}
                />
                {/* <div style={{height: '20px'}}></div> */}
              </div>
            ))}
          </div>
          <div className={c('fbh fbac fbjc wh100p')} />
        </div>
      </Scroll>
    )
  } catch (err) {
    modal.event.fire('ready', {})
    return <div style={{fontSize}}>视频出现错误:{err}</div>
  }
})

export default MVideoMulti
