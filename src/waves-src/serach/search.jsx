// import React from 'react'
// import {types} from 'mobx-state-tree'
// import {MUIBase} from '../ui-base'
// import Icon from '../../components/icon'
// import s from './search.module.styl'
// import c from 'classnames'

// const MSearch = MUIBase.named('MSearch')
// .props({
//     text: types.maybe(types.string),
//   })
//   .actions(self => {
//     const afterCreate = () => {
//       self.key = 'Search'
//     }

//     // 无数据或数据错误时，采用备用数据渲染
//   const drawFallback = () => {
//     self.draw({redraw: false})
//   }

//   // 和图表的方法保持一致
//   const draw = ({redraw}) => {
//     if (redraw === true) {
//       self.removeNode(self.container?.parentNode)
//     }

//     const style = {
//         height: self.config('height'),
//         width: self.config('width'),
//         color: self.config('fontColor'),
//         fontSize: self.config('fontSize'),
//         backgroundColor: self.config('backgroundColor'),
//     };

//     const iconStyle = {
//         width: self.config('iconWidth'),
//         size: self.config('iconSize'),
//         backgroundColor: self.config('iconBackgroundColor'),
//       }

//     // 自适应容器
//     if (self.config('adaptContainer')) {
//         Object.assign(style, {
//           width: self.containerWidth,
//           height: self.containerHeight,
//         })
//       }

//       // 渲染组件
//     self.render(
//         <div>
//           <div className={c('w100p', s.container)} style={style}>
//             <input
//               className={s.input}
//               value={self.text}
//               onChange={self.onChange}
//               placeholder={self.config('placeholder')}
//               // style={{...style, backgroundColor: 'none', padding: `0 ${style.fontSize}px`}}
//               style ={style}
//             />
//             <div onClick={self.onSearch} className={s.icon} style={{...iconStyle, cursor: 'pointer'}}>
//               <Icon name="search" fill={style.color} size={iconStyle.size} />
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // 改变 input 内容
//   const onChange = e => {
//     self.text = e.target.value
//   }

//   // 当搜索按钮被点击
//   const onSearch = () => {
//     self.event.fire('onClickSearchButton', {data: self.text})
//   }

//   return {
//     draw,
//     onChange,
//     onSearch,
//     drawFallback,
//     afterCreate,
//   }
// })

// export default MSearch
