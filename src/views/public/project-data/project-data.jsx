import React from "react"
import {observer} from "mobx-react-lite"
// import IconButton from '@components/icon-button'
// import w from '@models'
import Table from "@components/table"
import "./project-data.module.styl"
import w from "@models"

const ProjectData = ({project}) => {
  return (
    <>
      <Table
        dataSource={project.data.map((data) => ({
          dataName: data.dataName,
          dataType: data.dataType,
          dataId: data.dataId
        }))}
        columns={[
          {key: "dataName", title: "名称"},
          {key: "dataType", title: "类型", width: 100}
        ]}
        datas={[{dataName: 1, dataType: 2, remark: 3, action: "s"}]}
        onDoubleClick={({data}) => {
          project.openTabByData({data, type: data.dataType})
        }}
        onContextMenu={({e, data}) => {
          e.preventDefault()
          e.stopPropagation()
          const menu = w.overlayManager.get("menu")
          menu.show({
            list: [
              {
                name: "删除",
                action: () => {
                  project.removeData({dataId: data.dataId})
                  menu.hide()
                }
              }
            ]
          })
        }}
        rowHeight={23}
        headClassName="head"
        rowClassName="row"
      />
    </>
  )
}

export default observer(ProjectData)
