import chroma from 'chroma-js'

/** 颜色比例尺
 * @param v 渐变色数组 [['rgba(74,144,226,1)', 0],['rgba(80,227,194,1)', 1]]
 * @param n getColor所需颜色数量
 */
export const chromaScale = (v, n) => {
  const colors = v.map((o) => o[0])
  const domain = v.map((o) => o[1])
  const scaleMap = {}
  Array.from({length: n}, (x, i) => i).forEach((x) => {
    const {_rgb} = chroma.scale(colors).domain(domain)(x / (n > 1 ? n - 1 : 1))
    scaleMap[x] = `rgba(${_rgb[0]}, ${_rgb[1]}, ${_rgb[2]}, ${_rgb[3]})`
  })
  return Object.values(scaleMap)
}
