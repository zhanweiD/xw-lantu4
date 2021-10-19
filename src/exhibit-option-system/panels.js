// 布局
const layout = {
  name: 'layout',
  sections: [
    {
      name: 'base',
      fields: [
        {
          name: 'xyPosition',
        },
        {
          name: 'areaSize',
        },
      ],
    },
  ],
}

// 偏移
const offset = {
  name: 'offset',

  fields: [
    {
      name: 'areaOffset',
    },
  ],
}

// 背景色
const backgroundColor = {
  name: 'backgroundColor',
  sections: [
    {
      name: 'singleColor',
      effective: false,
      fields: [
        {
          name: 'singleColor',
        },
        {
          name: 'opacity',
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'gradientColor',
      effective: false,
      fields: [
        {
          name: 'gradientColor',
          // defaultValue: [
          //   ['rgb(0,56,144)', 0],
          //   ['rgb(0,24,61)', 1],
          // ],
        },
      ],
    },
  ],
}

// 素材
const material = {
  name: 'material',
  // 内容由选中的画布或容器决定
}

// 描述
const remark = {
  name: 'remark',
  sections: [
    {
      name: 'base',
      fields: [
        {
          name: 'id',
        },
        {
          name: 'name',
          // 默认值使用画布和容器的默认值
        },
        {
          name: 'note',
        },
      ],
    },
  ],
}

// 全局
const global = {
  name: 'global',
  sections: [
    // TODO 主题待开放
    // {
    //   name: 'theme',
    //   fields: [
    //     {
    //       name: 'themeSelect',
    //     },
    //   ],
    // },
    {
      name: 'grid',
      fields: [
        {
          name: 'size',
          min: 40,
          max: 200,
          step: 10,
          defaultValue: 40,
        },
        {
          name: 'singleColor',
          defaultValue: '#ffffff',
        },
        {
          name: 'opacity',
          defaultValue: 0.4,
        },
      ],
      sections: [
        {
          name: 'divisionLine',
          fields: [
            {
              name: 'singleColor',
              defaultValue: 'lightgreen',
            },
            {
              name: 'opacity',
              defaultValue: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'watermark',
      effective: false,
      fields: [
        {
          name: 'content',
        },
        {
          name: 'angle',
        },
        {
          name: 'opacity',
        },
      ],
    },
    {
      name: 'auth',
      effective: false,
      fields: [
        {
          name: 'password',
        },
      ],
    },
    {
      name: 'other',
      fields: [
        {
          name: 'thousandDiv',
        },
        {
          name: 'decimalPlaces',
        },
      ],
    },
  ],
}

export {
  // 布局
  layout,
  // 偏移
  offset,
  // 背景色
  backgroundColor,
  // 素材
  material,
  // 描述
  remark,
  // 全局
  global,
}
