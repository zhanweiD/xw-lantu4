import React, {Children} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import Icon from '../../components/icon'
import s from './picture-group.module.styl'

const thumbnail =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDQxIDQxIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MS41OyI+CiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLC0wLjAwMjg5NDU1LC0wLjAwMjM4ODg0KSI+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtMjk3NC4zNywtMTA4NC40MykiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjk0ODAxMywwLDAsMC45NDgwMTMsMTU0LjY0Myw1OS45MzM3KSI+CiAgICAgICAgICAgICAgICA8cmVjdCB4PSIyOTc0LjYyIiB5PSIxMDgwLjY4IiB3aWR0aD0iNDIuMTk0IiBoZWlnaHQ9IjQyLjE5NCIgc3R5bGU9ImZpbGw6bm9uZTsiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDE5NC44NjgsLTEwLjU3MTUpIj4KICAgICAgICAgICAgICAgIDxnIG9wYWNpdHk9IjAuNjUiPgogICAgICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDIuMTIyMDEsMCwwLDIuMTIyMDEsLTM0MzUuNDMsLTExODUuNTMpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD0iMjkzMS4yNSIgY3k9IjEwNzkuNzUiIHI9IjEuNzUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOndoaXRlO3N0cm9rZS13aWR0aDowLjVweDtzdHJva2UtZGFzaGFycmF5OjAsMC4wMiwwLDA7Ii8+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuODQ0NzYsMCwwLDEuODU2NzYsLTI2MjIuMDUsLTg5OS41ODYpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI5NTAsMTA5MkwyOTI4LjMyLDEwOTJMMjkzMy4yMywxMDg1TDI5MzYuNTUsMTA4OS43M0wyOTQyLjUsMTA4MUwyOTUwLDEwOTJaIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTp3aGl0ZTtzdHJva2Utd2lkdGg6MC41cHg7c3Ryb2tlLWRhc2hhcnJheTowLDAuMDIsMCwwOyIvPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg=='
const MInput = MUIBase.named('MInput')
  .props({
    pictureData: types.array(types.array(types.frozen())),
    currentPage: types.optional(types.number, 1),
    totalPage: types.optional(types.number, 1),
    visiableData: types.frozen(),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'pictureGroup'
    }

    const data = (pictureData) => {
      self.pictureData = pictureData.data
        ?.slice(1)
        ?.map(([left, right, url]) => [left, right, url === '' ? thumbnail : url])
    }

    const setPage = (pageNumber) => {
      if (pageNumber <= self.totalPage && pageNumber >= 1) {
        self.currentPage = pageNumber
        self.event.fire('onChangePage', {data: pageNumber})
        self.draw({redraw: false})
      }
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
      ;[
        'columnNumber',
        'fontSize',
        'gap',
        'leftLabelColor',
        'rightLabelColor',
        'backgroundColor',
        'leftLableFontSize',
        'animationDuration',
        'isMarkVisible',
      ].forEach((name) => {
        style[name] = self.config(name)
      })

      // 默认自适应
      Object.assign(style, {
        width: self.containerWidth,
        height: self.containerHeight,
      })

      // 更新当前数据

      const pictureNumber = style.columnNumber * 3
      self.totalPage = Math.ceil(self.config('data').length / pictureNumber)
      self.visiableData = self
        .config('data')
        .slice((self.currentPage - 1) * pictureNumber, self.currentPage * pictureNumber)

      // 渲染组件
      self.render(
        <PictureGroup
          modal={self}
          visiableData={self.visiableData}
          currentPage={self.currentPage}
          totalPage={self.totalPage}
          style={style}
        />
      )
    }

    return {
      data,
      draw,
      setPage,
      drawFallback,
      afterCreate,
    }
  })

const PictureGroup = observer(({modal, visiableData, style, currentPage, totalPage}) => {
  const {
    columnNumber,
    gap,
    width,
    height,
    fontSize,
    leftLabelColor,
    rightLabelColor,
    backgroundColor,
    leftLableFontSize,
    animationDuration,
    isMarkVisible,
  } = style
  const containerStyle = {
    width,
    height: height - fontSize * 1.5,
    lineHeight: `${fontSize * 1.5}px`,
    alignContent: 'baseline',
    backgroundColor,
  }
  const cardStyle = {
    width: (containerStyle.width - gap * (columnNumber - 1)) / columnNumber,
    height: containerStyle.height / 3,
  }
  const imageStyle = {
    width: cardStyle.width,
    height: cardStyle.height - fontSize * 3,
  }
  const leftLabelStyle = {
    fontSize: leftLableFontSize,
    color: leftLabelColor,
    backgroundColor,
    whiteSpace: 'nowrap',
  }
  const rightLabelStyle = {
    fontSize,
    color: rightLabelColor,
  }
  const iconStyle = {
    width: fontSize * 2,
    height: fontSize * 1.5,
    backgroundColor: 'white',
    borderRadius: '5px',
  }

  return (
    <div className="fbh fbv fbjsb">
      <div className="fbh fbw" style={containerStyle}>
        {visiableData.map(([leftLabel, rightLabel, pictureUrl], i) =>
          Children.toArray(
            <div
              style={{...cardStyle, marginRight: i % columnNumber !== columnNumber - 1 ? gap : 0}}
              className="fbh fbv"
            >
              <img style={imageStyle} src={pictureUrl} alt="" />
              <div className="fbh fbjsb">
                <div style={leftLabelStyle}>{leftLabel}</div>
                <div style={rightLabelStyle} className={isMarkVisible && s.box}>
                  <p className={s.animate} style={{animationDuration: isMarkVisible && `${animationDuration}s`}}>
                    {rightLabel}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <div className="fbh fbjc fbac" style={leftLabelStyle}>
        <div style={iconStyle} className="hand fbh fbjc fbac" onClick={() => modal.setPage(currentPage - 1)}>
          <Icon fill="gray" name="arrow-left" />
        </div>
        <div>&nbsp;&nbsp;{currentPage}&nbsp;</div>
        <div>&nbsp;/&nbsp;</div>
        <div>&nbsp;{totalPage}&nbsp;&nbsp;</div>
        <div style={iconStyle} className="hand fbh fbjc fbac" onClick={() => modal.setPage(currentPage + 1)}>
          <Icon fill="gray" name="arrow-right" />
        </div>
      </div>
    </div>
  )
})

export default MInput
