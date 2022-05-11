import React from 'react'
import {observer} from 'mobx-react-lite'
import ExcelData from './data-excel'
import ApiData from './data-api'
import JsonData from './data-json'
import Database from './data-database'
import Loading from '@components/loading'

// 这里暂时包了一层tab壳子，预备作为扩展使用，且符合editor->tab->data
const DataTab = ({data}) => {
  const {state_ = 'loading'} = data
  return (
    <Loading data={state_}>
      {data.dataType === 'excel' && <ExcelData data={data} />}
      {data.dataType === 'json' && <JsonData data={data} />}
      {data.dataType === 'sql' && <Database data={data} />}
      {data.dataType === 'api' && <ApiData data={data} />}
    </Loading>
  )
}

export default observer(DataTab)
