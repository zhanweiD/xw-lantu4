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
  sections: [
    "optionPanel.basic",
    "style.label",
    {
      section: "graph.fixedWidth",
      fields: [
        {
          type: "sectionConfig",
          option: "useFixedWidth",
          defaultValue: false,
          icon: "checkbox"
        }
      ]
    },
    {
      section: "graph.fixedPaddingInner",
      fields: [
        {
          type: "sectionConfig",
          option: "useFixedPaddingInner",
          defaultValue: false,
          icon: "checkbox"
        }
      ]
    }
  ],
  fields: [
    {
      section: "optionPanel.basic",
      option: "type",
      field: {
        type: "select",
        label: "wave.type",
        defaultValue: "column",
        options: [
          {
            key: "wave.column",
            value: "column"
          },
          {
            key: "wave.bar",
            value: "bar"
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
        defaultValue: "group",
        options: [
          {
            key: "wave.cover",
            value: "default"
          },
          {
            key: "wave.group",
            value: "group"
          },
          {
            key: "wave.stack",
            value: "stack"
          },
          {
            key: "wave.waterfall",
            value: "waterfall"
          },
          {
            key: "wave.interval",
            value: "interval"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "paddingInner",
      field: {
        type: "number",
        label: "wave.paddingInner",
        defaultValue: 0,
        hasSlider: true,
        min: 0,
        max: 1,
        step: 0.1
      }
    },
    {
      section: "optionPanel.basic",
      option: "axis",
      field: {
        type: "check",
        label: "wave.axisBinding",
        defaultValue: "main",
        options: [
          {
            key: "wave.mainAxis",
            value: "main"
          },
          {
            key: "wave.minorAxis",
            value: "minor"
          }
        ]
      }
    },
    {
      section: "style.label",
      option: "labelPositionMax",
      field: {
        type: "select",
        label: "wave.maxValue",
        defaultValue: "center",
        options: [
          {
            key: "wave.center",
            value: "center"
          },
          {
            key: "wave.topInner",
            value: "top-inner"
          },
          {
            key: "wave.topOuter",
            value: "top-outer"
          },
          {
            key: "wave.rightInner",
            value: "right-inner"
          },
          {
            key: "wave.rightOuter",
            value: "right-outer"
          },
          {
            key: "wave.bottomInner",
            value: "bottom-inner"
          },
          {
            key: "wave.bottomOuter",
            value: "bottom-outer"
          },
          {
            key: "wave.leftInner",
            value: "left-inner"
          },
          {
            key: "wave.leftOuter",
            value: "left-outer"
          }
        ]
      }
    },
    {
      section: "style.label",
      option: "labelPositionMin",
      field: {
        type: "select",
        label: "wave.minValue",
        defaultValue: "center",
        options: [
          {
            key: "wave.center",
            value: "center"
          },
          {
            key: "wave.topInner",
            value: "top-inner"
          },
          {
            key: "wave.topOuter",
            value: "top-outer"
          },
          {
            key: "wave.rightInner",
            value: "right-inner"
          },
          {
            key: "wave.rightOuter",
            value: "right-outer"
          },
          {
            key: "wave.bottomInner",
            value: "bottom-inner"
          },
          {
            key: "wave.bottomOuter",
            value: "bottom-outer"
          },
          {
            key: "wave.leftInner",
            value: "left-inner"
          },
          {
            key: "wave.leftOuter",
            value: "left-outer"
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
    },
    {
      section: "graph.fixedWidth",
      option: "fixedBandWidth",
      field: {
        type: "number",
        label: "graph.width",
        defaultValue: 100
      }
    },
    {
      section: "graph.fixedPaddingInner",
      option: "fixedPaddingInner",
      field: {
        type: "number",
        label: "graph.paddingInner",
        defaultValue: 10
      }
    }
  ]
}

export default {
  children: (defaultValues) => createChildren(children, defaultValues),
  other: (defaultValues) => createOther(other, defaultValues)
}
