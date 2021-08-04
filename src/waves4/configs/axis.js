import {createChildren, createOther} from "./create-config"

const lineConfig = {
  fillType: {
    defaultValue: "solid",
    disabledKey: ["gradient", "theme"]
  },
  fillSolidColor: {
    defaultValue: "rgb(255,255,255)"
  },
  fillOpacity: {
    defaultValue: 0,
    hasSlider: true,
    min: 0,
    max: 1,
    step: 0.01
  },
  strokeWidth: {
    defaultValue: 1,
    min: 0,
    step: 0.1
  },
  strokeType: {
    defaultValue: "solid",
    disabledKey: []
  },
  strokeSolidColor: {
    defaultValue: "rgb(255,255,255)"
  },
  strokeGradientColor: {
    defaultValue: ["rgb(74,144,226)", "rgb(80,227,194)"]
  },
  strokeOpacity: {
    defaultValue: 0.3,
    hasSlider: true,
    min: 0,
    max: 1,
    step: 0.01
  }
}

const textConfig = {
  fontFamily: {
    defaultValue: "Arial"
  },
  fontSize: {
    defaultValue: 8,
    min: 0,
    step: 0.1
  },
  fontWeight: {
    defaultValue: 200,
    min: 100,
    max: 900,
    step: 100
  },
  fillColor: {
    defaultValue: "rgb(255,255,255)"
  },
  fillOpacity: {
    defaultValue: 1,
    hasSlider: true,
    min: 0,
    max: 1,
    step: 0.01
  },
  useShadow: {
    defaultValue: false
  },
  shadowConfig: {
    defaultValue: [0, 0, 5]
  },
  shadowColor: {
    defaultValue: "rgb(0,0,0)"
  },
  shadowOpacity: {
    defaultValue: 1,
    hasSlider: true,
    min: 0,
    max: 1,
    step: 0.01
  },
  useFormat: {
    defaultValue: false
  },
  usePercentage: {
    defaultValue: false
  },
  useThousandth: {
    defaultValue: false
  },
  decimalPlace: {
    defaultValue: 2,
    min: 0,
    max: 8,
    step: 1
  },
  rotation: {
    defaultValue: 0,
    min: 0,
    max: 360,
    step: 1
  },
  writingMode: {
    defaultValue: "horizontal"
  },
  offset: {
    defaultValue: [0, 0]
  }
}

// 子图层的配置结构
const children = [
  {
    tabId: "graph",
    name: "X轴主轴刻度线",
    option: "lineX",
    graph: lineConfig,
    keyword: "linearX"
  },
  {
    tabId: "graph",
    name: "X轴副轴刻度线",
    option: "lineXT",
    graph: lineConfig,
    keyword: "linearX"
  },
  {
    tabId: "graph",
    name: "Y轴主轴刻度线",
    option: "lineY",
    graph: lineConfig,
    keyword: "linearY"
  },
  {
    tabId: "graph",
    name: "Y轴副轴刻度线",
    option: "lineYR",
    graph: lineConfig,
    keyword: "linearY"
  },
  {
    tabId: "graph",
    name: "角度轴刻度线",
    option: "lineAngle",
    graph: lineConfig,
    keyword: "polar"
  },
  {
    tabId: "graph",
    name: "半径轴刻度线",
    option: "lineRadius",
    graph: lineConfig,
    keyword: "polar"
  },
  {
    tabId: "text",
    name: "X轴主轴文本",
    option: "textX",
    text: textConfig,
    keyword: "linearX"
  },
  {
    tabId: "text",
    name: "X轴副轴文本",
    option: "textXT",
    text: textConfig,
    keyword: "linearX"
  },
  {
    tabId: "text",
    name: "Y轴主轴文本",
    option: "textY",
    text: textConfig,
    keyword: "linearY"
  },
  {
    tabId: "text",
    name: "Y轴副轴文本",
    option: "textYR",
    text: textConfig,
    keyword: "linearY"
  },
  {
    tabId: "text",
    name: "角度轴文本",
    option: "textAngle",
    text: textConfig,
    keyword: "polar"
  },
  {
    tabId: "text",
    name: "半径轴文本",
    option: "textRadius",
    text: textConfig,
    keyword: "polar"
  }
]

// 其他的配置属性
const other = {
  sections: ["optionPanel.basic", "style.label"],
  fields: [
    {
      section: "optionPanel.basic",
      option: "type",
      field: {
        type: "select",
        label: "wave.type",
        defaultValue: "cartesian",
        options: [
          {
            key: "wave.cartesian",
            value: "cartesian"
          },
          {
            key: "wave.polar",
            value: "polar"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "extendZero",
      field: {
        type: "switch",
        label: "wave.extendZero",
        defaultValue: false
      }
    },
    {
      section: "optionPanel.basic",
      option: "tickLineNumber",
      field: {
        type: "number",
        label: "wave.tickLineNumber",
        defaultValue: 5,
        min: 0
      }
    },
    {
      section: "optionPanel.basic",
      option: "paddingInner",
      field: {
        type: "number",
        label: "wave.paddingInner",
        defaultValue: 0.382,
        min: 0,
        max: 1,
        step: 0.01
      }
    },
    {
      section: "style.label",
      option: "labelOffset",
      field: {
        type: "number",
        label: "style.labelOffset",
        defaultValue: 5,
        min: 0
      }
    }
  ]
}

export default {
  children: (defaultValues, coordinate = "") => {
    return createChildren(
      children.filter(({keyword}) => coordinate.search(keyword) !== -1),
      defaultValues
    )
  },
  other: (defaultValues) => createOther(other, defaultValues)
}
