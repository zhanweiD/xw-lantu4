import {types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'

import isDef from '@utils/is-def'

export const MGradientField = types
  .model('MGradientField', {
    type: types.enumeration(['gradient']),
    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.optional(types.frozen(), {
      gradientList: [{color: 'rgb(0, 119, 255)'}, {color: 'rgb(80, 227, 194)'}],
    }),
  })

  .views((self) => ({
    // 渐变颜色数组格式转换
    get colorArrayForm() {
      if (Array.isArray(self.value)) {
        if (Array.isArray(self.value[0])) {
          return self.value
        }
        return [...Array.from(self.value, (color, i) => [color, i / (self.value.length - 1)])]
      }
      if (self.value) {
        const {gradientList = []} = self.value
        const copyList = JSON.parse(JSON.stringify(gradientList))
        copyList.sort((a, b) => a.position - b.position)
        return [...copyList.map(({color, position}) => [color, position])]
      }
      return [
        ['rgb(0, 0, 0)', 0],
        ['rgb(0, 0, 0)', 1],
      ]
    },
    // 渐变颜色对象格式转换
    get colorObjectForm() {
      if (Array.isArray(self.value)) {
        const gradientValue = {
          gradientList: [],
        }
        if (Array.isArray(self.value[0])) {
          self.value.forEach((item, index) => {
            const [color, scale] = item
            gradientValue.gradientList.push({
              key: `g${index}`,
              color,
              position: scale,
            })
          })
        } else {
          self.value.forEach((color, index) => {
            gradientValue.gradientList.push({
              key: `g${index}`,
              color,
              position: index / (self.value.length - 1),
            })
          })
        }
        return gradientValue
      }
      return self.value
    },
    // 背景色
    get gradientColor() {
      if (self.value) {
        const {gradientList} = self.colorObjectForm

        const copyList = JSON.parse(JSON.stringify(gradientList))
        let colorList = ''

        if (gradientList.length === 2 && !gradientList[0].key) {
          return `linear-gradient(90deg, ${gradientList[0].color} 0%, ${gradientList[1].color} 100%)`
        }
        copyList.sort((a, b) => a.position - b.position)
        copyList.forEach((item, index) => {
          colorList += `${item.color} ${item.position * 100}%${index === copyList.length - 1 ? '' : ','}`
        })
        return `linear-gradient(90deg, ${colorList})`
      }
      return 'rgb(0, 0, 0)'
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }

    const setValue = (value) => {
      self.value = value
    }

    const getValue = () => {
      return self.colorArrayForm
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
