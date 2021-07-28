/**
 * @author 白浅
 * @description GIS 散点气泡层的配置项
 */
import {DEFAULT_DATA} from "./data"

// 根据这个配置生成组件的模型
export const scatterLayerConfig = (t) => ({
  type: "scatter",
  key: "scatter",
  name: "散点气泡层",
  defaultData: DEFAULT_DATA,
  other: {
    sections: ["optionPanel.scatter", "optionPanel.label"],
    fields: [
      {
        section: "optionPanel.scatter",
        option: "scatterSize",
        field: {
          type: "number",
          label: t("scatterSize"),
          defaultValue: 10,
          min: 1,
          supportProcessor: true,
          tip: "有高度时，大小保持一致",
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
        section: "optionPanel.scatter",
        option: "scatterColor",
        field: {
          type: "color",
          label: t("scatterColor"),
          defaultValue: [219, 152, 80],
          isColorArrayForm: true,
          opacityMax: 255,
          supportProcessor: true,
          processorCode: `
          // @param d 每一条数据
          return function (d) {
            // 默认返回颜色
            return [255,255,255]
          }`
        }
      },

      {
        section: "optionPanel.scatter",
        option: "scatterHeight",
        field: {
          type: "number",
          label: t("scatterHeight"),
          defaultValue: 0,
          min: 0,
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
      // 暂时只开放像素
      // {
      //   section: 'optionPanel.scatter',
      //   option: 'scatterUnits',
      //   field: {
      //     type: 'check',
      //     label: t('scatterUnits'),
      //     defaultValue: 'pixels',
      //     options: [
      //       {
      //         key: '像素',
      //         value: 'pixels',
      //       },
      //       {
      //         key: '米',
      //         value: 'meters',
      //       },
      //     ],
      //   },
      // },
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
            name: "经度",
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
            name: "纬度",
            key: "latitude",
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
