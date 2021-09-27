export default ({content}) => {
  return {
    effective: true,
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'content',
            defaultValue: content,
          },
          {
            name: 'layoutPosition',
            defaultValue: 'topLeft',
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
        ],
      },
      {
        name: 'text',
        fields: [
          {
            name: 'textSize',
            defaultValue: 20,
          },
          {
            name: 'textWeight',
            defaultValue: 400,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
        ],
      },
      {
        name: 'shadow',
        effective: false,
        fields: [
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
          {
            name: 'blur',
            defaultValue: 2,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(0,0,0)',
          },
        ],
      },
    ],
  }
}
