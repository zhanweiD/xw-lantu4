import React from "react"
import {observer} from "mobx-react-lite"
import {Link} from "react-router-dom"
import c from "classnames"
import config from "@utils/config"
import {MUser} from "@models/user/user"
// import Modal from "@components/modal"
import UserSection from "./user-section"
import s from "./user.module.styl"

const user = MUser.create({})

const {Item} = UserSection
const User = () => {
  const {avatar, mobile, email, nickname} = user
  return (
    <div className={s.page}>
      {user.userId && (
        <>
          <header className={c("fb1 fbh fbac", s.header)}>
            <Link to="/" className={c(s.logo, "fbh fbac fbjc")}>
              <img src={config.logo} alt="logo" />
            </Link>
          </header>
          <div className={c("p16", s.content)}>
            <UserSection title="基本信息" className="mb20">
              <Item label="头像">
                <img className={(s.itemContent, s.avatar)} src={avatar || config.mascot} alt="avatar" />
              </Item>
              <Item label="手机号">
                <div>{mobile}</div>
              </Item>
              <Item label="昵称">
                <div className="fbh">
                  <div className={s.itemContent}>{nickname}</div>
                  <div
                    className={s.option}
                    // onClick={() => {
                    //   setIsNicknameVisible(true)
                    // }}
                  >
                    修改
                  </div>
                </div>
              </Item>
              <Item label="邮箱">
                <div className="fbh">
                  <div className={s.itemContent}>{email}</div>
                  <div className={s.option}>修改</div>
                </div>
              </Item>
            </UserSection>
            <UserSection title="账户信息">
              <Item label="密码">*********</Item>
            </UserSection>
            {/* <Modal
              model={user.nickname}
              isVisible={isNicknameVisible}
              hasMask
              title={"昵称"}
              closable
              onClose={() => {
                setIsNicknameVisible(false)
              }}
              buttons={[
                {
                  name: "取消",
                  action: () => {
                    console.log("取消")
                    setIsNicknameVisible(false)
                  }
                },
                {
                  name: "确认",
                  action: () => {
                    console.log("确认")
                    setIsNicknameVisible(false)
                  }
                }
              ]}
            /> */}
          </div>
        </>
      )}
    </div>
  )
}

export default observer(User)
