import {createConfigModelClass} from "@components/field"

export const MCreateOrganizationModal = createConfigModelClass(
  "MCreateOrganizationModal",
  {
    sections: ["__hide__"],
    fields: [
      {
        section: "__hide__",
        option: "name",
        field: {
          type: "text",
          label: "organization.organizationName",
          option: "name",
          required: true,
          placeholder: "namePlaceholder"
        }
      },
      {
        section: "__hide__",
        option: "description",
        field: {
          type: "textarea",
          label: "organization.description",
          option: "description",
          placeholder: "detailPlaceholder"
        }
      }
    ]
  }
)
