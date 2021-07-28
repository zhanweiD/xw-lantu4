/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-04-27 11:01:48
 * @Description: 组织管理列表
 */
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import ManageContainer from "@components/manage-container"
import w from "@models"
import FieldModal from "@components/field-modal"
import Confirm from "@components/confirm"
import OrganizationList from "./organization-list"

const Organization = () => {
  const {t} = useTranslation()
  const {user} = w
  return (
    <ManageContainer
      loading={!user}
      link="/"
      name={t("organization.organizationManagement")}
    >
      <OrganizationList user={user} />
      <FieldModal model={w.overlayManager.get("fieldModal")} />
      <Confirm model={w.overlayManager.get("confirm")} />
    </ManageContainer>
  )
}

export default observer(Organization)
