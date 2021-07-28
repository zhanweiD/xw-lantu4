/**
 * @author 南风
 * @description DataTab
 */
import React from "react"
import {observer} from "mobx-react-lite"
import ExcelData from "./data-excel"
import ApiData from "./data-api"
import JsonData from "./data-json"
import Database from "./data-database"

// 这里暂时包了一层tab壳子，预备作为扩展使用，且符合editor->tab->data
const DataTab = ({data}) => {
  return (
    <>
      {data.dataType === "excel" && <ExcelData data={data} />}
      {data.dataType === "json" && <JsonData data={data} />}
      {data.dataType === "database" && <Database data={data} />}
      {data.dataType === "api" && <ApiData data={data} />}
    </>
  )
}

export default observer(DataTab)
