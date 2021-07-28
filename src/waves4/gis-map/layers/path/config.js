/**
 * @author 白浅
 * @description GIS 轨迹图层的配置项
 */
import {DEFAULT_DATA} from "./data"

export const pathLayerConfig = (t) => ({
  type: "path",
  key: "path",
  name: "轨迹层",
  defaultData: DEFAULT_DATA,
  other: {
    sections: ["optionPanel.path", "optionPanel.advanced"],
    fields: [
      {
        section: "optionPanel.path",
        option: "showPath",
        field: {
          type: "switch",
          label: t("showPath"),
          defaultValue: true
        }
      },
      {
        section: "optionPanel.path",
        option: "pathWidth",
        field: {
          type: "number",
          label: t("pathWidth"),
          defaultValue: 5,
          min: 1
        },
        when: {
          key: "showPath",
          value: true
        }
      },
      {
        section: "optionPanel.path",
        option: "pathColor",
        field: {
          type: "color",
          label: t("pathColor"),
          defaultValue: [219, 152, 80],
          isColorArrayForm: true,
          opacityMax: 255
        },
        when: {
          key: "showPath",
          value: true
        }
      },
      {
        section: "optionPanel.path",
        option: "rounded",
        field: {
          type: "switch",
          label: t("rounded"),
          defaultValue: true
        }
      },
      {
        section: "optionPanel.path",
        option: "showTrail",
        field: {
          type: "switch",
          label: t("showTrail"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.path",
        option: "trailLength",
        field: {
          type: "number",
          label: t("trailLength"),
          defaultValue: 600,
          min: 1
        },
        when: {
          key: "showTrail",
          value: true
        }
      },
      {
        section: "optionPanel.path",
        option: "trailWidth",
        field: {
          type: "number",
          label: t("trailWidth"),
          defaultValue: 10,
          min: 1
        },
        when: {
          key: "showTrail",
          value: true
        }
      },
      {
        section: "optionPanel.path",
        option: "trailColor",
        field: {
          type: "color",
          label: t("trailColor"),
          defaultValue: [241, 105, 76],
          isColorArrayForm: true
        },
        when: {
          key: "showTrail",
          value: true
        }
      },
      {
        section: "optionPanel.path",
        option: "trailSpeed",
        field: {
          type: "number",
          label: t("trailSpeed"),
          defaultValue: 1,
          min: 1
        },
        when: {
          key: "showTrail",
          value: true
        }
      },

      {
        section: "optionPanel.advanced",
        option: "showEndVertex",
        field: {
          type: "switch",
          label: t("showEndVertex"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "endVertexSize",
        field: {
          type: "number",
          label: t("endVertexSize"),
          defaultValue: 2,
          min: 1
        },
        when: {
          key: "showEndVertex",
          value: true
        }
      },
      {
        section: "optionPanel.advanced",
        option: "endVertexColor",
        field: {
          type: "color",
          label: t("endVertexColor"),
          defaultValue: [103, 233, 29],
          isColorArrayForm: true,
          opacityMax: 255
        },
        when: {
          key: "showEndVertex",
          value: true
        }
      },

      {
        section: "optionPanel.advanced",
        option: "showVertex",
        field: {
          type: "switch",
          label: t("showVertex"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "vertexSize",
        field: {
          type: "number",
          label: t("vertexSize"),
          defaultValue: 0.5,
          min: 0.5
        },
        when: {
          key: "showVertex",
          value: true
        }
      },
      {
        section: "optionPanel.advanced",
        option: "vertexColor",
        field: {
          type: "color",
          label: t("vertexColor"),
          defaultValue: [170, 190, 49],
          isColorArrayForm: true,
          opacityMax: 255
        },
        when: {
          key: "showVertex",
          value: true
        }
      }
    ]
  },
  dataConfig: [
    [
      {
        name: "路径id",
        key: "pathId",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            // name: '路径id',
            key: "pathId",
            type: "string"
          }
        ]
      },
      {
        name: "经度",
        key: "longitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            // name: '经度',
            key: "longitude",
            type: "number"
          }
        ]
      },
      {
        name: "纬度",
        key: "latitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            // name: '纬度',
            key: "latitude",
            type: "number"
          }
        ]
      },
      {
        name: "时间戳",
        key: "time",
        type: ["number"],
        range: [0, 1],
        value: [
          {
            // name: '时间戳',
            key: "time",
            type: "number"
          }
        ]
      }
    ]
  ]
})
