import {types} from 'mobx-state-tree'
import {createConfigModelClass} from '@components/field'

export const MDataBasic = createConfigModelClass('MDataBasic', {
  id: types.identifier,
  sections: ['optionPanel.logInfo', 'optionPanel.basicInfo'],
  fields: [
    {
      section: 'optionPanel.logInfo',
      option: 'ctime',
      when: {
        key: 'isCreate',
        value: true,
      },
      field: {
        type: 'text',
        label: 'optionPanel.ctime',
        defaultValue: '',
        readOnly: true,
      },
    },
    {
      section: 'optionPanel.logInfo',
      option: 'mtime',
      when: {
        key: 'isCreate',
        value: true,
      },
      field: {
        type: 'text',
        label: 'optionPanel.mtime',
        defaultValue: '',
        readOnly: true,
      },
    },
    {
      section: 'optionPanel.logInfo',
      option: 'creator',
      when: {
        key: 'isCreate',
        value: true,
      },
      field: {
        type: 'text',
        label: 'optionPanel.creator',
        defaultValue: '',
        readOnly: true,
      },
    },
    {
      section: 'optionPanel.basicInfo',
      option: 'dataName',
      field: {
        type: 'text',
        label: 'name',
        defaultValue: '',
      },
    },
    {
      section: 'optionPanel.basicInfo',
      option: 'remark',
      field: {
        type: 'text',
        label: 'description.description',
        defaultValue: '',
      },
    },
    {
      section: 'optionPanel.basicInfo',
      option: 'customId',
      field: {
        type: 'text',
        label: 'dataPanel.customId',
        value: '',
      },
    },
    {
      section: '',
      option: 'isCreate',
      field: {
        type: 'switch',
        label: '',
        value: false,
      },
    },
  ],
})
