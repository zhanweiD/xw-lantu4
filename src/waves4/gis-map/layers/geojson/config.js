/**
 * @author 白浅
 * @description GIS 飞多边形填充层的配置项
 */

import {DEFAULT_DATA} from "./data"

// 根据这个配置生成组件的模型
export const geoJsonLayerConfig = (t) => ({
  type: "geojson",
  key: "geojson",
  name: "多边形填充层",
  defaultData: DEFAULT_DATA,
  other: {
    sections: ["optionPanel.geojson", "optionPanel.label"],
    fields: [
      {
        section: "optionPanel.geojson",
        option: "data",
        field: {
          type: "text",
          label: t("geojsonURL"),
          defaultValue:
            "http://cdn.dtwave.com/waveview/geojson/100000_full.json"
        }
      },
      {
        section: "optionPanel.geojson",
        option: "filled",
        field: {
          type: "switch",
          label: t("filled"),
          defaultValue: true
        }
      },
      {
        section: "optionPanel.geojson",
        option: "filledColor",
        when: {
          key: "filled",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("filledColor"),
          defaultValue: [89, 97, 241],
          isFixed: false,
          opacityMax: 255,
          supportProcessor: true,
          processorCode: `
          // @param d 每一条数据
          return function (d) { 
            const childrenNum = d.properties?.childrenNum; 
            return [childrenNum*10, 200, 0]; 
          }`
        }
      },
      {
        section: "optionPanel.geojson",
        option: "stroked",
        field: {
          type: "switch",
          label: t("stroked"),
          defaultValue: true
        }
      },
      {
        section: "optionPanel.geojson",
        option: "strokedLineColor",
        when: {
          key: "stroked",
          value: true
        },
        field: {
          type: "color",
          isColorArrayForm: true,
          label: t("strokedLineColor"),
          defaultValue: [255, 255, 255],
          isFixed: false
        }
      },

      {
        section: "optionPanel.geojson",
        option: "strokedLineWidth",
        when: {
          key: "stroked",
          value: true
        },
        field: {
          tip: "粗细只在2D下生效",
          type: "number",
          label: t("strokedLineWidth"),
          defaultValue: 1,
          min: 0,
          max: 4
        }
      },

      {
        section: "optionPanel.geojson",
        option: "extruded",
        field: {
          type: "switch",
          label: t("isExtruded"),
          defaultValue: false
        }
      },
      {
        section: "optionPanel.geojson",
        option: "extrudedHeight",
        when: {
          key: "extruded",
          value: true
        },
        field: {
          type: "number",
          label: t("extrudedHeight"),
          defaultValue: 40,
          min: 0,
          supportProcessor: true,
          processorCode: `
          // @param d 每一条数据
          return function (d) { 
            const childrenNum = d.properties?.childrenNum; 
            return childrenNum*10; 
          }`
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
        name: "标签",
        key: "label",
        type: ["string"],
        range: [0, 1],
        value: [
          {
            // name: '热力',
            key: "label",
            type: "string"
          }
        ]
      }
    ]
  ]
})
