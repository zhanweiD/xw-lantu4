/**
 * @author 白浅
 * @description GIS 飞线层的配置项
 */
import {DEFAULT_DATA} from "./data"

export const ColorMap = {
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
export const odLineLayerConfig = (t) => ({
  type: "odline",
  key: "odline",
  name: "飞线层",
  defaultData: DEFAULT_DATA,

  other: {
    sections: ["optionPanel.flyline", "optionPanel.advanced"],
    fields: [
      {
        section: "optionPanel.flyline",
        option: "lineHeight",
        field: {
          type: "number",
          label: t("flyLineHeight"),
          defaultValue: 1,
          min: 0,
          max: 1
        }
      },
      {
        section: "optionPanel.flyline",
        option: "lineWidth",
        field: {
          type: "number",
          label: t("flyLineWidth"),
          defaultValue: 4,
          min: 1,
          max: 30,
          supportProcessor: true,
          processorCode: `
        // @param d 每个点的数据
          return function (d) {
            // 默认返回半径
            // 此处返回一个number类型的值
            return 10
          }`
        }
      },
      {
        section: "optionPanel.flyline",
        option: "lineColor",
        field: {
          type: "selectGradientColor",
          label: t("flyLineColor"),
          defaultValue: ColorMap.bright,
          options: [
            {
              // key值为选项标签名
              key: "bright",
              value: ColorMap.bright
            },

            {
              key: "green",
              value: ColorMap.green
            },
            {
              key: "purple",
              value: ColorMap.purple
            }
          ]
        }
      },
      {
        section: "optionPanel.flyline",
        option: "greatCircle",
        field: {
          type: "switch",
          label: t("greatCircle"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.flyline",
        option: "showFlyPoint",
        field: {
          type: "switch",
          label: t("showFlyPoint"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.flyline",
        option: "flyPointWidth",
        when: {
          key: "showFlyPoint",
          value: true
        },
        field: {
          type: "number",
          label: t("flyPointWidth"),
          defaultValue: 4
          // TODO 为什么这里去掉，飞线动画才生效
          // opacityMax: 255,
          // supportProcessor: true,
          // processorCode: `
          //   // @param d 每一条数据
          //   return function (d) {
          //     // 默认返回颜色
          //     return [255,255,255]
          //   }`,
        }
      },
      {
        section: "optionPanel.flyline",
        option: "flyPointLength",
        when: {
          key: "showFlyPoint",
          value: true
        },
        field: {
          type: "number",
          label: t("flyPointLength"),
          defaultValue: 6
          // TODO 为什么这里去掉，飞线动画才生效
          // opacityMax: 255,
          // supportProcessor: true,
          // processorCode: `
          //   // @param d 每一条数据
          //   return function (d) {
          //     // 默认返回颜色
          //     return [255,255,255]
          //   }`,
        }
      },
      {
        section: "optionPanel.flyline",
        option: "flyPointColor",
        when: {
          key: "showFlyPoint",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("flyPointColor"),
          defaultValue: ColorMap.bright[1],
          isFixed: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "sourcePoint",
        field: {
          type: "switch",
          label: t("sourcePoint"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "sourcePointSize",
        when: {
          key: "sourcePoint",
          value: true
        },
        field: {
          type: "number",
          label: t("sourcePointSize"),
          defaultValue: 12,
          min: 2
        }
      },
      {
        section: "optionPanel.advanced",
        option: "sourcePointColor",
        when: {
          key: "sourcePoint",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("sourcePointColor"),
          defaultValue: ColorMap.bright[0],
          isFixed: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "targetPoint",
        field: {
          type: "switch",
          label: t("targetPoint"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "targetPointSize",
        when: {
          key: "targetPoint",
          value: true
        },
        field: {
          type: "number",
          label: t("targetPointSize"),
          defaultValue: 6,
          min: 2
        }
      },
      {
        section: "optionPanel.advanced",
        option: "targetPointColor",
        when: {
          key: "targetPoint",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("targetPointColor"),
          defaultValue: ColorMap.bright[2],
          isFixed: false
        }
      },
      {
        section: "optionPanel.advanced",
        option: "showLabel",
        field: {
          type: "switch",
          label: t("showLabel"),
          defaultValue: false
        }
      },

      {
        section: "optionPanel.advanced",
        option: "labelSize",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "number",
          label: t("labelSize"),
          defaultValue: 20
        }
      },

      {
        section: "optionPanel.advanced",
        option: "labelColor",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("labelColor"),
          defaultValue: [255, 255, 255],
          isFixed: false
        }
      }
    ]
  },
  dataConfig: [
    [
      {
        name: "起点经度",
        key: "sourceLongitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            name: "起点经度",
            key: "sourceLongitude",
            type: "number"
          }
        ]
      },
      {
        name: "起点纬度",
        key: "sourceLatitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            name: "起点纬度",
            key: "sourceLatitude",
            type: "number"
          }
        ]
      },
      {
        name: "起点标签",
        key: "sourceLabel",
        type: ["string"],
        range: [0, 1],
        value: [
          {
            name: "sourceLabel",
            key: "sourceLabel",
            type: "string"
          }
        ]
      },
      {
        name: "终点经度",
        key: "targetLongitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            name: "终点经度",
            key: "targetLongitude",
            type: "number"
          }
        ]
      },
      {
        name: "终点纬度",
        key: "targetLatitude",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            name: "终点纬度",
            key: "targetLatitude",
            type: "number"
          }
        ]
      },
      {
        name: "终点标签",
        key: "targetLabel",
        type: ["string"],
        range: [0, 1],
        value: [
          {
            name: "targetLabel",
            key: "targetLabel",
            type: "string"
          }
        ]
      }
    ]
  ]
})
