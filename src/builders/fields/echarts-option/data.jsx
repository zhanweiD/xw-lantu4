import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import hJSON from 'hjson'
import tip from '@components/tip'
import copy from '@utils/copy'
import {CodeField} from '../code'

const EchartsOptionField = ({value, onChange = () => {}}) => {
  const [json, setJson] = useState(value)
  useEffect(() => {
    setJson(value)
  }, [value])
  return (
    <CodeField
      childrenClassName="ml24"
      className="block"
      value={json}
      height={200}
      onChange={(value) => {
        setJson(value)
      }}
      buttons={[
        {
          name: '复制',
          action: () => {
            copy(json)
            tip.success({content: '复制成功'})
          },
          position: 'left',
        },
        {
          name: '格式化',
          action: () => {
            try {
              const hjson = hJSON.parse(json)
              setJson(hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true}))
            } catch (error) {
              tip.error({content: '格式化失败,请检查JSON是否合法'})
            }
          },
          position: 'left',
        },
        {
          name: '保存',
          action: () => {
            try {
              const hjson = hJSON.parse(json)
              const text = hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true})
              onChange(text)
            } catch (error) {
              tip.error({content: '保存失败,请检查JSON是否合法'})
            }
          },
          position: 'right',
        },
      ]}
    />
  )
}

export default observer(EchartsOptionField)
