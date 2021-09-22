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
    {
      name: 'constraint',
      fields: [
        {
          name: 'constraint',
        },
      ],
    },
  ],
}

// 背景色
const backgroundColor = {
  name: 'backgroundColor',
  sections: [
    {
      name: 'singleColor',
      fields: [
        {
          name: 'colorSingle',
        },
        {
          name: 'opacity',
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'gradientColor',
      fields: [
        {
          name: 'gradientColor',
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
const description = {
  name: 'description',
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

export default {
  // 布局
  layout,
  // 背景色
  backgroundColor,
  // 素材
  material,
  // 描述
  description,
}
