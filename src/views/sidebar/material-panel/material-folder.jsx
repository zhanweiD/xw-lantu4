import React from "react"
import {observer} from "mobx-react-lite"
import Section from "@components/section"
import Material from "./material-thumbnail"
import Grid from "@components/grid"

const MaterialFolder = ({folder, showType, icon}) => {
  const {materials} = folder
  return (
    <Section
      icon={icon}
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      version={3}
      name={`${folder.folderName}(${folder.materials.length})`}
      sessionId={`material-folder-${folder.folderId}`}
    >
      {showType === "grid" ? (
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
