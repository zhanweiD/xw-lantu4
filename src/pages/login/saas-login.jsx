import check from '@utils/check'
import config from '@utils/config'
import createLog from '@utils/create-log'
import io from '@utils/io'
import c from 'classnames'
import {Base64} from 'js-base64'
import Icon from '@components/icon'
import CryptoJS from 'crypto-js'
import React, {useEffect, useState} from 'react'
import s from './login.module.styl'

let errorClearTimer
const log = createLog('@pages/login')

const SaaSRegister = ({
  isAgree,
  setIsAgree,
  inviteCode,
  setInviteCode,
  setMessage,
  setPage,
  verificationCode,
  setVerificationCode,
  inviteCodeTip,
  getVerificationCode,
  password,
  setPassword,
  confimPwd,
  setConfimPwd,
  mobile,
}) => {
  // eslint-disable-next-line no-unused-vars
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
        type: 'register',
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
  return (
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
          className={c('hand fs16', s.sendCode)}
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
      <div className="fbh pr lh32">
        <input
          type="text"
          className="fb1 mb20 lh32 ctb70 fs16"
          placeholder="请输入手机验证码"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <span
          className={c('hand fs16', s.sendCode, {ctb50: inviteCodeTip !== '获取验证码'})}
          onClick={getVerificationCode}
        >
          {inviteCodeTip}
        </span>
      </div>
      <div className="mb12 fbh fbjsb">
        <div>
          <input className="hand mr4" type="checkbox" value={isAgree} onChange={(e) => setIsAgree(e.target.checked)} />
          <span className={c('fs16 lh32 ctb50')}>同意</span>
          <span
            className={c('fs16 lh32 hand')}
            onClick={() => window.open('https://cdn.dtwave.com/waveview-public/v4/user-agreement.html')}
          >
            澜图用户协议
          </span>
          <span className={c('fs16 lh32 ctb50')}>和</span>
          <span
            className={c('fs16 lh32 hand')}
            onClick={() => window.open('https://cdn.dtwave.com/waveview-public/v4/privacy-policy.html')}
          >
            澜图隐私政策
          </span>
        </div>
        <div>
          <span className={c('fs16 lh32 ctb50')}>已有账号，马上</span>
          <span className={c('fs16 lh32 hand')} onClick={() => setPage('')}>
            登录
          </span>
        </div>
      </div>
    </div>
  )
}

const MessageLogin = ({
  verificationCode,
  setVerificationCode,
  getVerificationCode,
  inviteCodeTip,
  isKeepLogin,
  setKeepLogin,
  setPage,
}) => {
  return (
    <div>
      <div className="fbh pr lh32">
        <input
          type="text"
          className="fb1 mb20 lh32 ctb70 fs16"
          placeholder="请输入手机验证码"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <span
          className={c('hand fs16', s.sendCode, {ctb50: inviteCodeTip !== '获取验证码'})}
          onClick={getVerificationCode}
        >
          {inviteCodeTip}
        </span>
      </div>
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
        <span className={c('fs16 lh32 hand')} onClick={() => setPage('register')}>
          用户注册
        </span>
      </div>
    </div>
  )
}

const PwdLogin = ({
  password,
  setPassword,
  verificationCode,
  setVerificationCode,
  setTimer,
  timer,
  isKeepLogin,
  setKeepLogin,
  setPage,
  pwdType,
  setPwdType,
}) => {
  return (
    <div>
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
          <span className={c('fs16 lh32 hand')} onClick={() => setPage('register')}>
            用户注册
          </span>
        </div>
      </div>
    </div>
  )
}

const SaaSForm = () => {
  // 需要特殊加密   不可以明文展示
  const type = Base64.decode('d2F2ZXZpZXc=')
  const [pwdType, setPwdType] = useState(true)
  const [timer, setTimer] = useState(new Date().getTime())
  // 登录或注册
  // loginMessage： 短信登录  loginPwd: 密码登录 register： 注册
  const [page, setPage] = useState('loginPwd') // register
  // 手机号
  const [mobile, setMobile] = useState('')
  // 手机验证码
  // const [verificationCode, setVerificationCode] = useState('')
  // 邀请码
  const [inviteCode, setInviteCode] = useState('')
  // 是否记住登录状态
  const [isKeepLogin, setKeepLogin] = useState(false)
  // 错误提示
  const [message, setMessage] = useState('')
  // 验证码提示文字
  const [inviteCodeTip, setInviteCodeTip] = useState('获取验证码')
  // 是否同意
  const [isAgree, setIsAgree] = useState(false)
  // 密码
  const [password, setPassword] = useState('')
  const [confimPwd, setConfimPwd] = useState('')
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
    // if (!verificationCode) {
    //   setMessage('请输入手机验证码')
    //   return
    // }
    // if (!/^[0-9]{6}$/.test(verificationCode)) {
    //   setMessage('验证码不正确')
    //   return
    // }
    if (page === 'register' && !inviteCode) {
      setMessage('请输入邀请码')
      return
    }
    let user
    try {
      if (page === 'loginMessage') {
        user = await io.auth.login({
          platform: 'phone',
          remberMe: isKeepLogin,
          phone: {
            mobile: mobile,
            code: verificationCode,
          },
        })
        // 登录/注册通过后跳转到主页面
        if (user?.userId) {
          window.location.href = window.appData?.pathPrefix || '/'
        }
      } else if (page === 'loginPwd') {
        user = await io.auth.login({
          platform: type,
          remberMe: isKeepLogin,
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
        if (!verificationCode) {
          setMessage('请输入手机验证码')
          return
        }
        if (password !== confimPwd) {
          setMessage('密码和确认密码不一致')
          return
        }
        if (!isAgree) {
          setMessage('请勾选用户协议和隐私协议')
          return
        }
        user = await io.auth.register({
          platform: 'phone',
          phone: {
            mobile,
            inviteCode,
            code: verificationCode,
            password: CryptoJS.AES.encrypt(password, type).toString(),
          },
        })
        if (user?.userId) {
          setPage('loginPwd')
          setVerificationCode('')
          setInviteCode('')
          setPassword('')
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
  // 获取验证码
  const getVerificationCode = async () => {
    setMessage('')
    if (!mobile) {
      setMessage('请输入手机号码')
      return
    }
    if (!check('mobile', mobile)) {
      setMessage('手机号码不正确')
      return
    }
    try {
      if (inviteCodeTip === '获取验证码') {
        const type = {
          loginPwd: 'login',
          loginMessage: 'login',
          register: 'register',
        }
        await io.auth.getSMSCode({
          type: type[page],
          mobile,
        })
        let interval
        let countdown = 60
        setInviteCodeTip(`${countdown--}s后重试`)
        interval = setInterval(() => {
          setInviteCodeTip(`${countdown--}s后重试`)
          if (countdown === -1) {
            clearInterval(interval)
            setInviteCodeTip('获取验证码')
          }
        }, 1000)
      }
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
        <div></div>
        <div>
          {page == 'register' ? (
            <span className={c('fs26 hand', {ctb50: page !== 'register'})} onClick={() => setPage('register')}>
              用户注册
            </span>
          ) : (
            <span>
              <span className={c('fs26 hand', {ctb50: page !== 'loginPwd'})} onClick={() => setPage('loginPwd')}>
                密码登录
              </span>
              <span className={c('fs26 hand ctb50 mr8 ml8')}>/</span>
              <span
                className={c('fs26 hand', {ctb50: page !== 'loginMessage'})}
                onClick={() => setPage('loginMessage')}
              >
                短信登录
              </span>
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
              onChange={(e) => setMobile(e.target.value)}
            />
            {page === 'loginPwd' && (
              <PwdLogin
                password={password}
                setPassword={setPassword}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                setTimer={setTimer}
                timer={timer}
                pwdType={pwdType}
                setPwdType={setPwdType}
                isKeepLogin={isKeepLogin}
                setKeepLogin={setKeepLogin}
                setPage={() => {
                  setPage('register')
                  setPassword('')
                  setVerificationCode('')
                }}
              />
            )}
            {page === 'loginMessage' && (
              <MessageLogin
                verificationCode={verificationCode}
                setVerificationCode={(v) => setVerificationCode(v)}
                getVerificationCode={(v) => getVerificationCode(v)}
                inviteCodeTip={inviteCodeTip}
                isKeepLogin={isKeepLogin}
                setKeepLogin={setKeepLogin}
                setPage={() => {
                  setPage('register')
                  setPassword('')
                  setVerificationCode('')
                }}
              />
            )}
            {page === 'register' && (
              <SaaSRegister
                isAgree={isAgree}
                setIsAgree={(v) => setIsAgree(v)}
                inviteCode={inviteCode}
                setInviteCode={(v) => setInviteCode(v)}
                setMessage={(v) => setMessage(v)}
                setPage={() => {
                  setPage('loginPwd')
                  setPassword('')
                  setVerificationCode('')
                }}
                verificationCode={verificationCode}
                setVerificationCode={(v) => setVerificationCode(v)}
                inviteCodeTip={inviteCodeTip}
                getVerificationCode={(v) => getVerificationCode(v)}
                password={password}
                setPassword={setPassword}
                confimPwd={confimPwd}
                setConfimPwd={setConfimPwd}
                mobile={mobile}
              />
            )}
          </form>
        </div>
        <div className={c('fbh fbjc fbac p12 fs20 ctw hand', s.sendButton)} onClick={handleSubmit}>
          {page === 'register' ? '注 册' : '登 录'}
        </div>
      </div>
    </div>
  )
}

const SaaSLogin = () => {
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
        <SaaSForm />
      </div>
      <div className={s.copyright}>{copyright}</div>
    </div>
  )
}

export default SaaSLogin
