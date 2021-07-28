import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import {
  NumberField,
  SelectThemeColorField,
  SwitchField,
  TextField
} from "@components/field"
import Section from "@components/section"
import {themeConfigs} from "@utils/theme"

const ArtBasic = ({basic}) => {
  const {t} = useTranslation()
  const {themeId, gridUnit, watermark, password} = basic
  return (
    <>
      <Section
        sessionId="art-basic"
        name={t("art.basic")}
        childrenClassName="pt8 pb8"
      >
        <SelectThemeColorField
          label={t("art.theme")}
          value={themeId}
          type="select-theme-color"
          options={[
            {
              key: t("theme.fairyLand"),
              value: "fairyLand",
              data: themeConfigs.fairyLand.colors
            },
            {
              key: t("theme.emeraldGreen"),
              value: "emeraldGreen",
              data: themeConfigs.emeraldGreen.colors
            },
            {
              key: t("theme.duskUniverse"),
              value: "duskUniverse",
              data: themeConfigs.duskUniverse.colors
            },
            {
              key: t("theme.glaze"),
              value: "glaze",
              data: themeConfigs.glaze.colors
            },
            {
              key: t("theme.exquisite"),
              value: "exquisite",
              data: themeConfigs.exquisite.colors
            },
            {
              key: t("theme.blueGreen"),
              value: "blueGreen",
              data: themeConfigs.blueGreen.colors
            },
            {
              key: t("theme.greenRed"),
              value: "greenRed",
              data: themeConfigs.greenRed.colors
            },
            {
              key: t("theme.blueRed"),
              value: "blueRed",
              data: themeConfigs.blueRed.colors
            },
            {
              key: t("theme.orangePurple"),
              value: "orangePurple",
              data: themeConfigs.orangePurple.colors
            },
            {
              key: t("theme.brownGreen"),
              value: "brownGreen",
              data: themeConfigs.brownGreen.colors
            }
          ]}
          onChange={(value) => {
            basic.set({
              themeId: value
            })
          }}
          isFixed
        />
      </Section>
      <Section
        sessionId="art-grid"
        name={t("art.grid")}
        childrenClassName="pt8 pb8"
      >
        <NumberField
          label={t("art.size")}
          min={16}
          value={gridUnit}
          onChange={(value) => {
            basic.set({
              gridUnit: +value
            })
          }}
        />
      </Section>
      <Section
        sessionId="art-watermark"
        name={t("art.watermark")}
        childrenClassName="pt8 pb8"
      >
        <TextField
          label={t("art.text")}
          value={watermark.value}
          onChange={(value) => {
            watermark.set({
              value
            })
          }}
        />

        <NumberField
          label={t("art.rotation")}
          min={-180}
          max={180}
          step={1}
          value={watermark.rotation}
          onChange={(value) => {
            watermark.set({
              rotation: value
            })
          }}
        />
        <NumberField
          label={t("art.opacity")}
          min={0}
          max={1}
          step={0.1}
          value={watermark.opacity}
          onChange={(value) => {
            watermark.set({
              opacity: value
            })
          }}
        />
      </Section>
      <Section
        sessionId="art-permission"
        name={t("art.permission")}
        childrenClassName="pt8 pb8"
        extra={
          <SwitchField
            value={password.isEnable}
            onChange={(value) => {
              password.set({
                isEnable: value
              })
            }}
          />
        }
      >
        <TextField
          type="password"
          label={t("art.password")}
          value={password.value}
          onChange={(value) => {
            password.set({
              value
            })
          }}
        />
      </Section>
    </>
  )
}
export default observer(ArtBasic)
