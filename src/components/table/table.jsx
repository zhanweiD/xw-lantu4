import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
// import DropMenu from '@components/drop-menu'
import s from "./table.module.styl"
// import Icon from '../icon'
import Loading from "../loading"

/**
 * 纯粹是一份代码不想写两遍，提出来的，列包裹容器
 * @param {*} param0
 */
const ColWrap = ({column, children}) => (
  <div
    className={c("fbv")}
    style={{
      ...(() => {
        if (column.width) {
          return {
            width: column.width
          }
        }
        return {
          flex: 1
        }
      })()
    }}
  >
    {children}
  </div>
)

/**
 * @param {dataSource} 列表数据
 * @param {columns} 列配置 参考 antd，实现了 title key render width
 * @param {placeholder} 无数据的提示文案
 * @param {rowHeight} 列高度
 * @param {maxRows} 最多展示几列，超出滚动
 */
const Table = ({
  dataSource = [],
  columns,
  rowHeight = 40,
  maxRows = 999,
  className,
  headClassName,
  rowClassName,
  loadingState,
  onDoubleClick = () => {},
  onContextMenu = () => {}
}) => {
  // 原数据
  return (
    <div>
      {/* 表头 */}
      <div className={c("fbh", s.tabHead, className)}>
        {columns.map((column, colIndex) => {
          const firstRow = colIndex === 0
          const lastRow = colIndex === columns.length - 1
          return Children.toArray(
            <ColWrap column={column}>
              <div
                className={c(
                  "cfb30 pt12 pb12",
                  firstRow && "pl30",
                  lastRow && "pr30",
                  !column.title && "h100p",
                  headClassName
                )}
              >
                {column.title}
              </div>
            </ColWrap>
          )
        })}
      </div>
      <Loading data={loadingState}>
        <div
          className={c("fbh", s.row)}
          style={{maxHeight: `${rowHeight * maxRows}px`}}
        >
          {columns.map((column, colIndex) => {
            const firstRow = colIndex === 0
            const lastRow = colIndex === columns.length - 1
            return Children.toArray(
              <ColWrap column={column}>
                {dataSource.map((data, rowIndex) =>
                  Children.toArray(
                    <div
                      className={c(
                        "fbv fbjc",
                        firstRow && "pl30",
                        lastRow && "pr30",
                        rowIndex % 2 === 0 ? s.bg29 : s.bg2e,
                        rowClassName
                      )}
                      style={{
                        minHeight: `${rowHeight}px`
                      }}
                      onDoubleClick={(e) => {
                        onDoubleClick({e, data, rowIndex})
                      }}
                      onContextMenu={(e) => {
                        onContextMenu({e, data, rowIndex})
                      }}
                    >
                      {column.render
                        ? column.render(data[column.key], data, rowIndex)
                        : data[column.key]}
                    </div>
                  )
                )}
              </ColWrap>
            )
          })}
        </div>
      </Loading>
    </div>
  )
}

export default observer(Table)
