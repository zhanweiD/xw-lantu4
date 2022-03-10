import ClipboardJS from 'clipboard'

// 复制到粘贴板
const copy = (v) => {
  const div = document.createElement('div')
  console.log(ClipboardJS)
  const copyLink = new ClipboardJS(div, {text: () => v})
  copyLink.on('success', () => console.log('复制成功'))
  div.click()
}

export default copy
