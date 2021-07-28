import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import Icon from "@components/icon"
import {DropMenu} from "@components/drop-menu"
import s from "./head-drop-menu.module.styl"

const HeaderDropMenu = ({user = {}}) => {
  const {t} = useTranslation()
  const {
    nickname,
    organizationName,
    logout,
    organizationId,
    changechangeWorkspace,
    organizationList
  } = user

  const dropMenuItems = []

  organizationList
    .filter((v) => v.organizationId !== organizationId)
    .map((item, index) =>
      dropMenuItems.push({
        name: item.organizationName,
        // 判断是否是当前激活的组织：若已经激活，则隐藏
        isHide: item.organizationId === organizationId,
        endLine: index === organizationList.length - 1,
        action: () => changechangeWorkspace(item.organizationId)
      })
    )

  // 个人空间菜单按钮，切换到个人空间后隐藏
  organizationId &&
    dropMenuItems.push({
      name: t("organization.personalSpace"),
      // 判断是否是当前激活的组织：若已经激活，则隐藏
      endLine: true,
      // 是否文字加粗
      textBolder: true,
      action: () => changechangeWorkspace(null)
    })
  // 组织信息菜单按钮，切换到个人空间后隐藏
  dropMenuItems.push({
    action: () => {
      user.hideDropMenu(true)
      window.open("/organization")
    },
    name: t("user.manage"),
    endLine: true
  })
  const changeLanguage = (e, lang) => {
    e.nativeEvent?.stopImmediatePropagation()
    user.changeLanguage(lang)
  }
  // 个人设置 和 语言切换 及退出登录
  dropMenuItems.push(
    {
      name: (
        <div className="fbh fbac">
          <Icon name="user" className={s.iconButton} /> {t("user.personalSet")}
        </div>
      ),
      endLine: true,
      action: () => {
        user.hideDropMenu(true)
        window.open("/user")
      }
    },
    {
      name: (
        <div className="fbh fbac">
          <div className="fb1 fbh fbac">
            <Icon name="language" className={s.iconButton} />{" "}
            {t("user.languageSet")}
          </div>
          <div>
            {user.language === "zh-CN" && (
              <div
                onClick={(e) => {
                  changeLanguage(e, "en")
                }}
                className={s.button}
              >
                English
              </div>
            )}
            {user.language === "en" && (
              <div
                onClick={(e) => {
                  changeLanguage(e, "zh-CN")
                }}
                className={s.button}
              >
                中文
              </div>
            )}
          </div>
        </div>
      ),
      endLine: true,
      disable: true,
      action: () => {}
    },
    {
      name: (
        <div className="fbh fbac">
          <Icon name="logout" className={s.iconButton} /> {t("user.logout")}
        </div>
      ),
      action: () => {
        // 调用退出登陆接口
        logout()
        // 提示用户保存数据
        // 刷新页面
        window.location.reload()
      }
    }
  )
  return (
    <>
      <DropMenu items={dropMenuItems} user={user}>
        <div className={c("fbh fbac pl16 pr16 h40", s.minWidth140)}>
          <div className={c("omit", s.maxWidth100)}>
            {`${
              organizationId
                ? organizationName
                : t("organization.personalSpace")
            }`}{" "}
          </div>
          <div className={c("omit", s.maxWidth80)}>{` · ${nickname}`} </div>
        </div>
      </DropMenu>
    </>
  )
}

export default observer(HeaderDropMenu)
