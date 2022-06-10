import React, {useRef, useLayoutEffect} from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import Scroll from '../../components/scroll'
import s from './iframe.module.styl'
import c from 'classnames'

const MyIframe = MUIBase.named('MyIframe')
  .props({
    name: types.optional(types.string, '框架'),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'iframe'
    }

    // 传入数据
    const data = (iframeData) => {
      console.log('iframeData', iframeData)
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {
        isMarkVisible: self.config('isMarkVisible'),
        isCustomSize: self.config('isCustomSize'),
        height: self.config('isCustomSize') ? self.config('height') : self.containerHeight,
        width: self.config('isCustomSize') ? self.config('width') : self.containerWidth,
        scrolling: self.config('scrolling'),
        border: `${self.config('borderWidth')}px solid ${self.config('borderColor')}`,
      }
      console.log('iframe-style', style)

      const RenderCom = ({data, style}) => {
        console.log('iframe-data', data)
        const iframeRef = useRef(null)
        const {
          border,
          isMarkVisible,
          scrolling,
          // isCustomSize,
          width,
          height,
        } = style
        const mainWidth = width
        const mainHidth = height

        useLayoutEffect(() => {
          // iframeRef.current.onload = () => {
          //   self.event.fire('ready', {})
          // }
        }, [])

        if (data && data[0]) {
          return (
            <>
              <div className={c(s.fullScreen, isMarkVisible ? 'fbh fbac fbjc wh100p' : 'fbh fbac fbjc wh100p noevent')}>
                <iframe
                  ref={iframeRef}
                  seamless
                  align="middle"
                  title="sp"
                  scrolling={scrolling ? 'yes' : 'no'}
                  width={mainWidth}
                  height={mainHidth}
                  marginHeight="0"
                  marginWidth="0"
                  style={{border}}
                  src={data[0]}
                />
              </div>
              <div className={c('wh100p pa')} style={{display: isMarkVisible ? 'none' : 'block', top: 0, left: 0}} />
            </>
          )
        }
        return (
          <>
            <div className={c(s.fullScreen, isMarkVisible ? 'fbh fbac fbjc wh100p' : 'fbh fbac fbjc wh100p noevent')}>
              <iframe
                ref={iframeRef}
                seamless
                align="middle"
                title="sp"
                scrolling={scrolling ? 'yes' : 'no'}
                width={mainWidth}
                height={mainHidth}
                marginHeight="0"
                marginWidth="0"
                frameBorder={border}
                src={0}
              />
            </div>
            <div className={c('wh100p pa')} style={{display: isMarkVisible ? 'none' : 'block', top: 0, left: 0}} />
          </>
        )
      }

      // 渲染组件
      self.render(
        <div className="wh100p exhibit" style={{height: style.height, width: style.width}}>
          <Scroll className="h100p">
            <div style={{position: 'relative'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '10px'}}>
                <RenderCom data={self.config('data')} style={style} />
              </div>
            </div>
          </Scroll>
        </div>
      )
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

export default MyIframe
