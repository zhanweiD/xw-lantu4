import {createChildren, createOther} from "./create-config"

// 子图层的配置结构
const children = [
  {
    tabId: "graph",
    name: "圆点",
    option: "circle",
    graph: {
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
    text: {
      fontFamily: {
        defaultValue: "Arial"
      },
      fontSize: {
        defaultValue: 10,
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
  sections: ["optionPanel.basic"],
  fields: [
    {
      section: "optionPanel.basic",
      option: "circleSize",
      field: {
        type: "number",
        label: "legend.size",
        defaultValue: 10,
        min: 0
      }
    },
    {
      section: "optionPanel.basic",
      option: "alignment",
      field: {
        type: "alignment",
        label: "legend.align",
        defaultValue: "right-top"
      }
    },
    {
      section: "optionPanel.basic",
      option: "direction",
      field: {
        type: "check",
        label: "style.direction",
        defaultValue: "horizontal",
        options: [
          {
            key: "style.horizontal",
            value: "horizontal"
          },
          {
            key: "style.vertical",
            value: "vertical"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "gap",
      field: {
        type: "multiNumber",
        label: "legend.gap",
        defaultValue: [0, 5],
        items: [
          {
            key: "legend.padding"
          },
          {
            key: "legend.margin"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "offset",
      field: {
        type: "multiNumber",
        label: "legend.offset",
        defaultValue: [0, 0],
        items: [
          {
            key: "X"
          },
          {
            key: "Y"
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
