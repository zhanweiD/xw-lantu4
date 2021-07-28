import {createConfigModelClass} from "@components/field"
import i18n from "@i18n"

export const MBackground = createConfigModelClass("MBackground", {
  sections: [
    {
      section: "background.backgroundImage",
      fields: [
        {
          type: "sectionConfig",
          option: "useBackgroundImage",
          defaultValue: false,
          readOnly: false,
          icon: "checkbox"
        }
      ]
    },
    {
      section: "background.backgroundColor",
      fields: [
        {
          type: "sectionConfig",
          option: "useBackgroundColor",
          defaultValue: false,
          readOnly: false,
          icon: "checkbox"
        }
      ]
    }
  ],
  fields: [
    {
      section: "background.backgroundImage",
      option: "opacity",
      field: {
        type: "number",
        label: "background.opacity",
        defaultValue: 1,
        step: 0.1,
        min: 0,
        max: 1,
        readOnly: false
      }
    },
    {
      section: "background.backgroundColor",
      option: "colorType",
      field: {
        type: "check",
        label: "background.type",
        options: [
          {
            key: i18n.t("background.solid"),
            value: "solid"
          },
          {
            key: i18n.t("background.gradient"),
            value: "gradient"
          },
          {
            key: i18n.t("background.css"),
            value: "css"
          }
        ],
        defaultValue: "solid",
        readOnly: false
      }
    },
    {
      section: "background.backgroundColor",
      option: "solidColor",
      field: {
        type: "color",
        label: "background.color",
        defaultValue: "",
        readOnly: false
      },
      when: {
        key: "colorType",
        value: "solid"
      }
    },
    {
      section: "background.backgroundColor",
      option: "gradientColor",
      field: {
        type: "gradientColor",
        label: "background.color",
        defaultValue: ["rgb(74,144,226)", "rgb(80,227,194)"],
        readOnly: false
      },
      when: {
        key: "colorType",
        value: "gradient"
      }
    }
  ]
})
