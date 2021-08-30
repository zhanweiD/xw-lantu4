/* addLayer: () => {

} */
/* addConfig: () => {

} */

const getLayersConfig = () => {
  const map = new Map()
  const config = {
    key: "bubble-layer",
    name: "气泡层",
    icons: [
      {
        icon: "eyes"
      },
      {
        icon: "more"
        // type: ''
      }
    ],
    configs: [
      {
        option: "data",
        field: {
          type: "data"
        }
      },
      {
        label: "位置",
        option: "position",
        fields: [
          {
            type: "data-map",
            label: "经度",
            option: "lat",
            link: (root, self) => {
              root.data.event.on("change", (v) => {
                self.setOptions(v)
              })
            }
          },
          {
            type: "data-map",
            label: "纬度",
            option: "lan",
            link: (root, self) => {
              root.data.event.on("change", (v) => {
                self.setOptions(v)
              })
            }
          }
        ]
      },
      {
        label: "标签",
        option: "label",
        canSetVisible: true,
        icons: [
          {
            icon: "eyes",
            option: "isVisible"
          }
        ],
        fields: [
          {
            label: "字段",
            type: "data-map",
            option: "field",
            link: (root, self) => {
              root.data.event.on("change", (v) => {
                self.setOptions(v)
              })
            }
          },
          {
            label: "字号",
            type: "number",
            option: "fontSize",
            step: 1,
            min: 12
          },
          {
            label: "颜色",
            type: "color",
            option: "color"
          },
          {
            label: "透明度",
            option: "opacity",
            step: 0.01,
            min: 0,
            max: 1,
            defaultValue: 1
          },
          {
            label: "偏移",
            option: "offset",
            type: "multiNumber",
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
        ]
      },
      {
        label: "填充",
        option: "fill",
        canSetVisible: true,
        icons: [
          {
            icon: "eyes",
            option: "isVisible"
          }
        ],
        fields: [
          {
            label: "字段",
            option: "field",
            type: "filter",
            link: (root, self) => {
              root.data.event.on("change", (v) => {
                self.setOptions(v)
              })
            }
          },
          {
            label: "颜色",
            option: "color",
            type: "colorField",
            link: (root, self) => {
              root.fill.field.event.on("change", (v) => {
                self.setOptions(v)
              })
              root.fill.reverse.event.on("change", (v) => {
                self.setReverse(v)
              })
              root.fill.count.event.on("change", (v) => {
                self.setCount(v)
              })
            }
          },
          {
            label: "反转",
            option: "reverse",
            type: "switch",
            defaultValue: false
          },
          {
            label: "数量",
            option: "count",
            type: "number",
            step: 1,
            min: 0,
            defaultValue: 6
          }
        ]
      }
    ]
  }
  map.set("bubble-layer", config)
  return map
}
const config = () => ({
  key: "gis-map",
  name: k("gis-map"),
  layout: () => [16, 16],
  getLayerConfig: () => getLayersConfig(),
  configs: []
})
