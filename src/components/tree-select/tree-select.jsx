import React, {useEffect, useState} from 'react'
import c from 'classnames'
import toggleArrayKey from '@common/toggle-array-key'

import s from './tree-select.module.styl'

const Checkbox = ({onChange = () => undefined, className, checked}) => {
  return (
    <input
      checked={checked}
      className={c(s.checkbox, className)}
      type="checkbox"
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}
// options 数据格式要求

const TreeSelect = ({options = [], onChange = () => undefined, defaultValue = []}) => {
  const [selectedKeys, setSelectkeys] = useState(defaultValue)
  const onSelect = (keys = [], checked) => {
    if (keys.length === 1) {
      const res = toggleArrayKey(selectedKeys, keys[0])
      setSelectkeys(res)
      return
    }
    // 多选
    if (checked) {
      setSelectkeys([...new Set([...keys, ...selectedKeys])])
    } else {
      const set = new Set(selectedKeys)
      keys.forEach((key) => {
        if (set.has(key)) {
          set.delete(key)
        }
      })
      setSelectkeys([...set])
    }
  }

  useEffect(() => {
    onChange(selectedKeys)
  }, [selectedKeys])

  const loopChild = (nodes) => {
    return (
      <>
        {nodes.map((node) => {
          if (node.children && Array.isArray(node.children)) {
            return (
              <div key={node.key}>
                <Item onSelect={onSelect} selectedKeys={selectedKeys} nodeData={node} />
                <div className="pl16">{loopChild(node.children)}</div>
              </div>
            )
          }
          return <Item key={node.key} onSelect={onSelect} selectedKeys={selectedKeys} nodeData={node} />
        })}
      </>
    )
  }

  return <div className={c(s.tree_select)}>{loopChild(options)}</div>
}

const Item = ({onSelect, selectedKeys = [], nodeData}) => {
  const {key, title, children = []} = nodeData
  const checked = selectedKeys.includes(key)
  const onSelfSelect = () => {
    const keys = [key]
    const loopKeys = (ns) => {
      ns.forEach((n) => {
        keys.push(n.key)
        if (n.children && Array.isArray(n.children)) {
          loopKeys(n.children)
        }
      })
    }
    loopKeys(children)
    onSelect(keys, !checked, nodeData)
  }
  return (
    <div className={c('fbh fbas fbac hand', s.select_item)} onClick={() => onSelfSelect()}>
      <Checkbox checked={checked} className="fbn" />
      <div className="omit ml4">{title}</div>
    </div>
  )
}

TreeSelect.Item = Item

export default TreeSelect
