const exhibit = {
  layers: [
    {
      key: "bubble-layer",
      name: "气泡层",
      data: {
        type: "private"
        // defaultValue: [],
      },
      styles: [
        {
          label: "label",
          option: "label",
          sectionConfig: [
            {
              option: "isVisible",
              field: {
                type: "sectionConfig",
                icon: "eyes",
                defaultValue: true
              }
            }
          ],
          fields: [
            {
              option: "field",
              subscribe: {
                action: (value) => {
                  console.log(value)
                }
              },
              field: {
                type: "select"
              }
            },
            {
              option: "fontSize",
              field: {
                type: "text",
                step: 1,
                defaultValue: 10
              }
            },
            {
              option: "color",
              field: {
                type: "color",
                link: (config, self) => {
                  config.reverse.on("change", (v) => {
                    self.xxxReverseColor(v)
                  })
                }
              }
            },
            {
              option: "reverse",
              field: {
                type: "switch"
              }
            }
          ]
        }
      ]
    }
  ]
}
