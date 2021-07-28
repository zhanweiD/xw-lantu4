/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-14 15:08:33
 * @Description: 组织添加用户的弹窗
 */
import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Modal from "@components/modal"
import {useTranslation} from "react-i18next"
import {SelectField} from "@components/field"
import IconButton from "@components/icon-button"
import Button from "@components/button"
import SearchBar from "@components/search-bar"
import s from "./member.module.styl"

const AddUserModal = ({organization}) => {
  const {t} = useTranslation()
  const {addUserModal = {}} = organization
  const {
    isVisible,
    roleCode,
    searchUsers,
    submit,
    searchValue,
    addUsers,
    onCancel,
    search,
    addUser,
    removeAddUser,
    roles_,
    changeRoleCode
  } = addUserModal
  return (
    <Modal
      title={
        <div className="fbh">
          <SearchBar
            className={c(s.searchbar, "searchbar", "mr10")}
            placeholder={t("organization.searchPlaceholder")}
            value={searchValue}
            onChange={(e) => search(e.target.value)}
            onSearch={search}
          />
          <div className="ml8 lh28">{t("organization.role")}：</div>
          <SelectField
            value={roleCode}
            options={roles_}
            onChange={changeRoleCode}
          />
        </div>
      }
      width={600}
      height={550}
      isVisible={isVisible}
      onClose={onCancel}
      className={c(s.modal)}
    >
      <div className="fbv h100p">
        <div className={c("fbh", "fb1")}>
          <div className="fb1">
            <p>{t("organization.searchResult")}:</p>
            <div>
              {searchUsers.map((user) => {
                return (
                  <div key={user.userId} className="fbh lh32">
                    <span className="mw150 omit">{user.nickname}</span>
                    <span>({user.mobile}) </span>
                    {!user.isAdded && (
                      <IconButton
                        icon="add"
                        onClick={() => {
                          addUser(user)
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={c(s.cutLine, "mr18")} />
          <div className="fb1">
            <p>{t("organization.waitAddUser")}:</p>
            <div className="fbh fbw">
              {addUsers.map((user) => {
                return (
                  <div key={user.userId} className={c("fbh lh32", s.addUser)}>
                    {user.nickname}{" "}
                    <IconButton
                      icon="close"
                      iconSize={16}
                      onClick={() => {
                        removeAddUser(user)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="w100p" style={{textAlign: "right"}}>
          <Button
            name={t("user.cancel") || t("member.cancel")}
            width={80}
            className={c("mr6", s.cancel)}
            onClick={onCancel}
          />
          <Button
            name="确认"
            type="primary"
            width={120}
            onClick={async () => {
              if (addUsers.length <= 0) return
              await submit()
              await organization.members.search()
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default observer(AddUserModal)
