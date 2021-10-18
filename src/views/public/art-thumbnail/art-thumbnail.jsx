import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import Icon from '@components/icon'
import {DragSource, DropTarget} from '@components/drag-and-drop'
import w from '@models'
import s from './art-thumbnail.module.styl'
import thumbnailFallback from './empty.png'

const Sortable = observer(({art, index, project, children, enable}) => {
  return enable ? (
    <DragSource
      key={art.artId}
      onEnd={(dropResult, data) => dropResult.changeSort(data)}
      dragKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
      data={{art, index}}
    >
      <DropTarget
        hideOutLine
        acceptKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
        data={{changeSort: project?.saveArtSort}}
        hover={(item) => {
          // 需要重新赋值index，否则会出现无限交换情况
          if (item.index !== index) {
            project.moveArtSort(item.index, index)
            item.index = index
          }
        }}
      >
        {children}
      </DropTarget>
    </DragSource>
  ) : (
    children
  )
})

const ArtThumbnail = ({project, art, index, useButtons = true, isTemplate = false}) => {
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {isThumbnailVisible} = projectPanel
  const thumbnail = art.thumbnail || thumbnailFallback
  const menu = w.overlayManager.get('menu')
  const list = [
    {name: '编辑', action: () => (art.editArt(), menu.hide())},
    {name: '预览', action: () => (art.previewArt(), menu.hide())},
    !isTemplate && {name: '保存为模板', action: () => (art.saveAsTemplate(), menu.hide())},
    {name: '更新缩略图', action: () => (art.updateThumbnail(), menu.hide())},
    !isTemplate && {name: '复制', action: () => (art.copyArt(), menu.hide())},
    !isTemplate && {name: '导出', action: () => (art.exportArt(), menu.hide())},
    {name: '删除', action: () => (art.removeArt(), menu.hide())},
  ].filter(Boolean)

  return (
    <Sortable art={art} index={index} project={project} enable={!isThumbnailVisible}>
      <div
        className={c('w100p', s.art)}
        onContextMenu={(e) => (e.preventDefault(), e.stopPropagation(), menu.show({list}))}
        onDoubleClick={art.editArt}
      >
        {isThumbnailVisible && (
          <div
            className={c(s.thumbnailContainer)}
            style={{
              backgroundImage: `url(${thumbnail})`,
            }}
          />
        )}
        <div className="fbh fbac">
          <div className={c('fb1 omit ctw60 fbh fbac fs12 lh24 pl4', art.isActive_ && s.activeArt)}>
            {!isThumbnailVisible && <Icon fill="#fff5" name="drag" size={10} />}
            <div title={art.name} className="omit hand">
              {art.name}
            </div>
          </div>
          {useButtons && (
            <div className={c('fbh')}>
              {art.isOnline && (
                <IconButton
                  buttonSize={24}
                  className={s.toolIconHighlight}
                  icon="publish"
                  iconFill="#7BD100"
                  title="已发布"
                  onClick={art.previewPublishArt}
                />
              )}
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="preview"
                title="预览"
                onClick={art.previewArt}
              />
            </div>
          )}
        </div>
      </div>
    </Sortable>
  )
}

export default observer(ArtThumbnail)
