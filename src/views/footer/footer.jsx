import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import isDev from '@utils/is-dev'
import w from '@models'
import s from './footer.module.styl'

const Footer = () => {
  return (
    <footer className={c('fbh fbje', s.footer)}>
      {isDev && (
        <div
          className="hand ctw mr16 fbh fbac"
          onClick={() => {
            console.clear()
            const activeTab = w.editor.tabs.find((t) => t.id === w.editor.activeTabId)

            const {art} = activeTab || {}
            if (art) {
              if (art.viewport.selectRange) {
                if (art.viewport.selectRange.target === 'frame') {
                  const frame = art.viewport.selectRange.viewport_.frames.find(
                    (v) => v.frameId === art.viewport.selectRange.range[0].frameId
                  )
                  frame.dumpSchema()
                } else {
                  console.log('选中的不是画布')
                }
              } else {
                console.log('没有选中的画布')
              }
            }
          }}
        >
          Frame
        </div>
      )}
      {isDev && (
        <div
          className="hand ctw mr16 fbh fbac"
          onClick={() => {
            console.clear()
            const activeTab = w.editor.tabs.find((t) => t.id === w.editor.activeTabId)

            const {art} = activeTab || {}
            if (art) {
              if (art.viewport.selectRange) {
                if (art.viewport.selectRange.target === 'box') {
                  art.viewport.selectRange.boxes_.forEach((box) => {
                    box.dumpSchema()
                  })
                } else {
                  console.log('选中的不是容器')
                }
              } else {
                console.log('没有选中的容器')
              }
            }
          }}
        >
          Box
        </div>
      )}
      {isDev && (
        <div
          className="hand ctw mr16 fbh fbac"
          onClick={() => {
            console.clear()
            const activeTab = w.editor.tabs.find((t) => t.id === w.editor.activeTabId)

            const {art} = activeTab || {}
            if (art) {
              if (art.viewport.selectRange) {
                if (art.viewport.selectRange.target === 'box') {
                  art.viewport.selectRange.boxes_.forEach((box) => {
                    const exhibitModel = box.art_.exhibitManager.get(box.exhibit.id)
                    exhibitModel.dumpSchema()
                  })
                } else {
                  console.log('选中的不是组件')
                }
              } else {
                console.log('没有选中的组件')
              }
            }
          }}
        >
          Exhibit
        </div>
      )}
    </footer>
  )
}

export default observer(Footer)
