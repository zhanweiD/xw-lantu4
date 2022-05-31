import {types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'

export const MLayout = types
  .model('MLayout', {
    x: types.optional(types.union(types.number, types.string), 0),
    y: types.optional(types.union(types.number, types.string), 0),
    width: types.optional(types.union(types.number, types.string), 0),
    height: types.optional(types.union(types.number, types.string), 0),
    normalKeys: types.frozen(['x', 'y', 'width', 'height']),
  })
  .actions(commonAction(['set', 'getSchema']))
