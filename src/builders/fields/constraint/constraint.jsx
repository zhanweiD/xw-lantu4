import React from 'react'
import {observer} from 'mobx-react-lite'
// import {useTranslation} from 'react-i18next'
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
  // onChange = () => {},
  onClick = () => {},
  label,
  visible,
  labelClassName,
  childrenClassName,
  className,
}) => {
  // const {t} = useTranslation()

  const line = getLine(value.constraints)
  const {ctString} = value.constraints
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div className="fbh fb1">
        <div className={c('fbh fb1', s.box)}>
          <img className={s.left} src={line.left} alt="" />
          <div className={c('fbv fb1', s.center)}>
            <img src={line.top} className={s.top} alt="" />
            <div className={c('fbh fb1 pr fbjc fbac w100p cfw10')}>
              <img src={line.width} alt="" className="pa" />
              <img src={line.height} alt="" className="pa" style={{height: 32}} />
            </div>
            <img src={line.bottom} className={s.bottom} alt="" />
          </div>
          <img src={line.right} className={s.right} alt="" />
        </div>
        <div className="fbh fbn ml8">
          <div className="fbv fbac fbjc">
            <IconButton
              buttonSize={24}
              icon="ct-01"
              className={c({
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
              icon="ct-04"
              className={c({
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
              icon="ct-09"
              className={c({
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
          {/* <div className="fbv fbac fbjc">
            <IconButton
              buttonSize={24}
              icon="ct-05"
              className={c({
                [s.isActive]: ctString === 'rlh',
              })}
              onClick={() => {
                const value = {
                  top: false,
                  right: true,
                  bottom: false,
                  left: true,
                  width: false,
                  height: true,
                  ctString: 'rlh',
                }
                onClick(value)
              }}
            />
          </div> */}
          <div className="fbv fbac fbjc">
            <IconButton
              buttonSize={24}
              icon="ct-02"
              className={c({
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
              className={c({
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
              icon="ct-10"
              className={c({
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
          {/* <div className="fbv fbac fbjc">
            <IconButton
              buttonSize={24}
              icon="ct-07"
              className={c({
                [s.isActive]: ctString === 'tbw',
              })}
              onClick={() => {
                const value = {
                  top: true,
                  right: false,
                  bottom: true,
                  left: false,
                  width: true,
                  height: false,
                  ctString: 'tbw',
                }
                onClick(value)
              }}
            />
          </div> */}
          <div className="fbv fbac fbjc">
            <IconButton
              buttonSize={24}
              icon="ct-03"
              className={c({
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
              icon="ct-08"
              className={c({
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
              icon="ct-11"
              className={c({
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
    </Field>
  )
}

export default observer(ConstraintField)
