import React from "react"
import {observer} from "mobx-react-lite"
import Loading from "@components/loading"
import DataSourceManagerTab from "../data-source-manager-tab"
import MaterialTab from "../material-tab"
import DataTab from "../data-tab"
import ProjectDetailTab from "../project-detail-tab"
import ArtInitTab from "../art-init-tab"
import ArtTab from "../art-tab"

const EditorTab = ({tab}) => {
  return (
    <div className="wh100p">
      {tab.type === "projectDetail" && tab.projectDetail && <ProjectDetailTab project={tab.projectDetail} />}
      {tab.type === "artInit" && tab.initArt && <ArtInitTab art={tab.initArt} id={tab.id} />}
      {tab.type === "art" && tab.art && (
        <Loading data={tab.art.fetchState}>
          <ArtTab art={tab.art} />
        </Loading>
      )}
      {tab.type === "material" && tab.material && (
        <Loading data={tab.material.fetchState}>
          <MaterialTab material={tab.material} />
        </Loading>
      )}
      {tab.type === "data" && tab.data && <DataTab data={tab.data} />}
      {tab.type === "dataSourceManager" && tab.dataSourceManager && (
        <DataSourceManagerTab dataSourceManager={tab.dataSourceManager} />
      )}
    </div>
  )
}

export default observer(EditorTab)
