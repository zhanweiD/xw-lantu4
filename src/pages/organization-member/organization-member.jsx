/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-04-27 11:02:11
 * @Description: 组织管理列表
 */
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import ManageContainer from "@components/manage-container"
import w from "@models"
import Member from "./member"

const Organization = (props) => {
  const {t} = useTranslation()
  const {organizationId = 0} = props
  const {user = {}} = w
  const {getOganization_} = user
  const organization = getOganization_
    ? getOganization_(Number(organizationId))
    : null
  return (
    <>
      <ManageContainer
        loading={!organization}
        link="/organization"
        name={`${organization?.organizationName}的${t(
          "organization.memberManagement"
        )} `}
      >
        <Member organization={organization} user={user} />
      </ManageContainer>
    </>
  )
}

export default observer(Organization)
