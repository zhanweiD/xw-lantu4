import {destroy, isMapType, getType} from 'mobx-state-tree'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import isFunction from 'lodash/isFunction'
import isArray from 'lodash/isArray'
import isDef from '@utils/is-def'
import createLog from '@utils/create-log'

const log = createLog('@utils/common-action')

export const getModelSchema = (node, option = {}) => {
  const {normalKeys = node.normalKeys || [], deepKeys = node.deepKeys || []} = option

  const typeName = getType(node).name
  // NOTE 修改这个值，在对应type类使用断点调试
  const debugTypeName = ''
  if (debugTypeName) {
    console.log('typeName', typeName)
    if (typeName === debugTypeName) {
      // debugger
    }
  }

  const schema = {}
  normalKeys.forEach((key) => {
    if (node[key] && isFunction(node[key].toJSON)) {
      schema[key] = node[key].toJSON()
    } else {
      schema[key] = node[key]
    }
  })

  deepKeys.forEach((key) => {
    if (isDef(node[key])) {
      if (isFunction(node[key].map)) {
        // 数组类型
        schema[key] = node[key].map((child) => {
          if (isFunction(child.getSchema)) {
            return child.getSchema(option)
          }
          // log.warn('getSchema is not a function on child object: ', child)
          return undefined
        })
        // console.log('~~~~~~ schema', schema)
      } else if (isMapType(getType(node[key]))) {
        // Map类型
        schema[key] = {}
        node[key].forEach((item, id) => {
          if (isFunction(item.getSchema)) {
            // NOTE: Map类型替换id时单独做处理，所以这里始终不替换id
            schema[key][id] = item.getSchema({
              ...option,
              copy: false,
            })
          } else {
            schema[key][id] = item
          }
        })
      } else {
        if (isFunction(node[key].getSchema)) {
          schema[key] = node[key].getSchema(option)
        } else {
          log.warn("getSchema is not a function on object. Function: 'getModelSchema'", node[key])
        }
      }
    } else {
      log.warn(`${key} is not found on node(${typeName}). Function: 'getModelSchema'`, node)
    }
  })

  if (debugTypeName) {
    console.log(`getModelSchema(${typeName})`, JSON.stringify(schema, null, 4))
  }

  return schema
}

export const setModelSchema = (node, schema) => {
  if (!schema) {
    return
  }

  const typeName = getType(node).name

  // NOTE 修改这个值，就可以查看对应type类的schema，或加入debugger断点
  const debugTypeName = ''
  if (debugTypeName) {
    if (typeName === debugTypeName) {
      console.log(typeName, 'schema', JSON.stringify(schema, null, 4))
    }
  }

  if (isArray(node.normalKeys)) {
    node.normalKeys.forEach((key) => {
      try {
        node[key] = schema[key]
      } catch (error) {
        log.error(error, schema[key])
      }
    })
  }

  if (isArray(node.deepKeys)) {
    node.deepKeys.forEach((key) => {
      if (isDef(node[key])) {
        // NOTE 经验 模型节点，使用isArray检测是不是数组即可，使用isArrayType返回的是false
        if (isArray(node[key])) {
          if (isArray(schema[key])) {
            schema[key].forEach((itemSchema, index) => {
              node[key][index].setSchema(itemSchema)
            })
          }
        } else if (isPlainObject(schema[key]) && isMapType(getType(node[key]))) {
          node[key].setSchema(schema[key])
        } else {
          if (isFunction(node[key].setSchema)) {
            node[key].setSchema(schema[key])
          } else {
            log.warn("setSchema is not a function on object. Function: 'setModelSchema'", node[key])
          }
        }
      } else {
        if (schema[key]) {
          console.log('here')
        } else {
          log.warn(`deepKey(${key}) property is not found on node(${typeName}). Function: 'setModelSchema'`)
        }
      }
    })
  }

  if (isArray(node.refKeys)) {
    node.refKeys.forEach((key) => {
      node[key] = schema[key]
    })
  }

  // 原因及重要性：afterCreate只保障的id值的完成了初始化，不能保障所有props值都完成初始化
  if (isFunction(node.afterSetSchema)) {
    node.afterSetSchema()
  }
}

export const clearModelSchema = (model) => {
  if (isArray(model.deepKeys)) {
    model.deepKeys.forEach((key) => {
      if (isDef(model[key])) {
        destroy(model[key])
      } else {
        log.warn(`${key} is not found on model node:`, model)
      }
    })
  }

  if (isArray(model.refKeys)) {
    model.refKeys.forEach((key) => {
      if (isDef(model[key])) {
        destroy(model[key])
      } else {
        log.warn(`${key} is not found on node:`, model)
      }
    })
  }
}

const commonAction =
  (actions = []) =>
  (self) => {
    // 内置的通用action大全
    const collection = {
      set(key, value) {
        if (isString(key)) {
          self[key] = value
        } else if (isPlainObject(key)) {
          Object.entries(key).forEach(([k, v]) => (self[k] = v))
        }
        // if (self.art) {
        //   self.art.snapshot()
        // }
      },
      /**
       * 选中状态管理
       * 添加下面的方法，先需要添加 selected 属性，如下：
       * selected: types.maybe(types.reference(MXxxItem)),
       * 而且，MXxxItem模型需要有select/unselect方法
       */
      // 选中
      selectItem(item) {
        self.selectNone()
        self.selected = item
        self.selected.select()
      },

      // 选没
      selectNone() {
        if (self.selected) {
          self.selected.unselect()
          self.selected = undefined
        }
      },
      getSchema(option) {
        return getModelSchema(self, option)
      },

      setSchema(schema) {
        setModelSchema(self, schema)
      },

      clearSchema() {
        clearModelSchema(self)
      },

      copySchema() {
        return getModelSchema(self)
      },

      dumpSchema(option) {
        console.log(JSON.stringify(getModelSchema(self, option), null, 4))
      },
    }

    // 待使用的
    const toUseCollection = {}

    actions.forEach((action) => {
      if (collection[action]) {
        toUseCollection[action] = collection[action]
      }
    })

    return toUseCollection
  }

export default commonAction
