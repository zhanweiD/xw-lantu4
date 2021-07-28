/**
 * @author fenfen.wff
 * @description GIS地图属性配置从图层到图表到转化
 */

export const getBaseMapConfig = (options) => {
  const layers = options?.layers
  const baseMapLayer = layers?.find((layer) => layer.type === "basemap")
  return baseMapLayer?.other
}
