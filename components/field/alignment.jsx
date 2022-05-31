import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {useTranslation} from 'react-i18next'
import Icon from '@components/icon'
import Caption from '@components/caption'
import {Field} from './base'
import s from './alignment.module.styl'

export const AlignmentField = observer(({label, tip, value, defaultValue, onChange, className, readOnly}) => {
  const {t} = useTranslation()

  // 对齐字段定义，顺序不能变
  const OPTIONS = [
    {
      key: 'leftTop',
      value: 'left-top',
      title: t('alignment.leftTop'),
    },
    {
      key: 'centerTop',
      value: 'center-top',
      title: t('alignment.centerTop'),
    },
    {
      key: 'rightTop',
      value: 'right-top',
      title: t('alignment.rightTop'),
    },
    {
      key: 'middleLeft',
      value: 'middle-left',
      title: t('alignment.middleLeft'),
    },
    {
      key: 'middleCenter',
      value: 'middle-center',
      title: t('alignment.middleCenter'),
    },
    {
      key: 'middleRight',
      value: 'middle-right',
      title: t('alignment.middleRight'),
    },
    {
      key: 'leftBottom',
      value: 'left-bottom',
      title: t('alignment.leftBottom'),
    },
    {
      key: 'centerBottom',
      value: 'center-bottom',
      title: t('alignment.centerBottom'),
    },
    {
      key: 'rightBottom',
      value: 'right-bottom',
      title: t('alignment.rightBottom'),
    },
  ]

  return (
    <Field label={label} tip={tip} className={className}>
      {OPTIONS.map((option, index) => (
        <Caption
          key={option.key}
          content={option.title}
          className={c('fb1', s.option, {
            [s.gap]: index + 1 < OPTIONS.length,
            noEvent: readOnly,
          })}
        >
          <div
            className={c('w100p cfw10 h24 fbh fbac fbjc hand', {
              [s.highLight]: (value || defaultValue) === option.value,
            })}
            onClick={() => {
              onChange(option.value)
            }}
          >
            <Icon name={`align-${option.value}`} size={12} fill={readOnly ? 'rgba(255,255,255,0.5)' : '#ffffff'} />
          </div>
        </Caption>
      ))}
    </Field>
  )
})
