import {types} from 'mobx-state-tree'
import MBase from '../base.model'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.frozen(),
})

export const MColumnSelectField = MBase.named('MColumnSelectField')
  .props({
    type: types.enumeration(['columnSelect']),
    option: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.frozen(),
    options: types.optional(types.array(MKeyValue), []),
  })
  .actions((self) => {
    const setOptions = (options) => {
      self.options = options
    }

    const update = (columns) => {
      const options = columns.map((v) => {
        return {
          key: `${v.alias}`,
          value: `${v.alias}`,
        }
      })
      self.setOptions(options)
    }

    return {
      setOptions,
      update,
    }
  })
