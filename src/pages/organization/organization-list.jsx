import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import moment from "moment"
import {useTranslation} from "react-i18next"
import Button from "@components/button"
import IconButton from "@components/icon-button"
import Table from "@components/table"
import w from "@models"
import {createConfigModelClass} from "@components/field"
import {Link} from "react-router-dom"

const OrganizationList = ({user}) => {
  const {t} = useTranslation()

  const {organizationList = []} = user

  const {tip} = w.env_

  const modal = w.overlayManager.get("fieldModal")

  const showEditModal = (organizationM) => {
    const MFieldModal = createConfigModelClass("fieldModal", {
      sections: ["__hide__"],
      fields: [
        {
          section: "__hide__",
          option: "name",
          field: {
            type: "text",
            label: "organization.organizationName",
            option: "name",
            required: true,
            value: organizationM.organizationName || "",
            placeholder: "namePlaceholder"
          }
        },
        {
          section: "__hide__",
          option: "description",
          field: {
            type: "textarea",
            label: "organization.description",
            placeholder: t("organization.descriptionPlaceholder"),
            value: organizationM.description || "",
            option: "description"
          }
        }
      ]
    })
    modal.show({
      attachTo: false,
      title: "编辑组织",
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
          action: async (value) => {
            if (await organizationM.updateOrganization(value)) {
              modal.hide()
            }
          }
        }
      ]
    })
  }

  const shwoRemoveModal = (organizationM) => {
    const MFieldModal = createConfigModelClass("fieldModal", {
      sections: ["__hide__"],
      fields: [
        {
          section: "__hide__",
          option: "tip",
          field: {
            type: "tips",
            label: "organization.removeTips"
          }
        },
        {
          section: "__hide__",
          option: "organizationName",
          field: {
            type: "textarea",
            label: "organization.organizationName",
            placeholder: "organization.removeOrganizationConfirm",
            required: true,
            option: "organizationName"
          }
        }
      ]
    })
    modal.show({
      attachTo: false,
      title: "删除组织",
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
          action: (value) => {
            if (value.organizationName === organizationM.organizationName) {
              user.removeOrganization(organizationM.organizationId)
            } else {
              tip.error({content: "请输入正确的组织名称"})
            }
          }
        }
      ]
    })
  }

  // 退出组织
  const shwoQuitModal = (organizationM) => {
    w.confirm({
      attachTo: false,
      content: t("organization.exitConfirm"),
      onConfirm: () => {
        user.quitOrganization(organizationM.organizationId)
      }
    })
  }

  // 表格
  const columns = [
    {
      title: t("organization.name"),
      key: "organizationName"
    },
    {
      title: t("organization.owner"),
      key: "owner"
    },
    {
      title: t("organization.createTime"),
      key: "ctime",
      render: (value) => moment(value).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      title: t("organization.role"),
      key: "roleName"
    },
    {
      title: t("organization.operation"),
      key: "operation",
      /*eslint-disable*/
      render: (value, rowData) => {
        return (
          <div className="fbh ">
            <Link to={`/organization/${rowData.organizationId}/member`}>
              <IconButton iconSize={16} icon="user" />
            </Link>
            {rowData.hasPermission("organization.update") && (
              <IconButton
                iconSize={16}
                icon="edit"
                onClick={(e) => {
                  e.stopPropagation()
                  showEditModal(rowData)
                }}
              />
            )}
            {rowData.isMaster && (
              <IconButton
                iconSize={12}
                icon="remove"
                onClick={(e) => {
                  e.stopPropagation()
                  shwoRemoveModal(rowData)
                }}
              />
            )}
            {!rowData.isMaster && (
              <IconButton
                iconSize={12}
                icon="logout"
                onClick={(e) => {
                  e.stopPropagation()
                  shwoQuitModal(rowData)
                }}
              />
            )}
          </div>
        )
        /*eslint-enable*/
      }
    },
    {
      title: t("organization.isDefault"),
      key: "operation",
      /*eslint-disable*/
      render: (value, rowData) => {
        // 如果是默认组织 点击取消默认组织， 不是默认组织 点击设置为默认组织
        return (
          <div
            className={c({
              o0p: rowData.loginDefault === "N" && !rowData.isMouseOver
            })}
            onMouseOverCapture={() => {
              rowData.set("isMouseOver", true)
            }}
            onMouseLeave={() => rowData.set("isMouseOver", false)}
          >
            <Button
              type="primary"
              size="small"
              name={t("organization.isDefault")}
              onClick={() => {
                user.changeLoginDefault(
                  rowData.organizationId,
                  rowData.loginDefault === "N" ? "Y" : "N"
                )
              }}
            />
          </div>
        )
      }
      /*eslint-enable*/
    }
  ]
  return (
    <>
      <div className="fbh fbac pb24">
        <div className="fb1 fbh"> </div>
        <div className={c("mt18", "fbh")}>
          <div className="fb1 fbh" />
          <Button
            className={c("mr10")}
            type="primary"
            size="small"
            name={t("organization.add")}
            onClick={(e) => {
              e.stopPropagation()
              user.showCreateOrganizationModal()
            }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={organizationList}
        placeholder={t("organization.noMember")}
        rowHeight={56}
      />
    </>
  )
}

export default observer(OrganizationList)
