import React, {useState} from "react"
import io from "@utils/io"
import aesEncode from "@utils/aes-encode"
import {useTranslation} from "react-i18next"
import check from "@utils/check"
import "./login.styl"
import config from "@utils/config"

const AccountLogin = () => {
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    if (!check("mobile", mobile)) {
      return setMessage(t("login.wrongMobile"))
    }
    if (!password) {
      return setMessage(t("login.needPassword"))
    }

    if (loading) return ""
    setLoading(true)
    try {
      // 澜图登录
      const user = await io.auth.login({
        platform: "waveview",
        waveview: {
          mobile,
          password: aesEncode(password)
        }
      })

      if (user.userId) {
        window.location.href = window.appData?.pathPrefix || "/"
      }
    } catch (e) {
      setMessage(e.message)
    }
    return setLoading(false)
  }
  const onPasswordChange = (value) => {
    setMessage("")
    setPassword(value)
  }

  const onPhoneChange = (value) => {
    setMessage("")
    const reg = /^1([0-9]*)?$/
    if ((reg.test(value) && value.length < 12) || value === "") {
      setMobile(value)
    }
  }
  return (
    <>
      <div className="title mt30">{t("login.login")}</div>
      <form className="mt30" onSubmit={handleSubmit}>
        <input
          name="mobile"
          type="text"
          value={mobile}
          placeholder={t("user.mobilePlaceholder")}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        <input
          name="password"
          type="password"
          value={password}
          placeholder={t("user.password")}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <div className="mt20">
          <input
            className="submitButton"
            type="submit"
            value={loading ? t("login.submiting") : t("login.submit")}
          />
        </div>
        {message && <div className="errorMessage">{message}</div>}
      </form>
    </>
  )
}
const Login = () => {
  const {t} = useTranslation()
  return (
    <div
      className="loginMain"
      style={{backgroundImage: `url(${config.loginBack})`}}
    >
      <div className="sloganContainer">
        <img src={config[t("login.slogan")]} alt="logo" />
      </div>
      <div className="formContainer cfb40">
        <AccountLogin />
      </div>
    </div>
  )
}

export default Login
