import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Section from "@components/section"
import Material from "./material-thumbnail"
import Grid from "@components/grid"

const MaterialFolder = ({folder, showType, icon}) => {
  const {materials} = folder
  return (
    <Section icon={icon} className="pl8 pr8 mt8" childrenClassName="pt8" version={3} name={`${folder.folderName}(${folder.materials.length})`} sessionId={`material-folder-${folder.folderId}`}>
      {materials.length === 0 ? (
        <div className={c("mb16 emptyNote")}>
          <div>
            列表还是空空的，点击
            <span className="ctSecend hand" onClick={() => folder.upload(folder.folderId)}>
              上传
            </span>
          </div>
        </div>
      ) : null}
      {showType === "grid-layout" ? (
        <Grid column={4}>
          {materials.map((material) => (
            <Grid.Item key={material.materialId}>
              <Material key={material.materialId} material={material} showType={showType} />
            </Grid.Item>
          ))}
        </Grid>
      ) : (
        materials.map((material) => <Material key={material.materialId} material={material} showType={showType} />)
      )}
    </Section>
  )
}

export default observer(MaterialFolder)
