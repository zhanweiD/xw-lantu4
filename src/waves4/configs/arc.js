import {createChildren, createOther} from "./create-config"

// 子图层的配置结构
const children = [
  {
    tabId: "graph",
    name: "圆弧",
    option: "arc",
    animation: {
      enterAnimationType: {
        defaultValue: "zoom"
      }
    },
    graph: {
      fillType: {
        defaultValue: "theme",
        disabledKey: []
      },
      fillSolidColor: {
        defaultValue: "rgb(255,255,255)"
      },
      fillGradientColor: {
        defaultValue: ["rgb(74,144,226)", "rgb(80,227,194)"]
      },
      fillOpacity: {
        defaultValue: 1,
        hasSlider: true,
        min: 0,
        max: 1,
        step: 0.01
      },
      strokeWidth: {
        defaultValue: 0,
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
        defaultValue: 1,
        hasSlider: true,
        min: 0,
        max: 1,
        step: 0.01
      }
    }
  },
  {
    tabId: "text",
    name: "文本",
    option: "text",
    animation: {
      enterAnimationDelay: {
        defaultValue: 2000
      }
    },
    text: {
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
        defaultValue: "pie",
        options: [
          {
            key: "wave.pie",
            value: "pie"
          },
          {
            key: "wave.nightingaleRose",
            value: "nightingaleRose"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "mode",
      field: {
        type: "select",
        label: "wave.mode",
        defaultValue: "default",
        options: [
          {
            key: "wave.cover",
            value: "default"
          },
          {
            key: "wave.stack",
            value: "stack"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "innerRadius",
      field: {
        type: "number",
        label: "wave.innerRadius",
        defaultValue: 0
      }
    },
    {
      section: "style.label",
      option: "labelPosition",
      field: {
        type: "select",
        label: "style.position",
        defaultValue: "inner",
        options: [
          {
            key: "style.inner",
            value: "inner"
          },
          {
            key: "style.outer",
            value: "outer"
          }
        ]
      }
    },
    {
      section: "style.label",
      option: "labelOffset",
      field: {
        type: "number",
        label: "style.offset",
        defaultValue: 5
      }
    }
  ]
}

export default {
  children: (defaultValues) => createChildren(children, defaultValues),
  other: (defaultValues) => createOther(other, defaultValues)
}
