// 中文转 code 字符串 eg： "中文" => "2001325991"
export default function zhToCode(zhStr = '') {
  if (!zhStr) {
    return ''
  }
  return zhStr.split('').map(s => s.charCodeAt(0)).join('')
}
