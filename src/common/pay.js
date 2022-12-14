
// 付费模版
export const payList = {
  basic: [
    {
      key: 'accountCount',
      isSingle: true,
      title: '账号数量',
      myOption: '当前账号数量10',
      command: '这里是账号数量的相关介绍',
      options: [
        {id: 'accountCount_1', number: '账号数量20个', price: 1000},
        {id: 'accountCount_2', number: '账号数量30个', price: 1500},
        {id: 'accountCount_3', number: '账号数量不限', price: 2000},
      ],
    },
    {
      key: 'artPublishCount',
      isSingle: true,
      title: '大屏发布数量',
      myOption: '当前大屏发布数量10',
      command: '这里是大屏发布数量的相关介绍',
      options: [
        {id: 'artPublishCount_1', number: '大屏发布数量20个', price: 1000},
        {id: 'artPublishCount_2', number: '大屏发布数量30个', price: 1500},
        {id: 'artPublishCount_3', number: '大屏发布数量不限', price: 2000},
      ],
    },
    {
      key: 'artBagCount',
      isSingle: true,
      title: '大屏资源部署包数量',
      myOption: '当前大屏资源部署包数量10',
      command: '这里是大屏资源部署包数量的相关介绍',
      options: [
        {id: 'artBagCount_1', number: '大屏资源部署包20个', price: 1000},
        {id: 'artBagCount_2', number: '大屏资源部署包30个', price: 1500},
        {id: 'artBagCount_3', number: '大屏资源部署包不限', price: 2000},
      ],
    },
    {
      key: 'organizationSpaceCount',
      isSingle: true,
      title: '组织空间数量',
      myOption: '当前组织空间数量10',
      command: '这里是组织空间数量的相关介绍',
      options: [
        {id: 'organizationSpaceCount_1', number: '组织空间数量2个', price: 1000},
        {id: 'organizationSpaceCount_2', number: '组织空间数量4个', price: 1500},
        {id: 'organizationSpaceCount_3', number: '组织空间数量不限', price: 2000},
      ],
    },
    {
      key: 'spaceCount',
      isSingle: true,
      title: '空间容量',
      myOption: '当前空间容量100M',
      command: '这里是空间容量的相关介绍',
      options: [
        {id: 'spaceCount_1', number: '空间容量500M', price: 1000},
        {id: 'spaceCount_2', number: '空间容量1G', price: 1500},
        {id: 'spaceCount_3', number: '空间容量5G', price: 2000},
      ],
    },
  ],
  highLevel: [
    {
      key: 'highTemplate',
      isSingle: false,
      title: '高级模版',
      myOption: '当前拥有的高级模版......',
      command: '这里是高级模版的相关介绍',
      options: [
        {id: 'highTemplate_1', number: '名称1', price: 1000},
        {id: 'highTemplate_2', number: '名称2', price: 1000},
        {id: 'highTemplate_3', number: '名称3', price: 1000},
        {id: 'highTemplate_4', number: '名称4', price: 1000},
      ],
    },
    {
      key: 'highChartExhibit',
      isSingle: false,
      title: '高级图表组件',
      myOption: '当前拥有的高级图表组件......',
      command: '这里是高级图表组件的相关介绍',
      options: [
        {id: 'highChartExhibit_1', number: '名称1', price: 1000},
        {id: 'highChartExhibit_2', number: '名称2', price: 1000},
        {id: 'highChartExhibit_3', number: '名称3', price: 1000},
        {id: 'highChartExhibit_4', number: '名称4', price: 1000},
      ],
    },
    {
      key: 'highInteractiveExhibit',
      isSingle: false,
      title: '高级交互组件',
      myOption: '当前拥有的高级交互组件......',
      command: '这里是高级交互组件的相关介绍',
      options: [
        {id: 'highInteractiveExhibit_1', number: '名称1', price: 1000},
        {id: 'highInteractiveExhibit_2', number: '名称2', price: 1000},
        {id: 'highInteractiveExhibit_3', number: '名称3', price: 1000},
        {id: 'highInteractiveExhibit_4', number: '名称4', price: 1000},
      ],
    },
    {
      key: 'highTitle',
      isSingle: false,
      title: '高级主题',
      myOption: '当前拥有的高级主题......',
      command: '这里是高级主题的相关介绍',
      options: [
        {id: 'highTitle_1', number: '名称1', price: 1000},
        {id: 'highTitle_2', number: '名称2', price: 1000},
        {id: 'highTitle_3', number: '名称3', price: 1000},
        {id: 'highTitle_4', number: '名称4', price: 1000},
      ],
    },
  ],
  other: [
    {
      key: 'gisExhibit',
      isSingle: false,
      title: 'GIS组件',
      myOption: '当前拥有GIS组件图层......',
      command: '这里是GIS组件的相关介绍',
      options: [
        {id: 'gisExhibit_1', number: 'XXX', price: 1000},
        {id: 'gisExhibit_2', number: 'XXX', price: 1000},
        {id: 'gisExhibit_3', number: 'XXX', price: 1000},
      ],
    },
    {
      key: 'dataAccess',
      isSingle: false,
      title: '数据接入',
      myOption: '当前拥有GIS组件图层......',
      command: '这里是数据接入的相关介绍',
      options: [
        {id: 'dataAccess_1', number: '数据类型', price: 1000},
        {id: 'dataAccess_2', number: '数据类型', price: 1000},
        {id: 'dataAccess_3', number: '数据类型', price: 1000},
      ],
    },
  ],
}
