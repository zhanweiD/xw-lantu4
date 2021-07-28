import {createConfigModelClass} from "@components/field"

export const MTooltip = createConfigModelClass("MTooltip", {
  sections: [
    {
      section: "tooltip.basic",
      fields: [
        {
          type: "sectionConfig",
          option: "useTooltip",
          defaultValue: false,
          icon: "checkbox"
        }
      ]
    }
  ],
  fields: [
    {
      section: "tooltip.basic",
      option: "mode",
      field: {
        type: "check",
        label: "tooltip.mode",
        defaultValue: "single",
        options: [
          {
            key: "tooltip.single",
            value: "single"
          },
          {
            key: "tooltip.group",
            value: "group"
          }
        ]
      }
    }
  ]
})
