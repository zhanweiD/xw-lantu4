import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Scroll from "@components/scroll"
import Icon from "@components/icon"
import s from "./table-list.module.styl"

// TODO ICON 不应该在这里规定,应该由上层决定。
const icons = {
  string: "value-type-string",
  date: "value-type-date",
  number: "value-type-number",
  boolean: "value-type-boolean"
}

const TableList = ({
  data,
  columns,
  rowLimit,
  onExtraClick = () => {},
  onClick = () => {},
  isShowExtraColumns
}) => {
  return (
    <Scroll className={c(s.tableList)}>
      <table>
        <thead>
          <tr>
            {columns.map((col) =>
              Children.toArray(
                <th>
                  <div>
                    <div
                      className={c("fbh fbac hand", s.tableHead)}
                      onClick={(e) => onClick(col, e)}
                    >
                      <Icon name={icons[col.type]} size={10} fill="#5383E4" />
                      <span className={s.thBox}>{col.name}</span>
                    </div>
                    <div
                      className={c("fbh fbac oh", s.extra)}
                      style={{height: isShowExtraColumns ? 32 : 0}}
                    >
                      <input
                        className="w100p"
                        type="text"
                        value={col.alias}
                        onChange={(e) => {
                          onExtraClick(col, e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data
            .slice(0, rowLimit)
            .map((item, index) =>
              Children.toArray(
                <tr
                  className={c(index % 2 === 0 ? "cfw" : s.tableListTrColorTwo)}
                >
                  {columns.map((col) =>
                    Children.toArray(
                      <td title={item[col.name]}>{item[col.name]}</td>
                    )
                  )}
                </tr>
              )
            )}
        </tbody>
      </table>
    </Scroll>
  )
}

export default observer(TableList)
