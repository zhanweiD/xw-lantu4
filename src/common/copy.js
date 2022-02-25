import * as Clipboard from 'clipboard'

// 复制到粘贴板
const copy = v => {
  const div = document.createElement('div')
  const copyLink = new Clipboard(div, {text: () => v})
  copyLink.on('success', () => console.log('复制成功'))
  div.click()
}

export default copy
