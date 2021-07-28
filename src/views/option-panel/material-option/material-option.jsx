/**
 * @author 南风
 * @description 素材面板配置信息栏封装
 */
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import moment from "moment"
import c from "classnames"
import {TextField, TextareaField, NumberField} from "@components/field"
import Tab from "@components/tab"
import Section from "@components/section"
import Scroll from "@components/scroll"

const MaterialOption = ({material}) => {
  const {materialOptions} = material
  const {t} = useTranslation()
  return (
    <Tab sessionId="material-option" className={c({fb1: true})}>
      <Tab.Item name={t("material.info")}>
        <Scroll className="h100p">
          {/* 日志信息 */}
          <Section
            name={t("materialPanel.logInfo")}
            childrenClassName="pt8 pb8"
            props={materialOptions.sectionLog}
          >
            <TextField
              label={t("materialPanel.creater")}
              value={material.user.nickname}
              readOnly
            />
            <TextField
              label={t("materialPanel.ctime")}
              value={moment(material.ctime).format("YYYY-MM-DD HH:mm:ss")}
              readOnly
            />
          </Section>
          {/* 基础信息 */}
          <Section
            name={t("materialPanel.basicInfo")}
            childrenClassName="pt8 pb8"
            props={materialOptions.sectionBasic}
          >
            <TextField
              label={t("name")}
              value={material.name}
              onChange={(v) => material.set("name", v)}
            />
            <TextareaField
              label={t("description.description")}
              value={material.description}
              onChange={(v) => material.set("description", v)}
            />
            <TextareaField
              label={t("materialPanel.filePath")}
              value={material.id}
              readOnly
            />
            {/* 按素材类型划分特有信息 */}
            {material.type === "image" ? (
              <>
                <NumberField
                  label={t("width")}
                  readOnly
                  value={material.width}
                />
                <NumberField
                  label={t("height")}
                  readOnly
                  value={material.height}
                />
              </>
            ) : (
              ""
            )}
          </Section>
        </Scroll>
      </Tab.Item>
    </Tab>
  )
}

export default observer(MaterialOption)
