import {createConfigModelClass} from "@components/field"

const getAnimationConfig = (section) => [
  // 基础配置
  {
    section,
    option: `${section.split(".")[1]}Type`,
    field: {
      type: "select",
      label: "animation.type",
      defaultValue: "fade",
      options: [
        {
          key: "animation.fade",
          value: "fade"
        },
        {
          key: "animation.zoom",
          value: "zoom"
        },
        {
          key: "animation.scan",
          value: "scan"
        },
        {
          key: "animation.scroll",
          value: "scroll"
        },
        {
          key: "animation.breathe",
          value: "breathe"
        },
        {
          key: "animation.move",
          value: "move"
        },
        {
          key: "animation.erase",
          value: "erase"
        }
      ]
    }
  },
  {
    section,
    option: `${section.split(".")[1]}Duration`,
    field: {
      type: "number",
      label: "animation.duration",
      defaultValue: 2000,
      min: 0
    }
  },
  {
    section,
    option: `${section.split(".")[1]}Delay`,
    field: {
      type: "number",
      label: "animation.delay",
      defaultValue: 0,
      min: 0
    }
  },
  // 淡出淡出
  {
    section,
    option: `${section.split(".")[1]}.fade.mode`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "fade"
    },
    field: {
      type: "check",
      label: "wave.mode",
      defaultValue: "fadeIn",
      options: [
        {
          key: "animation.fadeIn",
          value: "fadeIn"
        },
        {
          key: "animation.fadeOut",
          value: "fadeOut"
        }
      ]
    }
  },
  // 缩放动画
  {
    section,
    option: `${section.split(".")[1]}.zoom.mode`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "zoom"
    },
    field: {
      type: "check",
      label: "wave.mode",
      defaultValue: "enlarge",
      options: [
        {
          key: "animation.enlarge",
          value: "enlarge"
        },
        {
          key: "animation.narrow",
          value: "narrow"
        }
      ]
    }
  },
  {
    section,
    option: `${section.split(".")[1]}.zoom.direction`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "zoom"
    },
    field: {
      type: "check",
      label: "style.direction",
      defaultValue: "both",
      options: [
        {
          key: "animation.both",
          value: "both"
        },
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
  // 扫光动画
  {
    section,
    option: `${section.split(".")[1]}.scan.direction`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scan"
    },
    field: {
      type: "check",
      label: "style.direction",
      defaultValue: "top",
      options: [
        {
          key: "style.top",
          value: "top"
        },
        {
          key: "style.bottom",
          value: "bottom"
        },
        {
          key: "style.left",
          value: "left"
        },
        {
          key: "style.right",
          value: "right"
        },
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
    section,
    option: `${section.split(".")[1]}.scan.scope`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scan"
    },
    field: {
      type: "check",
      label: "animation.scope",
      defaultValue: "both",
      options: [
        {
          key: "animation.both",
          value: "both"
        },
        {
          key: "graph.fill",
          value: "fill"
        },
        {
          key: "graph.stroke",
          value: "stroke"
        }
      ]
    }
  },
  {
    section,
    option: `${section.split(".")[1]}.scan.color`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scan"
    },
    field: {
      type: "color",
      label: "style.color",
      defaultValue: "rgb(255,255,255)"
    }
  },
  {
    section,
    option: `${section.split(".")[1]}.scan.opacity`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scan"
    },
    field: {
      type: "number",
      hasSlider: true,
      label: "style.opacity",
      defaultValue: 0.4,
      min: 0,
      max: 1,
      step: 0.01
    }
  },
  // 滚动动画
  {
    section,
    option: `${section.split(".")[1]}.scroll.offset`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scroll"
    },
    field: {
      type: "multiNumber",
      label: "style.offset",
      defaultValue: [0, 0],
      items: [
        {
          key: "style.horizontal"
        },
        {
          key: "style.vertical"
        }
      ]
    }
  },
  {
    section,
    option: `${section.split(".")[1]}.scroll.reverse`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "scroll"
    },
    field: {
      type: "switch",
      label: "animation.reverse",
      defaultValue: false
    }
  },
  // 移动动画
  {
    section,
    option: `${section.split(".")[1]}.move.position`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "move"
    },
    field: {
      type: "multiNumber",
      label: "style.position",
      defaultValue: [0, 0],
      items: [
        {
          key: "style.horizontal"
        },
        {
          key: "style.vertical"
        }
      ]
    }
  },
  // 擦除动画
  {
    section,
    option: `${section.split(".")[1]}.erase.direction`,
    when: {
      key: `${section.split(".")[1]}Type`,
      value: "erase"
    },
    field: {
      type: "check",
      label: "style.direction",
      defaultValue: "right",
      options: [
        {
          key: "style.top",
          value: "top"
        },
        {
          key: "style.bottom",
          value: "bottom"
        },
        {
          key: "style.left",
          value: "left"
        },
        {
          key: "style.right",
          value: "right"
        }
      ]
    }
  }
]

export const MAnimation = createConfigModelClass("MAnimation", {
  sections: [
    {
      section: "animation.enterAnimation",
      fields: [
        {
          type: "sectionConfig",
          option: "useEnterAnimation",
          defaultValue: true,
          icon: "checkbox"
        }
      ]
    },
    {
      section: "animation.loopAnimation",
      fields: [
        {
          type: "sectionConfig",
          option: "useLoopAnimation",
          defaultValue: false,
          icon: "checkbox"
        }
      ]
    },
    {
      section: "animation.updateAnimation",
      fields: [
        {
          type: "sectionConfig",
          option: "useUpdateAnimation",
          defaultValue: false,
          icon: "checkbox"
        }
      ]
    }
  ],
  fields: [
    ...getAnimationConfig("animation.enterAnimation"),
    ...getAnimationConfig("animation.loopAnimation"),
    {
      section: "animation.updateAnimation",
      option: "updateAnimationDuration",
      field: {
        type: "number",
        label: "animation.duration",
        defaultValue: 2000,
        min: 0
      }
    },
    {
      section: "animation.updateAnimation",
      option: "updateAnimationDelay",
      field: {
        type: "number",
        label: "animation.delay",
        defaultValue: 0,
        min: 0
      }
    }
  ]
})
