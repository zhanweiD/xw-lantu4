/**
 * @author 白浅
 * @description GIS 热力图层的配置项
 */
import {DEFAULT_DATA} from "./data"

export const HeatmapColorMap = {
  bright: [
    [255, 232, 0],
    [165, 224, 0],
    [59, 209, 70]
  ],
  green: [
    [0, 186, 115],
    [0, 160, 136],
    [0, 132, 144]
  ],
  purple: [
    [78, 32, 124],
    [178, 60, 51],
    [103, 5, 12]
  ],
  brightConfig: ["#FFE800", "#A5E000", "#3BD146"],
  greenConfig: ["#00BA73", "#00A088", "#008490"],
  purpleConfig: ["#4E207C", "#B23C33", "#67050C"]
}

// 根据这个配置生成组件的模型
export const heatmapLayerConfig = (t) => ({
  key: "heatmap",
  type: "heatmap",
  name: "热力层",
  defaultData: DEFAULT_DATA,
  other: {
    sections: ["optionPanel.heatmap"],
    fields: [
      {
        section: "optionPanel.heatmap",
        option: "heatmapType",
        field: {
          type: "check",
          label: t("heatmapType"),
          options: [
            {
              key: "经典",
              value: "classic"
            },
            {
              key: "蜂窝",
              value: "honeycomb"
            },
            {
              key: "网格",
              value: "grid"
            }
          ],
          defaultValue: "classic"
        }
      },
      {
        section: "optionPanel.heatmap",
        option: "extruded",
        field: {
          type: "check",
          label: t("extruded"),
          options: [
            {
              key: "2D",
              value: "2d"
            },

            {
              key: "3D",
              value: "3d"
            }
          ],
          defaultValue: "2d"
        },
        when: (parent) => {
          return parent.heatmapType.value !== "classic"
        }
      },
      {
        section: "optionPanel.heatmap",
        option: "elevationRange",
        when: {
          key: "extruded",
          value: "3d"
        },
        field: {
          type: "multiNumber",
          label: t("elevationRange"),
          defaultValue: [0, 100],
          items: [
            {
              key: t("min"),
              step: 10,
              min: 0
            },
            {
              key: t("max"),
              step: 10,
              min: 0
            }
          ]
        }
      },
      {
        section: "optionPanel.heatmap",
        option: "colorRange",
        field: {
          type: "selectGradientColor",
          label: t("colorRange"),
          defaultValue: HeatmapColorMap.bright,
          options: [
            {
              // key值为选项标签名
              key: "bright",
              value: HeatmapColorMap.bright
            },

            {
              key: "green",
              value: HeatmapColorMap.green
            },
            {
              key: "purple",
              value: HeatmapColorMap.purple
            }
          ]
        }
      },
      {
        section: "optionPanel.heatmap",
        option: "radius",
        field: {
          type: "number",
          label: t("heatRadius"),
          defaultValue: 50,
          min: 1
        }
      }
    ]
  },
  dataConfig: [
    [
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
        name: "热力",
        key: "value",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            // name: '热力',
            key: "value",
            type: "number"
          }
        ]
      }
    ]
  ]
})
