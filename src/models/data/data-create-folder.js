import {createConfigModelClass} from "@components/field"

export const MDataCreaterFolder = createConfigModelClass("MDataCreaterFolder", {
  sections: ["__hide__"],
  fields: [
    {
      section: "__hide__",
      option: "name",
      field: {
        type: "text",
        label: "name",
        defaultValue: ""
      }
    }
  ]
})
