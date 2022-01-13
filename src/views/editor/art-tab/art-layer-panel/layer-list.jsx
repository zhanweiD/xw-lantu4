import {observer} from 'mobx-react-lite'
import React from 'react'
// import React, {useRef} from 'react'
// import c from 'classnames'
// import IconButton from '@components/icon-button'
// import Section from '@builders/section'
// import Upload from '@components/upload'
import {DragSource} from '@components/drag-and-drop'
// import w from '@models'
import LayerListItem from './layer-list-item'
// import s from './layer-list.module.styl'

// 成组后双击菜单
// const MoreIcon = ({project, isTop, isRecent}) => {
//   const uploadRef = useRef(null)
//   const menu = w.overlayManager.get('menu')
//   const onUpload = (files) => project.importArt(files, project.projectId)
//   const onClickMore = (e, button) => {
//     e.stopPropagation()
//     menu.toggle({
//       attachTo: button,
//       list: [
//         {name: '新建数据屏', action: () => (project.createArt(), menu.hide())},
//         {name: '导入数据屏', action: () => (uploadRef.current.click(), menu.hide())},
//         {name: '项目详情', action: () => (project.editProject(), menu.hide())},
//         {
//           name: !isRecent && (isTop ? '取消置顶项目' : '置顶项目'),
//           action: () => (project.projectPanel_.toggleProjectTop(project, !isTop), menu.hide()),
//         },
//       ],
//     })
//   }
//   return (
//     <div className="pr oh">
//       {isTop && <div className={s.delta} />}
//       <Upload accept=".json" multiple={false} onOk={onUpload}>
//         <div ref={uploadRef} />
//       </Upload>
//       <IconButton icon="more" iconSize={14} buttonSize={24} onClick={onClickMore} />
//     </div>
//   )
// }

// 项目列表
export default observer(({layer, index, other}) => {
  const {boxId} = layer
  return (
    <div key={boxId}>
      <DragSource
        key={boxId}
        onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
        dragKey="CREATE_ART_DRAG_KEY"
        data={layer}
      >
        <LayerListItem layer={layer} index={index} {...other} />
      </DragSource>
    </div>
    // 下拉框分组会用到
    //   <Section
    //   key={boxId}
    //   sessionId={`SKLayer-${boxId}`}
    //   name={name}
    //   childrenClassName="pt8 pb8"
    //   // extra={icon}
    // >
    //   <div key={boxId} className={c('ml8 mr8 mb4')}>
    //     <DragSource
    //       key={boxId}
    //       onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
    //       dragKey="CREATE_ART_DRAG_KEY"
    //       data={layer}
    //     >
    //       <LayerListItem layer={layer} index={index} {...other} />
    //     </DragSource>
    //   </div>
    // </Section>
  )
})
