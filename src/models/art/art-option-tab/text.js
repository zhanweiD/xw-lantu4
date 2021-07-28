import {createConfigModelClass} from "@components/field"
import i18n from "@i18n"

export const MText = createConfigModelClass("MText", {
  sections: [
    "text.basic",
    "text.fill",
    {
      section: "text.shadow",
      fields: [
        {
          type: "sectionConfig",
          option: "useShadow",
          defaultValue: false,
          readOnly: true,
          icon: "checkbox"
        }
      ]
    },
    {
      section: "text.format",
      fields: [
        {
          type: "sectionConfig",
          option: "useFormat",
          defaultValue: false,
          readOnly: true,
          icon: "checkbox"
        }
      ]
    },
    "text.other"
  ],
  fields: [
    {
      section: "text.basic",
      option: "fontFamily",
      field: {
        type: "select",
        label: "text.fontFamily",
        options: [
          {
            key: "Times New Roman",
            value: "Times New Roman"
          },
          {
            key: "Arial",
            value: "Arial"
          }
        ],
        defaultValue: "Arial",
        readOnly: true
      }
    },
    {
      section: "text.basic",
      option: "fontSize",
      field: {
        type: "number",
        label: "text.fontSize",
        defaultValue: 12,
        readOnly: true
      }
    },
    {
      section: "text.basic",
      option: "fontWeight",
      field: {
        type: "number",
        label: "text.fontWeight",
        defaultValue: 200,
        readOnly: true
      }
    },
    {
      section: "text.fill",
      option: "fillColor",
      field: {
        type: "color",
        label: "text.color",
        defaultValue: "",
        readOnly: true
      }
    },
    {
      section: "text.fill",
      option: "fillOpacity",
      field: {
        type: "number",
        label: "text.opacity",
        defaultValue: 1,
        readOnly: true
      }
    },
    {
      section: "text.shadow",
      option: "shadowColor",
      field: {
        type: "color",
        label: "text.color",
        defaultValue: "",
        readOnly: true
      }
    },
    {
      section: "text.shadow",
      option: "shadowConfig",
      field: {
        type: "multiNumber",
        label: "text.shadowConfig",
        items: [
          {
            key: i18n.t("text.offsetX"),
            step: 1
          },
          {
            key: i18n.t("text.offsetY"),
            step: 1
          },
          {
            key: i18n.t("text.blurRadius"),
            step: 1
          }
        ],
        defaultValue: [0, 0, 0],
        readOnly: true
      }
    },
    {
      section: "text.shadow",
      option: "shadowOpacity",
      field: {
        type: "number",
        label: "text.opacity",
        defaultValue: 1,
        step: 0.1,
        min: 0,
        max: 1,
        readOnly: true
      }
    },
    {
      section: "text.format",
      option: "useThousandth",
      field: {
        type: "switch",
        label: "text.thousandth",
        defaultValue: false,
        readOnly: true
      }
    },
    {
      section: "text.format",
      option: "usePercentage",
      field: {
        type: "switch",
        label: "text.percentage",
        defaultValue: false,
        readOnly: true
      }
    },
    {
      section: "text.format",
      option: "decimalPlace",
      field: {
        type: "number",
        label: "text.precision",
        defaultValue: 0,
        readOnly: true
      }
    },
    {
      section: "text.other",
      option: "rotation",
      field: {
        type: "number",
        label: "text.rotation",
        defaultValue: 0,
        readOnly: true
      }
    },
    {
      section: "text.other",
      option: "offset",
      field: {
        type: "multiNumber",
        label: "legend.offset",
        defaultValue: [0, 0],
        items: [
          {
            key: "X"
          },
          {
            key: "Y"
          }
        ],
        readOnly: true
      }
    },
    {
      section: "text.other",
      option: "writingMode",
      field: {
        type: "check",
        label: "text.writingMode",
        options: [
          {
            key: i18n.t("text.horizontal"),
            value: "horizontal"
          },
          {
            key: i18n.t("text.vertical"),
            value: "vertical"
          }
        ],
        defaultValue: "horizontal",
        readOnly: true
      }
    }
  ]
})
