import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import Video from './VideoPlayer'

const MVideo = MUIBase.named('MVideo')
  .props({})
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'video'
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
      ;['backgroundColor']?.forEach((name) => {
        style[name] = self.config(name)
      })

      // 默认自适应
      Object.assign(style, {
        width: self.containerWidth,
        height: self.containerHeight,
      })

      // 渲染组件
      self.render(<VideoComponent modal={self} videoUrl={self.config('data')} style={style} />)
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

const VideoComponent = observer(({modal, videoUrl, style}) => {
  let url = videoUrl.flat()[0]
  const [type, setType] = useState('')
  const fontSize = 24

  useEffect(() => {
    if (videoUrl) {
      if (url.indexOf('?') !== -1) {
        [url] = url.split('?')
      }
      if (url.endsWith('mp4')) {
        setType('mp4')
      } else if (url.endsWith('m3u8')) {
        setType('m3u8')
      } else {
        console.log('self', self)
        modal.event.fire('ready', {})
      }
    } else {
      modal.event.fire('ready', {})
    }
  }, [])

  const createRandomId = () => {
    return `${(Math.random() * 10000000).toString(16).substr(0, 4)}-${new Date().getTime()}-${Math.random()
      .toString()
      .substr(2, 5)}`
  }

  try {
    if (type !== '') {
      return (
        <div>
          <div style={{height: modal.containerHeight}}>
            <Video
              srcUrl={url}
              type={type}
              style={style}
              boxId={createRandomId()}
              readyEvent={() => {
                modal.event.fire('ready', {})
              }}
              isInteractive={modal.config('isMarkVisible')}
            />
          </div>
          {/* <div className={c('fbh fbac fbjc wh100p', isInteraction ? null : s.mark)} /> */}
        </div>
      )
    }
    return <div style={{fontSize}}>视频无法查看</div>
  } catch (err) {
    modal.event.fire('ready', {})
    return <div style={{fontSize}}>视频出现错误:{err}</div>
  }
})

export default MVideo
