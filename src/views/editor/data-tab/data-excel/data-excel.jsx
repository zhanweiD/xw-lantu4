import React from 'react'
import {observer} from 'mobx-react-lite'
import TableList from '@components/table-list'
import w from '@models'
import UploadExcel from './upload-excel'

const ExcelData = ({data}) => {
  const {excel} = data
  const limit = data.excel.options.limit.value
  const isSetAlias = data.excel.options.isSetAlias.value
  return excel.hasExcel && excel.data.length > 0 ? (
    <TableList
      data={excel.data}
      columns={excel.columns}
      rowLimit={limit}
      isShowExtraColumns={isSetAlias}
      onExtraClick={(col, value) => excel.setAlias(col, value)}
      onClick={(col, e) => {
        e.stopPropagation()
        const menu = w.overlayManager.get('menu')
        menu.show({
          attochTo: e,
          list: [
            {
              name: '文本',
              action: () => {
                excel.setDataType(col, 'string')
                menu.hide()
              },
              iconName: 'value-type-string',
            },
            {
              name: '数值',
              action: () => {
                excel.setDataType(col, 'number')
                menu.hide()
              },
              iconName: 'value-type-number',
            },
            {
              name: '日期',
              action: () => {
                excel.setDataType(col, 'date')
                menu.hide()
              },
              iconName: 'value-type-date',
            },
            {
              name: '布尔',
              action: () => {
                excel.setDataType(col, 'boolean')
                menu.hide()
              },
              iconName: 'value-type-boolean',
            },
          ],
        })
      }}
    />
  ) : (
    <UploadExcel onOk={(files) => excel.loadFiles(files)} height={400} name="点此上传Excel文件" />
  )
}

export default observer(ExcelData)
