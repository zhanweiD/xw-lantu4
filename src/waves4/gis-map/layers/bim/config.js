/**
 * @author 白浅
 * @description GIS 三维实景层的配置项
 */

// 根据这个配置生成组件的模型
export const bimLayerConfig = (t) => ({
  type: "bim",
  key: "bim",
  name: "三维实景层",
  other: {
    sections: ["optionPanel.bim"],
    fields: [
      {
        section: "optionPanel.bim",
        option: "tileUrl",
        field: {
          type: "text",
          label: t("tileUrl"),
          defaultValue:
            "https://yfcctv.wasu.cn/shidian-mapdata/whiteModel/lvchengxixiguoji/tileset.json"
        }
      },
      {
        section: "optionPanel.bim",
        option: "tileType",
        field: {
          type: "check",
          label: t("tileType"),
          options: [
            {
              key: "i3s",
              value: "i3s"
            },
            {
              key: "cesium",
              value: "cesium"
            },
            {
              key: "tile3d",
              value: "tile3d"
            }
          ],
          defaultValue: "tile3d"
        }
      }
    ]
  }
})
