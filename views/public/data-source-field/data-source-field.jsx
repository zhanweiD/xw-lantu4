import React from 'react'
import {Field, SelectField, TextField, NumberField} from '@components/field'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Button from '@components/button'
import s from './data-source-field.module.styl'

const DataSourceField = observer(({data, model, isView, testBtn, onClick = () => {}}) => {
  if (!data || !data.modelConfig) data.modelConfig = {}
  const {
    remark = '',
    dataSourceName = '',
    databaseList = [],
    type = '',
    host = '',
    userName = '',
    password = '',
    port = '',
    database = '',
  } = data.modelConfig
  return (
    <div className={c(s.databaseMargin)}>
      <TextField
        label="数据源名称"
        value={dataSourceName}
        onChange={(value) =>
          data.set({
            modelConfig: {...data.modelConfig, dataSourceName: value},
          })
        }
        readOnly={isView}
      />
      <TextField
        label="备注"
        value={remark}
        onChange={(value) => data.set({modelConfig: {...data.modelConfig, remark: value}})}
        readOnly={isView}
      />
      {isView ? (
        <TextField label="数据库类型" value={type} readOnly={isView} />
      ) : (
        <SelectField
          label="数据库类型"
          value={type}
          options={model.databaseTypes}
          isFixed={false}
          onChange={(value) => data.set({modelConfig: {...data.modelConfig, type: value}})}
        />
      )}
      <TextField
        label="链接地址"
        value={host}
        readOnly={isView}
        onChange={(value) => data.set({modelConfig: {...data.modelConfig, host: value}})}
      />
      <TextField
        label="用户名"
        value={userName}
        readOnly={isView}
        onChange={(value) => data.set({modelConfig: {...data.modelConfig, userName: value}})}
      />
      <TextField
        label="密码"
        type="password"
        value={password}
        readOnly={isView}
        onChange={(value) => data.set({modelConfig: {...data.modelConfig, password: value}})}
      />

      <NumberField
        label="端口"
        max={65535}
        min={1}
        value={port}
        readOnly={isView}
        onChange={(value) => data.set({modelConfig: {...data.modelConfig, port: value}})}
      />

      {isView ? (
        <TextField label="数据库" value={database} readOnly={isView} />
      ) : (
        <Field label="数据库">
          <div className="fbh fb1">
            <Button
              className={s.button}
              lineHeight={26}
              type="dashed"
              size="small"
              name="获取库列表"
              circle={3}
              onClick={model.getDatabases}
            />
            <SelectField
              className={c('fb1', s.selectDatabase)}
              isFixed={false}
              value={database}
              options={(() => {
                if (databaseList && databaseList.length > 0) {
                  return databaseList.map((val) => ({key: val, value: val}))
                }
                if (databaseList && databaseList.length === 0 && database) {
                  return [{key: database, value: database}]
                }
                return []
              })()}
              onChange={(value) =>
                data.set({
                  modelConfig: {...data.modelConfig, database: value},
                })
              }
            />
          </div>
        </Field>
      )}

      {!testBtn ? (
        <div
          className={c(s.testConnButton, 'mt24 mb8 hand ctw')}
          onClick={(e) => {
            onClick(e)
          }}
        >
          测试连通性
        </div>
      ) : null}
    </div>
  )
})

export default DataSourceField
