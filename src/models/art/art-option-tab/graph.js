import {createConfigModelClass} from "@components/field"
import i18n from "@i18n"

export const MGraph = createConfigModelClass("MGraph", {
  sections: ["graph.fill", "graph.stroke"],
  fields: [
    {
      section: "graph.fill",
      option: "fillType",
      field: {
        type: "check",
        label: "graph.type",
        options: [
          {
            key: i18n.t("graph.solid"),
            value: "solid"
          },
          {
            key: i18n.t("graph.gradient"),
            value: "gradient"
          },
          {
            key: i18n.t("graph.theme"),
            value: "theme"
          }
        ],
        defaultValue: "solid",
        readOnly: true
      }
    },
    {
      section: "graph.fill",
      option: "fillSolidColor",
      field: {
        type: "color",
        label: "graph.color",
        defaultValue: "",
        readOnly: true
      },
      when: {
        key: "fillType",
        value: "solid"
      }
    },
    {
      section: "graph.fill",
      option: "fillGradientColor",
      field: {
        type: "gradientColor",
        label: "graph.color",
        defaultValue: ["rgb(74,144,226)", "rgb(80,227,194)"],
        readOnly: true
      },
      when: {
        key: "fillType",
        value: "gradient"
      }
    },
    {
      section: "graph.fill",
      option: "fillOpacity",
      field: {
        type: "number",
        label: "graph.opacity",
        defaultValue: 1,
        step: 0.1,
        min: 0,
        max: 1,
        readOnly: true
      }
    },
    {
      section: "graph.stroke",
      option: "strokeWidth",
      field: {
        type: "number",
        label: "graph.width",
        defaultValue: 0,
        readOnly: true
      }
    },
    {
      section: "graph.stroke",
      option: "strokeType",
      field: {
        type: "check",
        label: "graph.type",
        options: [
          {
            key: i18n.t("graph.solid"),
            value: "solid"
          },
          {
            key: i18n.t("graph.gradient"),
            value: "gradient"
          },
          {
            key: i18n.t("graph.theme"),
            value: "theme"
          }
        ],
        defaultValue: "solid",
        readOnly: true
      }
    },
    {
      section: "graph.stroke",
      option: "strokeSolidColor",
      field: {
        type: "color",
        label: "graph.color",
        defaultValue: "",
        readOnly: true
      },
      when: {
        key: "strokeType",
        value: "solid"
      }
    },
    {
      section: "graph.stroke",
      option: "strokeGradientColor",
      field: {
        type: "gradientColor",
        label: "graph.color",
        defaultValue: ["rgb(74,144,226)", "rgb(80,227,194)"],
        readOnly: true
      },
      when: {
        key: "strokeType",
        value: "gradient"
      }
    },
    {
      section: "graph.stroke",
      option: "strokeOpacity",
      field: {
        type: "number",
        label: "graph.opacity",
        defaultValue: 1,
        step: 0.1,
        min: 0,
        max: 1,
        readOnly: true
      }
    }
  ]
})
