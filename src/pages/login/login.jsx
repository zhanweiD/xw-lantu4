/* eslint-disable no-unused-vars */
import check from '@utils/check'
import config from '@utils/config'
import createLog from '@utils/create-log'
import {Base64} from 'js-base64'
import Icon from '@components/icon'
import io from '@utils/io'
import CryptoJS from 'crypto-js'
import c from 'classnames'
import React, {useEffect, useState} from 'react'
import s from './login.module.styl'

let errorClearTimer
const log = createLog('@pages/login')

const Form = () => {
  // 需要特殊加密   不可以明文展示
  const type = Base64.decode('d2F2ZXZpZXc=')
  const [pwdType, setPwdType] = useState(true)
  const [timer, setTimer] = useState(new Date().getTime())
  // 登录或注册
  const [page, setPage] = useState('login') // register
  // 手机号
  const [mobile, setMobile] = useState('')
  // 邀请码
  const [inviteCode, setInviteCode] = useState('')
  // 是否记住登录状态
  const [isKeepLogin, setKeepLogin] = useState(false)
  // 错误提示
  const [message, setMessage] = useState('')
  // 密码
  const [password, setPassword] = useState('')
  const [confimPwd, setConfimPwd] = useState('')
  // confimPwd
  const [verificationCode, setVerificationCode] = useState('')
  // 注册/登录
  const handleSubmit = async () => {
    setMessage('')
    if (!mobile) {
      setMessage('请输入手机号码')
      return
    }
    if (!check('mobile', mobile)) {
      setMessage('手机号码不正确')
      return
    }
    if (page === 'register' && !inviteCode) {
      setMessage('请输入邀请码')
      return
    }
    let user
    try {
      if (page === 'login') {
        user = await io.auth.login({
          platform: type,
          [type]: {
            mobile,
            captcha: verificationCode,
            password: CryptoJS.AES.encrypt(password, type).toString(),
          },
        })
        // 登录/注册通过后跳转到主页面
        if (user?.userId) {
          window.location.href = window.appData?.pathPrefix || '/'
        }
      } else if (page === 'register') {
        if (password === confimPwd) {
          user = await io.auth.register({
            platform: type,
            [type]: {
              mobile,
              inviteCode,
              password: CryptoJS.AES.encrypt(password, type).toString(),
            },
          })
          if (user?.userId) {
            setPage('login')
            setPassword('')
          }
        } else {
          setMessage('密码和确认密码不一致')
        }
      }
    } catch (error) {
      if (error.code === 'ERROR_PARAMS_ERROR') {
        log.error(error)
      } else {
        setMessage(error.message)
      }
    }
  }

  // 获取邀请码
  const getInvitationCode = async () => {
    if (!mobile) {
      setMessage('请输入手机号码')
      return
    }
    if (!check('mobile', mobile)) {
      setMessage('手机号码不正确')
      return
    }
    // inviteCode
    try {
      const res = await io.auth.getInviteCode({
        type: page,
        mobile,
      })
      const {inviteCode} = res
      setInviteCode(inviteCode)
    } catch (error) {
      if (error.code === 'ERROR_PARAMS_ERROR') {
        log.error(error)
      } else {
        setMessage(error.message)
      }
    }
  }

  // 提示文字发生变化时自动注销
  useEffect(() => {
    clearTimeout(errorClearTimer)
    if (message) {
      errorClearTimer = setTimeout(() => setMessage(''), 3000)
    }
  }, [message])

  return (
    <div className={c('fb3 cfw pr', s.formArea)}>
      {message && <div className={c('pa w100p fbh fbac fbjc ctw fs16 p12', s.tip)}>{message}</div>}
      <div className={c('wh100p fbv fbjsb bsbb', s.formContainer)}>
        <div>
          {page == 'register' ? (
            <span className={c('fs26 hand', {ctb50: page !== 'register'})} onClick={() => setPage('register')}>
              用户注册
            </span>
          ) : (
            <span className={c('fs26 hand', {ctb50: page !== 'login'})} onClick={() => setPage('login')}>
              澜图登录
            </span>
          )}
        </div>
        <div className="fb1">
          <form className="fbv">
            <input
              type="text"
              className="mb20 lh32 ctb70 fs16"
              placeholder="请输入手机号码"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value)
                page === 'register' && setInviteCode('')
              }}
            />
            {page === 'login' && (
              <div>
                <div className="fbh pr lh32">
                  <input
                    type={pwdType ? 'password' : 'text'}
                    className="fb1 mb20 lh32 ctb70 fs16"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="hand" onClick={() => setPwdType(!pwdType)}>
                    {pwdType ? (
                      <Icon name="private-eyes" fill="rgba(0, 0, 0, 0.5)" size={18} />
                    ) : (
                      <Icon name="public-eyes" fill="rgba(0, 0, 0, 0.5)" size={18} />
                    )}
                  </span>
                </div>
                <div className="fbh pr lh32">
                  <input
                    type="text"
                    className="fb1 mb20 lh32 ctb70 fs16"
                    placeholder="请输入验证码"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <img
                    className="hand"
                    onClick={() => setTimer(new Date().getTime())}
                    art=""
                    src={`${config.urlPrefix}/captcha?timer=${timer}`}
                    height="35px"
                    width="100px"
                  />
                </div>
              </div>
            )}
            {page === 'register' && (
              <div>
                <div className="fbh pr lh32">
                  <input
                    type="text"
                    className="fb1 mb20 lh32 ctb70 fs16"
                    placeholder="请输入邀请码"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                  <span
                    className={c('hand fs16', s.sendCode, inviteCode ? 'ct7 notAllowed' : '')}
                    // onClick={() => !inviteCode && getInvitationCode()}
                    onClick={() => setMessage('您可以通过以下联系方式获取邀请码：18667027566 何先生')}
                  >
                    获取邀请码
                  </span>
                </div>
                <div className="fbh pr lh32">
                  <input
                    type="password"
                    className="fb1 mb20 lh32 ctb70 fs16"
                    placeholder="请输入密码（6-16位，含字母、数字）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="fbh pr lh32">
                  <input
                    type="password"
                    className="fb1 mb20 lh32 ctb70 fs16"
                    placeholder="确认密码"
                    value={confimPwd}
                    onChange={(e) => setConfimPwd(e.target.value)}
                  />
                </div>
              </div>
            )}

            {page === 'login' && (
              <div className="fbh fbjsb">
                <label className="fbh fbac hand">
                  <input
                    className="hand"
                    type="checkbox"
                    value={isKeepLogin}
                    onChange={(e) => setKeepLogin(e.target.checked)}
                  />
                  <span className={c('pl8 fs16 lh32')}>记住登录状态</span>
                </label>
                <span
                  className={c('fs16 lh32 hand')}
                  onClick={() => {
                    setPage('register')
                    setPassword('')
                    setVerificationCode('')
                  }}
                >
                  用户注册
                </span>
              </div>
            )}
            {page === 'register' && (
              <div className="mb12 fbh fbjsb">
                <div>
                  <span className={c('fs16 lh32 ctb50')}>已有账号，马上</span>
                  <span
                    className={c('fs16 lh32 hand')}
                    onClick={() => {
                      setPage('login')
                      setPassword('')
                      setConfimPwd('')
                      setInviteCode('')
                    }}
                  >
                    登录
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className={c('fbh fbjc fbac p12 fs20 ctw hand', s.sendButton)} onClick={handleSubmit}>
          {page === 'login' ? '登 录' : '注 册'}
        </div>
      </div>
    </div>
  )
}

const Login = () => {
  // 版权文案
  const copyright = '© 2016-2021 DTWave. All Rights Reserved. 数澜科技 版权所有 浙ICP备16024205号'
  // 左侧 LOGO 文字
  const features = [
    ['一站式创建到发布', '丰富的图表库和UI库', '工作空间&权限管理'],
    ['GIS地图', '二次开发能力(待开放)', '丰富的数据源支持'],
  ]
  return (
    <div className={c('wh100p fbv fbac fbjc', s.login)} style={{backgroundImage: `url(${config.loginBack})`}}>
      <div className={c('fbh', s.centerArea)}>
        <div className={c('fb2', s.sloganArea)} style={{backgroundImage: `url(${config.waveviewBack})`}}>
          <div className="wh100p fb1 fbv fbjsb fbac">
            <div className={c(s.sloganTitle)}>
              <div className={c('fs20', s.slogan)}>澜图可视化 </div>
              <div className={c('cfw', s.splitLine)} />
              <div className={c('fs12', s.slogan)}>好设计即刻实现</div>
            </div>
            <div className="fbh fbjsb mb20">
              {features.map((group, i) => (
                <div className="fbv ml20 mr20" key={i}>
                  {group.map((feature, j) => (
                    <div className="fbh fbac mb6" key={j}>
                      <div className={s.dot} />
                      <div className={c('fs12', s.feature)}>{feature}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Form />
      </div>
      <div className={s.copyright}>{copyright}</div>
    </div>
  )
}

export default Login
