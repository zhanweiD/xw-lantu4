// import {types, getParent} from "mobx-state-tree"
import {types} from 'mobx-state-tree'
import {createConfigModelClass} from '@components/field'

// const defaultDataFieldCode = `[{
//   key: 'key1', // 数据的原始字段
//   name: '字段1', // 数据别名
//   type: 'String', // 数据类型
// }]`

export const MDataField = createConfigModelClass('MDataField', {
  id: types.identifier,
  sections: [],
  fields: [],
  // sections: ["dataPanel.dataField"],
  // fields: [
  //   {
  //     section: "dataPanel.dataField",
  //     option: "dataFieldCode",
  //     field: {
  //       type: "code",
  //       readOnly: false,
  //       height: 300,
  //       value: defaultDataFieldCode,
  //       buttons: [
  //         {
  //           name: "更新",
  //           position: "left",
  //           action: (self) => {
  //             const parent = getParent(self, 1)
  //             parent.updateDataField()
  //           }
  //         }
  //       ]
  //     }
  //   },
  //   // {
  //   //   section: 'dataPanel.dataField',
  //   //   option: 'uselessDataField',
  //   //   field: {
  //   //     label: '无用的数据字段',
  //   //     type: 'selectFilter',
  //   //     options: [],
  //   //     readOnly: true,
  //   //     height: 300,
  //   //     value: [],
  //   //   },
  //   // },
  //   {
  //     section: "dataPanel.dataField",
  //     option: "dataField",
  //     field: {
  //       type: "selectFilter",
  //       options: [],
  //       readOnly: true,
  //       height: 300,
  //       value: []
  //     }
  //   }
  // ]
})
