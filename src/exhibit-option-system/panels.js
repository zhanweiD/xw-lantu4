// 标签
const title = {
  name: 'title',
  sections: [
    {
      name: 'titleBase',
      fields: [
        {
          name: 'content',
          defaultValue: '显示当前的title',
        },
      ],
    },
    {
      name: 'text',
      fields: [
        {
          name: 'textSize',
        },
        {
          name: 'textWeight',
        },
        {
          name: 'colorSingle',
          //
        },
        {
          name: 'opacity',
        },
        {
          name: 'offset',
        },
      ],
    },
    {
      name: 'shadow',
      fields: [
        {
          name: 'colorSingle',
        },
        {
          name: 'offset',
        },
      ],
    },
  ],
}

export default {
  // 标题
  title,
}
