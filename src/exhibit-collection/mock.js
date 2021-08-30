/* addLayer: () => {

} */
/* addConfig: () => {

} */

const getLayersConfig = () => {
  return [
    {
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
              link: (target, self) => {
                target.event.on("change", (v) => {
                  self.setOptions(v)
                })
              }
            },
            {
              type: "data-map",
              label: "纬度",
              option: "lan",
              link: (target, self) => {
                target.event.on("change", (v) => {
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
              link: (target, self) => {
                target.event.on("change", (v) => {
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
        }
      ]
    }
  ]
}
const config = () => ({
  key: "gis-map",
  name: k("gis-map"),
  layout: () => [16, 16],
  getLayerConfig: () => getLayersConfig(),
  configs: []
})
