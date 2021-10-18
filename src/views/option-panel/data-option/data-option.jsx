import React, {useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Section from '@builders/section'
import Overlay from '@components/overlay'
import w from '@models'
import SectionFields from '@components/section-fields'
import Icon from '@components/icon'
import DataSourceField from '@views/public/data-source-field'
import s from './data-option.module.styl'
import UploadExcel from '../../editor/data-tab/data-excel/upload-excel'

const overlayManager = w.overlayManager.get('dataSourceModal')
const dataSourceMenu = w.overlayManager.get('dataSourceMenu')

const DataOption = ({data}) => {
  const {dataType, dataSource} = data
  const {t} = useTranslation()
  return (
    <Tab sessionId="data-option" className={c({fb1: true})}>
      <Tab.Item name={t('dataPanel.info')}>
        <Scroll className="h100p">
          {data.basic && <SectionFields model={data.basic} />}
          {dataType === 'api' && <SectionFields onChange={data.api.onOptionsChange} model={data.api.options} />}

          {dataType === 'excel' && (
            <>
              <SectionFields onChange={data.excel.onOptionsChange} model={data.excel.options} />
              {data.excel.hasExcel && (
                <UploadExcel
                  onOk={(files) => data.excel.loadFiles(files)}
                  className="ml24 mr24 pb16"
                  height={200}
                  name="点此重新上传Excel文件"
                />
              )}
            </>
          )}
          {dataType === 'database' && <SectionFields model={data.database.options} />}
          {dataType === 'database' && (
            <Section name="选择数据源" className="fb1" isFold={false}>
              <SelectData list={data.dataSources} data={data} />
            </Section>
          )}

          <Overlay
            model={overlayManager}
            buttons={[
              {
                name: '取消',
                action: () => {
                  overlayManager.hide()
                },
              },
              {
                name: '确认',
                action: () => {
                  dataSource.modelManager.toDoNext()
                },
              },
            ]}
          />
          <Overlay model={dataSourceMenu} className={s.overlay} />
          {data.dataField && <SectionFields model={data.dataField} contentClassName={s.overlay_content} />}
        </Scroll>
      </Tab.Item>
    </Tab>
  )
}

const SelectData = observer(({data, list}) => {
  const {dataSourceName} = data.dataSource
  const selectDataRef = useRef()
  return (
    <div className={c('pt8 pb16 ml24 mr16 fbh', s.text)}>
      <div ref={selectDataRef} className="fb3 pr16 fbh">
        <input
          className={c(s.input)}
          value={dataSourceName}
          onFocus={() => {
            dataSourceMenu.show({
              attachTo: selectDataRef.current,
              closable: false,
              width: selectDataRef.current.offsetWidth,
              content: <DataSourceListModel data={data} list={list} />,
            })
          }}
          onBlur={() => {
            setTimeout(() => {
              dataSourceMenu.hide()
            }, 100)
          }}
        />
        <div className={c('', s.drop)}>
          <Icon name="arrow-down" fill="rgba(255, 255, 255, 0.5)" size={8} />
        </div>
      </div>
      <div
        className={c('fb1 hand', s.button)}
        onMouseDown={() => {
          data.dataSource.modelManager.beforeOpenCreateModel()
          overlayManager.show({
            title: '添加数据库',
            content: (
              <DataSourceField
                onClick={data.database.testDatabaseConnectivity}
                data={data.dataSource.modelManager}
                model={data.database}
              />
            ),
            attachTo: false,
          })
        }}
      >
        添加数据源
      </div>
    </div>
  )
})

const DataSourceListModel = ({data, list}) => {
  return (
    <Scroll>
      <div className={c(s.dataSourceListModel)}>
        {list.length > 0 ? (
          list.map((dataSource) => {
            return (
              <div className="fbh p4 pl8 pr8" key={dataSource.dataSourceId}>
                <div
                  className="fb2"
                  onMouseDown={() => {
                    data.database.setDataSource(dataSource)
                  }}
                >
                  {dataSource.dataSourceName}
                </div>
                <div
                  className="fb1"
                  onMouseDown={() => {
                    data.dataSource.removeDataSource({
                      dataSourceId: dataSource.dataSourceId,
                    })
                  }}
                >
                  删除
                </div>
                <div
                  onMouseDown={() => {
                    data.dataSource.modelManager.beforeOpenUpdateModel(dataSource)
                    overlayManager.show({
                      title: '修改数据库',
                      content: (
                        <DataSourceField
                          onClick={data.database.testDatabaseConnectivity}
                          data={data.dataSource.modelManager}
                          model={data.database}
                        />
                      ),
                      attachTo: false,
                    })
                  }}
                >
                  修改
                </div>
              </div>
            )
          })
        ) : (
          <div>暂无数据</div>
        )}
      </div>
    </Scroll>
  )
}

export default observer(DataOption)
