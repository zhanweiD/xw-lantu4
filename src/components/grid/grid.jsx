import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./grid.module.styl"

const Item = observer(({children}) => (
  <div
    className={c(
      {"fb1 fbh fbac fbjc pr": true, hand: !!children},
      s.item,
      children && s.itemHover
    )}
  >
    {children}
  </div>
))

const Row = ({children}) => <div className={c("fbh", s.row)}>{children}</div>

const Grid = ({column = 4, children}) => {
  const rows = []
  const rowNumber = Math.ceil(children.length / column)

  // 在children中的索引位置
  let childIndex = 0
  for (let i = 0; i < rowNumber; i++) {
    const row = []
    for (let y = 0; y < column; y++) {
      row.push(children[childIndex] ? children[childIndex] : <Item />)
      childIndex++
    }
    rows.push(<Row>{Children.toArray(row)}</Row>)
  }

  return Children.toArray(rows)
}

Grid.Item = Item

export default observer(Grid)
