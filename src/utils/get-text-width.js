// 利用canvas计算文本宽度
const ctx = document.createElement("canvas").getContext("2d")

/**
 * 获取文字宽度
 * @param {string} text
 * @param {number} size
 * @returns {number}
 */

const STYLE = {
  FONT_FAMILY:
    "'PingFang SC', 'Helvetica Neue', Helvetica, Tahoma, Helvetica, sans-serif"
}

export default function getTextWidth(text, size) {
  ctx.font = `${size}px ${STYLE.FONT_FAMILY}`
  return ctx.measureText(text).width
}
