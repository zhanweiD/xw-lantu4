import React, {Children} from 'react'
import {observer} from 'mobx-react-lite'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import {ScrollAnimation} from '../base/animation'
import s from './ui-table.module.styl'
import Scroll from '../../components/scroll'

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
        columnSpacing,
        lineSpacing,
        titleFontSize,
        titleLowerSpacing,
        headVisible,
        headFontSize,
        cellFontSize,
        isAutoWidth,
        rowNumber,
      ] = [
        'columnSpacing',
        'lineSpacing',
        'titleFontSize',
        'titleLowerSpacing',
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
      const totalTextWidth =
        Object.keys(maxWidths).length !== 0 &&
        Object.values(maxWidths)?.reduce((previous, current) => previous + current)
      const availableWidth = self.containerWidth - columnSpacing * (self.labels.length - 1)

      Object.keys(maxWidths).forEach((id) => {
        assignedWidths[id] = isAutoWidth
          ? maxWidths[id] + (availableWidth - totalTextWidth) / self.labels.length
          : availableWidth / self.labels.length
      })
      self.assignedWidths = assignedWidths
      // 行单元格的宽度总和以及行单元格的高度
      const totalHeightWithoutTitle = self.containerHeight - (titleFontSize + titleLowerSpacing || 0)
      const rows = Math.min(rowNumber, self.values.length) + (headVisible ? 1 : 0)
      self.adaptTableBodyWidth = self.containerWidth
      self.adaptTableCellHeight = (totalHeightWithoutTitle - lineSpacing * rows) / rows
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
        backgroundColor: self.config('backgroundColor'),
        titleVisible: self.config('titleVisible'),
        titleFontSize: self.config('titleFontSize'),
        titleColor: self.config('titleColor'),
        titleBackground: self.config('titleBackground'),
        titlePosition: self.config('titlePosition'),
        titleLowerSpacing: self.config('titleLowerSpacing'),
        headVisible: self.config('headVisible'),
        headFontSize: self.config('headFontSize'),
        headFontWeight: self.config('headFontWeight'),
        headFontColor: self.config('headFontColor'),
        headBackground: self.config('headBackground'),
        headPosition: self.config('headPosition'),
        // cellWidth: self.config('cellWidth'),
        cellFontSize: self.config('cellFontSize'),
        cellFontColor: self.config('cellFontColor'),
        cellBackground: self.config('cellBackground'),
        cellPosition: self.config('cellPosition'),
        lineSpacing: self.config('lineSpacing'),
        columnSpacing: self.config('columnSpacing'),
        valueBarBackground: self.config('valueBarBackground'),
        isAutoWidth: self.config('isAutoWidth'),
        unitVisible: self.config('unitVisible'),
        unitFontSize: self.config('unitFontSize'),
        unitFontColor: self.config('unitFontColor'),
        unitLowerSpacing: self.config('unitLowerSpacing'),
        unitText: self.config('unitText'),
        signVisible: self.config('signVisible'),
        signWidth: self.config('signWidth'),
        signFontColor: self.config('signFontColor'),
        rectVisible: self.config('rectVisible'),
        rectFontColor: self.config('rectFontColor'),
        rectWidth: self.config('rectWidth'),
        rectHeight: self.config('rectHeight'),
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
          {overflow: 'hidden'}
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

  const createMarkup = (context) => {
    return {__html: context}
  }

  const titleStyle = {
    width: modal.adaptTableBodyWidth,
    height: style.titleFontSize,
    fontSize: style.titleFontSize,
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
    justifyContent: style.cellPosition,
  }

  const unitStyle = {
    display: style.unitVisible ? 'inline-block' : 'none',
    fontSize: style.unitFontSize,
    color: style.unitFontColor,
    marginBottom: style.unitLowerSpacing,
  }

  const signStyle = {
    ...cellStyle,
    display: style.signVisible ? 'inline-block' : 'none',
    width: style.signWidth,
    backgroundColor: style.signFontColor,
  }

  const rectStyle = {
    display: style.rectVisible ? 'inline-block' : 'none',
    height: style.rectHeight,
    backgroundColor: style.rectFontColor,
  }

  const headStyle = {
    ...cellStyle,
    fontSize: style.headFontSize,
    color: style.headFontColor,
    backgroundColor: style.headBackground,
    justifyContent: judgePosition(style.headPosition),
    fontWeight: style.headFontWeight,
  }
  const bodyStyle = {
    maxHeight: (cellStyle.height + style.lineSpacing) * values.length,
    overflow: 'hidden',
  }

  const containerDivStyle = {
    backgroundColor: style.backgroundColor,
  }

  return (
    <div className={s.container} style={containerDivStyle}>
      <div style={titleStyle} className={s.title}>
        {title}
      </div>
      <div className={s.table}>
        {/* 单位 */}
        <div style={unitStyle}>{style.unitText}</div>

        {/* 表头 */}
        {style.headVisible && (
          <div className={s.row} style={{marginLeft: style.signVisible && style.signWidth + 4}}>
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
                <div style={signStyle}></div>
                {labels.map(({id}) =>
                  Children.toArray(
                    <div className={s.cell} style={{...cellStyle, width: getCellWidth(id)}}>
                      <div className={s.text}>
                        {(typeof item[id] === 'string' && item[id]?.length < 30 && item[id]) ||
                          (typeof item[id] === 'number' && item[id])}
                      </div>
                      {/* 当列为数字时，显示数值大小的 bar */}
                      {typeof item[id] === 'number' && (
                        <div style={{...rectStyle, width: item[id] ? item[id] / 50 : style.rectWidth}} />
                      )}
                      {/* 富文本展示 */}
                      {typeof item[id] === 'string' && item[id]?.length > 30 && (
                        <Scroll className="h100p">
                          <div dangerouslySetInnerHTML={createMarkup(item[id])} />
                        </Scroll>
                      )}
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
