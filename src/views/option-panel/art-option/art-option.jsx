import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import find from "lodash/find"
import Tab from "@components/tab"
import Scroll from "@components/scroll"
import SectionFields from "@components/section-fields"
import Overlay from "@components/overlay"
import w from "@models"
import Layout from "./layout"
import Description from "./description"
import ArtBasic from "./art-basic"
import ExhibitLayer from "./exhibit-layer"
import GisLayer from "./gis-layer"

const ArtOption = ({art}) => {
  const {artOption, viewport, datas} = art
  const {selectRange} = viewport
  let exhibit
  let exhibitId
  let frame
  let box
  if (selectRange) {
    if (selectRange.target === "frame") {
      frame = viewport.selected
    } else if (
      selectRange.target === "box" &&
      selectRange.boxes_.length === 1
    ) {
      box = selectRange.boxes_[0]
      exhibitId = box.exhibit.id
      exhibit = box.frame_.art_.exhibitManager.get(exhibitId)
    }
  }

  const {t} = useTranslation()

  return (
    <>
      <Tab activeIndex={0} sessionId="art-option-top" className="fb2">
        <Tab.Item name={t("art.global")}>
          <Scroll className="h100p">
            <ArtBasic basic={artOption.basic} />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t("optionPanel.data")}>
          <Scroll className="h100p">
            {exhibit ? (
              <SectionFields
                model={exhibit.data}
                onChange={(data) => {
                  const schema = exhibit.getSchema()
                  const {layers} = schema
                  const {json, mappingValue, mode, effectLayers} = data.data
                  const temp = {}
                  Object.entries(mappingValue).forEach(([key, value]) => {
                    const layer = find(layers, (o) => o.id === key)
                    if (layer) {
                      layer.data = value
                    }
                    if (mode === "source") {
                      Object.values(value).forEach((v) => {
                        temp[v.sourceId] = JSON.stringify(
                          datas.find((d) => v.sourceId === `${d.id}`).data
                        )
                      })
                    }
                  })
                  if (mode === "source") {
                    schema.data = temp
                  } else {
                    schema.data = json
                  }

                  console.log(schema)
                  exhibit.adapter.update({
                    action: "data",
                    schema,
                    layerId: effectLayers
                  })
                }}
              />
            ) : (
              <div>请选择组件</div>
            )}
          </Scroll>
        </Tab.Item>
        <Tab.Item name="GIS图层">
          {exhibit && exhibit.key === "gisMap" ? (
            <GisLayer artOption={artOption} exhibit={exhibit} />
          ) : (
            <div>非GIS组件</div>
          )}
        </Tab.Item>
        <Tab.Item name="组件图层">
          {exhibit && exhibit.key !== "gisMap" ? (
            <ExhibitLayer artOption={artOption} exhibit={exhibit} />
          ) : (
            <div>GIS组件</div>
          )}
        </Tab.Item>
      </Tab>
      <Tab activeIndex={0} sessionId="art-option-bottom" className="fb1">
        <Tab.Item name={t("layout.layout")}>
          <Layout
            options={artOption}
            disabled={!(exhibit || frame)}
            exhibit={exhibit}
          />
        </Tab.Item>
        {/* <Tab.Item name={t('background.background')}>
        <Scroll className="h100p">
          <SectionFields sessionId="background" model={artOption.background} onChange={data => {
            // artOption.getTabValues(exhibit, data)
            console.log(data)
          }}
          />
        </Scroll>
      </Tab.Item> */}
        <Tab.Item name={t("graph.graph")}>
          <Scroll className="h100p">
            <SectionFields
              sessionId="graph"
              model={artOption.graph}
              onChange={(data) => {
                console.log(data, "data")
                artOption.getTabValues(exhibit, data)
              }}
            />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t("text.text")}>
          <Scroll className="h100p">
            <SectionFields
              sessionId="text"
              model={artOption.text}
              onChange={(data) => {
                artOption.getTabValues(exhibit, data)
              }}
            />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t("tooltip.tooltip")}>
          <Scroll className="h100p">
            <SectionFields
              sessionId="tooltip"
              model={artOption.tooltip}
              onChange={(data) => {
                artOption.getTooltip(exhibit, data)
              }}
            />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t("animation.animation")}>
          <Scroll className="h100p">
            <SectionFields
              sessionId="animation"
              model={artOption.animation}
              onChange={(data) => {
                artOption.setAnimationInExhibit(exhibit, data)
              }}
            />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t("description.description")}>
          <Description options={artOption} disabled={!(exhibit || frame)} />
        </Tab.Item>
      </Tab>
      <Overlay model={w.overlayManager.get("otherlayer")} />
    </>
  )
}

export default observer(ArtOption)
