import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import copy from '@utils/copy'
import tip from '@components/tip'
import IconButton from '@components/icon-button'
import Section from '../section'
import {CodeField} from '../fields/code'

const Processor = ({name, type, effective = false, value, onIconClick = () => {}, onChange = () => {}}) => {
  const [code, setCode] = useState(value)
  useEffect(() => {
    setCode(value)
  }, [value])
  return (
    <Section
      name={name}
      headIcon={
        <IconButton
          className="ml4"
          icon={effective ? 'effective' : 'ineffective'}
          iconSize={14}
          buttonSize={18}
          onClick={() => onIconClick(!effective)}
        />
      }
      type={type}
      titleClassName="pr8"
    >
      <CodeField
        className="block"
        childrenClassName="ml24"
        value={code}
        height={200}
        readOnly={!effective}
        onChange={(value) => {
          setCode(value)
        }}
        buttons={[
          {
            name: '复制',
            action: () => {
              copy(code)
              tip.success({content: '复制成功'})
            },
            position: 'left',
          },

          {
            name: '保存',
            action: () => {
              onChange(code)
            },
            position: 'right',
          },
        ]}
      />
    </Section>
  )
}

export default observer(Processor)
