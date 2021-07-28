import React from "react"
import {observer} from "mobx-react-lite"
import SectionFields from "@components/section-fields"
import ConstructLayer from "@components/construct-layer"
import w from "@models"

const ExhibitLayer = ({artOption, exhibit}) => {
  const {layers} = exhibit
  const groups = layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    layers: layer.children.map((v) => `${layer.id}.${v.option}`)
  }))
  const source = layers.reduce((total, current) => {
    const boxes = current.children.map((v) => ({
      id: `${current.id}.${v.option}`,
      name: v.name,
      groups: [current.id]
    }))
    total.push(...boxes)
    return total
  }, [])

  return (
    <>
      <ConstructLayer
        value={{
          source,
          groups
        }}
        onClick={(id, info, e) => {
          const layer = layers.filter((v) => v.id === info.groupId)[0]
          if (layer.other) {
            const {top} = e.target.getBoundingClientRect()
            w.overlayManager.get("otherlayer").show({
              title: layer.name,
              attachTo: false,
              right: 480,
              top,
              content: (
                <div className="pb32">
                  <SectionFields
                    model={layer.other}
                    onChange={(data) => {
                      artOption.getOther(exhibit, data)
                    }}
                  />
                </div>
              )
            })
          }
          artOption.set({
            updateLayer: layer.id,
            updateOption: info.layerId
          })
          artOption.setTooltip(layer.tooltip)
          if (info.type === "layer") {
            const child = layer.children.filter(
              (v) => v.option === info.layerId
            )[0]
            artOption.setTabConfig(child)
            artOption.setAnimationInPanel(child)
          }
        }}
        onEyeClick={(e) => {
          console.log(e)
        }}
      />
    </>
  )
}

export default observer(ExhibitLayer)
