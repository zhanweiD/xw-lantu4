import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import SettingList from "@components/setting-list"
import config from "@utils/config"
import ManageContainer from "@components/manage-container"
import FieldModal from "@components/field-modal"
import Confirm from "@components/confirm"
import {createConfigModelClass} from "@components/field"
import s from "./user.module.styl"

const {Item} = SettingList

const User = () => {
  const {t} = useTranslation()

  const {user = {}} = w

  const modal = w.overlayManager.get("fieldModal")

  const {nickname, mobile, avatar, email, changeUserDetail} = user

  const showNickNameModal = () => {
    const MFieldModal = createConfigModelClass("fieldModal", {
      sections: ["__hide__"],
      fields: [
        {
          section: "__hide__",
          option: "nickname",
          field: {
            type: "text",
            label: "user.name",
            placeholder: "namePlaceholder",
            defaultValue: nickname || "",
            required: true,
            option: "nickname"
          }
        }
      ]
    })
    modal.show({
      attachTo: false,
      title: t("user.modifyNickname"),
      content: MFieldModal.create(),
      height: 160,
      buttons: [
        {
          name: "取消",
          action: () => {
            modal.hide()
          }
        },
        {
          name: "确定",
          action: (values) => {
            changeUserDetail(values)
            modal.hide()
          }
        }
      ]
    })
  }
  const showEmailModal = () => {
    const MFieldModal = createConfigModelClass("fieldModal", {
      sections: ["__hide__"],
      fields: [
        {
          section: "__hide__",
          option: "email",
          field: {
            type: "text",
            label: "user.email",
            placeholder: "user.emailPlaceholder",
            defaultValue: email || "",
            required: true,
            option: "email"
          }
        }
      ]
    })
    modal.show({
      attachTo: false,
      title: t("user.modifyEmail"),
      content: MFieldModal.create(),
      height: 160,
      buttons: [
        {
          name: "取消",
          action: () => {
            modal.hide()
          }
        },
        {
          name: "确定",
          action: (values) => {
            changeUserDetail(values)
            modal.hide()
          }
        }
      ]
    })
  }
  return (
    <ManageContainer link="/" name={t("user.personalSet")}>
      <div className={c("fbv")}>
        <SettingList header="基本信息" className="mb20">
          <Item label="头像" highlight>
            <div className={s.minWidth}>
              <img
                className={s.logo}
                src={avatar || config.mascot}
                alt="avatar"
              />
            </div>
          </Item>
          <Item label="手机号" highlight>
            <div className={s.minWidth}>{mobile}</div>
          </Item>
          <Item
            label="昵称"
            action={
              <div
                className={c("hand", s.editButton)}
                onClick={showNickNameModal}
              >
                修改
              </div>
            }
          >
            <div className={s.minWidth}>{nickname}</div>
          </Item>
          <Item
            label="邮箱"
            action={
              <div className={c("hand", s.editButton)} onClick={showEmailModal}>
                修改
              </div>
            }
          >
            <div className={s.minWidth}>{email}</div>
          </Item>
        </SettingList>

        <SettingList header="账户信息">
          <Item highlight label="密码">
            <div className={s.minWidth}>***********</div>
          </Item>
        </SettingList>
      </div>
      <FieldModal model={w.overlayManager.get("fieldModal")} />
      <Confirm model={w.overlayManager.get("confirm")} />
    </ManageContainer>
  )
}

export default observer(User)
