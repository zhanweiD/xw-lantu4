import {types, getParent} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import {reaction} from 'mobx'
import isDef from '@utils/is-def'
import {commonFieldModelViews} from './base'

export const MGradientColorField = types
  .model('MGradientColorField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['gradientColor']),
    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.optional(types.frozen(), {
      gradientColorType: 'linear',
      gradientColorList: [{color: 'rgb(0, 119, 255)'}, {color: 'rgb(80, 227, 194)'}],
    }),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
  })
  .views((self) => commonFieldModelViews(self))
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
        const {gradientColorList = []} = self.value
        const copyList = JSON.parse(JSON.stringify(gradientColorList))
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
          gradientColorType: 'linear',
          gradientColorList: [],
        }
        if (Array.isArray(self.value[0])) {
          self.value.forEach((item, index) => {
            const [color, scale] = item
            gradientValue.gradientColorList.push({
              key: `g${index}`,
              color,
              position: scale,
            })
          })
        } else {
          self.value.forEach((color, index) => {
            gradientValue.gradientColorList.push({
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
        const {gradientColorType, gradientColorList} = self.colorObjectForm
        const gradientColorOption = gradientColorType === 'linear' ? '90deg,' : ''
        const copyList = JSON.parse(JSON.stringify(gradientColorList))
        let colorList = ''

        if (gradientColorList.length === 2 && !gradientColorList[0].key) {
          return `${gradientColorType}-gradient(${gradientColorOption} ${gradientColorList[0].color} 0%, ${gradientColorList[1].color} 100%)`
        }
        copyList.sort((a, b) => a.position - b.position)
        copyList.forEach((item, index) => {
          colorList += `${item.color} ${item.position * 100}%${index === copyList.length - 1 ? '' : ','}`
        })
        return `${gradientColorType}-gradient(${gradientColorOption} ${colorList})`
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
      reaction(
        () => {
          return {
            value: self.value,
            when: self.when,
          }
        },
        () => {
          getParent(self).update(self.fieldOption)
        },
        {
          // fireImmediately: true,
          delay: 300,
        }
      )
    }

    const setValue = (value) => {
      self.value = value
    }

    const clearValue = () => {
      self.value = ''
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值
      // 返回颜色数组
      return self.whenIsSatisfied ? self.colorArrayForm : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue,
    }
  })
