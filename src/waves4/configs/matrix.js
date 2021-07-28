import {createChildren, createOther} from "./create-config"

// 子图层的配置结构
const children = [
  {
    tabId: "graph",
    name: "矩形",
    option: "rect",
    animation: {
      enterAnimationType: {
        defaultValue: "zoom"
      },
      loopAnimationType: {
        defaultValue: "scan"
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
    tabId: "graph",
    name: "圆形",
    option: "circle",
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
  sections: ["optionPanel.basic", "style.circle"],
  fields: [
    {
      section: "optionPanel.basic",
      option: "shape",
      field: {
        type: "select",
        label: "wave.shape",
        defaultValue: "rect",
        options: [
          {
            key: "wave.rect",
            value: "rect"
          },
          {
            key: "wave.circle",
            value: "circle"
          }
        ]
      }
    },
    {
      section: "style.circle",
      option: "circleSize",
      field: {
        type: "multiNumber",
        label: "style.size",
        defaultValue: [-1, -1],
        items: [
          {
            key: "style.min"
          },
          {
            key: "style.max"
          }
        ]
      }
    }
  ]
}

export default {
  children: (defaultValues) => createChildren(children, defaultValues),
  other: (defaultValues) => createOther(other, defaultValues)
}
