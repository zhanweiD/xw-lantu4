import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import w from '@models'
import {ArtFrame, ArtFrameName} from './art-frame'
import SelectRange from './art-select-range'

const ArtViewport = ({art}) => {
  const {editor} = w
  const {artId, viewport} = art
  const {totalWidth, totalHeight, frames, isInit, selectRange, scaler, baseOffsetX, baseOffsetY, getMenuList} = viewport
  const viewRef = useRef(null)
  useEffect(() => {
    // 初始化可视区域元素尺寸数据，用于Tab内容缩放
    editor.initZoom(viewRef.current)
  }, [])
  useEffect(() => {
    // 将整个art缩放到可视区域之内
    viewport.initZoom()
  }, [artId])
  return (
    <div className={c('fb1 oh pr p24 fbh')}>
      <div
        className={c('fb1 pr artViewport', {
          cursorCross: art.activeTool === 'createFrame',
        })}
        ref={viewRef}
        onMouseDown={(e) => {
          viewport.onMouseDown(e)
        }}
        onKeyDown={(e) => {
          viewport.onBoxKeyDown(e)
        }}
      >
        <div
          id={`art-viewport-${artId}`}
          className="pa noChartEvent"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
          }}
        >
          {isInit && frames.map((frame) => <ArtFrame art={art} key={frame.frameId} frame={frame} />)}
        </div>
        {selectRange && (
          <SelectRange
            baseOffsetX={baseOffsetX}
            baseOffsetY={baseOffsetY}
            scaler={scaler}
            range={selectRange}
            getMenuList={getMenuList}
          />
        )}
        {isInit &&
          frames.map((frame) => (
            <ArtFrameName
              frame={frame}
              key={frame.frameId}
              isSelected={
                viewport.selectRange &&
                viewport.selectRange.target === 'frame' &&
                viewport.selectRange.range[0].frameId === frame.frameId
              }
              onMouseDown={(e) => {
                viewport.toggleSelectRange({
                  target: 'frame',
                  selectRange: [
                    {
                      frameId: frame.frameId,
                    },
                  ],
                })
                viewport.selectRange.onMove(e)
              }}
            />
          ))}
      </div>
    </div>
  )
}
export default observer(ArtViewport)
