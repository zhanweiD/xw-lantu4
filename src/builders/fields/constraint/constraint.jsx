import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import IconButton from '@components/icon-button'
import {Field} from '../base'

import horizontalLine from './images/ct-fixed-h.svg'
import verticalLine from './images/ct-fixed-v.svg'
import widthLine from './images/ct-fixed-width.svg'
import heightLine from './images/ct-fixed-height.svg'
import vhorizontalLine from './images/ct-unfixed-h.svg'
import vverticalLine from './images/ct-unfixed-v.svg'
import vwidthLine from './images/ct-unfixed-width.svg'
import vheightLine from './images/ct-unfixed-height.svg'
import s from './constraint.module.styl'
import {NumberInput} from '../number'

const getLine = (type) => {
  const line = {
    top: type.top ? verticalLine : vverticalLine,
    right: type.right ? horizontalLine : vhorizontalLine,
    bottom: type.bottom ? verticalLine : vverticalLine,
    left: type.left ? horizontalLine : vhorizontalLine,
    width: type.width ? widthLine : vwidthLine,
    height: type.height ? heightLine : vheightLine,
  }
  return line
}

const ConstraintField = ({
  value,
  container,
  onChange = () => {},
  onClick = () => {},
  label,
  visible,
  labelClassName,
  childrenClassName,
  className,
}) => {
  const {t} = useTranslation()
  const line = getLine(value.constraints)

  console.log(value)
  const {constraints, layout} = value
  const {ctString, top, right, bottom, left, height, width} = constraints
  // const {x, y, height, width} = value.layout
  console.log(container)
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div className="fbv fb1">
        <div className="fbh mb4">
          <div className={c('fbh fb1', s.box)}>
            <img className={s.left} src={line.left} alt="" />
            <div className={c('fbv fb1', s.center)}>
              <img src={line.top} className={c('fb1', s.top)} alt="" />
              <div className={c('fbh fb1 pr fbjc fbac w100p cfw10')}>
                <img src={line.width} alt="" className="pa w100p" />
                <img src={line.height} alt="" className="pa h100p" />
              </div>
              <img src={line.bottom} className={c('fb1', s.bottom)} alt="" />
            </div>
            <img src={line.right} className={s.right} alt="" />
          </div>
          <div className="fbh fbn ml8">
            <div className="fbv fbac fbjc">
              <IconButton
                buttonSize={24}
                title={t('fixTLWH')}
                icon="ct-01"
                className={c(s.item, s.lineR, s.lineB, {
                  [s.isActive]: ctString === 'tlwh',
                })}
                onClick={() => {
                  const value = {
                    top: true,
                    right: false,
                    bottom: false,
                    left: true,
                    width: true,
                    height: true,
                    ctString: 'tlwh',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixTBLW')}
                icon="ct-04"
                className={c(s.item, s.lineR, s.lineB, {
                  [s.isActive]: ctString === 'tblw',
                })}
                onClick={() => {
                  const value = {
                    top: true,
                    right: false,
                    bottom: true,
                    left: true,
                    width: true,
                    height: false,
                    ctString: 'tblw',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixBLWH')}
                icon="ct-09"
                className={c(s.item, s.lineR, {
                  [s.isActive]: ctString === 'blwh',
                })}
                onClick={() => {
                  const value = {
                    top: false,
                    right: false,
                    bottom: true,
                    left: true,
                    width: true,
                    height: true,
                    ctString: 'blwh',
                  }
                  onClick(value)
                }}
              />
            </div>
            <div className="fbv fbac fbjc">
              <IconButton
                buttonSize={24}
                title={t('fixTRLH')}
                icon="ct-02"
                className={c(s.item, s.lineR, s.lineB, {
                  [s.isActive]: ctString === 'trlh',
                })}
                onClick={() => {
                  const value = {
                    top: true,
                    right: true,
                    bottom: false,
                    left: true,
                    width: false,
                    height: true,
                    ctString: 'trlh',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixTRBL')}
                className={c(s.item, s.lineR, s.lineB, {
                  [s.isActive]: ctString === 'trbl',
                })}
                icon="ct-06"
                onClick={() => {
                  const value = {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    width: false,
                    height: false,
                    ctString: 'trbl',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixRBLH')}
                icon="ct-10"
                className={c(s.item, s.lineR, {
                  [s.isActive]: ctString === 'rblh',
                })}
                onClick={() => {
                  const value = {
                    top: false,
                    right: true,
                    bottom: true,
                    left: true,
                    width: false,
                    height: true,
                    ctString: 'rblh',
                  }
                  onClick(value)
                }}
              />
            </div>

            <div className="fbv fbac fbjc">
              <IconButton
                buttonSize={24}
                title={t('fixTRWH')}
                icon="ct-03"
                className={c(s.item, s.lineB, {
                  [s.isActive]: ctString === 'trwh',
                })}
                onClick={() => {
                  const value = {
                    top: true,
                    right: true,
                    bottom: false,
                    left: false,
                    width: true,
                    height: true,
                    ctString: 'trwh',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixTRBW')}
                icon="ct-08"
                className={c(s.item, s.lineB, {
                  [s.isActive]: ctString === 'trbw',
                })}
                onClick={() => {
                  const value = {
                    top: true,
                    right: true,
                    bottom: true,
                    left: false,
                    width: true,
                    height: false,
                    ctString: 'trbw',
                  }
                  onClick(value)
                }}
              />
              <IconButton
                buttonSize={24}
                title={t('fixRBWH')}
                icon="ct-11"
                className={c(s.item, {
                  [s.isActive]: ctString === 'rbwh',
                })}
                onClick={() => {
                  const value = {
                    top: false,
                    right: true,
                    bottom: true,
                    left: false,
                    width: true,
                    height: true,
                    ctString: 'rbwh',
                  }
                  onClick(value)
                }}
              />
            </div>
          </div>
        </div>
        <div className="fbh fbac">
          <div className={c('fb1 mr4', s.label)}>{t('T')}</div>
          <NumberInput
            className={s.w1}
            value={top ? layout.y : 'auto'}
            readOnly={!top}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: layout.x,
                y: v,
                height: layout.height,
                width: layout.width,
              }
              if (bottom) {
                data = {
                  x: layout.x,
                  y: v,
                  height: layout.height + layout.y - v,
                  width: layout.width,
                }
              }
              onChange(data)
            }}
          />

          <div className={c('fb1 ml8 mr4', s.label)}>{t('R')}</div>
          <NumberInput
            className={s.w1}
            value={right ? container.width + container.x - (layout.width + layout.x) : 'auto'}
            readOnly={!right}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: container.width + container.x - v - layout.width,
                y: layout.y,
                height: layout.height,
                width: layout.width,
              }
              if (left) {
                data = {
                  x: layout.x,
                  y: layout.y,
                  height: layout.height,
                  width: container.width + container.x - v - layout.x,
                }
              }
              onChange(data)
            }}
          />

          <div className={c('fb1 ml8 mr4', s.label)}>{t('B')}</div>
          <NumberInput
            className={s.w1}
            value={bottom ? container.height + container.y - (layout.height + layout.y) : 'auto'}
            readOnly={!bottom}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: layout.x,
                y: container.height + container.y - layout.height - v,
                height: layout.height,
                width: layout.width,
              }
              if (top) {
                data = {
                  x: layout.x,
                  y: layout.y,
                  height: container.height + container.y - v - layout.y,
                  width: layout.width,
                }
              }
              onChange(data)
            }}
          />

          <div className={c('fb1 ml8 mr4', s.label)}>{t('L')}</div>
          <NumberInput
            className={s.w1}
            value={left ? layout.x : 'auto'}
            readOnly={!left}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: v,
                y: layout.y,
                height: layout.height,
                width: layout.width,
              }
              if (right) {
                data = {
                  x: v,
                  y: layout.y,
                  height: layout.height,
                  width: layout.width + layout.x - v,
                }
              }
              onChange(data)
            }}
          />

          <div className={c('fb1 ml8 mr4', s.label)}>{t('W')}</div>
          <NumberInput
            className={s.w2}
            value={width ? layout.width : 'auto'}
            readOnly={!width}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: layout.x,
                y: layout.y,
                height: layout.height,
                width: v,
              }
              if (right) {
                data = {
                  x: layout.width + layout.x - v,
                  y: layout.y,
                  height: layout.height,
                  width: v,
                }
              }
              onChange(data)
            }}
          />
          <div className={c('fb1 ml8 mr4', s.label)}>{t('H')}</div>
          <NumberInput
            className={s.w2}
            value={height ? layout.height : 'auto'}
            readOnly={!height}
            onChange={(v) => {
              // 传入x y height width
              let data = {
                x: layout.x,
                y: layout.y,
                height: v,
                width: layout.width,
              }
              if (bottom) {
                data = {
                  x: layout.x,
                  y: layout.y + layout.height - v,
                  height: v,
                  width: layout.width,
                }
              }
              onChange(data)
            }}
          />
        </div>
      </div>
    </Field>
  )
}

export default observer(ConstraintField)
