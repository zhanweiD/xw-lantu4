// 超级管理员产品权限
const superAdminPermissions = [
  /**
   * =============================
   * 组织权限
   */
  'organization.create',
  'organization.update',
  'organization.remove',

  /** 项目成员管理权限 */
  'organization.member.create',
  'organization.member.update',
  'organization.member.remove',
  'organization.member.authorize',
  //  'project.member.leave',

  /**
   * =============================
   * 数据权限
   */
  'data.create',
  'data.remove',
  'data.update',
  'data.read',
  'data.authorize',

  /**
   * =============================
   * 素材权限
   */
  'material.create',
  'material.remove',
  'material.update',
  'material.read',
  'material.authorize',

  /**
   * =============================
   * 项目权限
   */
  /** 项目权限 */
  'project.read',
  'project.remove',
  'project.update',
  'project.create',
]

// 管理员产品权限
const adminPermissions = [
  // ! 不能编辑他人项目、素材、数据等
  /**
   * =============================
   * 组织权限
   */
  'organization.create',
  // 'organization.update',
  // 'organization.remove',

  /** 项目成员管理权限 */
  'organization.member.create',
  'organization.member.update',
  'organization.member.remove',
  'organization.member.authorize',
  'organization.member.leave',

  /**
   * =============================
   * 数据权限
   */
  'data.create',
  // 'data.remove',
  // 'data.update',
  'data.read',
  'data.authorize',

  /**
   * =============================
   * 素材权限
   */
  'material.create',
  // 'material.remove',
  // 'material.update',
  'material.read',
  'material.authorize',

  /**
   * =============================
   * 项目权限
   */
  /** 项目权限 */
  'project.read',
  // 'project.remove',
  // 'project.update',
  'project.create',
]

// 管理员产品权限
const memberPermissions = [
  // ! 不能编辑他人项目、素材、数据等
  /**
   * =============================
   * 组织权限
   */
  'organization.create',
  // 'organization.update',
  // 'organization.remove',

  /** 项目成员管理权限 */
  // 'organization.member.create',
  // 'organization.member.update',
  // 'organization.member.remove',
  // 'organization.member.authorize',
  'organization.member.leave',

  /**
   * =============================
   * 数据权限
   */
  'data.create',
  // 'data.remove',
  // 'data.update',
  'data.read',
  'data.authorize',

  /**
   * =============================
   * 素材权限
   */
  'material.create',
  // 'material.remove',
  // 'material.update',
  'material.read',
  'material.authorize',

  /**
   * =============================
   * 项目权限
   */
  /** 项目权限 */
  'project.read',
  // 'project.remove',
  // 'project.update',
  'project.create',
]

// 超级管理员项目权限
const adminProjectPermissions = [
  /**
   * 项目级别权限
   */
  'project.read',
  'project.remove',
  'project.update',
  // 'project.create',
  /** 项目成员管理 */
  'project.member.create',
  'project.member.update',
  'project.member.remove',
  'project.member.authorize',
  'project.member.leave', // 管理员不为一才可以退出
  /** 项目大屏管理权限 */
  'project.art.create',
  'project.art.update',
  'project.art.remove',
  'project.art.read',
  'project.art.publish',

  /** 项目数据管理权限 */
  'project.data.create',
  'project.data.update',
  'project.data.remove',
  'project.data.read',
  'project.data.authorize',

  /** 项目素材管理权限 */
  'project.material.create',
  'project.material.update',
  'project.material.remove',
  'project.material.read',
  'project.material.authorize',
  // 缺少一些权限值：
  // 发布
  // 版本回滚
  // mast版本设置
  // 版本删除
  // 密码设置
]

// 超级管理员项目权限
const memberProjectPermissions = [
  /**
   * 项目级别权限
   */
  'project.read',
  // 'project.remove',
  // 'project.update',
  // 'project.create',
  /** 项目成员管理 */
  // 'project.member.create',
  // 'project.member.update',
  // 'project.member.remove',
  // 'project.member.authorize',
  'project.member.leave', // 管理员不为一才可以退出
  /** 项目大屏管理权限 */
  'project.art.create',
  'project.art.update',
  'project.art.remove',
  'project.art.read',
  'project.art.publish',

  /** 项目数据管理权限 */
  'project.data.create',
  'project.data.update',
  'project.data.remove',
  'project.data.read',
  'project.data.authorize',

  /** 项目素材管理权限 */
  'project.material.create',
  'project.material.update',
  'project.material.remove',
  'project.material.read',
  'project.material.authorize',
  // 缺少一些权限值：
  // 发布
  // 版本回滚
  // mast版本设置
  // 版本删除
  // 密码设置
]

// 超级管理员项目权限
const readOnlyProjectPermissions = [
  /**
   * 项目级别权限
   */
  'project.read',
  // 'project.remove',
  // 'project.update',
  // 'project.create',
  /** 项目成员管理 */
  // 'project.member.create',
  // 'project.member.update',
  // 'project.member.remove',
  // 'project.member.authorize',
  'project.member.leave', // 管理员不为一才可以退出
  /** 项目大屏管理权限 */
  // 'project.art.create',
  // 'project.art.update',
  // 'project.art.remove',
  'project.art.read',
  // 'project.art.publish',

  /** 项目数据管理权限 */
  // 'project.data.create',
  // 'project.data.update',
  // 'project.data.remove',
  'project.data.read',
  // 'project.data.authorize',

  /** 项目素材管理权限 */
  // 'project.material.create',
  // 'project.material.update',
  // 'project.material.remove',
  'project.material.read',
  // 'project.material.authorize',
  // 缺少一些权限值：
  // 发布
  // 版本回滚
  // mast版本设置
  // 版本删除
  // 密码设置
]

export default {
  /**
   * 0: 管理员
   * 1: 成员
   * 2: 只读成员
   *
   * c: 超级管理员
   * a: 组织管理员
   * b: 组织成员
   */
  // 超级管理员
  getPermission: (type) => {
    let permission = []
    switch (type) {
      case '0a':
        permission = [...adminProjectPermissions, ...adminPermissions]
        break

      case '0b':
        permission = [...adminProjectPermissions, ...memberPermissions]
        break

      case '1a':
        permission = [...memberProjectPermissions, ...adminPermissions]
        break

      case '1b':
        permission = [...memberProjectPermissions, ...memberPermissions]
        break

      case '2a':
        permission = [...readOnlyProjectPermissions, ...adminPermissions]
        break

      case '2b':
        permission = [...readOnlyProjectPermissions, ...memberPermissions]
        break

      default:
        permission = [...adminProjectPermissions, ...superAdminPermissions]
        break
    }
    return permission
  },
}
