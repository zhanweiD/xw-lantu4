import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import moment from "moment"
import {useTranslation} from "react-i18next"
import Button from "@components/button"
import IconButton from "@components/icon-button"
import {SelectField, createConfigModelClass} from "@components/field"
import SearchBar from "@components/search-bar"
import Table from "@components/table"
import w from "@models"
import FieldModal from "@components/field-modal"
import Confirm from "@components/confirm"
import AddUserModal from "./add-user-modal"

import s from "./member.module.styl"
import "./member.styl"

const Member = ({organization}) => {
  const {t} = useTranslation()
  useEffect(() => {
    if (!organization.members) {
      organization.set("members", {organizationId: organization.organizationId})
    }
  }, [])
  const {members = {}, addUserModal} = organization
  const {
    list = [],
    state = "loading",
    getList,
    isNoMoreVisible,
    searchValue,
    search,
    roleCode,
    set
  } = members
  // 更新用户角色
  const showEditModal = (memberM) => {
    const fieldModal = w.overlayManager.get("fieldModal")

    const MFieldModal = createConfigModelClass("fieldModal", {
      sections: ["__hide__"],
      fields: [
        {
          section: "__hide__",
          option: "roleCode",
          field: {
            type: "select",
            label: "organization.choiceRole",
            defaultValue: memberM.roleCode,
            required: true,
            option: "roleCode",
            options: [
              {value: "admin", key: "organization.administrator"},
              {value: "member", key: "organization.member"}
            ]
          }
        }
      ]
    })
    fieldModal.show({
      attachTo: false,
      title: "成员更新",
      content: MFieldModal.create(),
      height: 160,
      buttons: [
        {
          name: "取消",
          action: () => {
            fieldModal.hide()
          }
        },
        {
          name: "确定",
          action: (value) => {
            members.updateMember(value, memberM.userId)
            fieldModal.hide()
          }
        }
      ]
    })
  }
  // 退出组织
  const shwoRemoveModal = (memberM) => {
    w.confirm({
      content: `“${memberM.nickname}” ${t("organization.removeConfirm")}`,
      onConfirm: () => members.remove(memberM.userId)
    })
  }
  // 表格头
  const columns = [
    {
      title: t("organization.nickname"),
      key: "nickname"
    },
    {
      title: t("organization.mobile"),
      key: "mobile"
    },
    {
      title: t("organization.role"),
      key: "roleName",
      type: "select",
      // options: filtrateOptions,
      render: (value) => {
        return value
      }
    },
    {
      title: t("organization.email"),
      key: "email"
    },
    {
      title: t("organization.joinTime"),
      key: "ctime",
      render: (value) => moment(value).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      title: t("organization.operation"),
      /*eslint-disable*/
      render: (value, rowData) => (
        <div className="fbh ">
          {organization.hasPermission("organization.member.update") &&
            !rowData.isSelf &&
            !rowData.isMaster && (
              <IconButton
                iconSize={16}
                icon="edit"
                onClick={(e) => {
                  e.stopPropagation()
                  showEditModal(rowData)
                }}
              />
            )}
          {organization.hasPermission("organization.member.leave") &&
            !rowData.isSelf &&
            !rowData.isMaster && (
              <IconButton
                iconSize={12}
                icon="remove"
                onClick={() => shwoRemoveModal(rowData)}
              />
            )}
        </div>
      )
      /*eslint-enable*/
    }
  ]
  // 处理滚动加载
  const scrollEnd = async (e) => {
    const {scrollHeight, scrollTop, clientHeight} = e.target
    // console.log(scrollHeight, scrollTop, clientHeight)
    // 872 0 252
    if (scrollHeight - scrollTop === clientHeight) {
      await getList()
      setTimeout(() => {
        e.target.scrollTop = scrollTop + clientHeight
      }, 100)
    }
  }
  return (
    <>
      <div className="fbv h100p">
        <div className="fbh pb24 fbje">
          <div className={c(s.toolBar, "fbh")}>
            <div className="fbh">
              {/* <IconButton onClick={() => {
              set({
                searchValue: '',
                roleCode: '',
              })
              search()
            }} className={c(s.iconButton, s.reset)} buttonSize={28} iconSize={12} icon="reset" /> */}

              <div className="ml8 lh28">{t("organization.role")}：</div>
              <div className="ml8 lh28">
                <SelectField
                  value={roleCode}
                  options={[
                    {
                      key: "所有",
                      value: ""
                    },
                    {
                      key: "成员",
                      value: "member"
                    },
                    {
                      key: "管理员",
                      value: "admin"
                    }
                  ]}
                  onChange={(value) => {
                    set("roleCode", value)
                    search()
                  }}
                />
              </div>
              <SearchBar
                className={c(s.searchbar, "searchbar")}
                placeholder={t("organization.searchPlaceholder")}
                value={searchValue}
                onChange={(e) => set("searchValue", e.target.value)}
                onSearch={search}
              />
              <Button
                className={c("ml10", s.inviteBtn)}
                type="primary"
                size="small"
                name={t("organization.addUser")}
                onClick={() => {
                  addUserModal.set("isVisible", true)
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="fb1 .h0"
          style={{overflow: "auto", height: 0}}
          onScrollCapture={scrollEnd}
        >
          <Table
            columns={columns}
            dataSource={list}
            placeholder={t("organization.noMember")}
            loadingState={state !== "loading" ? state : ""}
            rowHeight={56}
          />
          <div className={s.footerText}>
            {isNoMoreVisible && state === "loadSuccess" && (
              <>
                <span>—— </span>
                {t("organization.noMore")}
                <span> ——</span>
              </>
            )}
            {state === "loading" && (
              <>
                <span>—— </span>
                {t("organization.loading")}
                <span> ——</span>
              </>
            )}
            {!isNoMoreVisible && state === "loadSuccess" && (
              <>
                <span>—— </span>
                <span className="ctMain" onClick={getList}>
                  {t("organization.loadMore")}
                </span>
                <span> ——</span>
              </>
            )}
          </div>
        </div>
        <AddUserModal organization={organization} />
      </div>
      <FieldModal model={w.overlayManager.get("fieldModal")} />
      <Confirm model={w.overlayManager.get("confirm")} />
    </>
  )
}

export default observer(Member)
