/**
 * @author 南风
 * @description 大屏详情
 */
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import Section from "@components/section"
import {TextField, TextareaField} from "@components/field"

const ArtDetailTab = ({art}) => {
  const {t} = useTranslation()
  return (
    <div className={c("fbh fbac fbjc")}>
      <scroll className="wh100p">
        <Section name="基础信息" childrenClassName="pt8 pb8">
          <div className="fbh">
            <div className="fb1">
              <TextField
                label={t("name")}
                value={art.name}
                onChange={(value) => art.set("name", value)}
                onBlur={art.update}
              />
              <TextareaField
                label={t("description.description")}
                value={art.remark}
                onChange={(value) => art.set("remark", value)}
                onBlur={art.update}
              />
              <TextareaField
                label={t("description.creater")}
                value={art.user.nickname}
                readOnly
              />
              <TextareaField
                label="分辨率"
                value={`${art.width} x ${art.height}`}
                readOnly
              />
              <TextareaField
                label={t("description.ctime")}
                value={art.ctime}
                readOnly
              />
              <TextareaField
                label={t("description.mtime")}
                value={art.mtime}
                readOnly
              />
            </div>
            <div className="fb2" />
          </div>
        </Section>
      </scroll>
    </div>
  )
}

export default observer(ArtDetailTab)
