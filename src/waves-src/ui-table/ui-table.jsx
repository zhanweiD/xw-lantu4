import React, {Children} from 'react'
import {observer} from 'mobx-react-lite'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import {ScrollAnimation} from '../base/animation'
import s from './ui-table.module.styl'

const MTable = MUIBase.named('MTable')
  .props({
    title: types.optional(types.string, ''),
    labels: types.array(types.frozen()),
    values: types.array(types.frozen()),
    assignedWidths: types.frozen(),
    adaptTableBodyWidth: types.frozen(),
    adaptTableCellHeight: types.frozen(),
    bodyID: types.frozen(),
    receiveEnableLoopAnimation: types.frozen(),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiTable'
    }

    // 数据传入
    const data = (tableData) => {
      self.title = tableData.titleText || self.config('titleText')
      self.labels = tableData.data.label
      self.values = tableData.data.value
      self.receiveEnableLoopAnimation = tableData.enableLoopAnimation
      // 部分样式
      const [
        adapterContainer,
        columnSpacing,
        lineSpacing,
        titleSize,
        titleLowerSpacing,
        cellWidth,
        cellHeight,
        headVisible,
        headFontSize,
        cellFontSize,
        isAutoWidth,
        rowNumber,
      ] = [
        'adapterContainer',
        'columnSpacing',
        'lineSpacing',
        'titleSize',
        'titleLowerSpacing',
        'cellWidth',
        'cellHeight',
        'headVisible',
        'headFontSize',
        'cellFontSize',
        'isAutoWidth',
        'rowNumber',
      ].map((name) => self.config(name))
      // 每一列最大的文字宽度
      const maxWidths = {}
      self.labels.forEach(({id, name}) => {
        const texts = [name].concat(self.values.map((item) => item[id]))
        const textWidths = texts.map((text, index) => {
          return self.util.getTextWidth(text, index === 0 && headVisible ? headFontSize : cellFontSize)
        })
        maxWidths[id] = Math.max(...textWidths)
      })
      // 按比例分配的宽度
      const assignedWidths = {}
      const totalTextWidth = Object.values(maxWidths)?.reduce((previous, current) => previous + current)
      const availableWidth = adapterContainer
        ? self.containerWidth - columnSpacing * (self.labels.length - 1)
        : isAutoWidth
        ? totalTextWidth * 1.5
        : cellWidth * self.labels.length
      Object.keys(maxWidths).forEach((id) => {
        assignedWidths[id] = isAutoWidth
          ? maxWidths[id] + (availableWidth - totalTextWidth) / self.labels.length
          : availableWidth / self.labels.length
      })
      self.assignedWidths = assignedWidths
      // 行单元格的宽度总和以及行单元格的高度
      if (adapterContainer) {
        const totalHeightWithoutTitle = self.containerHeight - (titleSize + titleLowerSpacing || 0)
        const rows = Math.min(rowNumber, self.values.length) + (headVisible ? 1 : 0)
        self.adaptTableBodyWidth = self.containerWidth
        self.adaptTableCellHeight = (totalHeightWithoutTitle - lineSpacing * rows) / rows
      } else {
        const totalCellWidth = Object.values(assignedWidths)?.reduce((previous, current) => previous + current)
        self.adaptTableBodyWidth = totalCellWidth + columnSpacing * (self.labels.length - 1)
        self.adaptTableCellHeight = cellHeight
      }
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.title = ''
      self.labels = [
        {id: 'column1', name: ''},
        {id: 'column2', name: ''},
      ]
      self.values = new Array(4).fill({})
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {
        titleVisible: self.config('titleVisible'),
        titleSize: self.config('titleSize'),
        titleColor: self.config('titleColor'),
        titleBackground: self.config('titleBackground'),
        titlePosition: self.config('titlePosition'),
        titleLowerSpacing: self.config('titleLowerSpacing'),
        headVisible: self.config('headVisible'),
        headFontSize: self.config('headFontSize'),
        headFontColor: self.config('headFontColor'),
        headBackground: self.config('headBackground'),
        headPosition: self.config('headPosition'),
        cellWidth: self.config('cellWidth'),
        cellFontSize: self.config('cellFontSize'),
        cellFontColor: self.config('cellFontColor'),
        cellBackground: self.config('cellBackground'),
        cellPosition: self.config('cellPosition'),
        lineSpacing: self.config('lineSpacing'),
        columnSpacing: self.config('columnSpacing'),
        valueBarBackground: self.config('valueBarBackground'),
        adapterContainer: self.config('adapterContainer'),
        isAutoWidth: self.config('isAutoWidth'),
      }

      // 渲染组件
      self.bodyID = `ui-table-${self.util.createUuid()}`
      self
        .render(
          <Table
            modal={self}
            style={style}
            title={self.title}
            labels={self.labels}
            values={self.values}
            bodyID={self.bodyID}
          />,
          style.adapterContainer && {overflow: 'hidden'}
        )
        .then(() => {
          // 轮播动画
          if (self.receiveEnableLoopAnimation) {
            const enableLoopAnimation = self.receiveEnableLoopAnimation
            const loopAnimationDuration = self.config('loopAnimationDuration')
            const loopAnimationDelay = self.config('loopAnimationDelay')
            enableLoopAnimation &&
              new ScrollAnimation(
                {
                  targets: `#${self.bodyID} .${s.row}`,
                  delay: loopAnimationDelay,
                  duration: loopAnimationDuration,
                  offsetY: self.adaptTableCellHeight + style.lineSpacing,
                  clone: (node) => {
                    // 想要滚动轮播动画最后“一行”连续，需要组件传入自定义追加元素的函数
                    const newNode = node.cloneNode(true)
                    node.parentNode.append(newNode)
                    return newNode
                  },
                },
                self
              ).play()
          }
        })
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

const Table = observer(({modal, style, title, labels, values, bodyID}) => {
  const judgePosition = (position) => {
    if (position === 'left') return 'flex-start'
    if (position === 'center') return 'center'
    if (position === 'right') return 'flex-end'
    return ''
  }
  // 根据自适应与否选取单元格宽度
  const getCellWidth = (id) => modal.assignedWidths[id]
  const titleStyle = {
    width: modal.adaptTableBodyWidth,
    height: style.titleSize,
    fontSize: style.titleSize,
    color: style.titleColor,
    marginBottom: style.titleLowerSpacing,
    display: style.titleVisible ? 'flex' : 'none',
    justifyContent: judgePosition(style.titlePosition),
    backgroundColor: style.titleBackground,
  }
  const cellStyle = {
    height: modal.adaptTableCellHeight,
    marginRight: style.columnSpacing,
    marginBottom: style.lineSpacing,
    fontSize: style.cellFontSize,
    color: style.cellFontColor,
    backgroundColor: style.cellBackground,
  }
  const headStyle = {
    ...cellStyle,
    fontSize: style.headFontSize,
    color: style.headFontColor,
    backgroundColor: style.headBackground,
    justifyContent: judgePosition(style.headPosition),
  }
  const bodyStyle = {
    maxHeight: (cellStyle.height + style.lineSpacing) * values.length,
    overflow: 'hidden',
  }
  const textStyle = {
    justifyContent: judgePosition(style.cellPosition),
  }

  return (
    <div className={s.container}>
      <div style={titleStyle} className={s.title}>
        {title}
      </div>
      <div className={s.table}>
        {/* 表头 */}
        {style.headVisible && (
          <div className={s.row}>
            {labels.map(({id, name}) =>
              Children.toArray(
                <div style={{...headStyle, width: getCellWidth(id)}} className={s.text}>
                  {name}
                </div>
              )
            )}
          </div>
        )}
        {/* 表格主体部分 */}
        <div style={bodyStyle} id={bodyID}>
          {values.map((item) =>
            Children.toArray(
              <div className={s.row}>
                {labels.map(({id, domain}) =>
                  Children.toArray(
                    <div className={s.cell} style={{...cellStyle, width: getCellWidth(id)}}>
                      {/* 当列为数字时，显示数值大小的 bar */}
                      <div
                        className={s.bar}
                        style={
                          domain && typeof item[id] === 'number'
                            ? {
                                height: style.cellHeight,
                                width: getCellWidth(id) * ((item[id] - domain[0]) / (domain[1] - domain[0])),
                                maxWidth: getCellWidth(id),
                                background: style.valueBarBackground,
                              }
                            : null
                        }
                      />
                      <div className={s.text} style={textStyle}>
                        {item[id]}
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
})

export default MTable
