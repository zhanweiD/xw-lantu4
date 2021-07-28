/**
 * @author 白浅
 * @description GIS 底图层配置
 */

export const baseMapConfig = (t) => ({
  sections: ["optionPanel.basic", t("childrenLayers")],
  fields: [
    {
      section: "optionPanel.basic",
      option: "theme",
      field: {
        type: "select",
        label: t("theme"),
        defaultValue: "blueStyle",
        // TODO 底图的颜色需要视觉重新看一下
        options: [
          {
            key: t("blueStyle"),
            value: "blueStyle"
          },
          {
            key: t("darkStyle"),
            value: "darkStyle"
          },
          {
            key: t("darkBlueStyle"),
            value: "darkBlueStyle"
          },
          {
            key: t("mapbox"),
            value: "mapboxStyle"
          },
          {
            key: t("wtms"),
            value: "wtms"
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "zoomRange",
      field: {
        type: "multiNumber",
        label: t("zoomRange"),
        defaultValue: [3, 18],
        items: [
          {
            key: t("min"),
            step: 1
          },
          {
            key: t("max"), // i18n
            step: 1
          }
        ]
      },
      // TODO 暂时这么使用，等丛鱼添加专门的fields之间的联动操作
      when: (parent) => {
        // 调整缩放范围时，实际显示范围要实时修正
        const zoomRange = parent.zoomRange?.value
        const minZoom = zoomRange[0]
        const maxZoom = zoomRange[1]
        const lng = parent.origin?.value[0]
        const lat = parent.origin?.value[1]
        const zoom = parent.origin?.value[2]
        if (zoom < minZoom) {
          parent.set("origin", [lng, lat, minZoom])
        }
        if (zoom > maxZoom) {
          parent.set("origin", [lng, lat, maxZoom])
        }
        return true
      }
    },
    {
      section: "optionPanel.basic",
      option: "pitchRange",
      field: {
        type: "multiNumber",
        label: t("pitchRange"),
        defaultValue: [0, 60],
        items: [
          {
            key: t("min"),
            step: 1,
            min: 0
          },
          {
            key: t("max"),
            step: 1,
            max: 85
          }
        ]
      },
      when: (parent) => {
        // 调整范围时，实际显示范围要实时修正
        const pitchRange = parent.pitchRange?.value
        const minPitch = pitchRange[0]
        const maxPitch = pitchRange[1]
        const pitch = parent.viewport?.value[0]
        const bearing = parent.viewport?.value[1]
        if (pitch < minPitch) {
          parent.set("viewport", [minPitch, bearing])
        }
        if (pitch > maxPitch) {
          parent.set("viewport", [maxPitch, bearing])
        }
        return true
      }
    },
    {
      section: "optionPanel.basic",
      option: "origin",
      field: {
        type: "multiNumber",
        label: t("origin"),
        defaultValue: [120.14857128194079, 30.251288234866852, 8],
        // defaultValue: [-73.97, 40.68, 11],
        items: [
          {
            key: t("longitude"),
            step: 0.1,
            min: -180,
            max: 180
          },
          {
            key: t("latitude"),
            step: 0.1,
            min: -90,
            max: 90
          },
          {
            key: t("zoom"),
            step: 1,
            min: 0,
            max: 22
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "viewport",
      field: {
        type: "multiNumber",
        label: t("viewport"),
        defaultValue: [0, 0],

        items: [
          {
            key: t("pitch"),
            step: 1
          },
          {
            key: t("bearing"),
            step: 1
          }
        ]
      }
    },
    {
      section: "optionPanel.basic",
      option: "viewFixed",
      field: {
        type: "switch",
        label: t("viewFixed"),
        defaultValue: false
      }
    }
  ]
})
