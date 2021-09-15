import check from '@utils/check'
import config from '@utils/config'
import createLog from '@utils/create-log'
import io from '@utils/io'
import c from 'classnames'
import React, {useEffect, useState} from 'react'
import s from './login.module.styl'

let errorClearTimer
const log = createLog('@pages/login')

const Form = () => {
  // 登录或注册
  const [page, setPage] = useState('login') // register
  // 手机号
  const [mobile, setMobile] = useState('')
  // 手机验证码
  const [verificationCode, setVerificationCode] = useState('')
  // 邀请码
  const [inviteCode, setInviteCode] = useState('')
  // 是否记住登录状态
  const [isKeepLogin, setKeepLogin] = useState(false)
  // 错误提示
  const [message, setMessage] = useState('')
  // 验证码提示文字
  const [inviteCodeTip, setInviteCodeTip] = useState('获取验证码')
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
    if (!verificationCode) {
      setMessage('请输入手机验证码')
      return
    }
    if (!/^[0-9]{6}$/.test(verificationCode)) {
      setMessage('验证码不正确')
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
          platform: 'phone',
          remberMe: isKeepLogin,
          phone: {
            mobile: mobile,
            code: verificationCode,
          },
        })
      } else if (page === 'register') {
        user = await io.auth.register({
          mobile,
          inviteCode,
          code: verificationCode,
        })
      }
      // 登录/注册通过后跳转到主页面
      if (user?.userId) {
        window.location.href = window.appData?.pathPrefix || '/'
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
        await io.auth.getSMSCode({
          type: page,
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
      <div className={c('wh100p fbv fbjsb', s.formContainer)}>
        <div>
          <span className={c('fs26 hand', {ctb50: page !== 'login'})} onClick={() => setPage('login')}>
            登录
          </span>
          <span className="fs26 pl12 pr12 ctb50">/</span>
          <span className={c('fs26 hand', {ctb50: page !== 'register'})} onClick={() => setPage('register')}>
            注册
          </span>
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
            {page === 'register' && (
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
                  onClick={() => setMessage('您可以通过以下联系方式获取邀请码：18667027566 何先生')}
                >
                  获取邀请码
                </span>
              </div>
            )}
            {page === 'login' && (
              <label className="fbh fbac hand">
                <input
                  className="hand"
                  type="checkbox"
                  value={isKeepLogin}
                  onChange={(e) => setKeepLogin(e.target.checked)}
                />
                <span className={c('pl8 fs12 lh32')}>记住登录状态</span>
              </label>
            )}
            {page === 'register' && (
              <div>
                <span className={c('fs12 lh32 ctb50')}>注册即代表同意</span>
                <span
                  className={c('fs12 lh32 hand')}
                  onClick={() => window.open('https://cdn.dtwave.com/waveview-public/v4/user-agreement.html')}
                >
                  《澜图用户协议》
                </span>
                <span
                  className={c('fs12 lh32 hand')}
                  onClick={() => window.open('https://cdn.dtwave.com/waveview-public/v4/privacy-policy.html')}
                >
                  《澜图隐私政策》
                </span>
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
