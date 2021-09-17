// import React, {useState, useRef, Children} from 'react'
// import {observer} from 'mobx-react-lite'
// import {useTranslation} from 'react-i18next'
// import c from 'classnames'
// import w from '@models'
// import Tab from '@components/tab'
// import Scroll from '@components/scroll'
// import Section from '@components/section'
// import Icon from '@components/icon'
// import IconButton from '@components/icon-button'
// import Grid from '@components/grid'
// import Modal from '@components/modal'
// import {TextField} from '@components/field'
// import config from '@utils/config'
// import DataToolbar from './data-toolbar'
// import DataThumbnail from './data-thumbnail'
// import s from './data-panel.module.styl'
// import Loading from '@components/loading'

// const DataFolders = observer(({dataPanel, folder, isTop}) => {
//     // TODO 多语言
//     // const {t} = useTranslation()
//     const {toolbar} = dataPanel
//     // const {datas_, folderName, section, env_ = {}} = folder
//     const {datas_, folderName, section} = folder

//     // const {session} = env_

//     return (
//       <Section
//         className="pl8 pr8 mt8"
//         childrenClassName="pt8"
//         icon={<MoreIcon dataPanel={dataPanel} folder={folder} isTop={isTop} />}
//         name={`${folderName} (${datas_.length})`}
//         props={section}
//         onFold={() => {
//           // session.set(section.sectionKey, fold)
//         }}
//       >
//         {datas_.length ? (
//           toolbar.showtype === 'grid-layout' ? (
//             <Grid column={toolbar.showtype === 'grid-layout' ? 4 : 1}>
//               {datas_.map((data) =>
//                 Children.toArray(
//                   <Grid.Item>
//                     <DataThumbnail
//                       folder={folder}
//                       data={data}
//                       // toolbar={toolbar}
//                       // isLast={index === datas_.length - 1}
//                       dataPanel={dataPanel}
//                     />
//                   </Grid.Item>
//                 )
//               )}
//             </Grid>
//           ) : (
//             datas_.map((data) =>
//               Children.toArray(
//                 <DataThumbnail
//                   data={data}
//                   dataPanel={dataPanel}
//                   // toolbar={toolbar}
//                   // isLast={index === datas_.length - 1}
//                   // index={index}
//                   folder={folder}
//                 />
//               )
//             )
//           )
//         ) : (
//           <div className={c('mb16 emptyNote')}>
//             <div>
//               列表还是空空的，点击
//               <span
//                 className="ctSecend hand"
//                 onClick={(e, button) => createMenu(e, button, dataPanel, folder, false, 'data')}
//               >
//                 新建
//               </span>
//             </div>
//           </div>
//         )}
//       </Section>
//     )
//   })

//   export default observer(DataFolders)
