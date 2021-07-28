/**
 * @author 白浅
 * @description GIS 图标图层的配置项
 */

import {DEFAULT_DATA} from "./data"

// 根据这个配置生成组件的模型
export const iconLayerConfig = (t) => ({
  key: "icon",
  type: "icon",
  name: "符号层",
  defaultData: DEFAULT_DATA,
  other: {
    sections: ["optionPanel.icon", "optionPanel.label"],
    fields: [
      {
        section: "optionPanel.icon",
        option: "iconWidth",
        field: {
          type: "number",
          label: t("iconWidth"),
          defaultValue: 128,
          min: 1,
          supportProcessor: true,
          processorCode: `
          // @param d 每个icon的数据
            return function (d) {
              // 默认返回宽度
              // 此处返回一个number类型的值
              return 128
            }`
        }
      },
      {
        section: "optionPanel.icon",
        option: "iconHeight",
        field: {
          type: "number",
          label: t("iconHeight"),
          defaultValue: 128,
          min: 1,
          supportProcessor: true,
          processorCode: `
          // @param d 每个icon的数据
            return function (d) {
              // 默认返回高度
              // 此处返回一个number类型的值
              return 128
            }`
        }
      },
      {
        section: "optionPanel.icon",
        option: "iconSize",
        field: {
          type: "number",
          label: t("iconSize"),
          defaultValue: 50,
          min: 30,
          supportProcessor: true,
          processorCode: `
          // @param d 每个icon的数据
            return function (d) {
              // 默认返回锚点x偏移
              // 此处返回一个number类型的值
              return 128
            }`
        }
      },
      {
        section: "optionPanel.icon",
        option: "iconAnchorX",
        field: {
          type: "check",
          label: t("iconAnchorX"),
          options: [
            {
              key: "style.left",
              value: "end"
            },
            {
              key: "style.center",
              value: "middle"
            },

            {
              key: "style.right",
              value: "start"
            }
          ],
          defaultValue: "middle"
        }
      },

      {
        section: "optionPanel.icon",
        option: "iconAnchorY",
        field: {
          type: "check",
          label: t("iconAnchorY"),
          options: [
            {
              key: "style.top",
              value: "bottom"
            },
            {
              key: "style.center",
              value: "center"
            },
            {
              key: "style.bottom",
              value: "top"
            }
          ],
          defaultValue: "bottom"
        }
      },
      {
        section: "optionPanel.label",
        option: "showLabel",
        field: {
          type: "switch",
          label: t("showLabel"),
          defaultValue: false
        }
      },

      {
        section: "optionPanel.label",
        option: "labelSize",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "number",
          label: t("labelSize"),
          defaultValue: 16
        }
      },

      {
        section: "optionPanel.label",
        option: "labelColor",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "color",
          label: t("labelColor"),
          defaultValue: [255, 255, 255],
          isColorArrayForm: true
        },
        action(instance, labelColor) {
          instance.update({labelColor})
        }
      },

      {
        section: "optionPanel.label",
        option: "getTextAnchor",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "check",
          label: t("getTextAnchor"),
          options: [
            {
              key: "style.left",
              value: "end"
            },
            {
              key: "style.center",
              value: "middle"
            },

            {
              key: "style.right",
              value: "start"
            }
          ],
          defaultValue: "middle"
        }
      },

      {
        section: "optionPanel.label",
        option: "getAlignmentBaseline",
        when: {
          key: "showLabel",
          value: true
        },
        field: {
          type: "check",
          label: t("getAlignmentBaseline"),
          options: [
            {
              key: "style.top",
              value: "bottom"
            },
            {
              key: "style.center",
              value: "center"
            },
            {
              key: "style.bottom",
              value: "top"
            }
          ],
          defaultValue: "top"
        }
      },
      {
        section: t("interactive"),
        option: "tooltip",
        field: {
          type: "tooltip",
          label: t("tooltip"),
          defaultValue: {
            disabled: true,
            title: undefined,
            titleSize: 24,
            titleColor: "rgba(255,255,255,1)",

            fields: [],
            fieldsSize: 14,
            fieldsColor: "rgb(240,240,240)"
          }
        }
      },
      {
        section: t("interactive"),
        option: "tooltipEventType",
        when: {
          isShow: ({tooltip}) => {
            return !tooltip.disabled
          }
        },
        field: {
          type: "check",
          label: "style.eventType",
          defaultValue: "hover",
          options: [
            {
              key: "style.click",
              value: "click"
            },
            {
              key: "style.hover",
              value: "hover"
            }
          ]
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
        name: "icon",
        key: "url",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            name: "url",
            key: "url",
            type: "string"
          }
        ]
      },
      {
        name: "size",
        key: "size",
        type: ["number"],
        range: [1, 1],
        value: [
          {
            name: "size",
            key: "size",
            type: "number"
          }
        ]
      },
      {
        name: "标签",
        key: "label",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            name: "label",
            key: "label",
            type: "string"
          }
        ]
      }
    ]
  ]
})
