import React from "react"
import {observer} from "mobx-react-lite"
import IconButton from "@components/icon-button"
import w from "@models"
import Table from "@components/table"
import "./project-member.styl"

const ProjectMember = ({project}) => {
  const {members_} = project
  const {user} = w
  // 表内容下拉框，设置成员角色
  const renderDropMenu = (title, rowData) => {
    // todo 真实的权限控制应该看当前用户是否具备项目管理权限
    const hasPermission = !rowData.isSelf
    return (
      <div className="fbh">
        <div>{title}</div>
        {hasPermission && (
          <IconButton
            icon="arrow-down"
            buttonSize={22}
            iconSize={10}
            onClick={(e, button) => {
              e.stopPropagation()
              const menu = w.overlayManager.get("menu")
              menu.toggle({
                attachTo: button,
                list: project.roleCodeMapping_
                  .filter(({value}) => value !== rowData.roleCode)
                  .map((roleCodeMapping) => ({
                    name: roleCodeMapping.key,
                    action: () => {
                      project.authorizeRole({
                        roleCode: roleCodeMapping.value,
                        userIds: [rowData.userId]
                      })
                      menu.hide()
                    }
                  }))
              })
            }}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Table
        dataSource={members_}
        columns={[
          {key: "nickname", title: "昵称"},
          {
            key: "roleName",
            title: (
              <div className="fbh">
                <div>角色</div>
                <IconButton
                  icon="arrow-down"
                  buttonSize={22}
                  iconSize={10}
                  onClick={(e, button) => {
                    e.stopPropagation()
                    const menu = w.overlayManager.get("menu")
                    menu.toggle({
                      attachTo: button,
                      list: [
                        {
                          name: "全部",
                          action: () => {
                            project.filterMember()
                            menu.hide()
                          }
                        },
                        ...project.roleCodeMapping_.map((roleCodeMapping) => ({
                          name: roleCodeMapping.key,
                          action: () => {
                            project.filterMember(roleCodeMapping)
                            menu.hide()
                          }
                        }))
                      ]
                    })
                  }}
                />
              </div>
            ),
            render: renderDropMenu,
            width: 200
          },
          {
            key: "action",
            title: "操作",
            width: 50,
            /* eslint-disable */
            render: (action, rowData) => (
              <>
                {rowData.isSelf && !user.hasPermission && (
                  <div className="hand" onClick={project.leaveConfirm}>
                    退出
                  </div>
                )}
                {/* todo 权限控制 */}
                {!rowData.isSelf && (
                  <div
                    className="hand"
                    onClick={() =>
                      project.removeMemberConfirm({
                        nickname: rowData.nickname,
                        userIds: [rowData.userId]
                      })
                    }
                  >
                    删除
                  </div>
                )}
              </>
            )
            /* eslint-enable */
          }
        ]}
        rowHeight={23}
        headClassName="head"
        rowClassName="row"
      />
    </>
  )
}

export default observer(ProjectMember)
